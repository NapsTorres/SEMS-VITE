/* eslint-disable @typescript-eslint/no-explicit-any */
import { useState, useMemo, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { useFetchData } from "../../../config/axios/requestData";
import TeamsServices from "../../../config/service/teams";
import { dateStringFormatter } from "../../../utility/utils";
import { FaTrophy, FaUsers } from "react-icons/fa";
import { MdEvent } from "react-icons/md";
import { Button, notification, Tooltip, Select, Modal, Input, Image } from "antd";
import { CheckCircleOutlined, CloseCircleOutlined, ArrowLeftOutlined, EyeOutlined } from '@ant-design/icons';
import useStore from "../../../zustand/store/store";
import { selector } from "../../../zustand/store/store.provider";
import { useQueryClient } from "@tanstack/react-query";
import { useMutation } from "@tanstack/react-query";

const { Option } = Select;

export const TeamInfo = () => {
  const navigate = useNavigate()
  const { teamId } = useParams();

  // Get filters from localStorage or use defaults
  const getInitialFilter = (key: string) => {
    const saved = localStorage.getItem(`teamInfo_${key}`);
    return saved || "all";
  };

  const [selectedEvent, setSelectedEvent] = useState(getInitialFilter('event'));
  const [selectedSport, setSelectedSport] = useState(getInitialFilter('sport'));

  // Save filters to localStorage whenever they change
  useEffect(() => {
    localStorage.setItem('teamInfo_event', selectedEvent);
    localStorage.setItem('teamInfo_sport', selectedSport);
  }, [selectedEvent, selectedSport]);

  const {
    data: [teamData] = [],
    isPending: isFetchingTeams,
  } = useFetchData(["team-info", teamId], [
    () => TeamsServices.fetchTeamInfo(teamId),
  ]);

  const admin = useStore(selector("admin"));
  const queryClient = useQueryClient();

  // Create memoized lists of unique events and sports
  const filterOptions = useMemo(() => {
    if (!teamData?.events) return {
      eventOptions: [{ value: 'all', label: 'All Events' }],
      sportOptions: [{ value: 'all', label: 'All Sports' }]
    };

    const availableEvents = [...new Set(teamData.events.map((event: any) => event.eventName))];
    
    // Filter sports based on selected event
    const availableSports = [...new Set(teamData.events
      .filter((event: any) => selectedEvent === 'all' || event.eventName === selectedEvent)
      .flatMap((event: any) => event.sportEvents.map((sport: any) => sport.sportsName)))];

    return {
      eventOptions: [
        { value: 'all', label: 'All Events' },
        ...availableEvents.map(eventName => ({
          value: eventName,
          label: eventName
        }))
      ],
      sportOptions: [
        { value: 'all', label: 'All Sports' },
        ...availableSports.map(sportName => ({
          value: sportName,
          label: sportName
        }))
      ]
    };
  }, [teamData, selectedEvent]);

  // Filter events based on selection
  const filteredEvents = useMemo(() => {
    if (!teamData?.events) return [];
    let filtered = teamData.events;

    if (selectedEvent !== 'all') {
      filtered = filtered.filter((event: any) => event.eventName === selectedEvent);
    }

    return filtered.map((event: any) => ({
      ...event,
      sportEvents: event.sportEvents.filter((sport: any) =>
        selectedSport === 'all' || sport.sportsName === selectedSport
      )
    })).filter((event: any) => event.sportEvents.length > 0);
  }, [teamData, selectedEvent, selectedSport]);

  const handleEventChange = (value: string) => {
    setSelectedEvent(value);
    if (value === 'all') {
      setSelectedSport('all');
    }
  };

  const handleSportChange = (value: string) => {
    setSelectedSport(value);
  };

  const updatePlayerStatusMutation = useMutation({
    mutationFn: TeamsServices.updatePlayerStatus,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["team-info", teamId] });
      notification.success({
        message: "Success",
        description: "Player status updated successfully"
      });
    },
    onError: (error: any) => {
      notification.error({
        message: "Error",
        description: error.message || "Failed to update player status"
      });
    }
  });

  const [rejectModalVisible, setRejectModalVisible] = useState(false);
  const [selectedPlayerId, setSelectedPlayerId] = useState<number | null>(null);
  const [rejectRemarks, setRejectRemarks] = useState('');

  const handleUpdateStatus = async (playerId: number, status: string, remarks?: string) => {
    const formData = new FormData();
    formData.append('playerId', playerId.toString());
    formData.append('status', status);
    formData.append('updatedBy', admin.info.id);
    if (remarks) {
      formData.append('remarks', remarks);
    }

    updatePlayerStatusMutation.mutate(formData);
  };

  const handleReject = (playerId: number) => {
    setSelectedPlayerId(playerId);
    setRejectModalVisible(true);
  };

  const handleRejectSubmit = () => {
    if (selectedPlayerId && rejectRemarks) {
      handleUpdateStatus(selectedPlayerId, 'rejected', rejectRemarks);
      setRejectModalVisible(false);
      setRejectRemarks('');
      setSelectedPlayerId(null);
    }
  };

  if (isFetchingTeams) {
    return <p className="text-gray-600 text-center mt-10">Loading...</p>;
  }

  if (!teamData) {
    return <p className="text-red-500 text-center mt-10">Team information not found.</p>;
  }

  const { team } = teamData;

  return (
    <div className="p-6 bg-gray-100 min-h-screen">
      {/* Back Button and Filters */}
      <div className="flex flex-col space-y-4 mb-6">
        <button
          onClick={() => navigate(-1)}
          className="flex items-center px-4 py-2 text-white font-semibold rounded shadow transition-colors w-fit"
          style={{ backgroundColor: '#064518' }}
        >
          <ArrowLeftOutlined className="mr-2" />
          Back
        </button>

        <div className="flex justify-center gap-4">
          <Select
            value={selectedEvent}
            onChange={handleEventChange}
            style={{ width: 200 }}
            placeholder="Filter by Event"
            className="rounded-full"
          >
            {filterOptions.eventOptions.map((option: any) => (
              <Option key={option.value} value={option.value}>
                {option.label}
              </Option>
            ))}
          </Select>

          <Select
            value={selectedSport}
            onChange={handleSportChange}
            style={{ width: 200 }}
            placeholder="Filter by Sport"
            className="rounded-full"
            disabled={selectedEvent === 'all'}
          >
            {filterOptions.sportOptions.map((option: any) => (
              <Option key={option.value} value={option.value}>
                {option.label}
              </Option>
            ))}
          </Select>
        </div>
      </div>

      {/* Team Details */}
      <div className="bg-white shadow-lg rounded-lg p-6 mb-8">
        <div className="flex items-center space-x-6">
          <img
            src={team?.teamLogo}
            alt={team?.teamName}
            className="w-28 h-28 rounded-full border border-gray-300 object-cover"
          />
          <div>
            <h3 className="text-3xl font-extrabold text-gray-800 flex items-center">
              {team?.teamName}
              <FaTrophy className="text-yellow-500 ml-3" title="Champion" />
            </h3>
            <p className="text-gray-500 mt-2 text-sm">
              Date Added: {dateStringFormatter(team?.dateAdded)}
            </p>
          </div>
        </div>
      </div>

      {/* Events Section - Now using filteredEvents */}
      {filteredEvents.map((event: any) => (
        <div
          key={event.eventsId}
          className="bg-white shadow-md rounded-lg p-6 mb-8"
        >
          <div className="border-b pb-4 mb-6 flex items-center">
            <MdEvent className="text-blue-500 text-2xl mr-3" />
            <div>
              <h4 className="text-2xl font-semibold text-gray-800">
                {event.eventName}
              </h4>
              <p className="text-gray-600 mt-1 text-sm">
                {dateStringFormatter(event.eventstartDate)} -{" "}
                {dateStringFormatter(event.eventendDate)}
              </p>
            </div>
          </div>

          {/* Sports Events Section */}
          {event.sportEvents.map((sportEvent: any) => (
            <div
              key={sportEvent.sportEventsId}
              className="bg-gray-50 p-4 rounded-lg shadow-sm mb-6"
            >
              <div className="flex justify-between items-center mb-4">
                <div className="flex items-center space-x-2">
                  <h5 className="text-lg font-bold text-gray-700">
                    {sportEvent.sportsName}
                  </h5>
                </div>
                <span className="text-gray-500 text-sm">
                  Bracket Type: {sportEvent.bracketType}
                </span>
              </div>
              <p className="text-gray-700 text-sm mb-2">
                <span className="font-semibold">Coach:</span>{" "}
                {sportEvent.coachName || "Not Assigned"}
              </p>
              <p className="text-gray-700 text-sm mb-4">
                <span className="font-semibold">Max Players:</span>{" "}
                {sportEvent.maxPlayers}
              </p>
              <p className="text-gray-700 text-sm mb-4">
                <span className="font-semibold">Standing:</span>{" "}
                <span className="text-green-600 font-bold">
                  {sportEvent.teamWin} Wins
                </span>{" "}
                /{" "}
                <span className="text-red-600 font-bold">
                  {sportEvent.teamLose} Losses
                </span>
              </p>

              {/* Players Table */}
              <div className="mt-4 border rounded-lg bg-white shadow">
                <div className="overflow-x-auto" style={{ minHeight: '200px', maxHeight: '400px' }}>
                  <table className="w-full table-auto border-collapse">
                    <thead className="bg-gray-50 sticky top-0">
                      <tr>
                        <th className="px-4 py-3 text-sm font-semibold text-gray-700 text-left w-1/5">
                          Player Name
                        </th>
                        <th className="px-4 py-3 text-sm font-semibold text-gray-700 text-left w-1/5">
                          Medical Certificate
                        </th>
                        <th className="px-4 py-3 text-sm font-semibold text-gray-700 text-left w-1/5">
                          Status
                        </th>
                        <th className="px-4 py-3 text-sm font-semibold text-gray-700 text-left w-1/5">
                          Remarks
                        </th>
                        <th className="px-4 py-3 text-sm font-semibold text-gray-700 text-left w-1/5">
                          Actions
                        </th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-200">
                      {sportEvent.players.map((player: any) => (
                        <tr
                          key={player.playerId}
                          className="group hover:bg-gray-50"
                        >
                          <td className="px-4 py-3 text-sm text-gray-800">
                            <div className="flex items-center">
                              <FaUsers className="text-gray-400 mr-2" />
                              {player.playerName}
                            </div>
                          </td>
                          <td className="px-4 py-3">
                            <div className="flex items-center gap-2">
                              <div className="w-12 h-12 relative">
                                <Image
                                  src={player.medicalCertificate}
                                  alt="Medical Certificate"
                                  className="w-full h-full object-cover rounded"
                                  fallback="https://via.placeholder.com/100?text=No+Image"
                                  preview={{
                                    mask: (
                                      <div className="flex items-center justify-center">
                                        <EyeOutlined className="text-lg" />
                                      </div>
                                    ),
                                  }}
                                />
                              </div>
                              <a
                                href={player.medicalCertificate}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="text-blue-500 hover:text-blue-600 text-sm"
                                onClick={(e) => e.stopPropagation()}
                              >
                                View Full
                              </a>
                            </div>
                          </td>
                          <td className="px-4 py-3 text-sm">
                            <span className={`${
                              player.status === 'approved' ? 'text-green-600' :
                              player.status === 'rejected' ? 'text-red-600' :
                              'text-yellow-600'
                            } font-semibold`}>
                              {player.status?.charAt(0).toUpperCase() + player.status?.slice(1)}
                            </span>
                          </td>
                          <td className="px-4 py-3 text-sm">
                            <span className={`${
                              player.status === 'rejected' ? 'text-red-600' :
                              'text-gray-600'
                            }`}>
                              {player.remarks || '-'}
                            </span>
                          </td>
                          <td className="px-4 py-3">
                            <div className="flex space-x-2">
                              <Tooltip title="Approve Player">
                                <Button
                                  type="text"
                                  icon={<CheckCircleOutlined className={player.status === 'approved' ? 'text-gray-400' : 'text-green-600'} />}
                                  onClick={() => handleUpdateStatus(player.playerId, 'approved')}
                                  disabled={player.status === 'approved'}
                                />
                              </Tooltip>
                              <Tooltip title="Reject Player">
                                <Button
                                  type="text"
                                  icon={<CloseCircleOutlined className={player.status === 'rejected' ? 'text-gray-400' : 'text-red-600'} />}
                                  onClick={() => handleReject(player.playerId)}
                                  disabled={player.status === 'rejected'}
                                />
                              </Tooltip>
                            </div>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          ))}
        </div>
      ))}

      {/* Reject Modal */}
      <Modal
        title="Reject Player"
        open={rejectModalVisible}
        onOk={handleRejectSubmit}
        onCancel={() => {
          setRejectModalVisible(false);
          setRejectRemarks('');
          setSelectedPlayerId(null);
        }}
        okButtonProps={{ 
          style: { backgroundColor: '#064518' },
          disabled: !rejectRemarks
        }}
      >
        <div className="mt-4">
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Rejection Remarks <span className="text-red-500">*</span>
          </label>
          <Input.TextArea
            value={rejectRemarks}
            onChange={(e) => setRejectRemarks(e.target.value)}
            placeholder="Please provide a reason for rejection"
            rows={4}
          />
        </div>
      </Modal>
    </div>
  );
};
