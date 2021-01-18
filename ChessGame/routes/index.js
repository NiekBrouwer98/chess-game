var express = require('express');
var router = express.Router();

// module.exports = function(app){
router.get("/splashScreen", function(req, res) {
  res.sendFile("splashScreen.html", { root: "./public" });
});

  /* Pressing the 'PLAY' button, returns this page */
router.get("/play", function(req, res) {
  res.sendFile("game.html", { root: "./public" });
});

module.exports = router;