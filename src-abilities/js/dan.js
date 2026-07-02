var Particle = function(x, y, angle, speed, size) {
  this.speed = speed;
  this.size = size;
  this.pos = {
    x: x || 0,
    y: y || 0
  };
  
  var radians = angle * Math.PI / 180;

  this.vel = {

      x: Math.cos(radians) * speed,
      y: -Math.sin(radians) * speed
  };

};

var Particles = function(options) {
  var defaults = {
    rate: 50,
    minAngle: 0,
    angleRange: 360,
    minSpeed: 0,
    speedRange: 15,
    minSize: 3,
    sizeRange: 2
  };

  options = _.inherit(options, defaults);
  this.n = options.n;
  this.particles = [];
  
  this.init = function() {
    for (var i = 0; i < this.n; i++) {
      this.particles.push(new Particle());
    }
  };

  this.getAngle0 = function() {

  };

  this.getSpeed0 = function() {

  };

  this.getSize = function() {

  };

  this.draw = function() {

  };

  this.move = function() {

  };
}