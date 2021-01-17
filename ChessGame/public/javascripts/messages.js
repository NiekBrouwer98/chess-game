(function(exports){

    /*
    *GAME-START: client to server
    */

   /*
    *PLAYER-WHITE: server to client-a
     */
    exports.T_PLAYER_TYPE = "PLAYER-TYPE";
    exports.O_PLAYER_WHITE = {
    type: exports.T_PLAYER_TYPE,
    data: "WHITE"
    };
    exports.S_PLAYER_WHITE = JSON.stringify(exports.O_PLAYER_WHITE);

    /*   
    *PLAYER-BLACK: server to client-b
    */
   exports.O_PLAYER_BLACK = {
   type: exports.T_PLAYER_TYPE,
   data: "BLACK"
   };
   exports.S_PLAYER_BLACK = JSON.stringify(exports.O_PLAYER_BLACK);

    /*
    *GAME-FIRST-MOVE: client-a to server, server to client-b
    */

    /*
    *GAME-MOVE: client to server, server to other client
    */

   /*
    *GAME-WINNER: server to client-a and client-b
    */
   exports.T_GAME_WON_BY = "GAME-WON-BY";
   exports.O_GAME_WON_BY = {
     type: exports.T_GAME_WON_BY,
     data: null
   };
   

   /*
    *ABORT-GAME: client to server, server to other client
    */
   exports.O_GAME_ABORTED = {
    type: "GAME-ABORTED"
  };
  exports.S_GAME_ABORTED = JSON.stringify(exports.O_GAME_ABORTED);

})(typeof exports === "undefined" ? (this.Messages = {}) : exports);