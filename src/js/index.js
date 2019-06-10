var Box = require('./box');
var Steps = require('./steps');
var Poop = require('./poop');

window.fez = {};

window.fez.boxEl = window.document.querySelectorAll('.box')[0];
window.fez.boxEl.style.webkitAnimationName = 'cspin1';
window.fez.boxEl.style.position = 'fixed';
window.fez.box = new Box();

require('./players');

window.fez.poop = new Poop();
window.fez.steps = new Steps()

require('./control');

require('./run');

require('../css/index.css');