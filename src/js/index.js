import Box from './box.js';
import Steps from './steps.js';
import Poop from './poop.js';
import Diamond from './diamond.js';
import Utils from './utils.js';

window.fez = {};

var width = 655;
var height = 455;
window.fez.box = new Box(width, height);
window.fez.diamond = new Diamond();

Utils.dom('.wrap').appendChild(window.fez.box.dom);
var boxDom = Utils.dom('.wrap .box');
boxDom.style.position = 'fixed';
window.fez.box.dom = boxDom;

Utils.dom(boxDom, `.${window.fez.box.currentFaceName} > .inner`).appendChild(window.fez.diamond.dom);
var diamondDom = Utils.dom('.box #diamond');
window.fez.diamond.dom = diamondDom;

window.fez.poop = new Poop();
window.fez.steps = new Steps()

await import('./players.js');
await import('./control.js');
await import('./run.js');
