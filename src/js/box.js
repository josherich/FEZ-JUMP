var Utils = require('./utils');
var keyframes = require('./keyframes');

var Box = function(width, height) {

  this.insertBoxDom = function() {
    var template = document.createElement('template');
    template.id = 'box';
    template.innerHTML = this.template.trim();
    // Utils.dom('body').appendChild(template);

    var boxDom = document.importNode(template.content, true);
    // Utils.dom('body').appendChild(boxDom);
    return boxDom;
  };

  /**
   * [rotateClockwise description]
   * @param  {Function} cb [use: cb(currentFace, prevFace)]
   * @return {[type]}      [description]
   */
  this.rotateClockwise = function(cb) {
    var kf_id = this.keyframes.insertRotate({start: [0, 1, 0, `${this.current_deg}deg`], end: [0, 1, 0, `${this.current_deg-90}deg`]})
    this.current_deg = this.current_deg-90;

    this.dom.style.webkitAnimationName = kf_id;

    this.rotate_idx = (this.rotate_idx + 1) % 4;
    this.currentFaceName = this.rotate_face_idx[this.rotate_idx]

    var prevFace = this.currentFace;
    var currentFace = Utils.dom(this.dom, `.box > .${this.currentFaceName} > .inner`);
    cb && cb(currentFace, prevFace);
    this.currentFace = currentFace;

  };

  /**
   * [rotateAClockwise description]
   * @param  {Function} cb [use: cb(currentFace, prevFace)]
   * @return {[type]}      [description]
   */
  this.rotateAClockwise = function(cb) {
    var kf_id = this.keyframes.insertRotate({start: [0, 1, 0, `${this.current_deg}deg`], end: [0, 1, 0, `${this.current_deg+90}deg`]})
    this.current_deg = this.current_deg+90;

    this.dom.style.webkitAnimationName = kf_id;

    this.rotate_idx = (this.rotate_idx - 1 < 0 ? 3 : this.rotate_idx - 1) % 4
    this.currentFaceName = this.rotate_face_idx[this.rotate_idx]

    var prevFace = this.currentFace;
    var currentFace = Utils.dom(this.dom, `.box > .${this.currentFaceName} > .inner`);
    cb && cb(currentFace, prevFace);
    this.currentFace = currentFace;
  };

  this.w = width;
  this.h = height;
  this.template = `
      <div class="box">
        <div class="front"><div class="inner"></div></div>
        <div class="back"><div class="inner"></div></div>
        <div class="top"><div class="inner"></div></div>
        <div class="bottom"><div class="inner"></div></div>
        <div class="left"><div class="inner"></div></div>
        <div class="right"><div class="inner"></div></div>
      </div>
  `
  this.face_idx = ['left', 'back', 'right', 'front', 'top', 'bottom'];
  this.rotate_face_idx = ['front', 'right', 'back', 'left'];
  
  this.el = this.insertBoxDom();
  this.dom = this.el;
  this.currentFaceName = 'front';
  this.currentFace = Utils.dom(this.dom, `.${this.currentFaceName} > .inner`);
  this.rotate_idx = 0;
  this.current_deg = 0;
  this.keyframes = keyframes;
};

module.exports = Box;