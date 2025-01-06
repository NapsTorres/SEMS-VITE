import { useState, useMemo } from "react";
import { Select } from "antd";
import useGameResults from "./useGameResults";

const { Option } = Select;

export const GameResults = () => {
  const { isFetchingMatch, paginatedMatches } = useGameResults();

  const getInitialFilter = (key: string) => {
    const saved = localStorage.getItem(`gameResults_${key}`);
    return saved || "all";
  };

  const [eventFilter, setEventFilter] = useState(getInitialFilter("event"));
  const [sportFilter, setSportFilter] = useState(getInitialFilter("sport"));

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

  // Filter matches based on selected filters
  const filteredMatches = useMemo(() => {
    if (!paginatedMatches) return [];

    return paginatedMatches.filter((match: any) => {
      const eventMatches = eventFilter === "all" || match.event?.eventName === eventFilter;
      const sportMatches = sportFilter === "all" || match.sport?.sportsName === sportFilter;
      return eventMatches && sportMatches;
    });
  }, [paginatedMatches, eventFilter, sportFilter]);

  if (isFetchingMatch) {
    return <div>Loading...</div>;
  }

  return (
    <div className="space-y-2 p-4">
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
      </div>

      <div className="space-y-6 px-20">
        {filteredMatches?.map((match: any) => {
          const team1 = match.team1 || { teamName: 'Team 1', teamLogo: 'https://via.placeholder.com/60' };
          const team2 = match.team2 || { teamName: 'Team 2', teamLogo: 'https://via.placeholder.com/60' };
          
          return (
            <div
              key={match.matchId}
              className="w-full flex items-center blur-bg flex-col gap-6 border-4 border-blue-700 p-4"
              style={{
                backgroundImage: 'url("/bg.jpg")',
                backgroundSize: "fill",
                backgroundPosition: "center",
              }}
            >
              {/* Team 1 */}
              <div
                className="relative w-[70%] h-20 transform -skew-x-12 grid grid-cols-7"
                style={{
                  backgroundImage: 'url("/score.jpg")',
                  backgroundSize: "cover",
                  backgroundPosition: "center",
                }}
              >
                <div
                  className="col-span-2 flex justify-center items-center transform -skew-x-10 w-[180px] h-24 border-4 -mt-[8px] ml-4"
                  style={{
                    backgroundImage: 'url("/logobg.jpg")',
                    backgroundSize: "cover",
                    backgroundPosition: "center",
                  }}
                >
                  <img
                    className="w-20 aspect-square rounded-full"
                    src={team1.teamLogo}
                    alt={team1.teamName}
                  />
                </div>
                <div className="col-span-4 flex justify-start items-center transform -skew-x-10 h-20">
                  <p className="text-lg font-bold">{team1.teamName}</p>
                  <p className="text-xs text-gray-200">{team1.nickname || ''}</p>
                </div>
                <div className="col-span-1 flex justify-center items-center transform -skew-x-10 bg-black h-20">
                  <p className="text-4xl font-bold text-white">
                    {match.team1Score || 0}
                  </p>
                </div>
              </div>
              {/* Team 2 */}
              <div
                className="relative w-[70%] -ml-[38px] h-20 transform -skew-x-12 grid grid-cols-7"
                style={{
                  backgroundImage: 'url("/score.jpg")',
                  backgroundSize: "cover",
                  backgroundPosition: "center",
                }}
              >
                <div
                  className="col-span-2 flex justify-center items-center transform -skew-x-10 w-[180px] h-24 border-4 -mt-[8px] ml-4"
                  style={{
                    backgroundImage: 'url("/logobg.jpg")',
                    backgroundSize: "cover",
                    backgroundPosition: "center",
                  }}
                >
                  <img
                    className="w-20 border-4 borber-black m-2 aspect-square rounded-full"
                    src={team2.teamLogo}
                    alt={team2.teamName}
                  />
                </div>
                <div className="col-span-4 flex justify-start items-center transform -skew-x-10 h-20">
                  <p className="text-lg font-bold">{team2.teamName}</p>
                  <p className="text-xs text-gray-200">{team2.nickname || ''}</p>
                </div>
                <div className="col-span-1 flex justify-center items-center transform -skew-x-10 bg-black h-20">
                  <p className="text-4xl font-bold text-white">
                    {match.team2Score || 0}
                  </p>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default GameResults;
