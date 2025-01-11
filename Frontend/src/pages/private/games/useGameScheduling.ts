/* eslint-disable @typescript-eslint/no-explicit-any */
import { useState, useEffect, useMemo } from "react";
import { useFetchData } from "../../../config/axios/requestData";
import GamesServices from "../../../config/service/games";
import { message } from "antd";
import moment from "moment";
import { useLocation } from "react-router-dom";

const useGameSchedule = () => {
  const location = useLocation();
  // Get filters from localStorage or use defaults
  const getInitialFilter = (key: string) => {
    const saved = localStorage.getItem(`gameSchedule_${key}`);
    return saved || "all";
  };

  const getInitialDateFilter = () => {
    const saved = localStorage.getItem('gameSchedule_dateFilter');
    return saved || null;
  };

  const [statusFilter, setStatusFilter] = useState(getInitialFilter('status'));
  const [roundFilter, setRoundFilter] = useState(getInitialFilter('round'));
  const [eventFilter, setEventFilter] = useState(getInitialFilter('event'));
  const [sportFilter, setSportFilter] = useState(getInitialFilter('sport'));
  const [dateFilter, setDateFilter] = useState(getInitialDateFilter());

  // Save filters to localStorage whenever they change
  useEffect(() => {
    localStorage.setItem('gameSchedule_status', statusFilter);
    localStorage.setItem('gameSchedule_round', roundFilter);
    localStorage.setItem('gameSchedule_event', eventFilter);
    localStorage.setItem('gameSchedule_sport', sportFilter);
    if (dateFilter) {
      localStorage.setItem('gameSchedule_dateFilter', dateFilter);
    } else {
      localStorage.removeItem('gameSchedule_dateFilter');
    }
  }, [statusFilter, roundFilter, eventFilter, sportFilter, dateFilter]);

  // Rest of your existing state
  const [currentPage, setCurrentPage] = useState(1);
  const [matchesPerPage] = useState(10);
  const [isScheduleModalVisible, setScheduleModalVisible] = useState(false);
  const [selectedMatch, setSelectedMatch] = useState<any>(null);
  const [schedule, setSchedule] = useState("");
  const [venue, setVenue] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const { data: Match, isLoading: isFetchingMatch, refetch } = useFetchData(["Game"], [GamesServices.gameSchedule]);

  // Handle location state for auto-opening schedule form
  useEffect(() => {
    const state = location.state as { openScheduleForm?: boolean; matchId?: number };
    if (state?.openScheduleForm && state?.matchId) {
      const match = Match?.find((m: any) => m.matchId === state.matchId);
      if (match) {
        openScheduleModal(match);
        // Clear the state after using it
        window.history.replaceState({}, document.title, location.pathname);
      }
    }
  }, [Match, location]);

  // Handle schedule submission
  const handleScheduleSubmit = async (match: any) => {
    if (!schedule || !venue) {
      message.error('Please set both schedule and venue');
      return;
    }

    try {
      setIsSubmitting(true);
      const formattedSchedule = moment(schedule).format('YYYY-MM-DD HH:mm:ss');
      await GamesServices.updateSchedule({
        matchId: match.matchId,
        schedule: formattedSchedule,
        venue
      });
      
      message.success('Schedule updated successfully');
      setScheduleModalVisible(false);
      // Reset form values
      setSchedule("");
      setVenue("");
      setSelectedMatch(null);
      refetch(); // Refresh the matches data
    } catch (error) {
      message.error('Failed to update schedule');
      console.error('Schedule update error:', error);
    } finally {
      setIsSubmitting(false);
    }
  };

  // Open schedule modal
  const openScheduleModal = (match: any) => {
    setSelectedMatch(match);
    setSchedule(match.schedule || "");
    setVenue(match.venue || "");
    setScheduleModalVisible(true);
  };

  // Compute available options based on current filters
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

  // Filter matches based on all criteria
  const filteredMatches = useMemo(() => {
    if (!Match) return [];

    const filtered = Match.filter((match: any) => {
      const hasSched = match.schedule !== "" && match.schedule !== null;
      const statusMatch = statusFilter === "all" || match.status === statusFilter;
      const roundMatch = roundFilter === "all" || match.round.toString() === roundFilter;
      const eventMatch = eventFilter === "all" || match.event.eventName === eventFilter;
      const sportMatch = sportFilter === "all" || match.sport.sportsName === sportFilter;
      const dateMatch = !dateFilter || new Date(match.schedule).toISOString().split('T')[0] === dateFilter;

      return statusMatch && roundMatch && eventMatch && sportMatch && dateMatch && hasSched;
    });

    // First show all unscheduled matches sorted by round, then all scheduled matches
    return filtered.sort((a: any, b: any) => {
      const aHasSchedule = Boolean(a.schedule && a.venue);
      const bHasSchedule = Boolean(b.schedule && b.venue);

      // If one is scheduled and the other isn't, unscheduled comes first
      if (aHasSchedule !== bHasSchedule) {
        return aHasSchedule ? 1 : -1;
      }

      // If both are unscheduled, sort by round
      if (!aHasSchedule && !bHasSchedule) {
        return a.round - b.round;
      }

      // If both are scheduled, sort by status first
      const statusOrder: { [key: string]: number } = { pending: 0, ongoing: 1, completed: 2 };
      const aStatus = statusOrder[a.status?.toLowerCase() || ''] ?? 0;
      const bStatus = statusOrder[b.status?.toLowerCase() || ''] ?? 0;
      if (aStatus !== bStatus) {
        return aStatus - bStatus;
      }

      // If same status, sort by schedule date (newer first)
      return new Date(b.schedule).getTime() - new Date(a.schedule).getTime();
    });
  }, [Match, statusFilter, roundFilter, eventFilter, sportFilter, dateFilter]);

  // Calculate paginated matches
  const paginatedMatches = useMemo(() => {
    const indexOfLastMatch = currentPage * matchesPerPage;
    const indexOfFirstMatch = indexOfLastMatch - matchesPerPage;
    return filteredMatches.slice(indexOfFirstMatch, indexOfLastMatch);
  }, [filteredMatches, currentPage, matchesPerPage]);

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
  };

  return {
    isFetchingMatch,
    paginatedMatches,
    isScheduleModalVisible,
    selectedMatch,
    currentPage,
    matchesPerPage,
    schedule,
    venue,
    isSubmitting,
    statusFilter,
    roundFilter,
    dateFilter,
    eventFilter,
    sportFilter,
    filterOptions,
    filteredMatches,
    setScheduleModalVisible,
    handleScheduleSubmit,
    setStatusFilter,
    setRoundFilter,
    setDateFilter,
    setEventFilter,
    setSportFilter,
    openScheduleModal,
    handlePageChange,
    setSchedule,
    setVenue
  };
};

export default useGameSchedule;
