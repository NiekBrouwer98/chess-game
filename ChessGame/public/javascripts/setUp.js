/* Set up game */


(function setup(){
    var socket = new WebSocket(Setup.WEB_SOCKET_URL);

    //set up UI elements

    var gm = null

    socket.onmessage = function (event) {
        let incomingMsg = JSON.parse(event.data);
    
        //set player type
        if (incomingMsg.type == Messages.T_PLAYER_TYPE) {

          // Now that we know the player type we can setup the board
          gm = new GameManager(incomingMsg.data == "WHITE", socket);
        }

        // Check if we already have a game manager to receive other messages
        if(gm == null){
          console.error(`Our game manager is not yet initialized so we can't handle request ${incomingMsg.type}`)
          return
        }

        // We recieved a move to play
        if(incomingMsg.type = Messages.T_MAKE_A_MOVE){
          
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