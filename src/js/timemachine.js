var TimeMachine = function(getters) {
  this.history = [];
  this.getters = getters;
  this.pointer = 0;
  function throttle (fn, interval) {
    var throttled = false;
    return function() {
      if (throttled) {
        return;
      } else {
        fn()
        throttled = true;
        setTimeout(function(){
          throttled = false;
        }, interval);
      }
    }
  }

  this.log = throttle(function() {
    var record = {};
    var last = this.history[this.history.length - 1];
    this.getters.map(function(getter) {
      record[getter.name] = getter.val();
    });
    if (last && record.x == last.x && record.y == last.y) return;
    if (this.history.length > 200) {
      this.history.shift();
    }
    this.history.push(record);
  }.bind(this), 100);

  this.stepBack = function() {
    if (this.pointer == 0) {
      this.pointer = this.history.length;
      return null;
    }
    this.pointer--;
    return this.history[this.pointer];
  };

  this.stepForward = function() {
    if (this.pointer > this.history.length - 1) {
      return null;
    }
    this.pointer++;
    return this.history[this.pointer];
  };

  this.getTimeline = function() {
    return this.history;
  }
};

module.exports = TimeMachine;