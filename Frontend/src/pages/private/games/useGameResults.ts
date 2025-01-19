/* eslint-disable @typescript-eslint/no-explicit-any */
import { useFetchData } from "../../../config/axios/requestData";
import GamesServices from "../../../config/service/games";

export default function useGameResults() {
  const { data: Match, isLoading: isFetchingMatch } = useFetchData(["Game"], [GamesServices.gameSchedule]);

  const filteredMatches = Match?.filter(() => {
    return true; // Show all matches
  }).sort((a: any, b: any) => {
    // Sort by matchId to maintain the order from database
    return a.matchId - b.matchId;
  });

  return {
    Match,
    isFetchingMatch,
    paginatedMatches: filteredMatches, // Return all matches instead of paginated
    filteredMatches,
  };
}
