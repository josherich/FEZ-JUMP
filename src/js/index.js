window.$ = require('jquery');

var Box = require('./box');
var Player = require('./player');
var Steps = require('./steps');
var Sprite = require('./sprite');
var running = false;

window.requestAnimationFrame = window.requestAnimationFrame || window.mozRequestAnimationFrame ||
                              window.webkitRequestAnimationFrame || window.msRequestAnimationFrame;

var wrapStyle = window.document.querySelector('.wrap').style;

var _box = window.document.querySelectorAll('.box')[0];

_box.style.webkitAnimationName = 'cspin1';
_box.style.position = 'fixed';


// debug
window.fez = {};
window.fez.box = new Box();
window.fez.player = new Player();
window.fez.playerSprite = new Sprite('./images/jumplr.png', [
  {
    name: 'right',
    el: window.fez.player.getDOM(),
    imgW: 14,
    imgH: 21,
    x: 0,
    y: 0,
    count: 12,
    state: function() { return window.fez.player.right;}
  },
  {
    name: 'left',
    el: window.fez.player.getDOM(),
    imgW: 14,
    imgH: 21,
    x: 0,
    y: 21,
    count: 12,
    state: function() { return window.fez.player.left;}
  }
]);

window.fez._state = {
  playing: true
};

window.fez.control = {
  playing: function() {
    return window.fez._state.playing;
  },
  stop: function() {
    window.fez._state.playing = false;
  },
  play: function() {
    window.fez._state.playing = true;
  },
  toggle: function() {
    window.fez._state.playing = !window.fez._state.playing;
  }
};

window.fez.steps = new Steps()
window.fez.boxEl = _box;

window.addEventListener('keydown', function(ev) {
  // move player
  var player = window.fez.player;
  var box = window.fez.box;
  if (ev.keyCode == 37 && !running) {
    player.turnLeft();
    ev.preventDefault();
  }
  if (ev.keyCode == 39 && !running) {
    player.turnRight();
    ev.preventDefault();
  }
  if (ev.keyCode == 38 && !running) {
    player.jump = true;
    ev.preventDefault();
  }
  // rotate and move the world
  if (ev.keyCode === 65 && !running) { // right rotate
    running = true;
    setTimeout(function(){
      running = false;
    }, 900);
    box.acw();
  } else if (ev.keyCode === 68 && !running) {
    running = true;
    setTimeout(function(){
      running = false;
    }, 900);
    box.cw()
  } else if (ev.keyCode === 87) { // up
    // _box.style.top = increasePx(_box.style.top);
    // wrapStyle.perspective = increasePx(wrapStyle.perspective);
  } else if (ev.keyCode === 16) {
    window.fez.player.shoot();
    // _box.style.top = decreasePx(_box.style.top);
    // wrapStyle.perspective = decreasePx(wrapStyle.perspective);
  } else if (ev.keyCode === 32) {
    window.fez.control.toggle();
  }
}, false);

window.addEventListener('keyup', function(ev) {
  var player = window.fez.player;
  var box = window.fez.box;

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

function increasePx (px) {
  if (!px) return '10px';
  var n = parseInt(px.replace('px','')) + 10;
  return n + 'px';
}
function decreasePx (px) {
  if (!px) return '10px';
  var n = parseInt(px.replace('px','')) - 10;
  return n + 'px';
}

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
  var player = window.fez.player;
  var steps = window.fez.steps;
  if (window.fez.control.playing()) {
    player.move();
    steps.move();
    player.draw();
    steps.draw();
  }

  requestAnimationFrame(run);
}

// run
requestAnimationFrame(run);