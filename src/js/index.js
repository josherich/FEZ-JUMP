window.$ = require('jquery');

var Box = require('./box');
var Player = require('./player');
var Steps = require('./steps');
var running = false;

window.requestAnimationFrame = window.requestAnimationFrame || window.mozRequestAnimationFrame ||
                              window.webkitRequestAnimationFrame || window.msRequestAnimationFrame;

var _box = window.document.querySelectorAll('.box')[0];

_box.style.webkitAnimationName = 'cspin1';
_box.style.position = 'fixed';


// debug
window.fez = {};
window.fez.box = new Box();
window.fez.player = new Player();
window.fez.steps = new Steps()

window.addEventListener('keydown', function(ev) {
  // move player
  var player = window.fez.player;
  var box = window.fez.box;

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
    _box.style.top =  h + 'px';
    h -= 10;
  } else if (ev.keyCode === 83) {
    _box.style.top = h + 'px';
    h += 10;
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
  player.move();
  steps.move();
  player.draw();
  steps.draw();
  requestAnimationFrame(run);
}

// run
requestAnimationFrame(run);