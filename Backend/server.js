require('dotenv').config();
const cors = require("cors");
const express = require("express");
require("express-group-routes");
const app = express();
const { createServer } = require("http");
const httpServer = createServer(app);
const { initializeSocket } = require("./websocket");
const bodyparser = require("body-parser");
const { userRouter, teamsRouter, eventsRouter, sportsRouter, gameRouter, mediaRouter } = require("./router/main.router.js");

// Use environment variable PORT assigned by EB, fallback to 3006 for local testing
const PORT = process.env.PORT || 5000;

// CORS options
const corsOptions = {
    origin: [
        'http://localhost:5173',
        // // 'http://localhost:5174',
        // // 'http://localhost:5175',
        // // 'http://localhost:5177',
        // // 'https://ncf-sems.vercel.app',
        'http://sems-frontend.s3-website-ap-northeast-1.amazonaws.com'
    ],
    credentials: true,
    optionsSuccessStatus: 200,
};

app.use(cors(corsOptions));
app.use(express.json({ limit: "50mb" }));
app.use(express.urlencoded({ limit: "50mb", extended: true }));
app.use(bodyparser.json());

// Initialize Socket.IO
initializeSocket(httpServer);

// API Routes
app.group("/api/v1", (router) => {
    router.use("/user", userRouter);
    router.use("/teams", teamsRouter);
    router.use("/events", eventsRouter);
    router.use("/sports", sportsRouter);
    router.use("/games", gameRouter);
    router.use("/media", mediaRouter);
});

// Root route
app.get("/", async (req, res) => {
    res.send("API running 🥳");
});

// Start server
httpServer.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});
