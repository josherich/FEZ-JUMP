var Enemy = require('./enemy');

function Step(face, x, y) {
  this.face = face;
  this.el = document.createElement('div');
  $(this.el).addClass('step');
  $(this.face).append(this.el);

  this.w = 30;
  this.h = 10;
  this.x = x;
  this.y = y;

  // this.enemy = new Enemy(this);

  this.getX = function() {
    return this.x;
  };

  this.getY = function() {
    return this.y + this.h;
  };

  this.draw = function() {
    this.el.style.webkitTransform = 'translate(' + this.x + 'px, -' + this.y + 'px)';
    if (this.enemy) {
      this.enemy.draw();
    }
  };

  this.playerIsOn = function(tolerance) {
    tolerance = tolerance || 1;
    var x = this.getX();
    var player = window.fez.player;
    if (player.x + player.w < x) {
      return false;
    }
    if (player.x - player.w > x + this.w) {
      return false;
    }
    var y = this.getY();
    var diffY = player.y - y;
    return (diffY >= 0 && diffY <= tolerance);
  };

  this.move = function() {
    if (this.enemy) {
      this.enemy.move();
      if (this.enemy.dead)
        this.enemy = undefined;
    }
  };
};

function Steps() {
  var lx = 40,
      ly = 30,
      x0 = 150,
      y0 = 0;
  this.steps = {'.left .inner':[], '.back .inner':[], '.right .inner':[], '.front .inner':[]};
  this.x = 0;
  this.y = 0;
  var box = window.fez.box;

  this.addNeeded = function(face) {
    if (this.y > (box.h - 21)) {
      return;
    }
    var randX = Math.random() * lx * 2 - lx;
    var randY = Math.random() * ly;
    if (randX + x0 > box.w) {
      this.x = box.w - 20;
    } else if (randX + x0 < 0) {
      this.x = 20;
    } else {
      this.x = randX + x0 - 20;
    }
    this.y = randY + y0 > box.h ? box.h - 40 : randY + y0 + 40;

    x0 = this.x;
    y0 = this.y;
    this.steps[face].push(new Step(face, this.x, this.y));
    this.addNeeded(face);
  };

  this.init = function() {
    var i = 5;
    while (i--) {
      this.steps.push(new Step('.left .inner'));
    }
  };

  var faceTable = ['.left .inner', '.back .inner', '.right .inner', '.front .inner'];

  for (var i in faceTable) {
    this.addNeeded(faceTable[i]);
  }

  this.playerIsOnAnyStep = function(tolerance) {
    tolerance = tolerance || 1;
    var steps = this.steps[box.curFace];
    for (var i = 0; i < steps.length; i++) {
      if (steps[i].playerIsOn(tolerance)) {
        return true;
      }
    }
    return false;
  };

  this.move = function() {
    var steps = this.steps[box.curFace];
    for (var i = 0; i < steps.length; i++) {
      steps[i].move();
    }
  };

  this.draw = function() {
    var steps = this.steps[box.curFace];
    for (var i = 0; i < steps.length; i++) {
      steps[i].draw();
    }
  };

};

module.exports = Steps;
