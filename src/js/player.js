var Bullet = require('./bullet');
var Sprite = require('./sprite');

var playerID = 0;

var Player = function(options) {
  var self = this;
  var box = window.fez.box;
  
  var el = document.createElement('div');
  el.className = 'player';
  el.id = 'player_' + playerID;
  document.querySelector('.left .inner').appendChild(el);
  playerID++;

  this.birth = options.birth || {x:0,y:0};
  this.id = options.id;
  this.el = el;
  this.jumpSpeed = 10;
  this.moveSpeed = 1;
  this.maxMove = 8;
  this.gravity = -0.6;
  this.bounce = 0.1;
  this.friction = 0.8;
  this.jump = false;
  this.w = 14;

  this.y = this.birth.y;
  this.vy = 0;

  this.x = this.birth.x;
  this.vp = 0;
  this.maxp = box.w;

  this.dead = false;
  this.left = false;
  this.right = false;
  this.facing = 1; // right
  this.score = 0;

  this.bullets = [];

  this._getDOM = function() {
    return this.el;
  };

  this.sprite = new Sprite('./images/jumplr.png', [
    {
      name: 'right',
      el: self._getDOM(),
      imgW: 14,
      imgH: 21,
      x: 0,
      y: 0,
      count: 12,
      state: function() { return self.right;}
    },
    {
      name: 'left',
      el: self._getDOM(),
      imgW: 14,
      imgH: 21,
      x: 0,
      y: 21,
      count: 12,
      state: function() { return self.left;}
    }
  ]);

  this.move = function() {
    if (this.dead) return;
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
    if (this.vy < 0 && steps.playerIsOnAnyStep(this, tolerance)) {
      this.vy = this.bounce * -this.vy;
    }

    this.shot();

    if (this.dead) {
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
    var bullet = new Bullet(this, {
      type: 'input.checkbox'
    });
    this.bullets.push(bullet);
    bullet.shoot();
  };

  this.shot = function() {
    var self = this;
    var others = this.others();
    var player;
    for (var j = 0; j < others.length; j++) {
      player = others[j];
      for (var i = 0; i < player.bullets.length; i++) {
        var bullet = player.bullets[i];
        if (bullet.dead) continue;
        var dx = Math.abs(bullet.ox - self.x);
        var dy = Math.abs(bullet.oy - self.y);
        if (dx < 8 && dy < 8) {
          self.die();
          bullet.disappear();
          player.bullets.splice(i,1);
          player.win();
          return;
        }
      }
    }
  };

  this.die = function() {
    var el = this.el;
    this.dead = true;
    this.blink(8);
    setTimeout(self.restore.bind(self),2000);
  };

  this.restore = function() {
    this.dead = false;
    this.x = this.birth.x;
    this.y = this.birth.y;
    el.style.display = 'block';
  };

  this.win = function() {
    this.score += 1;
    document.querySelector('#score_' + this.id).textContent = this.score;
  };

  this.blink = function(n, callback) {
    var self = this;
    var el = this.el;
    function _blink() {
      el.style.display = 'none';
      setTimeout(function() {
        el.style.display = 'block';
        n--;
        if (n > 0) {
          setTimeout(_blink, 200)
        } else {
          callback && callback.call(self);
        }
      },200);
    }
    _blink();
  };

  this.others = function() {
    var self = this;
    return window.fez.players.filter(function(player) {
      return player != self;
    });
  };

  this.canJump = function() {
    var steps = window.fez.steps;
    var tolerance = Math.max(-this.vy, 8);
    return steps.playerIsOnAnyStep(this, tolerance) || this.y == 0;
  };

  this.draw = function() {
    this.el.style.webkitTransform = 'translate(' + this.x + 'px, -' + this.y + 'px)';
    this.bullets.map(function(bullet) {
      bullet.draw();
    });
    // this.updatePerspective();
  };

  this.updatePerspective = function() {
    var y = this.y * 290 / 455 - 130;
    window.fez.boxEl.style.top = y + 'px';
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