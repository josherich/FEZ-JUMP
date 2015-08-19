var Bullet = require('./bullet');

var Player = function() {
  var box = window.fez.box;
  this.el = document.querySelector('.player');
  this.jumpSpeed = 10;
  this.moveSpeed = 1;
  this.maxMove = 8;
  this.gravity = -0.6;
  this.bounce = 0.1;
  this.friction = 0.8;
  this.jump = false;
  this.w = 10;

  this.y = 0;
  this.vy = 0;

  this.x = 0;
  this.vp = 0;
  this.maxp = box.w;

  this.dead = false;
  this.left = false;
  this.right = false;
  this.facing = 1; // right

  this.bullets = [];

  this.move = function() {
    var steps = window.fez.steps;
    if (this.jump && this.canJump()) {
      this.vy = this.jumpSpeed;
    }
    if (this.right) {
      this.vp += this.moveSpeed;
      this.vp = Math.min(this.maxMove, this.vp);
    }
    if (this.left) {
      this.vp -= this.moveSpeed;
      this.vp = Math.max(-this.maxMove, this.vp);
    }
    this.y += this.vy;

    if (this.y > 0) {
      this.vy += this.gravity;
    } else {
      this.vy = 0;
      this.y = 0;
    }
    this.x += this.vp;
    this.x = Math.max(this.x, 0);
    this.x = Math.min(this.x, this.maxp - this.w);
    this.vp *= this.friction;

    var tolerance = Math.max(-this.vy, 1);
    if (this.vy < 0 && steps.playerIsOnAnyStep(tolerance)) {
      this.vy = this.bounce * -this.vy;
    }

    if (this.dead == 0) {
      this.gameOver = true;
    }

    this.bullets.map(function(bullet) {
      bullet.move();
    });

  }

  this.look = function() {
    console.log('p: ', this.p);
    console.log('y: ', this.y);
    console.log('vy: ', this.vy);
  };

  this.shoot = function() {
    var bullet = new Bullet(this);
    this.bullets.push(bullet);
    bullet.shoot();
  };

  this.canJump = function() {
    var steps = window.fez.steps;
    var tolerance = Math.max(-this.vy, 8);
    return steps.playerIsOnAnyStep(tolerance) || this.y == 0;
  };

  this.draw = function() {
    this.el.style.webkitTransform = 'translate(' + this.x + 'px, -' + this.y + 'px)';
    this.bullets.map(function(bullet) {
      bullet.draw();
    });
    this.updatePerspective();
  };

  this.updatePerspective = function() {
    var y = this.y * 290 / 455 - 130;
    window.fez.boxEl.style.top = y + 'px';
  };

  this.getDOM = function() {
    return this.el;
  };

  this.turnLeft = function() {
    this.left = true;
    this.facing = -1;
  };

  this.turnRight = function() {
    this.right = true;
    this.facing = 1;
  };
}

module.exports = Player;