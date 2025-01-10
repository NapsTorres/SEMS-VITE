/* eslint-disable @typescript-eslint/no-explicit-any */
import { useState, useEffect } from "react";
import "swiper/css";
import "swiper/css/navigation";
import "swiper/css/pagination";
import "swiper/css/free-mode";
import "swiper/css/thumbs";
import FirstSection from "./firstSection";
import { useFetchData } from "../../../config/axios/requestData";
import SportsServices from "../../../config/service/sports";
import HeaderComponents from "./header";
import MatchSection from "./match";
import NewsSection from "./newsSection";
import { io } from "socket.io-client";
import { WEBSOCKET_URL } from "../../../config/socket/websocket";

export const LandingPage = () => {
  const { data: [summary] = [], refetch } = useFetchData(
    ["summary"],
    [() => SportsServices.fetchSportsSummary()]
  );
  const [selectedEventId, setSelectedEventId] = useState<string>("");
  const [selectedSport, setSelectedSport] = useState<string>("");
  const [hasUserSelectedSport, setHasUserSelectedSport] = useState(false);

  // Handle event selection and update sport selection accordingly
  useEffect(() => {
    if (selectedEventId) {
      const selectedEvent = summary?.events?.find(
        (event: any) => event.eventId === selectedEventId
      );
      
      // Only auto-select first sport if user hasn't made a selection
      // or if they've switched events
      if (selectedEvent?.sportsEvents?.length > 0 && !hasUserSelectedSport) {
        setSelectedSport(selectedEvent.sportsEvents[0].sportsName);
      } else if (!selectedEvent?.sportsEvents?.length) {
        // If event has no sports, clear the sport selection
        setSelectedSport("");
        setHasUserSelectedSport(false);
      }
    }
  }, [selectedEventId, summary?.events, hasUserSelectedSport]);

  // Custom sport selection handler
  const handleSportSelection = (sport: string) => {
    setSelectedSport(sport);
    setHasUserSelectedSport(true);
  };

  // Reset user selection when changing events
  const handleEventSelection = (eventId: string) => {
    setSelectedEventId(eventId);
    setHasUserSelectedSport(false);
  };

  // WebSocket connection for real-time updates
  useEffect(() => {
    const socket = io(WEBSOCKET_URL, {
      withCredentials: true
    });

    socket.on('connect', () => {
      if (selectedEventId) {
        socket.emit('join_event', selectedEventId);
      }
      if (selectedSport) {
        socket.emit('join_sport', selectedSport);
      }
    });

    // Listen for event updates
    socket.on('event_update', () => {
      refetch();
    });

    // Listen for sports updates
    socket.on('sport_update', () => {
      refetch();
    });

    // Listen for match updates
    socket.on('match_update', () => {
      refetch();
    });

    return () => {
      socket.disconnect();
    };
  }, [refetch, selectedEventId, selectedSport]);

  const selectedEvent = summary?.events?.find(
    (event: any) => event.eventId === selectedEventId
  );

  return (
    <div className="min-h-screen relative overflow-hidden" style={{ backgroundColor: '#e9ece4' }}>
      <HeaderComponents
        selected={selectedEventId}
        selectedSport={selectedSport}
        matches={selectedEvent?.sportsEvents}
        setSelected={handleEventSelection}
        events={summary?.events || []}
      />
      <main className="">
        <FirstSection />
        {selectedEvent ? (
          <>
            <div className="p-16 flex flex-col justify-start items-center">
            <h2 className="text-3xl font-bold text-center py-4">
              {selectedEvent.eventName}
            </h2>
            <div dangerouslySetInnerHTML={{__html:selectedEvent?.description}} />
            </div>
          <MatchSection 
            teams={summary?.teams} 
            selectedSport={selectedSport} 
            setSelectedSport={handleSportSelection} 
            event={selectedEvent} 
            matches={selectedEvent?.sportsEvents} 
          />
          </>
        ) : (
          <p className="text-center py-6">
            Please select an event to view its details.
          </p>
        )}

        <NewsSection news={summary?.media}  />
      </main>
      <footer className="bg-gray-800 text-white text-center py-4" id="contact">
        <p>&copy; 2024 SportsCentral. All rights reserved.</p>
      </footer>
    </div>
  );
};
