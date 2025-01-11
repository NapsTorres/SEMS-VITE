/* eslint-disable @typescript-eslint/no-explicit-any */
import React from "react";
import { Match, RoundRobinHooksProps } from "../../types";
import { dateStringFormatter } from "../../utility/utils";
import { CalendarOutlined, EnvironmentOutlined } from "@ant-design/icons";
import { useNavigate } from "react-router-dom";

interface RoundRobinBracketProps extends RoundRobinHooksProps {
  isPublicView?: boolean;
}

const RoundRobinBracket: React.FC<RoundRobinBracketProps> = ({ matches, teams, isPublicView = false }) => {
  const navigate = useNavigate();
  const roundsMatch = matches?.reduce((acc, match) => {
    const round = acc[match.round] || [];
    round.push(match);
    acc[match.round] = round;
    return acc;
  }, {} as Record<number, Match[]>);

  const handleMatchClick = (match: any) => {
    if (isPublicView) return; // Disable click in public view
    
    if (!match.venue || !match.schedule) {
      navigate('/Game-Schedule', { 
        state: { 
          openScheduleForm: true, 
          matchId: match.matchId,
          team1Name: teams.find((team: any) => team.teamId === match.team1Id)?.teamName,
          team2Name: teams.find((team: any) => team.teamId === match.team2Id)?.teamName,
          team1Id: match.team1Id,
          team2Id: match.team2Id
        } 
      });
    } else if (match.status !== "Completed") {
      navigate(`/Game-Scoring/match/${match.matchId}`);
    }
  };

  return (
    <div className="p-8 font-sans text-gray-800">
      <h1 className="text-5xl text-center font-bold text-red-600 mb-12">
        Round Robin Bracket
      </h1>
      <div className="flex flex-col gap-8">
        {Object.keys(roundsMatch || [])?.map((roundKey) => (
          <div key={roundKey} className="flex flex-col items-center">
            <h2 className="text-3xl font-semibold text-blue-700 mb-6">
              Round {roundKey}
            </h2>
            <div className="grid grid-cols-1 gap-8">
              {roundsMatch[Number(roundKey || [])]?.map((match: any) => {
                const team1 = teams.find(
                  (team: any) => team.teamId === match.team1Id
                );
                const team2 = teams.find(
                  (team: any) => team.teamId === match.team2Id
                );

                const team1Score = match.team1Score ?? 0;
                const team2Score = match.team2Score ?? 0;

                return (
                  <div
                    key={match.matchId}
                    onClick={() => handleMatchClick(match)}
                    className={`flex flex-col items-center p-6 rounded-xl shadow-lg border bg-white ${!isPublicView ? "transform hover:scale-105 transition-transform duration-300 cursor-pointer" : ""}`}
                  >
                    <div className="flex flex-col items-center w-full mb-4">
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
                    </div>
                    <div className="flex items-center justify-between w-full px-4">
                      <div className="flex flex-col items-center">
                        {team1 && team1.teamLogo ? (
                          <img
                            src={team1.teamLogo}
                            alt={team1.teamName}
                            className="w-20 h-20 rounded-full shadow-lg"
                          />
                        ) : (
                          <div className="w-20 h-20 bg-gray-200 rounded-full flex items-center justify-center shadow-lg">
                            <span className="text-gray-500">N/A</span>
                          </div>
                        )}
                        <div className="flex flex-col items-center mt-2">
                          <span className="font-semibold text-center text-gray-700">
                            {team1?.teamName || "Unknown Team 1"}
                          </span>
                          <span className="text-gray-700 font-bold">
                            Score: {team1Score}
                          </span>
                        </div>
                      </div>
                      <span className="text-2xl font-bold text-gray-700">
                        VS
                      </span>
                      <div className="flex flex-col items-center">
                        {team2 && team2.teamLogo ? (
                          <img
                            src={team2.teamLogo}
                            alt={team2.teamName}
                            className="w-20 h-20 rounded-full shadow-lg"
                          />
                        ) : (
                          <div className="w-20 h-20 bg-gray-200 rounded-full flex items-center justify-center shadow-lg">
                            <span className="text-gray-500">N/A</span>
                          </div>
                        )}
                        <div className="flex flex-col items-center mt-2">
                          <span className="font-semibold text-center text-gray-700">
                            {team2?.teamName || "Unknown Team 2"}
                          </span>
                          <span className="text-gray-700 font-bold">
                            Score: {team2Score}
                          </span>
                        </div>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default RoundRobinBracket;
