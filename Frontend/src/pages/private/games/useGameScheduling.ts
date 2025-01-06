/* eslint-disable @typescript-eslint/no-explicit-any */
import { useState, useEffect, useMemo } from "react";
import { useFetchData } from "../../../config/axios/requestData";
import GamesServices from "../../../config/service/games";
import { message } from "antd";
import moment from "moment";

const useGameSchedule = () => {
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
      const matchStatus = match.status?.toLowerCase() || '';
      const filterStatus = statusFilter.toLowerCase();

      const statusMatch = filterStatus === "all" || matchStatus === filterStatus;
      const roundMatch = roundFilter === "all" || match.round.toString() === roundFilter;
      const eventMatch = eventFilter === "all" || match.event.eventName === eventFilter;
      const sportMatch = sportFilter === "all" || match.sport.sportsName === sportFilter;
      const dateMatch = !dateFilter || new Date(match.schedule).toDateString() === new Date(dateFilter).toDateString();

      return statusMatch && roundMatch && eventMatch && sportMatch && dateMatch;
    });

    // Define exact order: scheduled -> ongoing -> completed
    const getStatusOrder = (status: string): number => {
      const lowerStatus = status?.toLowerCase() || '';
      switch (lowerStatus) {
        case 'scheduled': return 0;
        case 'ongoing': return 1;
        case 'completed': return 2;
        default: return 999;
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
