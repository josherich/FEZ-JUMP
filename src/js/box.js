var Box = function() {
  this.el = window.document.querySelectorAll('.box')[0];
  this.w = 255;
  this.h = 455;
  this.curFace = ".left .inner";

  function convert_rotate(i) {
    return [0, 3, 2, 1, 4][i];
  }
  function transSurface(ifCW, i) {
    var table_cw = ['', '.left .inner', '.back .inner', '.right .inner', '.front .inner'];
    var table_acw = ['', '.right .inner', '.back .inner', '.left .inner', '.front .inner'];
    var playerEl = $('.player');
    var player = window.fez.player;

    if (ifCW) {
      $(table_cw[i]).append(playerEl);
      player.x = 255 - 20;
      this.curFace = table_cw[i];
    } else {
      $(table_acw[i]).append(playerEl);
      player.x = 0;
      this.curFace = table_acw[i];
    }
  }

  this.cw = function() {
    var name = this.el.style.webkitAnimationName;
    var i;
    if (name.indexOf('cspin') > -1) {
      i = parseInt(name.replace('cspin', '')) + 1;
    } else {
      i = convert_rotate(parseInt(name.replace('aspin', ''))) + 1;
    }
    if (i == 5) {
      i = 1;
    }
    if (i == 0) {
      i = 4;
    }
    this.el.style.webkitAnimationName = 'cspin' + i;
    transSurface(true, i);
  };

  this.acw = function() {
    var name = this.el.style.webkitAnimationName;
    var i;
    if (name.indexOf('aspin') > -1) {
      i = parseInt(name.replace('aspin', '')) + 1;
    } else {
      i = convert_rotate(parseInt(name.replace('cspin', ''))) + 1;
    }
    if (i == 5)
      i = 1;
    if (i == 0)
      i = 4;
    this.el.style.webkitAnimationName = 'aspin' + i;
    transSurface(false, i);
  };
};

module.exports = Box;