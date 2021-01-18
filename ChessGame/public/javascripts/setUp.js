/* Set up game */


(function setup(){
    var socket = new WebSocket(Setup.WEB_SOCKET_URL);

    //set up UI elements

    var gs = new GameState(socket);

    socket.onmessage = function (event) {
        let incomingMsg = JSON.parse(event.data);
    
        //set player type
        if (incomingMsg.type == Messages.T_PLAYER_TYPE) {
          gs.setPlayerType(incomingMsg.data); //should be "WHITE" or "BLACK"
    
          //if player type is BLACK than disable movement
          if (gs.getPlayerType() == "BLACK") {
            //disable movement possibility
    
          //code status that is send to players with Status();
          }
        }
    }
    
    socket.onopen = function () {
      socket.send("{}");
    };
  
    //server sends a close event only if the game was aborted from some side
    socket.onclose = function () {
      // if (gs.whoWon() == null) {
      //   sb.setStatus(Status["aborted"]);
      // }
    };
  
    socket.onerror = function () { };
  })();