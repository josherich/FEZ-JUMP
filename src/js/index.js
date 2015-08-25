window.$ = require('jquery');

var Box = require('./box');
var Player = require('./player');
var Steps = require('./steps');
var Poop = require('./poop');

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
window.fez.players = [];
window.fez.players.push(new Player({
  id: 1,
  birth: {x:0, y:0}
}));
window.fez.players.push(new Player({
  id: 2,
  birth: {x:640, y:0}
}));

window.fez.poop = new Poop();

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
  var player1 = window.fez.players[0];
  var player2 = window.fez.players[1];
  var box = window.fez.box;

  // player1 - a - left
  if (ev.keyCode == 65 && !running) {
    player1.turnLeft();
    ev.preventDefault();
  }
  // player1 - d - right
  if (ev.keyCode == 68 && !running) {
    player1.turnRight();
    ev.preventDefault();
  }
  // player1 - w - jump
  if (ev.keyCode == 87 && !running) {
    player1.jump = true;
    ev.preventDefault();
  }
  // player1 - f - shoot
  if (ev.keyCode === 70) {
    player1.shoot();
  }

  // player2 - left - left
  if (ev.keyCode == 37 && !running) {
    player2.turnLeft();
    ev.preventDefault();
  }
  // player2 - right - right
  if (ev.keyCode == 39 && !running) {
    player2.turnRight();
    ev.preventDefault();
  }
  // player2 - up - jump
  if (ev.keyCode == 38 && !running) {
    player2.jump = true;
    ev.preventDefault();
  }
  // player2 - / - shoot
  if (ev.keyCode === 191) {
    player2.shoot();
  }

  // rotate right
  if (ev.keyCode === 188 && !running) {
    running = true;
    setTimeout(function(){
      running = false;
    }, 900);
    box.acw();
  }
  // rotate left 
  if (ev.keyCode === 190 && !running) {
    running = true;
    setTimeout(function(){
      running = false;
    }, 900);
    box.cw()
  }

  // world - space - toggle play/pause
  if (ev.keyCode === 32) {
    window.fez.control.toggle();
  }
}, false);

window.addEventListener('keyup', function(ev) {
  var player1 = window.fez.players[0];
  var player2 = window.fez.players[1];
  var box = window.fez.box;

  if (ev.keyCode == 65 && !running) {
    player1.left = false;
    ev.preventDefault();
  }
  if (ev.keyCode == 68 && !running) {
    player1.right = false;
    ev.preventDefault();
  }
  if (ev.keyCode == 87 && !running) {
    player1.jump = false;
    ev.preventDefault();
  }

  if (ev.keyCode == 37 && !running) {
    player2.left = false;
    ev.preventDefault();
  }
  if (ev.keyCode == 39 && !running) {
    player2.right = false;
    ev.preventDefault();
  }
  if (ev.keyCode == 38 && !running) {
    player2.jump = false;
    ev.preventDefault();
  }
  // console.log(box.curFace);
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

function updatePerspective() {
  var ym = 0;
  var players = window.fez.players;
  players.map(function(player) {
    ym += player.y * 290 / 455 - 130;
  })
  window.fez.boxEl.style.top = (ym / players.length) + 'px';
};

function run() {
  var players = window.fez.players;
  var steps = window.fez.steps;
  var poop = window.fez.poop;
  if (window.fez.control.playing()) {
    players.map(function(player) {
      player.move();
    });
    steps.move();
    poop.move();

    players.map(function(player) {
      player.draw();
    });

    steps.draw();
    poop.draw();
    updatePerspective();
  }

  requestAnimationFrame(run);
}

// run
requestAnimationFrame(run);