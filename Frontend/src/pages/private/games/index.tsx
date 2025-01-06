import { Link } from "react-router-dom";
import { useState, useEffect, useMemo } from "react";
import { Button, Pagination, Select, Spin } from "antd";
import useGameScorig from "./useGameScoring";

const { Option } = Select;

export const GameScoring = () => {
  const { Match, isFetchingMatch } = useGameScorig({});
  const [currentPage, setCurrentPage] = useState(1);
  const [matchesPerPage] = useState(6);

  const getInitialFilter = (key: string) => {
    const saved = localStorage.getItem(`gameScoring_${key}`);
    return saved || "all";
  };

  const [statusFilter, setStatusFilter] = useState(getInitialFilter("status"));
  const [roundFilter, setRoundFilter] = useState(getInitialFilter("round"));
  const [eventFilter, setEventFilter] = useState(getInitialFilter("event"));
  const [sportFilter, setSportFilter] = useState(getInitialFilter("sport"));

  // Save filters to localStorage whenever they change
  useEffect(() => {
    localStorage.setItem('gameScoring_status', statusFilter);
    localStorage.setItem('gameScoring_round', roundFilter);
    localStorage.setItem('gameScoring_event', eventFilter);
    localStorage.setItem('gameScoring_sport', sportFilter);
  }, [statusFilter, roundFilter, eventFilter, sportFilter]);

  const filterOptions = useMemo(() => {
    if (!Match) return { events: [], sports: [], rounds: [] };

    const availableEvents = [...new Set(Match.map((m: any) => m.event.eventName))];
    
    // Filter sports based on selected event
    const availableSports = [...new Set(Match
      .filter((m: any) => eventFilter === 'all' || m.event.eventName === eventFilter)
      .map((m: any) => m.sport.sportsName))];
    
    // Filter rounds based on selected event and sport
    const availableRounds = [...new Set(Match
      .filter((m: any) => {
        const eventMatch = eventFilter === 'all' || m.event.eventName === eventFilter;
        const sportMatch = sportFilter === 'all' || m.sport.sportsName === sportFilter;
        return eventMatch && sportMatch;
      })
      .map((m: any) => m.round))];

    return {
      events: availableEvents,
      sports: availableSports,
      rounds: availableRounds.sort((a: number, b: number) => a - b)
    };
  }, [Match, eventFilter, sportFilter]);

  const getStatusBackground = (status: string) => {
    const lowerStatus = status?.toLowerCase() || '';
    switch (lowerStatus) {
      case "scheduled":
        return "bg-gradient-to-r from-yellow-200 to-yellow-400";
      case "ongoing":
        return "bg-gradient-to-r from-orange-300 to-orange-500";
      case "completed":
        return "bg-gradient-to-r from-green-300 to-green-500";
      default:
        return "bg-gradient-to-r from-yellow-200 to-yellow-400";
    }
  };

  const filteredMatches = useMemo(() => {
    if (!Match) return [];

    const filtered = Match.filter((match: any) => {
      const hasSched = match.schedule !== "" && match.schedule !== null;
      const matchStatus = match.status?.toLowerCase() || '';
      const filterStatus = statusFilter.toLowerCase();

      const statusMatch = filterStatus === "all" || matchStatus === filterStatus;
      const roundMatch = roundFilter === "all" || match.round.toString() === roundFilter;
      const eventMatch = eventFilter === "all" || match.event.eventName === eventFilter;
      const sportMatch = sportFilter === "all" || match.sport.sportsName === sportFilter;

      return statusMatch && roundMatch && eventMatch && sportMatch && hasSched;
    });

    // Define exact order: scheduled -> ongoing -> completed
    const getStatusOrder = (status: string): number => {
      const lowerStatus = status?.toLowerCase() || '';
      switch (lowerStatus) {
        case 'scheduled': return 0;
        case 'ongoing': return 1;
        case 'completed': return 2;
        default: return 999; // Any other status goes to the end
      }
    };
    
    return filtered.sort((a: any, b: any) => {
      // First, compare by status order
      const aOrder = getStatusOrder(a.status);
      const bOrder = getStatusOrder(b.status);
      if (aOrder !== bOrder) return aOrder - bOrder;
      
      // If same status, sort by schedule date (newer first)
      if (a.schedule && b.schedule) {
        return new Date(b.schedule).getTime() - new Date(a.schedule).getTime();
      }
      
      // Put matches without schedule at the end
      if (!a.schedule) return 1;
      if (!b.schedule) return -1;
      return 0;
    });
  }, [Match, statusFilter, roundFilter, eventFilter, sportFilter]);

  const paginatedMatches = useMemo(() => {
    const indexOfLastMatch = currentPage * matchesPerPage;
    const indexOfFirstMatch = indexOfLastMatch - matchesPerPage;
    return filteredMatches?.slice(indexOfFirstMatch, indexOfLastMatch);
  }, [filteredMatches, currentPage, matchesPerPage]);

  const handlePageChange = (page: number) => setCurrentPage(page);

  const getWinner = (team1Score: number, team2Score: number, team1: any, team2: any, status: string) => {
    if (team1Score > team2Score) return team1?.teamName || "Team 1";
    if (team2Score > team1Score) return team2?.teamName || "Team 2";
    if (team1Score === team2Score) {
      return status === "completed" ? "Draw" : "Not Declared";
    }
    return "Not Declared";
  };

  if (isFetchingMatch) {
    return <Spin size="large" />;
  }

  return (
    <div className="p-5">
      <div className="flex justify-center items-center mb-4">
        <h1 className="text-2xl font-bold text-gray-800">Game Scoring</h1>
      </div>

      {/* Filters */}
      <div className="flex gap-4 mb-4 justify-center">
        <Select
          value={statusFilter}
          onChange={setStatusFilter}
          style={{ width: 200 }}
          placeholder="Filter by Status"
          className="rounded-full"
        >
          <Option value="all">All Statuses</Option>
          <Option value="scheduled">Pending</Option>
          <Option value="ongoing">Ongoing</Option>
          <Option value="completed">Completed</Option>
        </Select>

        <Select
          value={eventFilter}
          onChange={setEventFilter}
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
      </div>

      {/* Matches Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mb-4">
        {paginatedMatches?.map((match: any) => {
          const team1 = match.team1;
          const team2 = match.team2;
          const team1Score = match.team1Score || 0;
          const team2Score = match.team2Score || 0;
          const winner = getWinner(team1Score, team2Score, team1, team2, match.status);
          const eventAndSport = `${match.event?.eventName || "Unknown Event"} - ${match.sport?.sportsName || "Unknown Sport"}`;
          const statusBackground = getStatusBackground(match.status);

          return (
            <div
              key={match.matchId}
              className={`p-4 rounded-lg h-[500px] shadow-md ${statusBackground}`}
            >
              <div className="h-full flex flex-col">
                <h2 className="text-lg font-semibold text-center mb-4">
                  {eventAndSport}
                </h2>
                <h2 className="text-lg font-semibold text-center mb-4">
                  Round {match.round} - Match {match.matchId}
                </h2>
                <div className="text-center mb-4">
                  <p className="text-xl font-bold">
                    <strong>Winner:</strong> {winner}
                  </p>
                </div>
                <div className="flex-grow flex justify-center items-center mb-4">
                  <div className="flex flex-col items-center mx-4">
                    <img
                      src={team1?.teamLogo || "https://via.placeholder.com/60"}
                      alt={team1?.teamName}
                      className="w-16 h-16 rounded-full shadow-md"
                    />
                    <p className="font-semibold text-center mt-2">{team1?.teamName || "Team 1"}</p>
                    <p className="text-center font-bold">Score: {team1Score}</p>
                  </div>
                  <p className="text-xl font-bold mx-2">VS</p>
                  <div className="flex flex-col items-center mx-4">
                    <img
                      src={team2?.teamLogo || "https://via.placeholder.com/60"}
                      alt={team2?.teamName}
                      className="w-16 h-16 rounded-full shadow-md"
                    />
                    <p className="font-semibold text-center mt-2">{team2?.teamName || "Team 2"}</p>
                    <p className="text-center font-bold">Score: {team2Score}</p>
                  </div>
                </div>
                <div className="text-center mb-4">
                  <p><strong>Status:</strong> {match.status || "Pending"}</p>
                  <p><strong>Scheduled:</strong> {new Date(match.schedule).toLocaleString()}</p>
                </div>
                <Link to={`match/${match.matchId}`}>
                  <Button type="primary" block style={{ backgroundColor: '#064518', borderColor: '#064518', color: 'white' }}>Update Match</Button>
                </Link>
              </div>
            </div>
          );
        })}
      </div>

      {/* Pagination */}
      <div className="flex justify-end mt-4">
        <Pagination
          current={currentPage}
          pageSize={matchesPerPage}
          total={filteredMatches?.length || 0}
          onChange={handlePageChange}
          showSizeChanger={false}
          className="rounded-full"
          showTotal={(total) => `Total ${total} matches`}
        />
      </div>
    </div>
  );
};
