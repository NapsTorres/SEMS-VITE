import React from "react";
import useDoubleEliminationHooks from "./useDoubleEliminationHooks";
import { DoubleEliminationHooksProps } from "../../types";
import MatchCard from "./matchupCard";
import { CalendarOutlined, EnvironmentOutlined } from "@ant-design/icons";
import { dateStringFormatter } from "../../utility/utils";

const DoubleEliminationBracket: React.FC<DoubleEliminationHooksProps> = ({
  matches,
  teams,
}) => {
  const {
    championTeam,
    winnersRounds,
    losersRounds,
    finalRound,
    finalRematchRound,
    findTeamById,
  } = useDoubleEliminationHooks({ matches, teams });

  const renderMatch = (match: any) => (
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
        team1Score={match.team1Score}
        team2Score={match.team2Score}
        schedule={match.schedule}
        venue={match.venue}
      />
    </div>
  );

  return (
    <div className="space-y-6">
      {/* Winners Bracket */}
      <div className="winners-bracket">
        <h2 className="text-xl font-bold text-center mb-4">Winners Bracket</h2>
        <div className="bracket-grid grid grid-cols-6 gap-4">
          {Object.keys(winnersRounds).map((round, index) => (
            <div key={round} className="round-column flex flex-col space-y-4">
              <h3 className="round-title text-lg font-semibold text-center">
                Round {index + 1}
              </h3>
              {winnersRounds[Number(round)].map((match) => renderMatch(match))}
            </div>
          ))}
        </div>
      </div>

      {/* Final and Final Rematch */}
      <div className="finals-section">
        <h2 className="text-xl font-bold text-center mb-4">Finals</h2>
        <div className="bracket-grid grid grid-cols-6 gap-4">
          {/* Empty space for alignment */}
          <div className="col-span-2"></div>

          {/* Final Column */}
          <div className="round-column flex flex-col space-y-4 col-span-1">
            <h3 className="round-title text-lg font-semibold text-center">Final</h3>
            {Object.keys(finalRound).map((round) => (
              <div key={round}>
                {finalRound[Number(round)].map((match) => renderMatch(match))}
              </div>
            ))}
          </div>

          {/* Final Rematch Column */}
          <div className="round-column flex flex-col space-y-4 col-span-1">
            <h3 className="round-title text-lg font-semibold text-center">Final Rematch</h3>
            {Object.keys(finalRematchRound).map((round) => (
              <div key={round}>
                {finalRematchRound[Number(round)].map((match) => renderMatch(match))}
              </div>
            ))}
          </div>

          {/* Empty space for alignment */}
          <div className="col-span-2"></div>
        </div>
      </div>

      {/* Losers Bracket */}
      <div className="losers-bracket">
        <h2 className="text-xl font-bold text-center mb-4">Losers Bracket</h2>
        <div className="bracket-grid grid grid-cols-6 gap-4">
          {Object.keys(losersRounds).map((round, index) => (
            <div key={round} className="round-column flex flex-col space-y-4">
              <h3 className="round-title text-lg font-semibold text-center">
                Round {index + 1}
              </h3>
              {losersRounds[Number(round)].map((match) => renderMatch(match))}
            </div>
          ))}
        </div>
      </div>

      {/* Champion Section */}
      {championTeam ? (
        <div className="champion-section bg-gradient-to-r from-yellow-300 via-yellow-500 to-yellow-300 p-6 rounded-lg shadow-lg mt-6 text-center flex flex-col items-center space-y-4">
          <h2 className="text-3xl font-bold text-white mb-2">🏆 Champion 🏆</h2>
          <div className="flex items-center space-x-4">
            <img
              src={championTeam.teamLogo}
              alt={championTeam.teamName}
              className="w-24 h-24 rounded-full border-4 border-white shadow-lg"
            />
            <div className="text-start">
              <p className="text-2xl font-semibold text-white">
                {championTeam.teamName}
              </p>
              <p className="text-lg text-white opacity-90">
                Congratulations to the champion team!
              </p>
            </div>
          </div>
        </div>
      ) : null}
    </div>
  );
};

export default DoubleEliminationBracket;
