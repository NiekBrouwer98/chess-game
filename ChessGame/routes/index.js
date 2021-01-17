var express = require('express');
var app = express();

module.exports = function(app){
  app.get("/", function(req, res) {
    res.sendFile("splashScreen.html", { root: "./public" });
  });

  /* Pressing the 'PLAY' button, returns this page */
  app.get("/play", function(req, res) {
    res.sendFile("game.html", { root: "./public" });
  });
}