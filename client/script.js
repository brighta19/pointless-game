/*global io*/
var socket = io.connect(window.location.href);

var c, canvas, div;
window.addEventListener('load', function() {
  div = document.getElementById('box');
  canvas = document.getElementById('c');
  c = canvas.getContext('2d');
  canvas.addEventListener('mousemove', function(e) {
    socket.emit('mousemove', {
      x: e.clientX - div.offsetLeft,
      y: e.clientY - div.offsetTop
    });
  });
});

function sendKey(input, active) {
  socket.emit('keyPress', {
    input: input,
    active: active
  });
}

window.addEventListener('keydown', function(e) {
  if (e.keyCode == 37) sendKey('left', true); // ← (Left)
  if (e.keyCode == 39) sendKey('right', true); // → (Right)
  if (e.keyCode == 38) sendKey('up', true); // ↑ (Up)
  if (e.keyCode == 40) sendKey('down', true);  // ↓ (Down)
});
window.addEventListener('keyup', function(e) {
  if (e.keyCode == 37) sendKey('left', false); // ← (Left)
  if (e.keyCode == 39) sendKey('right', false); // → (Right)
  if (e.keyCode == 38) sendKey('up', false); // ↑ (Up)
  if (e.keyCode == 40) sendKey('down', false);  // ↓ (Down)
});

socket.on('newPos', function(data) {
  c.clearRect(0, 0, 500, 500);
  for (var i in data) {
    var player = data[i];
    c.fillStyle = player.color;
    c.fillRect(player.x, player.y, player.w, player.h);
    if (player.hasOwnProperty('mouse')) {
      var P1 = document.createElement('img');
      P1.src = '/img/P1.png';
      var P2 = document.createElement('img');
      P2.src = '/img/P2.png';
      var P3 = document.createElement('img');
      P3.src = '/img/P3.png';
      var P4 = document.createElement('img');
      P4.src = '/img/P4.png';
      if (i == '0') c.drawImage(P1, player.mouse.x, player.mouse.y);
      if (i == '1') c.drawImage(P2, player.mouse.x, player.mouse.y);
      if (i == '2') c.drawImage(P3, player.mouse.x, player.mouse.y);
      if (i == '3') c.drawImage(P4, player.mouse.x, player.mouse.y);
    }
  }
});