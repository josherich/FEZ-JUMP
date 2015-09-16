var running = false;

window.fez._state = {
  playing: true
};

window.fez.control = {
  playing: function() {
    return window.fez._state.playing;
  },
  stop: function() {
    window.fez._state.playing = false;
  },
  play: function() {
    window.fez._state.playing = true;
  },
  toggle: function() {
    window.fez.players[1].timeMode = false;
    window.fez.players[1].removeTimeline();

    window.fez._state.playing = !window.fez._state.playing;
  }
};


window.addEventListener('keydown', function(ev) {
  // move player
  var player1 = window.fez.players[0];
  var player2 = window.fez.players[1];
  var box = window.fez.box;

  // player1 - a - left
  if (ev.keyCode == 65 && !running) {
    player1.turnLeft();
    ev.preventDefault();
  }
  // player1 - d - right
  if (ev.keyCode == 68 && !running) {
    player1.turnRight();
    ev.preventDefault();
  }
  // player1 - w - jump
  if (ev.keyCode == 87 && !running) {
    player1.jump = true;
    ev.preventDefault();
  }
  // player1 - f - shoot
  if (ev.keyCode === 70) {
    player1.shoot();
  }

  // player2 - left - left
  if (ev.keyCode == 37 && !running) {
    player2.turnLeft();
    ev.preventDefault();
  }
  // player2 - right - right
  if (ev.keyCode == 39 && !running) {
    player2.turnRight();
    ev.preventDefault();
  }
  // player2 - up - jump
  if (ev.keyCode == 38 && !running) {
    player2.jump = true;
    ev.preventDefault();
  }


  
  // if (ev.keyCode == 38 && !running) {
  //   player2.goForward();
  //   ev.preventDefault();
  // }

  // if (ev.keyCode == 40 && !running) {
  //   player2.goBack();
  //   ev.preventDefault();
  // }

  // player2 - / - shoot
  if (ev.keyCode === 191) {
    player2.shoot();
  }

  // player2 - j - step back
  if (ev.keyCode == 74) {
    player2.stepBack();
  }

  // player2 - k - step forward
  if (ev.keyCode == 75) {
    player2.stepForward();
  }

  // player2 - shift - draw timeline
  if (ev.keyCode == 16) {
    player2.drawTimeline();
  }

  // rotate right
  if (ev.keyCode === 188 && !running) {
    running = true;
    setTimeout(function(){
      running = false;
    }, 900);
    box.acw();
  }
  // rotate left 
  if (ev.keyCode === 190 && !running) {
    running = true;
    setTimeout(function(){
      running = false;
    }, 900);
    box.cw()
  }

  // world - space - toggle play/pause
  if (ev.keyCode === 32) {
    window.fez.control.toggle();
  }
}, false);

window.addEventListener('keyup', function(ev) {
  var player1 = window.fez.players[0];
  var player2 = window.fez.players[1];
  var box = window.fez.box;

  if (ev.keyCode == 65 && !running) {
    player1.left = false;
    ev.preventDefault();
  }
  if (ev.keyCode == 68 && !running) {
    player1.right = false;
    ev.preventDefault();
  }
  if (ev.keyCode == 87 && !running) {
    player1.jump = false;
    ev.preventDefault();
  }

  if (ev.keyCode == 37 && !running) {
    player2.left = false;
    ev.preventDefault();
  }
  if (ev.keyCode == 39 && !running) {
    player2.right = false;
    ev.preventDefault();
  }
  if (ev.keyCode == 38 && !running) {
    player2.jump = false;
    ev.preventDefault();
  }
  // if (ev.keyCode == 38 && !running) {
  //   player2.forward = false;
  //   ev.preventDefault();
  // }
  // if (ev.keyCode == 40 && !running) {
  //   player2.backward = false;
  //   ev.preventDefault();
  // }
  // console.log(box.curFace);
}, false);