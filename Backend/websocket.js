const { Server } = require("socket.io");

let io;

const initializeSocket = (httpServer) => {
  io = new Server(httpServer, {
    cors: {
      origin: ['http://localhost:5173', 'http://localhost:5174', 'http://localhost:5175', 'http://localhost:5177', 'https://ncf-sems.vercel.app'],
      methods: ["GET", "POST"],
      credentials: true
    }
  });

  io.on("connection", (socket) => {
    socket.on("disconnect", () => {});

    socket.on("join_event", (eventId) => {
      socket.join(`event_${eventId}`);
    });

    socket.on("join_sport", (sportId) => {
      socket.join(`sport_${sportId}`);
    });
  });
};

const emitScoreUpdate = (matchId, team1Score, team2Score) => {
  if (io) {
    io.emit(`score_update_${matchId}`, { team1Score, team2Score });
  }
};

const emitStatusUpdate = (matchId, status, winnerId = null) => {
  if (io) {
    io.emit(`status_update_${matchId}`, { status, winnerId });
    io.emit('match_update');
  }
};

const emitEventUpdate = () => {
  if (io) {
    io.emit('event_update');
  }
};

const emitSportUpdate = () => {
  if (io) {
    io.emit('sport_update');
    io.emit('event_update');
  }
};

module.exports = {
  initializeSocket,
  emitScoreUpdate,
  emitStatusUpdate,
  emitEventUpdate,
  emitSportUpdate
}; 