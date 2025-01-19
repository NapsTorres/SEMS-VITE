import React from "react";
import { Team } from "../../types";
import { useNavigate } from "react-router-dom";

interface MatchCardProps {
  team1: Team | null;
  team2: Team | null;
  status: string;
  winnerTeamId: number | null;
  matchId: number;
  team1Score?: number | null;
  team2Score?: number | null;
  schedule?: string | null;
  venue?: string | null;
}

const MatchCard: React.FC<MatchCardProps> = ({
  team1,
  team2,
  status,
  winnerTeamId,
  matchId, 
  team1Score,
  team2Score,
  schedule,
  venue,
}) => {
  const navigate = useNavigate();
  const isTeam1Winner = team1 && winnerTeamId === team1.teamId;
  const isTeam2Winner = team2 && winnerTeamId === team2.teamId;

  const handleClick = () => {
    if (status === "completed") {
      return; // Don't do anything for completed matches
    }
    
    // Check if schedule and venue are properly set
    const hasSchedule = schedule !== null && schedule !== undefined && schedule !== "";
    const hasVenue = venue !== null && venue !== undefined && venue !== "" && venue !== "Not Set";
    
    // If match hasn't been scheduled or no venue set, go to Game Schedule
    if (!hasSchedule || !hasVenue) {
      navigate('/Game-Schedule', {
        state: { 
          highlightMatchId: matchId,
        }
      });
      return;
    }
    
    // If match has schedule and venue, go to scoring page
    navigate(`/Game-Scoring/match/${matchId}`);
  };

  return (
    <div
      onClick={handleClick}
      className={`row-span-7 flex flex-col justify-center gap-4 items-start rounded-lg p-6 shadow-md w-80 h-64 m-2 ${
        status === "completed"
          ? "cursor-not-allowed bg-white"
          : "cursor-pointer bg-white hover:bg-gray-50"
      }`}
    >
      <div className="flex justify-between w-full">
        <div className="text-gray-500 text-sm font-semibold">
          Match ID: {matchId}
        </div>
      </div>

      <div className="flex items-center gap-4 justify-between w-full">
        <div className="flex items-center gap-4">
          {team1?.teamLogo ? (
            <img
              src={team1.teamLogo}
              className={`w-14 h-14 rounded-full ${
                !isTeam1Winner && status === "completed" ? "filter grayscale" : ""
              }`}
              alt={team1.teamName}
            />
          ) : (
            <div className="w-14 h-14 rounded-full bg-gray-300" />
          )}
          <p
            className={`text-sm font-semibold text-start ${
              !isTeam1Winner && status === "completed" ? "text-gray-400" : "text-gray-700"
            }`}
          >
            {team1 ? team1.teamName : "TBD"}
          </p>
        </div>
        <p className={`text-xl min-w-[30px] text-right ${isTeam1Winner ? "text-green-500" : "text-gray-500"}`}>
          {team1Score ?? 0}
        </p>
      </div>

      <span className="text-gray-500 text-xs text-center w-full">vs</span>

      <div className="flex items-center gap-4 justify-between w-full">
        <div className="flex items-center gap-4">
          {team2?.teamLogo ? (
            <img
              src={team2.teamLogo}
              className={`w-14 h-14 rounded-full ${
                !isTeam2Winner && status === "completed" ? "filter grayscale" : ""
              }`}
              alt={team2.teamName}
            />
          ) : (
            <div className="w-14 h-14 rounded-full bg-gray-300" />
          )}
          <p
            className={`text-sm font-semibold text-start ${
              !isTeam2Winner && status === "completed" ? "text-gray-400" : "text-gray-700"
            }`}
          >
            {team2 ? team2.teamName : "TBD"}
          </p>
        </div>
        <p className={`text-xl min-w-[30px] text-right ${isTeam2Winner ? "text-green-500" : "text-gray-500"}`}>
          {team2Score ?? 0}
        </p>
      </div>

      {status === "completed" && winnerTeamId && (
        <div className="mt-2 text-center text-sm font-semibold text-blue-500">
          Winner:{" "}
          <span className={`${winnerTeamId === team1?.teamId ? "text-blue-500" : "text-blue-500"}`}>
            {winnerTeamId === team1?.teamId ? team1?.teamName : team2?.teamName}
          </span>
        </div>
      )}
    </div>
  );
};

export default MatchCard;
