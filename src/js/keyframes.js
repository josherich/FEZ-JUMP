var Keyframes = function() {
  /**
   * [insertRotate description]
   * @param  {[Array]} params [ x, y, z rotation in deg: [10,10,10] ]
   * @return {[type]}        [description]
   */
  this.insertRotate = function(params) {
    var id = 'kf_rotate_' + Date.now();
    var start = params.start.join(',');
    var end   = params.end.join(',');

    var str = `@keyframes ${id} {
      from {
        transform: rotate3d(${start}); }
      to {
        transform: rotate3d(${end}); } }`
    this.style_sheet.insertRule(str);
    // this.style_sheet.addRule(str);
    this.rules[id] = params;
    return id;
  };

  this.insertKeyframesStyleTag = function() {
    var style = document.createElement('style');
    style.title = this.tag_id;
    style.type = 'text/css';
    
    document.head.appendChild(style);

    for (var i = 0; i < document.styleSheets.length; i++) {
      if (document.styleSheets[i].title = this.tag_id)
        return document.styleSheets[i];
    }
  };

  this.clearRules = function() {
    this.rules = [];
  };

  this.tag_id = 'kf' + Date.now();
  this.style_sheet = this.insertKeyframesStyleTag();

  this.rules = {};
  
}

module.exports = new Keyframes();