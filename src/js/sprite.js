var Sprite = function(spriteUrl, actions) {
  var self = this;
  this.url = spriteUrl;
  this.actionMap = {};

  this.loadAction = function(options) {
    this.actionMap[options.name] = {
      el: options.el,
      imgW: options.imgW,
      imgH: options.imgH,
      xo: options.x,
      yo: options.y,
      count: options.count,
      offsetX: 1, // FIXME
      state: options.state
    };
    options.el.style.width = pixelize(options.imgW);
    options.el.style.height = pixelize(options.imgH);
    options.el.style.backgroundImage = 'url("' + this.url + '")';
    options.el.style.backgroundRepeat = 'none';
    options.el.style.backgroundPositionX = pixelize(options.x);
    options.el.style.backgroundPositionY = pixelize(-options.y);
  };

  actions.map(self.loadAction.bind(this))

  this.play = function() {
    var self = this;
    function run() {
      if (!window.fez.control.playing()) return;

      for (var name in self.actionMap) {
        var action = self.actionMap[name];
        if (action.state()) {
          action.offsetX += action.imgW;
          action.el.style.backgroundPositionX = pixelize(action.offsetX);
          action.el.style.backgroundPositionY = pixelize(-action.yo);
        } else {
          action.offsetX = 1;
        }

        if (action.offsetX >= action.imgW * action.count) {
          action.offsetX = 1; // FIXME
        }
      }

    }
    this.runFlag = setInterval(run.bind(this), 50);
  };

  this.stop = function(action) {
    action.offsetX = 2; // FIXME
    action.el.style.backgroundPositionX = action.x;
    action.el.style.backgroundPositionY = action.y;
    clearInterval(this.runFlag);
  };

  this.play();

}

function pixelize(value) {
  return value + 'px';
}

module.exports = Sprite;