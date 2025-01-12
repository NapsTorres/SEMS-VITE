/* eslint-disable @typescript-eslint/no-explicit-any */
import {
  Button,
  Select,
  Spin,
  Table,
  Tag,
  Typography,
  Tooltip,
  DatePicker,
} from "antd";
import { ScheduleOutlined, EditOutlined } from "@ant-design/icons";
import ScheduleModal from "../../../components/form/SetSchedule";
import useGameSchedule from "./useGameScheduling";
import { CiLocationOn } from "react-icons/ci";
import moment from "moment";
import { useLocation } from "react-router-dom";
import { useEffect } from "react";
import { useFetchData } from "../../../config/axios/requestData";
import EventsServices from "../../../config/service/events";
import { Events } from "../../../types";

const { Option } = Select;
const { Text } = Typography;

export const GameSchedule = () => {
  const location = useLocation();
  const { openScheduleForm, matchId, team1Name, team2Name, team1Id, team2Id, currentSchedule, currentVenue } = location.state || {};

  const {
    isFetchingMatch,
    paginatedMatches,
    venue,
    schedule,
    isScheduleModalVisible,
    selectedMatch,
    currentPage,
    filteredMatches,
    matchesPerPage,
    filterOptions,
    roundFilter,
    dateFilter,
    eventFilter,
    sportFilter,
    setScheduleModalVisible,
    handleScheduleSubmit,
    setRoundFilter,
    setDateFilter,
    setEventFilter,
    setSportFilter,
    openScheduleModal,
    handlePageChange,
    setSchedule,
    setVenue,
    statusFilter,
    setStatusFilter,
  } = useGameSchedule();

  // Fetch events data
  const { data: events } = useFetchData(["Events"], [() => EventsServices.fetchEvents()]);

  // Get event dates for the selected match
  const getEventDates = () => {
    if (eventFilter === 'all') return { startDate: undefined, endDate: undefined };
    const event = events?.find((e: Events) => e.eventName === eventFilter);
    return {
      startDate: event?.eventStartDate,
      endDate: event?.eventEndDate
    };
  };

  // Handle auto-opening schedule modal when navigating from matchup card
  useEffect(() => {
    if (openScheduleForm && matchId) {
      const match = {
        matchId,
        team1: { teamName: team1Name, teamId: team1Id },
        team2: { teamName: team2Name, teamId: team2Id },
        schedule: currentSchedule,
        venue: currentVenue
      };
      openScheduleModal(match);
    }
  }, [openScheduleForm, matchId]);

  const getStatusTag = (status: string) => {
    switch (status) {
      case "pending":
        return <Tag className="min-w-20 text-center" color="yellow">Pending</Tag>;
      case "ongoing":
        return <Tag className="min-w-20 text-center" color="orange">Ongoing</Tag>;
      case "completed":
        return <Tag className="min-w-20 text-center" color="green">Completed</Tag>;
      default:
        return <Tag className="min-w-20 text-center" color="yellow">Pending</Tag>;
    }
  };

  const columns = [
    {
      title: "Match",
      dataIndex: "matchId",
      key: "matchId",
      render: (_text: any, record: any) => (
        <Text strong>
          Round {record.round} - Match {record.matchId}
        </Text>
      ),
    },
    {
      title: "Teams",
      key: "teams",
      render: (_text: any, record: any) => (
        <div className="grid grid-cols-5 gap-4">
          <div className="text-center flex flex-col items-center col-span-2">
            <Tooltip title={record.team1?.teamName}>
              <img
                src={record.team1?.teamLogo || "https://via.placeholder.com/60"}
                alt={record.team1?.teamName}
                className="w-12 h-12 rounded-full shadow-md"
              />
            </Tooltip>
            <Text className="block mt-1">{record.team1?.teamName || "Team 1"}</Text>
          </div>
          <Text strong className="text-lg col-span-1 text-center">
            VS
          </Text>
          <div className="text-center flex flex-col items-center col-span-2">
            <Tooltip title={record.team2?.teamName}>
              <img
                src={record.team2?.teamLogo || "https://via.placeholder.com/60"}
                alt={record.team2?.teamName}
                className="w-12 h-12 rounded-full shadow-md"
              />
            </Tooltip>
            <Text className="block mt-1">{record.team2?.teamName || "Team 2"}</Text>
          </div>
        </div>
      ),
    },
    {
      title: "Status",
      dataIndex: "status",
      key: "status",
      render: (status: string) => getStatusTag(status),
    },
    {
      title: "Scheduled",
      dataIndex: "schedule",
      key: "schedule",
      render: (schedule: string) => (
        <Text>
          <ScheduleOutlined /> {new Date(schedule).toLocaleString()}
        </Text>
      ),
    },
    {
      title: "Venue",
      dataIndex: "venue",
      key: "venue",
      render: (venue: string) => (
        <Text className="flex items-center flex-nowrap gap-2">
          <CiLocationOn /> {venue || "Not Set"}
        </Text>
      ),
    },
    {
      title: "Action",
      key: "action",
      render: (_text: any, record: any) => (
        <Button
          type="primary"
          icon={<EditOutlined />}
          onClick={() => openScheduleModal(record)}
          disabled={record.status === "completed" || record.status === "ongoing"}
          className="rounded-full"
          style={{ backgroundColor: '#064518', borderColor: '#064518', color: 'white' }}
        >
          Schedule & Venue
        </Button>
      ),
    },
  ];

  if (isFetchingMatch) {
    return <Spin size="large" />;
  }

  const { startDate, endDate } = getEventDates();

  return (
    <div className="p-5">
      <div className="flex justify-center items-center mb-4">
        <h1 className="text-2xl font-bold text-gray-800">Game Schedule</h1>
      </div>

      {/* Filters */}
      <div className="flex gap-4 mb-4 justify-center">
        {/* Status Filter */}
        <Select
          value={statusFilter}
          onChange={setStatusFilter}
          style={{ width: 200 }}
          placeholder="Filter by Status"
          className="rounded-full"
        >
          <Option value="all">All Statuses</Option>
          <Option value="pending">Pending</Option>
          <Option value="ongoing">Ongoing</Option>
          <Option value="completed">Completed</Option>
        </Select>

        {/* Event Filter */}
        <Select
          value={eventFilter}
          onChange={(value) => {
            setEventFilter(value);
            if (value === 'all') {
              setSportFilter('all');
            }
          }}
          style={{ width: 200 }}
          placeholder="Filter by Event"
          className="rounded-full"
        >
          <Option value="all">All Events</Option>
          {filterOptions.events.map((eventName: unknown) => (
            <Option key={eventName as string} value={eventName as string}>
              {eventName as string}
            </Option>
          ))}
        </Select>

        {/* Sport Filter */}
        <Select
          value={sportFilter}
          onChange={setSportFilter}
          style={{ width: 200 }}
          placeholder="Filter by Sport"
          className="rounded-full"
          disabled={eventFilter === 'all'}
        >
          <Option value="all">All Sports</Option>
          {filterOptions.sports.map((sportName: unknown) => (
            <Option key={sportName as string} value={sportName as string}>
              {sportName as string}
            </Option>
          ))}
        </Select>

        {/* Round Filter */}
        <Select
          value={roundFilter}
          onChange={setRoundFilter}
          style={{ width: 200 }}
          placeholder="Filter by Round"
          className="rounded-full"
        >
          <Option value="all">All Rounds</Option>
          {filterOptions.rounds.map((round: unknown) => (
            <Option key={round as number} value={(round as number).toString()}>
              Round {round as number}
            </Option>
          ))}
        </Select>

        {/* Date Filter */}
        <DatePicker
          value={dateFilter ? moment(dateFilter) : null}
          onChange={(date) => setDateFilter(date ? date.format('YYYY-MM-DD') : null)}
          style={{ width: 200 }}
          placeholder="Filter by Date"
          className="rounded-full"
        />
      </div>

      <Table
        dataSource={paginatedMatches}
        columns={columns}
        rowKey="matchId"
        pagination={{
          current: currentPage,
          total: filteredMatches.length,
          pageSize: matchesPerPage,
          onChange: handlePageChange,
          showSizeChanger: false,
        }}
        className="mt-4"
      />

      {selectedMatch && (
        <ScheduleModal
          isModalVisible={isScheduleModalVisible}
          schedule={schedule}
          setSchedule={setSchedule}
          venue={venue}
          setVenue={setVenue}
          handleScheduleSubmit={() => handleScheduleSubmit(selectedMatch)}
          onCancel={() => setScheduleModalVisible(false)}
          isSubmitting={false}
          eventStartDate={startDate}
          eventEndDate={endDate}
        />
      )}
    </div>
  );
};

export default GameSchedule;
