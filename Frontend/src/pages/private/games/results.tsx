import { useState, useMemo } from "react";
import { Select, Tag, Table, Typography, Tooltip } from "antd";
import useGameResults from "./useGameResults";
import { CiLocationOn } from "react-icons/ci";
import { ScheduleOutlined } from "@ant-design/icons";

const { Option } = Select;
const { Text } = Typography;

export const GameResults = () => {
  const { isFetchingMatch, paginatedMatches } = useGameResults();

  const getInitialFilter = (key: string) => {
    const saved = localStorage.getItem(`gameResults_${key}`);
    return saved || "all";
  };

  const [eventFilter, setEventFilter] = useState(getInitialFilter("event"));
  const [sportFilter, setSportFilter] = useState(getInitialFilter("sport"));
  const [sortBy, setSortBy] = useState("date");

  // Save filters to localStorage whenever they change
  const handleEventChange = (value: string) => {
    setEventFilter(value);
    if (value === 'all') {
      setSportFilter('all');
    }
    localStorage.setItem('gameResults_event', value);
  };

  const handleSportChange = (value: string) => {
    setSportFilter(value);
    localStorage.setItem('gameResults_sport', value);
  };

  const filterOptions = useMemo(() => {
    if (!paginatedMatches) return { events: [], sports: [] };

    const availableEvents = [...new Set(paginatedMatches.map((m: any) => m.event?.eventName))];
    
    // Filter sports based on selected event
    const availableSports = [...new Set(paginatedMatches
      .filter((m: any) => eventFilter === 'all' || m.event?.eventName === eventFilter)
      .map((m: any) => m.sport?.sportsName))];

    return {
      events: availableEvents,
      sports: availableSports
    };
  }, [paginatedMatches, eventFilter]);

  // Filter and sort matches based on selected filters
  const filteredMatches = useMemo(() => {
    if (!paginatedMatches) return [];

    let filtered = paginatedMatches.filter((match: any) => {
      const eventMatches = eventFilter === "all" || match.event?.eventName === eventFilter;
      const sportMatches = sportFilter === "all" || match.sport?.sportsName === sportFilter;
      return eventMatches && sportMatches;
    });

    // Sort matches based on selected sort option
    return filtered.sort((a: any, b: any) => {
      switch (sortBy) {
        case "date":
          return new Date(b.schedule || 0).getTime() - new Date(a.schedule || 0).getTime();
        case "round":
          return a.round - b.round;
        case "status": {
          const statusOrder: { [key: string]: number } = { completed: 0, ongoing: 1, pending: 2 };
          const statusA = (a.status || 'pending').toLowerCase();
          const statusB = (b.status || 'pending').toLowerCase();
          return statusOrder[statusA] - statusOrder[statusB];
        }
        default:
          return 0;
      }
    });
  }, [paginatedMatches, eventFilter, sportFilter, sortBy]);

  const columns = [
    {
      title: "Match",
      dataIndex: "matchId",
      key: "matchId",
      render: (_text: any, record: any) => (
        <Text strong>
          Round {record.round} - Match {record.matchId}
          {record.bracketType && (
            <span className="ml-2 text-gray-500">({record.bracketType})</span>
          )}
        </Text>
      ),
    },
    {
      title: "Event & Sport",
      key: "eventSport",
      render: (_text: any, record: any) => (
        <Text>
          {record.event?.eventName} • {record.sport?.sportsName}
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
            <Text strong>{record.team1Score || 0}</Text>
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
            <Text strong>{record.team2Score || 0}</Text>
          </div>
        </div>
      ),
    },
    {
      title: "Status",
      dataIndex: "status",
      key: "status",
      render: (status: string) => (
        <Tag color={status === 'completed' ? 'green' : status === 'ongoing' ? 'orange' : 'yellow'}>
          {status?.toUpperCase()}
        </Tag>
      ),
    },
    {
      title: "Schedule",
      dataIndex: "schedule",
      key: "schedule",
      render: (schedule: string) => (
        <Text>
          <ScheduleOutlined /> {schedule ? new Date(schedule).toLocaleString() : 'Not Set'}
        </Text>
      ),
    },
    {
      title: "Venue",
      dataIndex: "venue",
      key: "venue",
      render: (venue: string) => (
        <Text>
          <CiLocationOn className="inline mr-1" /> {venue || "Not Set"}
        </Text>
      ),
    },
  ];

  if (isFetchingMatch) {
    return <div>Loading...</div>;
  }

  return (
    <div className="p-5">
      <div className="flex justify-center items-center mb-4">
        <h1 className="text-2xl font-bold text-gray-800">Game Results</h1>
      </div>

      {/* Filters */}
      <div className="flex justify-center gap-4 mb-6">
        <Select
          value={eventFilter}
          onChange={handleEventChange}
          style={{ width: 200 }}
          placeholder="Filter by Event"
          className="rounded-full"
        >
          <Option value="all">All Events</Option>
          {filterOptions.events.map((eventName: string) => (
            <Option key={eventName} value={eventName}>
              {eventName}
            </Option>
          ))}
        </Select>

        <Select
          value={sportFilter}
          onChange={handleSportChange}
          style={{ width: 200 }}
          placeholder="Filter by Sport"
          className="rounded-full"
          disabled={eventFilter === 'all'}
        >
          <Option value="all">All Sports</Option>
          {filterOptions.sports.map((sportName: string) => (
            <Option key={sportName} value={sportName}>
              {sportName}
            </Option>
          ))}
        </Select>

        <Select
          value={sortBy}
          onChange={(value) => setSortBy(value)}
          style={{ width: 200 }}
          placeholder="Sort by"
          className="rounded-full"
        >
          <Option value="date">Latest First</Option>
          <Option value="round">Round Number</Option>
          <Option value="status">Status</Option>
        </Select>
      </div>

      <Table
        dataSource={filteredMatches}
        columns={columns}
        rowKey="matchId"
        pagination={false}
        className="mt-4"
      />
    </div>
  );
};

export default GameResults;
