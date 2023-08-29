const app = require('express')();
const server = require('http').createServer(app);
const socket = require('socket.io')(server);
const { controller } = require("./controller")
const { gameData } = require("./model")
const path = require("path")
const port = process.env.PORT || 8080;

app.get('/', function (_req, res) {
  res.sendFile(path.resolve('./src/index.html'));
});

controller(socket, gameData)

server.listen(port, function () {
  console.log(`Listening on port ${port}`);
});