const { getSportsEventsWithDetails } = require("../../helpers/fetchSportInfo.js");
const pool = require("../../middleware/db.js");
const util = require("util");
const { emitScoreUpdate, emitStatusUpdate } = require("../../websocket");
const queryAsync = util.promisify(pool.query).bind(pool);

module.exports = {
  fetchMatches: async () => {
    try {
      const matches = await queryAsync("SELECT * FROM matches");

      const matchesWithTeams = await Promise.all(
        matches.map(async (match) => {
          const team1 = await queryAsync("SELECT * FROM teams WHERE teamId = ?", [match.team1Id]);
          const team2 = await queryAsync("SELECT * FROM teams WHERE teamId = ?", [match.team2Id]);
          const sportEvent = await queryAsync("SELECT * FROM sports_events where sportEventsId =?",[match.sportEventsId])
          const event = await queryAsync("SELECT * FROM events where eventId = ?",[sportEvent[0].eventsId])
          const sport = await queryAsync("SELECT * from sports where sportsId = ?",[sportEvent[0].sportsId])
          return {
            ...match,
            team1: team1[0] || null,
            team2: team2[0] || null,
            sportEvent:sportEvent[0] || null,
            event:event[0] || null,
            sport:sport[0] || null,
          };
        })
      );

      return { success: 1, results: matchesWithTeams };
    } catch (error) {
      console.error("Error fetching matches:", error);
      return { success: 0, message: error.message };
    }
  },

  fetchMatchById: async (data) => {
    try {
        const matchId = data.matchId
      const match = await queryAsync("SELECT * FROM matches WHERE matchId = ?", [matchId]);
      if (!match.length) {
        return { success: 0, message: "Match not found" };
      }

      const team1 = await queryAsync("SELECT * FROM teams WHERE teamId = ?", [match[0].team1Id]);
      const team2 = await queryAsync("SELECT * FROM teams WHERE teamId = ?", [match[0].team2Id]);
      const sportEvent = await queryAsync("SELECT * FROM sports_events where sportEventsId =?",[match[0].sportEventsId])
      const event = await queryAsync("SELECT * FROM events where eventId = ?",[sportEvent[0].eventsId])
      const sport = await queryAsync("SELECT * from sports where sportsId = ?",[sportEvent[0].sportsId])
   
      const matchWithTeams = {
        ...match[0],
        team1: team1[0] || null,
        team2: team2[0] || null,
        sportEvent:sportEvent[0] || null,
        event:event[0] || null,
        sport:sport[0] || null,
      };

      return { success: 1, results: matchWithTeams };
    } catch (error) {
      console.error("Error fetching match by ID:", error);
      return { success: 0, message: error.message };
    }
  },

  updateScore: async (data) => {
    let { matchId, teamId, increment } = data;
    
    teamId = Number(teamId);
    increment = Number(increment);
    
    if (!matchId || !teamId || !increment) {
      return { success: 0, message: 'Invalid parameters.' }
    }
  
    try {
      const matchQuery = 'SELECT * FROM matches WHERE matchId = ?';
      const matchResults = await queryAsync(matchQuery, [matchId]);
      if (matchResults.length === 0) {
        return { success: 0, message: 'Match not found.' }
      }
  
      const match = matchResults[0];
  
      let updatedScore;
      let team1Score = match.team1Score;
      let team2Score = match.team2Score;

      if (match.team1Id === teamId) {
        updatedScore = Number(match.team1Score) + Number(increment);
        team1Score = updatedScore;
        await queryAsync('UPDATE matches SET team1Score = ? WHERE matchId = ?', [updatedScore, matchId]);
      } else if (match.team2Id === teamId) {
        updatedScore = match.team2Score + increment;
        team2Score = updatedScore;
        await queryAsync('UPDATE matches SET team2Score = ? WHERE matchId = ?', [updatedScore, matchId]);
      } else {
        return { success: 0, message: 'Invalid team ID for this match.' }
      }

      // Emit score update via WebSocket
      emitScoreUpdate(matchId, team1Score, team2Score);
  
      return {
        success: 1,
        message: 'Score updated successfully.',
        matchId,
        teamId,
        updatedScore
      }
    } catch (error) {
        console.error("Error updating score:", error);
        return { success: 0, message: error.message };
    }
  },

  gameStatus: async(data) => {
    const { matchId, status } = data;
    // Convert status to lowercase for consistency
    const normalizedStatus = status.toLowerCase();

    if (!matchId || !normalizedStatus) {
        return { success: 0, message: "matchId and status are required" }
    }

    try {
        // Get current match details first
        const currentMatch = await queryAsync("SELECT * FROM matches WHERE matchId = ?", [matchId]);
        if (currentMatch.length === 0) {
            return { success: 0, message: "Match not found" }
        }

        const match = currentMatch[0];
        const { team1Id, team2Id, team1Score, team2Score, status: currentStatus, sportEventsId, winner_team_id, next_match_id } = match;

        // If changing from completed to ongoing, reset team standings and next match
        if (currentStatus === 'completed' && normalizedStatus === 'ongoing' && winner_team_id) {
            // Reset win/loss records
            await queryAsync(
                "UPDATE teams_events SET teamWin = teamWin - 1 WHERE teamId = ? and sportEventsId = ?",
                [winner_team_id, sportEventsId]
            );

            const loserId = winner_team_id === team1Id ? team2Id : team1Id;
            await queryAsync(
                "UPDATE teams_events SET teamLose = teamLose - 1 WHERE teamId = ? and sportEventsId = ?",
                [loserId, sportEventsId]
            );

            // Reset next match if it exists
            if (next_match_id) {
                // Get next match details to determine which team to remove
                const nextMatch = await queryAsync("SELECT * FROM matches WHERE matchId = ?", [next_match_id]);
                if (nextMatch.length > 0) {
                    const { team1Id: nextTeam1Id, team2Id: nextTeam2Id } = nextMatch[0];
                    
                    // Remove the winner from the next match
                    if (nextTeam1Id === winner_team_id) {
                        await queryAsync(
                            "UPDATE matches SET team1Id = NULL, team1stat = NULL WHERE matchId = ?",
                            [next_match_id]
                        );
                    } else if (nextTeam2Id === winner_team_id) {
                        await queryAsync(
                            "UPDATE matches SET team2Id = NULL, team2stat = NULL WHERE matchId = ?",
                            [next_match_id]
                        );
                    }
                }
            }
        }

        // Update match status and clear winner if changing to ongoing
        const result = await queryAsync(
            "UPDATE matches SET status = ?, winner_team_id = ? WHERE matchId = ?",
            [normalizedStatus, normalizedStatus === 'ongoing' ? null : winner_team_id, matchId]
        );

        if (result.affectedRows === 0) {
            return { success: 0, message: "Match not found" }
        }

        // Get winner ID if match is completed
        let winnerId = null;
        if (normalizedStatus === 'completed') {
            winnerId = team1Score > team2Score ? team1Id : team2Score > team1Score ? team2Id : null;
        }

        // Emit status update via WebSocket
        emitStatusUpdate(matchId, normalizedStatus, winnerId);

        return { success: 1, message: "Game status updated successfully" }
    } catch (error) {
        console.error("Error in gameStatus:", error);
        return { success: 0, message: "Failed to update game status" }
    }
  }
};
