/* game statistics */

var gameStatus = {
    since: Date.now(),
    gamesInitialized: 0,
    gamesAborted: 0,
    gamesCompleted: 0,
    playersOnline: 0,
    gamesOnline: 0
};

module.exports = gameStatus;