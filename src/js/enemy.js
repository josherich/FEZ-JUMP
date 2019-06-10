function Enemy(step) {
  this.size = 20;
  this.r = this.size / 2;

  this.step = step;

  this.gap = 2;

  this.el = document.createElement('div');
  this.el.classList.add('bad');
  this.step.face.appendChild(this.el);
z
  this.x = this.step.w - this.size;
  this.x *= Math.random();
  this.x += this.r;

  this.maxVx = 1;
  this.vx = (Math.random() - 0.5);
  this.vx *= this.maxVx * 2;

  this.checkPlayerTouch = function() {
    if (this.dying)
      return;
    var player = window.fez.player;
    var x = this.step.getX();
    var y = this.step.getY();
    x += this.x;
    y -= this.r + this.gap;

    var x2 = player.x;
    var y2 = player.y;

    var diffX = x - x2;
    var diffY = y - y2;
    var dist = Math.sqrt(diffX * diffX + diffY * diffY);
    if (dist < player.r + this.r) {
      player.dead = true;
    }
  };

  this.move = function() {
    this.checkPlayerTouch();
    this.x += this.vx;
    if (this.x < this.r) {
      this.x = this.r;
      this.vx = -this.vx;
    }
    var maxX = this.step.w - this.r;
    if (this.x > maxX) {
      this.x = maxX;
      this.vx = -this.vx;
    }
  };

  this.draw = function() {
    var x = this.step.getX();
    var y = this.step.getY();
    x += this.x;
    y += this.r;
    // this.el.innerText = this.x; //testing
    this.el.style.webkitTransform = 'translate(' + x + 'px, -' + y + 'px)';
  }
}

module.exports = Enemy;