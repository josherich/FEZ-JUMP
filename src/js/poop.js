var Poop = function() {
  var box = window.fez.box;
  this.x = 350;
  this.y = 0;
  this.vp = 0;
  this.vy = 0;
  this.gravity = -0.6;
  this.friction = 0.8;
  this.w = 8;
  this.maxp = box.w;

  this.carried = false;

  this.buildElement = function() {
    var el = document.querySelector('#diamond');
    this.el = el;
  };

  this.picked = function(player) {
    this.carried = true;
    this.player = player;
  };

  this.dropped = function() {
    this.carried = false;
    this.player = null;
  };

  this.reset = function() {
    this.dropped();
    this.x = 350;
    this.y = 0;
  };

  this.move = function() {
    if (this.carried) {
      this.x = this.player.x - 10;
      this.y = this.player.y + 25;
      return;
    }
    // gravity
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

  };

  this.draw = function() {
    this.el.style.bottom = this.y + 10 + 'px';
    this.el.style.left = this.x + 10 + 'px';
  };

  this.buildElement();
};

module.exports = Poop;