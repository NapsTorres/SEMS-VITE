const { checkUniqueField } = require("../../helpers/checkUniqueness.js");
const pool = require("../../middleware/db.js");
const util = require("util");
const { uploadImage, deleteImageByURL } = require("../../middleware/utils.js");
const { checkIfExists } = require("../../helpers/checkIfExist.js");
const { emitSportUpdate } = require("../../websocket");
const queryAsync = util.promisify(pool.query).bind(pool);

module.exports = {
  // Create a new sport
  createSports: async (data) => {
    try {
      const { sportsName, sportsLogo, description, createdBy } = data;
      await checkUniqueField("sports", "sportsName", sportsName);
      const imageUrl = await uploadImage(sportsLogo, sportsLogo.originalname);
      await queryAsync(
        "INSERT INTO sports (sportsName, sportsLogo, description, createdBy) VALUES (?, ?, ?, ?)",
        [sportsName, imageUrl, description, createdBy]
      );
      emitSportUpdate();
      return { success: 1, message: "New Sport added successfully" };
    } catch (error) {
      return { success: 0, message: error.message || "Internal Server Error" };
    }
  },

  // Fetch all sports
  fetchSports: async () => {
    try {
      const sportLists = await queryAsync(`
        SELECT 
          s.sportsId,
          s.sportsName,
          s.sportsLogo,
          s.description,
          s.createdAt,
          s.createdBy,
          u1.username AS createdByUsername,
          s.updatedBy,
          u2.username AS updatedByUsername
        FROM sports s
        LEFT JOIN users u1 ON s.createdBy = u1.id
        LEFT JOIN users u2 ON s.updatedBy = u2.id
      `);
      return { success: 1, results: sportLists, message: "Fetched successfully" };
    } catch (error) {
      return { success: 0, message: error.message || "Internal Server Error" };
    }
  },

  // Edit a sport
  editSports: async (data) => {
    try {
      const { sportsName, sportsLogo, description, sportsId, updatedBy } = data;
      const existingData = await checkIfExists("sports", "sportsId", sportsId);
      await checkUniqueField("sports", "sportsName", sportsName, existingData.sportsName);

      let imageUrl = sportsLogo;
      if (typeof sportsLogo !== "string") {
        imageUrl = await uploadImage(sportsLogo, sportsLogo.originalname, existingData.sportsLogo);
      }

      await queryAsync(
        "UPDATE sports SET sportsName = ?, sportsLogo = ?, description = ?, updatedBy = ? WHERE sportsId = ?",
        [sportsName, imageUrl, description, updatedBy, sportsId]
      );

      return { success: 1, message: "Team updated successfully" };
    } catch (error) {
      return { success: 0, message: error.message || "Internal Server Error" };
    }
  },

  // Delete a sport
  deleteSports: async (id) => {
    try {
      const existingData = await checkIfExists("sports", "sportsId", id);
      if (existingData.sportsLogo) await deleteImageByURL(existingData.sportsLogo);
      await queryAsync("DELETE FROM sports WHERE sportsId = ?", [id]);
      return { success: 1, message: "Sports deleted successfully" };
    } catch (error) {
      return { success: 0, message: error.message || "Internal Server Error" };
    }
  },

  // Fetch all data with nested events, sportsEvents, teams, and matches
  fetchAllData: async () => {
    try {
      const events = await queryAsync(`SELECT eventId, eventName, eventYear, eventstartDate, eventendDate, description FROM events`);
      const media = await queryAsync(`SELECT * FROM media`);
      const sports = await queryAsync(`SELECT sportsId, sportsName, sportsLogo, description, createdAt FROM sports`);
      const coach = await queryAsync(`SELECT * FROM users WHERE type = 'Coach'`);
      const teams = await queryAsync(`
        SELECT t.teamId, t.teamName, t.teamLogo, t.dateAdded, u.username AS coachName
        FROM teams t
        LEFT JOIN users u ON t.teamCoach = u.id
      `);

      // Build sportsEvents and participatingTeams in JS to avoid GROUP_CONCAT issues
      const enrichedEvents = await Promise.all(
        events.map(async (event) => {
          // Fetch sportsEvents for this event
          const sportsEventsRaw = await queryAsync(`
            SELECT se.sportEventsId, se.eventsId, s.sportsName, s.sportsLogo, se.bracketType, se.maxPlayers,
                   te.teamEventId, te.teamId, te.teamName, te.teamWin, te.teamLose, t.teamLogo AS teamLogo
            FROM sports_events se
            LEFT JOIN sports s ON se.sportsId = s.sportsId
            LEFT JOIN teams_events te ON se.sportEventsId = te.sportEventsId
            LEFT JOIN teams t ON te.teamId = t.teamId
            WHERE se.eventsId = ?
          `, [event.eventId]);

          // Group teams under each sportEvent
          const grouped = {};
          sportsEventsRaw.forEach(row => {
            if (!grouped[row.sportEventsId]) grouped[row.sportEventsId] = {
              sportEventsId: row.sportEventsId,
              eventsId: row.eventsId,
              sportsName: row.sportsName,
              sportsLogo: row.sportsLogo,
              bracketType: row.bracketType,
              maxPlayers: row.maxPlayers,
              participatingTeams: []
            };
            if (row.teamEventId) {
              grouped[row.sportEventsId].participatingTeams.push({
                teamEventId: row.teamEventId,
                teamId: row.teamId,
                teamName: row.teamName,
                teamLogo: row.teamLogo,
                teamWin: row.teamWin,
                teamLose: row.teamLose,
                players: [] // you can populate players here if needed
              });
            }
          });

          const sportsEvents = Object.values(grouped);

          // Fetch matches for each sportEvent
          const sportsEventsWithMatches = await Promise.all(
            sportsEvents.map(async (sportEvent) => {
              const matches = await queryAsync(`
                SELECT m.*, 
                       t1.teamName AS team1Name, t1.teamLogo AS team1Logo,
                       t2.teamName AS team2Name, t2.teamLogo AS team2Logo
                FROM matches m
                LEFT JOIN teams t1 ON m.team1Id = t1.teamId
                LEFT JOIN teams t2 ON m.team2Id = t2.teamId
                WHERE m.sportEventsId = ?
              `, [sportEvent.sportEventsId]);
              return { ...sportEvent, matches };
            })
          );

          return { ...event, sportsEvents: sportsEventsWithMatches };
        })
      );

      return {
        success: 1,
        results: {
          events: enrichedEvents,
          media,
          teams,
          sports,
          coach
        },
        message: "All data fetched successfully"
      };
    } catch (error) {
      console.error(error);
      return { success: 0, message: error.message || "Internal Server Error" };
    }
  }
};
