window.requestAnimationFrame = window.requestAnimationFrame || window.mozRequestAnimationFrame ||
                              window.webkitRequestAnimationFrame || window.msRequestAnimationFrame;

var _box = document.querySelectorAll('.box')[0];
_box.style.webkitAnimationName = 'cspin1';
_box.style.position = 'fixed';
var running = false;
var h = 100;
var faceTable = ['.left .inner', '.back .inner', '.right .inner', '.front .inner'];

var left = document.querySelectorAll('.left')[0];

var Box = function() {
  this.el = document.querySelectorAll('.box')[0];
  this.w = 255;
  this.h = 455;
  this.curFace = ".left .inner";
  this.rotateQueue = [];
  this.rotating = false;
  function convert_rotate(i) {
    return [0,3,2,1,4][i];
  }
  function transSurface(ifCW, i) {
    var table_cw = ['', '.left .inner', '.back .inner', '.right .inner', '.front .inner'];
    var table_acw = ['', '.right .inner', '.back .inner', '.left .inner', '.front .inner'];
    var player = $('.player');
    if (ifCW) {
      $(table_cw[i]).append(player);
      this.player.x = 255 - 20;
      this.curFace = table_cw[i];
    } else {
      $(table_acw[i]).append(player);
      this.player.x = 0;
      this.curFace = table_acw[i];
    }
  }

  this.init = function(player) {
    this.player = player;
  };
  this.doRotate = function() {
    console.log('do rotate');
    if (!this.rotating) {
      this._doRotate()
    }
  }
  this._doRotate = function() {
    var self = this;
    var el = this.rotateQueue[0];
    var onAnimationEnd = function() {
      self.rotateQueue.shift();
      console.log('animation ends');
      if (self.rotateQueue.length > 0) {
        self._doRotate();
      } else {
        self.rotating = false;
      }
      self.el.removeEventListener('webkitAnimationEnd', onAnimationEnd);
    };
    this.rotating = true;
    if (el === 'acw') self.acw();
    if (el === 'cw') self.cw();

    this.el.addEventListener('webkitAnimationEnd', onAnimationEnd, false);
  };
  this.cw = function() {
    var name = box.el.style.webkitAnimationName;
    var i;
    if (name.indexOf('cspin') > -1) {
      i = parseInt(name.replace('cspin','')) + 1;
    } else {
      i = convert_rotate(parseInt(name.replace('aspin',''))) + 1;
    }
    if (i == 5)
      i = 1;
    if (i == 0)
      i = 4;
    this.el.style.webkitAnimationName = 'cspin' + i;
    transSurface(true, i);
  }
  this.acw = function() {
    var name = box.el.style.webkitAnimationName;
    var i;
    if (name.indexOf('aspin') > -1) {
      i = parseInt(name.replace('aspin','')) + 1;
    } else {
      i = convert_rotate(parseInt(name.replace('cspin',''))) + 1;
    }
    if (i == 5)
      i = 1;
    if (i == 0)
      i = 4;
    this.el.style.webkitAnimationName = 'aspin' + i;
    transSurface(false, i);
  }
}
var Player = function(box) {
  this.el = document.querySelectorAll('.player')[0];
  this.jumpSpeed = 12;
  this.moveSpeed = 1.5;
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
  this.left = 0;
  this.move = function() {
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

    var tolerance = Math.max(-player.vy, 1);
    if (this.vy < 0 && steps.playerIsOnAnyStep(tolerance)) {
      this.vy = this.bounce * -this.vy;
    }

    if (this.dead == 0) {
      this.gameOver = true;
    }
  }

  this.look = function() {
    console.log('p: ', this.p);
    console.log('y: ', this.y);
    console.log('vy: ', this.vy);
  }

  this.canJump = function() {
    var tolerance = Math.max(-player.vy, 8);
    return steps.playerIsOnAnyStep(tolerance) || this.y == 0;
  }

  this.draw = function() {
    this.el.style.webkitTransform = 'translate(' + this.x + 'px, -' + this.y + 'px)';
  }
}

function Enemy(step) {
  this.size = 20;
  this.r = this.size / 2;

  this.step = step;

  this.gap = 2;

  this.el = document.createElement('div');
  $(this.el).addClass('bad');
  $(this.step.face).append(this.el);

  this.x = this.step.w - this.size;
  this.x *= Math.random();
  this.x += this.r;

  this.maxVx = 1;
  this.vx = (Math.random() - 0.5);
  this.vx *= this.maxVx * 2;

  this.checkPlayerTouch = function() {
    if (this.dying)
      return;
    var x = this.step.getX();
    var y = this.step.getY();
    x += this.x;
    y -= this.r + this.gap;

    var x2 = player.x;
    var y2 = player.y;

    var diffX = x - x2;
    var diffY = y - y2;
    var dist = Math.sqrt(diffX * diffX + diffY * diffY);
    if (dist < player.r + this.r) {
      player.dead = true;
    }
  };

  this.move = function() {
    this.checkPlayerTouch();
    this.x += this.vx;
    if (this.x < this.r) {
      this.x = this.r;
      this.vx = -this.vx;
    }
    var maxX = this.step.w - this.r;
    if (this.x > maxX) {
      this.x = maxX;
      this.vx = -this.vx;
    }
  };

  this.draw = function() {
    var x = this.step.getX();
    var y = this.step.getY();
    x += this.x;
    y += this.r;
    // this.el.innerText = this.x; //testing
    this.el.style.webkitTransform = 'translate(' + x + 'px, -' + y + 'px)';
  }
}

function Step(face, x, y) {
  this.face = face;
  this.el = document.createElement('div');
  $(this.el).addClass('step');
  $(this.face).append(this.el);

  this.w = 30;
  this.h = 10;
  this.x = x;
  this.y = y;

  this.enemy = new Enemy(this);

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
  this.steps = {'.left .inner':[], '.back .inner':[], '.right .inner':[], '.front .inner':[]};
  var lx = 40; ly = 30; x0 = 150, y0 = 0;
  this.x = 0;
  this.y = 0;
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
  }
  this.init = function() {
    var i = 5;
    while (i--) {
      this.steps.push(new Step('.left .inner'));
    }
  }
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

var box = new Box();
var player = new Player(box);
var steps = new Steps();

box.init(player);
window.player = player;

window.addEventListener('keydown', function(ev) {
  // move player
  if (ev.keyCode == 37 && !running) {
    player.left = true;
    ev.preventDefault();
  }
  if (ev.keyCode == 39 && !running) {
    player.right = true;
    ev.preventDefault();
  }
  if (ev.keyCode == 38 && !running) {
    player.jump = true;
    ev.preventDefault();
  }
  // rotate and move the world
  if (ev.keyCode === 65) { // right rotate
    running = true;
    setTimeout(function(){
      running = false;
    }, 900);
    box.rotateQueue.push('acw');
    box.doRotate();
  } else if (ev.keyCode === 68) {
    running = true;
    setTimeout(function(){
      running = false;
    }, 900);
    box.rotateQueue.push('cw');
    box.doRotate();
  } else if (ev.keyCode === 87) { // up
    _box.style.top =  h + 'px';
    h -= 10;
  } else if (ev.keyCode === 83) {
    _box.style.top = h + 'px';
    h += 10;
  }
}, false);

window.addEventListener('keyup', function(ev) {
  if (ev.keyCode == 37 && !running) {
    player.left = false;
    ev.preventDefault();
  }
  if (ev.keyCode == 39 && !running) {
    player.right = false;
    ev.preventDefault();
  }
  if (ev.keyCode == 38 && !running) {
    player.jump = false;
    ev.preventDefault();
  }
  console.log(box.curFace);
}, false);

function findKeyframesRule(rule) {
  var ss = document.stylesheets;
  for (var i = 0; i < ss.length; ++i) {
    for (var j = 0; j < ss[i].cssRules.length; ++j) {
      if (ss[i].cssRules[j].type == window.CSSRule.WEBKIT_KEYFRAMES_RULE && ss[i].cssRules[j].name == rule) {
        return ss[i].cssRules[j];
      }
    }
  }
  return null;
}

function run() {
  player.move();
  steps.move();
  player.draw();
  steps.draw();
  requestAnimationFrame(run);
}
requestAnimationFrame(run);