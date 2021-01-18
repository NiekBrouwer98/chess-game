var express = require("express");
var http = require("http");
var websocket = require("ws");

var indexRouter = require("./routes/index")
var messages = require("./public/javascripts/messages");

// implement live statistics
var gameStatus = require("./statTracker");
var Game = require("./playGame");

var port = process.argv[2];
var app = express();

//view engines to include statistics
app.use(express.static(__dirname + "/public"));

require("./routes/index.js")(app);

var server = http.createServer(app);
const wss = new websocket.Server({ server });

var websockets = {};

//regularly clean up websockets

var currentGame = new Game(gameStatus.gamesInitialized++);
var connectionID = 0;

wss.on("connection", function connection(ws) {
    /*
     * every two players are added to the same game 
     */ 
    let con = ws;
    con.id = connectionID++;
    let playerType = currentGame.addPlayer(con);
    websockets[con.id] = currentGame;

    console.log(
        "Player %s placed in game %s as %s",
        con.id,
        currentGame.id,
        playerType
    );
    

     /*
     * inform the client about its player color
     */
    con.send(playerType == "WHITE" ? messages.S_PLAYER_WHITE : messages.S_PLAYER_BLACK)

     /*
     * a new game object is created
     * if a player now leaves, the game is aborted
     */
    if (currentGame.hasTwoConnectedPlayers()) {
        currentGame = new Game(gameStatus.gamesInitialized++);
    }

     /* game interactions
     * receiving from client
     * determining game and opposing player
     * send to other client
    */
   con.on("message", function incoming(message) {
    let oMsg = JSON.parse(message);

    let gameObj = websockets[con.id];
    let otherPlayer = gameObj.playerWHITE == con ? playerWHITE : playerBLACK;
      
      if (oMsg.type == messages.T_MAKE_A_MOVE) {
        //Change boardstatus of own player

        if (gameObj.hasTwoConnectedPlayers()) {
          gameObj.otherPlayer.send(message);
        }

        if (oMsg.type == messages.T_GAME_WON_BY) {
          gameObj.setStatus(oMsg.data);
          //game was won by somebody, update statistics
          gameStatus.gamesCompleted++;
        }
      }
    });

     /*
     * abort the game
     */
    con.on("close", function(code){
      console.log(con.id + " disconnected...");

      if (code == "1001") {
        let gameObj = websockets[con.id];

        if (gameObj.isValidTransition(gameObj.gameState, "ABORTED")){
          gameObj.setStatus("ABORTED");
          gameStatus.gamesAborted++;

          try {
            gameObj.playerWHITE.close();
            gameObj.playerWHITE = null;
          } catch (e) {
            console.log("White player closing: " + e);
          }
  
          try {
            gameObj.playerBLACK.close();
            gameObj.playerBLACK = null;
          } catch (e) {
            console.log("Black player closing: " + e);
          }
        }
      }
    });
});


server.listen(port);