var express = require("express");
var http = require("http");
var websocket = require("ws");

var indexRouter = require("./routes/index")
var messages = require("./public/javascripts/messages");

var gameStatus = require("./statTracker");
var Game = require("./playGame");
const { gamesOnline } = require("./statTracker");
const game = require("./playGame");

var port = process.argv[2];
var app = express();

app.set("view engine", "ejs")
app.use(express.static(__dirname + "/public"));

app.get("/play", indexRouter);

// Implement live statistics
app.get("/", (req, res) => {
  console.log("Welcoming player to splash screen")
  res.render("splash.ejs", {
    playersOnline: gameStatus.playersOnline,
    gamesOnline: gameStatus.gamesOnline,
    gamesCompleted: gameStatus.gamesCompleted
  });
});

// Route without live statistics
// app.get("/", (req, res) => {
//   res.sendFile("splashScreen.html", { root: "./public" });
// });

//Initiate server
var server = http.createServer(app);
const wss = new websocket.Server({ server });

var websockets = {};

/*
* Clean up websockets after some time
*/
setInterval(function () {
  for (let i in websockets) {
    if (Object.prototype.hasOwnProperty.call(websockets, i)) {
      let gameObj = websockets[i];
      //if the gameObj has a final status, the game is complete/aborted
      if (gameObj.finalStatus != null) {
        delete websockets[i];
      }
    }
  }
}, 50000);

var currentGame = new Game(gameStatus.gamesInitialized++);
var connectionID = 0;

/*
* Correspondence with websockets
* It can receive different messages or close signs
*/
wss.on("connection", function connection(ws) {
  let con = ws;
  con.id = connectionID++;
  let playerType = currentGame.addPlayer(con);
  websockets[con.id] = currentGame;
  gameStatus.playersOnline++;

  console.log(
    "Player %s placed in game %s as %s",
    con.id,
    currentGame.id,
    playerType
  );


  /*
  * a new game object is created
  * if a player now leaves, the game is aborted
  */
  if (currentGame.hasTwoConnectedPlayers()) {

    //Inform players about their color
    currentGame.playerWHITE.send(messages.S_PLAYER_WHITE)
    currentGame.playerBLACK.send(messages.S_PLAYER_BLACK)

    currentGame = new Game(gameStatus.gamesInitialized++);
    gameStatus.gamesOnline++;

  }

  /* game interactions
  * receiving message from client
  * determining game and opposing player
  * send to other client
 */
  con.on("message", function incoming(message) {
    let oMsg = JSON.parse(message);

    let gameObj = websockets[con.id];

    console.log(oMsg)

    let isWhite = (gameObj.playerWHITE == con) ? true : false;

    if (oMsg.type == messages.T_MAKE_A_MOVE) {
      //Change boardstatus of own player
      
      if (isWhite) {

        if (gameObj.hasTwoConnectedPlayers()) {
          gameObj.playerBLACK.send(message);
        }
      } else {
        gameObj.playerWHITE.send(message);
      }
    }
    if (oMsg.type == messages.T_GAME_WON_BY) {
      if(isWhite)
        gameObj.playerBLACK.send(message);
      else
        gameObj.playerWHITE.send(message);

      gameObj.setStatus(oMsg.data);
      //game was won by somebody, update statistics
      gameStatus.gamesCompleted++;
    }
  });

  /*
  * abort the game
  */
  con.on("close", function (code) {
    console.log(con.id + " disconnected...");
    gameStatus.playersOnline--;

    if (code == "1001") {
      let gameObj = websockets[con.id];

      if (gameObj.isValidTransition(gameObj.gameState, "ABORTED")) {
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