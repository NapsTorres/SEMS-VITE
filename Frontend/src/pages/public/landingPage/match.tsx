/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable @typescript-eslint/no-explicit-any */
import React, { useEffect, useState } from "react";
import { Swiper, SwiperSlide } from "swiper/react";
import "swiper/css";
import "swiper/css/effect-coverflow";
import "swiper/css/pagination";
import { Autoplay, EffectCoverflow, Pagination } from "swiper/modules";
import { Select, Button } from "antd";
import { GoDotFill } from "react-icons/go";
import {
  AnimatedComponent,
  createSlideInVariant,
  parentVariant,
} from "../animation";
import { useNavigate } from "react-router-dom";
import BracketSection from "./bracketSection";
import { io } from 'socket.io-client';
import { WEBSOCKET_URL } from '../../../config/socket/websocket';

const MatchSection: React.FC<{
  matches: any;
  event: any;
  selectedSport: any;
  setSelectedSport: any;
  teams: any;
}> = ({ matches: initialMatches, event, setSelectedSport, selectedSport, teams }) => {
  const [matches, setMatches] = useState(initialMatches);
  const navigate = useNavigate();
  const sports = matches?.map((match: any) => ({
    label: match.sportsName,
    value: match.sportsName,
  }));
  const uniqueSports = Array.from(
    new Set(sports.map((sport: any) => sport.value))
  ).map((value) => {
    return sports.find((sport: any) => sport.value === value);
  });

  useEffect(() => {
    if (!selectedSport && uniqueSports.length > 0) {
      setSelectedSport(uniqueSports[0]?.value || "");
    }
  }, []);  

  const filteredMatches = matches?.filter(
    (match: any) => match.sportsName === selectedSport
  );
  const filteredTeams = filteredMatches?.[0]?.participatingTeams || [];

  const handleSportChange = (value: string) => {
    setSelectedSport(value);
  };

  const handleWatchLive = (match: any) => {
    navigate(
      `/live/${event?.eventName}/${selectedSport}/${match.matchId}/${match?.team1Name}/vs/${match?.team2Name}`
    );
  };
  const bracketType = event?.sportsEvents?.find(
    (v: any) => v.sportsName === selectedSport
  )?.bracketType;

  // Update matches when initialMatches changes
  useEffect(() => {
    console.log('MatchSection: Initial matches updated', initialMatches);
    setMatches(initialMatches);
  }, [initialMatches]);

  // WebSocket connection for real-time updates
  useEffect(() => {
    console.log('MatchSection: Setting up WebSocket connection');
    const socket = io(WEBSOCKET_URL, {
      withCredentials: true
    });

    socket.on('connect', () => {
      console.log('MatchSection: WebSocket connected');
    });

    socket.on('connect_error', (error) => {
      console.error('MatchSection: WebSocket connection error:', error);
    });

    // Listen for score updates and status updates for all matches in the selected sport
    const currentMatches = matches?.find((match: any) => match.sportsName === selectedSport)?.matches || [];
    console.log('MatchSection: Setting up listeners for matches:', currentMatches);
    
    currentMatches.forEach((match: any) => {
      // Score updates
      socket.on(`score_update_${match.matchId}`, ({ team1Score, team2Score }) => {
        console.log(`MatchSection: Received score update for match ${match.matchId}:`, { team1Score, team2Score });
        setMatches((prevMatches: typeof initialMatches) => 
          prevMatches.map((sport: any) => 
            sport.sportsName === selectedSport
              ? {
                  ...sport,
                  matches: sport.matches.map((m: any) =>
                    m.matchId === match.matchId
                      ? { ...m, team1Score, team2Score }
                      : m
                  )
                }
              : sport
          )
        );
      });

      // Status updates
      socket.on(`status_update_${match.matchId}`, ({ status, winnerId }) => {
        console.log(`MatchSection: Received status update for match ${match.matchId}:`, { status, winnerId });
        setMatches((prevMatches: typeof initialMatches) => 
          prevMatches.map((sport: any) => 
            sport.sportsName === selectedSport
              ? {
                  ...sport,
                  matches: sport.matches.map((m: any) =>
                    m.matchId === match.matchId
                      ? { ...m, status: status.toLowerCase(), winner_team_id: winnerId }
                      : m
                  )
                }
              : sport
          )
        );
      });
    });

    return () => {
      console.log('MatchSection: Cleaning up WebSocket connection');
      socket.disconnect();
    };
  }, [matches, selectedSport]);

  return (
    <section
      id="teams"
      className="relative w-full h-max overflow-hidden p-12 pt-20"
    >
      <div className="relative z-50">
        <div className="flex justify-between items-center">
          <h2 className="text-3xl font-bold mb-6 text-center text-white"></h2>

          {/* Sport Selection */}
          <div className="mb-6 text-center">
            <Select
              value={selectedSport}
              onChange={handleSportChange}
              className="w-40"
              placeholder="Choose a Sport"
              options={uniqueSports}
            />
          </div>
        </div>

        {/* Participating Teams */}
        <div className="relative mb-6 flex flex-col justify-center items-center">
          <h3 className="text-4xl font-bold mb-4 z-20 text-white">
            Participating Teams
          </h3>
          <div className="w-full">
            <Swiper
              effect={"coverflow"}
              grabCursor={true}
              coverflowEffect={{
                rotate: 30,
                stretch: 0,
                depth: 100,
                modifier: 1.5,
                slideShadows: true,
              }}
              slidesPerView={4}
              loop={true}
              autoplay={{
                delay: 1000,
                disableOnInteraction: false,
                pauseOnMouseEnter: false,
              }}
              speed={1000}
              centeredSlides={true}
              modules={[EffectCoverflow, Pagination, Autoplay]}
              className="mySwiper p-6"
              initialSlide={0}
              allowTouchMove={true}
            >
              {filteredTeams.length > 0 ? (
                filteredTeams.map((team: any, index: number) => (
                  <SwiperSlide
                    key={index}
                    className="flex flex-col items-center justify-center border bg-[linear-gradient(to_top,_#0ba360_0%,_#3cba92_100%)] p-4 rounded-md transition-all duration-300 hover:scale-105"
                  >
                    <div className="flex flex-col items-center justify-center w-full">
                      <img
                        className="w-40 h-40 rounded-full object-cover transition-transform duration-300 hover:scale-110"
                        src={team.teamLogo}
                        alt={team.teamName}
                      />
                      <p className="text-white mt-4 text-center text-lg font-semibold px-4 w-full">
                        {team.teamName}
                      </p>
                    </div>
                  </SwiperSlide>
                ))
              ) : (
                <p className="text-gray-700 text-center">
                  No teams available for this sport.
                </p>
              )}
            </Swiper>
          </div>
        </div>

        {/* Upcoming Matches */}
        <div className="z-20">
          <h3 className="text-2xl font-bold mb-4 text-center text-white">
            Matches
          </h3>
          {filteredMatches?.length > 0 ? (
            <AnimatedComponent
              variants={parentVariant}
              stagger={true}
              className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
            >
              {filteredMatches[0].matches
                ?.filter((v: any) => v.schedule)
                .map((match: any, index: number) => (
                  <div
                    key={index}
                    className="p-6 bg-white border border-gray-300 rounded-lg shadow-md flex flex-col items-center justify-center relative"
                  >
                    {/* Venue and Schedule */}
                    <div className="flex items-center justify-center gap-2 mb-4">
                      <div className="flex items-center text-gray-700">
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                        </svg>
                        <span className="font-semibold">{match.venue || "Venue Not Set"}</span>
                      </div>
                      <span className="text-gray-500">|</span>
                      <div className="flex items-center text-gray-700">
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                        </svg>
                        <span className="font-semibold">
                          {new Date(match.schedule).toLocaleDateString(undefined, {
                            weekday: 'short',
                            year: 'numeric',
                            month: 'short',
                            day: 'numeric',
                            hour: '2-digit',
                            minute: '2-digit'
                          })}
                        </span>
                      </div>
                    </div>

                    {/* Teams and Scores */}
                    <div className="flex items-center justify-center gap-6">
                      {/* Team 1 */}
                      <div className="flex flex-col items-center">
                        <img
                          src={match.team1Logo}
                          alt={match.team1Name}
                          className="w-24 h-24 object-cover rounded-full border border-gray-300"
                        />
                        <p className="mt-2 font-bold text-lg">
                          {match.team1Name}
                        </p>
                        <p className="mt-1 text-xl font-semibold text-gray-700">
                          Score: {match.team1Score || 0}
                        </p>
                      </div>
                      {/* VS */}
                      <span className="text-2xl font-bold text-gray-800">
                        VS
                      </span>
                      {/* Team 2 */}
                      <div className="flex flex-col items-center">
                        <img
                          src={match.team2Logo}
                          alt={match.team2Name}
                          className="w-24 h-24 object-cover rounded-full border border-gray-300"
                        />
                        <p className="mt-2 font-bold text-lg">
                          {match.team2Name}
                        </p>
                        <p className="mt-1 text-xl font-semibold text-gray-700">
                          Score: {match.team2Score || 0}
                        </p>
                      </div>
                    </div>

                    {/* Match Status */}
                    <div className="mt-4 text-center">
                      {match.status === "completed" ? (
                        <p className="text-green-600 font-bold">
                          Match Completed
                        </p>
                      ) : match.status === "ongoing" ? (
                        <p className="text-yellow-500 font-bold">
                          Match Ongoing
                        </p>
                      ) : (
                        <p className="text-gray-500 font-bold">
                          Upcoming Match
                        </p>
                      )}
                    </div>

                    {/* Live Scoring Button */}
                    {match.status === "ongoing" && (
                      <div className="absolute top-2 right-2 animate-pulse">
                        <Button
                          type="primary"
                          danger
                          className=""
                          onClick={() => handleWatchLive(match)}
                        >
                          <GoDotFill color="#16a34a" className="animate-ping" />{" "}
                          LIVE SCORING
                        </Button>
                      </div>
                    )}
                  </div>
                ))}
            </AnimatedComponent>
          ) : (
            <p className="text-gray-700 text-center">
              No upcoming matches available for this sport.
            </p>
          )}
        </div>

        {/* Team Standings */}
        <AnimatedComponent variants={createSlideInVariant("down")}>
        <div className="bg-[linear-gradient(to_top,_#0ba360_0%,_#3cba92_100%)] shadow-md rounded-lg p-6 mt-10">
  <h3 className="text-xl font-bold mb-4 text-gray-800">Team Standings</h3>
  <div className="overflow-x-auto">
    <table className="table-auto w-full border-collapse border border-gray-200">
      <thead className="bg-gray-100">
        <tr>
          <th className="px-4 py-2 text-left text-gray-600">Team</th>
          <th className="px-4 py-2 text-center text-gray-600">Wins</th>
          <th className="px-4 py-2 text-center text-gray-600">Losses</th>
        </tr>
      </thead>
      <tbody>
        {filteredTeams
          .sort((a: any, b: any) => b.teamWin - a.teamWin) // Sort teams by wins in descending order
          .map((team: any, index: number) => (
            <tr
              key={team.teamEventId}
              className={`border-t border-gray-200 ${
                index % 2 === 0 ? "bg-gray-50" : ""
              }`}
            >
              <td className="px-4 py-2 flex items-center">
                <img
                  src={team.teamLogo}
                  alt={team.teamName}
                  className="w-8 h-8 rounded-full mr-2"
                />
                <span>{team.teamName}</span>
              </td>
              <td className="px-4 py-2 text-center">{team.teamWin}</td>
              <td className="px-4 py-2 text-center">{team.teamLose}</td>
            </tr>
          ))}
      </tbody>
    </table>
  </div>
</div>

        </AnimatedComponent>
        <br />
        <div className="bg-white z-40 p-6 mt-16 rounded-md shadow-[0_3px_10px_rgb(0,0,0,0.2)]">
         
            <BracketSection
              matches={filteredMatches[0]?.matches}
              teams={teams}
              bracketType={bracketType}
            />
        </div>
      </div>
      <div className="absolute inset-0 before:absolute before:w-full before:h-full before:bg-gradient-to-br before:from-[#064518] before:to-[#f8ba00]"></div>
    </section>
  );
};

export default MatchSection;
