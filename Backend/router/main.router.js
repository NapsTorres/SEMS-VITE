const userRouter = require('./user.router')
const teamsRouter = require('./team.router')
const eventsRouter = require('./event.router')
const sportsRouter = require('./sports.router')
const gameRouter = require('./games.router')
const mediaRouter = require('./media.router')

module.exports = {
    userRouter: userRouter,
    teamsRouter: teamsRouter,
    eventsRouter: eventsRouter,
    sportsRouter: sportsRouter,
    gameRouter: gameRouter,
    mediaRouter: mediaRouter
}