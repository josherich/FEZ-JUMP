var Sprite = function(el, options) {
  this.imageUrl = options.url;
  this.el = el;
  this.imgW = options.imgW;
  this.imgH = options.imgH;
  this.el.style.width = this.imgW + 'px';
  this.el.style.height = this.imgW + 'px';
  this.count = options.count;
  this.offsetX = 0;

  this.setFirstFrame = function() {
    this.el.style.backgroundImage = 'url("./images/jump.png")';
    // this.el.style.backgroundSize = '768px';
    this.el.style.backgroundRepeat = 'none';
    this.el.style.backgroundPositionX = 0;
    this.el.style.backgroundPositionY = 0;
  }

  this.play = function() {
    function run() {
      this.offsetX += this.imgW;
      this.el.style.backgroundPositionX = this.offsetX + 'px';
      if (this.offsetX >= this.imgW * this.count) {
        this.offsetX = 0;
      }
    }
    this.runFlag = setInterval(run.bind(this), 60);
  };

  this.stop = function() {
    this.offset = 0;
    this.el.style.backgroundPositionX = 0 + 'px';
    clearInterval(this.runFlag);
  };

  this.setFirstFrame();
  this.play();

}

module.exports = Sprite;