var c = document.getElementById('c').getContext('2d');

var keys = [];
document.addEventListener('keydown', function(e) {
  keys[e.keyCode] = true;
});
document.addEventListener('keyup', function(e) {
  keys[e.keyCode] = false;
});

var bulletList = [];
var player = new Entity(250, 250, 10, 10, 'red');
player.update = function() {

  if (keys[37]) this.velX = -this.speed; // Left Key
  if (keys[38]) this.velY = -this.speed; // Up Key
  if (keys[39]) this.velX = this.speed; // Right Key
  if (keys[40]) this.velY = this.speed; // Down Key
  if (keys[32]) newBullet(player); // Space Key

  this.x += this.velX;
  this.y += this.velY;
  this.velX = 0;
  this.velY = 0;

  c.fillStyle = this.color;
  c.fillRect(this.x, this.y, this.w, this.h);

};

function Entity(x, y, w, h, color) {
  this.color = color;
  this.x = x;
  this.y = y;
  this.w = w;
  this.h = h;
  this.velX = 0;
  this.velY = 0;
  this.speed = 3;
}

function newBullet(obj) {
  var bullet = new Entity(player.x, player.y, 5, 5, 'black');
  bullet.velX = player.velX;
  bullet.velY = player.velY;
  if (bullet.velX !== 0 || bullet.velY !== 0) {
    bullet.update = function() {
      this.x += this.velX * 2;
      this.y += this.velY * 2;

      c.fillStyle = this.color;
      c.fillRect(this.x, this.y, this.w, this.h);
    };
    bulletList.push(bullet);
  }
  setTimeout(function() {
    delete bulletList[bulletList.indexOf(bullet)];
  }, 500);
}

function draw() {
  c.clearRect(0, 0, 500, 500);
  player.update();
  for (var i in bulletList) {
    bulletList[i].update();
  }
}

window.setInterval(draw, 1000 / 60);