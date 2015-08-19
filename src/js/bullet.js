var Sprite = require('./sprite');

var Bullet = function(player) {
  var self = this;
  var box = window.fez.box;
  var el = document.createElement('div');
  el.className = 'bullet';
  document.querySelector('.left .inner').appendChild(el);

  this.el = el;
  this.moveSpeed = 4;
  // relative to the player when shoot;
  this.ox = player.x;
  this.oy = player.y + 5;
  
  this.maxp = box.w;

  this.dead = false;
  this.shooted = false;
  this.player = player;
  this.direction = player.facing;

  this.sprite = new Sprite('./images/jumplr.png', [{
    name: 'bullet',
    el: self.el,
    imgW: 5,
    imgH: 5,
    x: 1,
    y: 43,
    count: 1,
    state: function() { return false; }
  }]);

  this.shoot = function() {
    this.shooted = true;
    this.direction = player.facing;
  };

  this.move = function() {
    if (!this.shooted) return;

    if (this.ox > this.maxp || this.ox < 0) {
      this.dead = true;
      this.el.style.display = 'none';
      el.remove();
    } else {
      this.ox += this.moveSpeed * this.direction;
    }
  };

  this.draw = function() {
    this.el.style.webkitTransform = 'translate(' + this.ox + 'px, -' + this.oy + 'px)';
  }
}

module.exports = Bullet;