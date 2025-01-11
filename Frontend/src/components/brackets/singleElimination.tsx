import React from "react";
import MatchCard from "./matchupCard";
import { dateStringFormatter } from "../../utility/utils";
import useSingleEliminationHooks from "./useSingleEliminationHooks";
import { SingleEliminationBracketProps } from "../../types";
import { CalendarOutlined, EnvironmentOutlined } from "@ant-design/icons";

const SingleEliminationBracket: React.FC<SingleEliminationBracketProps> = ({ matches, teams }) => {
  const {
    championTeam,
    rounds,
    findTeamById,
  } = useSingleEliminationHooks({ matches, teams });

  return (
    <div className="bracket-grid">
      {Object.keys(rounds).length > 0 ? (
        Object.keys(rounds).map((round) => (
          <div key={round} className="round-column">
            <h3 className="round-title">Round {round}</h3>
            {rounds[Number(round)].map((match) => (
              <div key={match.matchId} className="match-container">
                <div className="flex items-center justify-center gap-4 mb-2 text-sm">
                  <div className="flex items-center gap-1 text-gray-600">
                    <EnvironmentOutlined />
                    {match.venue ? (
                      <span>{match.venue}</span>
                    ) : (
                      <span className="text-gray-400">No Venue</span>
                    )}
                  </div>
                  <div className="flex items-center gap-1 text-gray-600">
                    <CalendarOutlined />
                    {match.schedule ? (
                      <span>{dateStringFormatter(match.schedule)}</span>
                    ) : (
                      <span className="text-gray-400">No Schedule</span>
                    )}
                  </div>
                </div>
                <MatchCard
                  matchId={match.matchId}
                  status={match.status}
                  winnerTeamId={match.winner_team_id}
                  team1={findTeamById(match.team1Id)}
                  team2={findTeamById(match.team2Id)}
                  team1Score={match.team1Score ?? undefined}
                  team2Score={match.team2Score ?? undefined}
                  schedule={match.schedule}
                  venue={match.venue}
                />
              </div>
            ))}
          </div>
        ))
      ) : (
        <p className="text-center text-gray-500">No matches found</p>
      )}


      {championTeam && (
        <div className="champion-section bg-gradient-to-r from-yellow-300 via-yellow-500 to-yellow-300 p-6 rounded-lg shadow-lg mt-6 text-center flex flex-col items-center space-y-4">
          <h2 className="text-3xl font-bold text-white mb-2">🏆 Champion 🏆</h2>
          <div className="flex items-center space-x-4">
            <img
              src={championTeam.teamLogo}
              alt={championTeam.teamName}
              className="w-24 h-24 rounded-full border-4 border-white shadow-lg"
            />
            <div className="text-start">
              <p className="text-2xl font-semibold text-white">{championTeam.teamName}</p>
              <p className="text-lg text-white opacity-90">Congratulations to the champion team!</p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default SingleEliminationBracket;
