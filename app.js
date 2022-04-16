// Create Express App
var express = require('express');
var app = express();
var server = require('http').createServer(app);

// Get Files for Client When Requested
app.use('/', express.static(__dirname + '/client'));

// Start the Server
var port = process.env.PORT || 8000;
server.listen(port);
console.log('Server started on port ' + port);


// Start Connection Between Client and Server
var io = require('socket.io')(server);
var SOCKET_LIST = {};
var PLAYER_LIST = {};

function onConnection(client) {
  client.id = Math.random();
  SOCKET_LIST[client.id] = client;
  console.log('User connected');
  PLAYER_LIST[client.id] = new Player(client.id);
  var player = PLAYER_LIST[client.id];
  client.on('keyPress', function(data) {
    if (data.input == 'up') player.upKey = data.active;
    if (data.input == 'down') player.downKey = data.active;
    if (data.input == 'left') player.leftKey = data.active;
    if (data.input == 'right') player.rightKey = data.active;
  });
  client.on('disconnect', function() {
    delete SOCKET_LIST[client.id];
    delete PLAYER_LIST[client.id];
    console.log('User disconnected');
  });
  client.on('mousemove', function(data) {
    player.mouse = data;
  });
  
}

function Player(id) {
  this.color = 'red';
  this.x = Math.floor(400 * Math.random());
  this.y = Math.floor(400 * Math.random());
  this.w = 10;
  this.h = 10;
  this.id = id;
  this.upKey = false;
  this.downKey = false;
  this.leftKey = false;
  this.rightKey = false;
  this.updatePos = function() {
    if (this.upKey) this.y -= 3;
    if (this.downKey) this.y += 3;
    if (this.leftKey) this.x -= 3;
    if (this.rightKey) this.x += 3;
  };
}

setInterval(function() {
  var pack = [];
  for (var i in PLAYER_LIST) {
    var player = PLAYER_LIST[i];
    player.updatePos();
    pack.push(player);
  }
  io.emit('newPos', pack);
}, 1000 / 60);

io.on('connection', onConnection);