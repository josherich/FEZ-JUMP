var Enemy = require('./enemy');

function Step(face, x, y, width) {
  this.face = face;
  this.el = document.createElement('div');
  this.el.style.width = width + 'px';
  $(this.el).addClass('step');
  $(this.face).append(this.el);

  this.w = width;
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

  this.playerIsOn = function(player, tolerance) {
    tolerance = tolerance || 1;
    var x = this.getX();
    var offset = 4;
    if (player.x + (player.w/2 + offset) < x) {
      return false;
    }

    if (player.x + (player.w/2 - offset) > x + this.w) {
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
  var lx = 120,
      ly = 30,
      x0 = 325,
      y0 = 0;
  this.steps = {'.box>.left>.inner':[], '.box>.back>.inner':[], '.box>.right>.inner':[], '.box>.front>.inner':[]};
  this.x = 0;
  this.y = 0;
  var box = window.fez.box;

  this.addNeeded = function(face) {
    if (this.y > (box.h - 21)) {
      return;
    }
    var randX = Math.random() * lx * 2 - lx;
    var randY = Math.random() * ly;
    var width = Math.random() * 40 + 20; // 20 - 60
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
    this.steps[face].push(new Step(face, this.x, this.y, width));
    this.addNeeded(face);
  };

  this.init = function() {
    var i = 5;
    while (i--) {
      this.steps.push(new Step('.box>.left>.inner'));
    }
  };

  var faceTable = ['.box>.left>.inner', '.box>.back>.inner', '.box>.right>.inner', '.box>.front>.inner'];

  for (var i in faceTable) {
    this.addNeeded(faceTable[i]);
  }

  this.playerIsOnAnyStep = function(player, tolerance) {
    tolerance = tolerance || 1;
    var steps = this.steps[box.curFace];
    for (var i = 0; i < steps.length; i++) {
      if (steps[i].playerIsOn(player, tolerance)) {
        return true;
      }
    }
    return false;
  };

  this.playerIsOnTopStep = function(player, tolerance) {
    tolerance = tolerance || 1;
    var steps = this.steps[box.curFace];
    if (steps.length > 0) {
      return steps[steps.length - 1].playerIsOn(player, tolerance);
      // return steps[0].playerIsOn(player, tolerance);
    } else {
      return false;
    }
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
