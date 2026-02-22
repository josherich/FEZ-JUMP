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
  var diamond = window.fez.diamond;

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

  // , rotate clockwise
  if (ev.keyCode === 188 && !running) {
    running = true;
    setTimeout(function(){
      running = false;
    }, 900);
    box.rotateClockwise(function(currentFace, prevFace) {
      currentFace.appendChild(player1.el);
      currentFace.appendChild(player2.el);
      currentFace.appendChild(diamond.dom);
    });
  }
  // . rotate anti-clockwise 
  if (ev.keyCode === 190 && !running) {
    running = true;
    setTimeout(function(){
      running = false;
    }, 900);
    box.rotateAClockwise(function(currentFace, prevFace) {
      currentFace.appendChild(player1.el);
      currentFace.appendChild(player2.el);
      currentFace.appendChild(diamond.dom);
    })
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

// Mobile scaling: fit game to viewport width
function scaleGame() {
  var wrap = document.querySelector('.wrap');
  if (!wrap) return;
  var gameWidth = 655;
  var gameHeight = 455;
  var scale = Math.min(window.innerWidth / gameWidth, 1);
  if (scale < 1) {
    wrap.style.transform = 'scale(' + scale + ')';
    wrap.style.transformOrigin = 'top center';
    wrap.style.marginTop = '0';
    wrap.style.marginBottom = (gameHeight * scale - gameHeight) + 'px';
  } else {
    wrap.style.transform = '';
    wrap.style.transformOrigin = '';
    wrap.style.marginTop = '';
    wrap.style.marginBottom = '';
  }
}

window.addEventListener('resize', scaleGame);
scaleGame();

// Touch control button bindings
function bindTouchBtn(id, onStart, onEnd) {
  var el = document.getElementById(id);
  if (!el) return;
  el.addEventListener('touchstart', function(e) {
    e.preventDefault();
    onStart();
  }, { passive: false });
  if (onEnd) {
    el.addEventListener('touchend', function(e) {
      e.preventDefault();
      onEnd();
    }, { passive: false });
    el.addEventListener('touchcancel', function(e) {
      e.preventDefault();
      onEnd();
    }, { passive: false });
  }
}

bindTouchBtn('touch-left',
  function() { window.fez.players[0].turnLeft(); },
  function() { window.fez.players[0].left = false; }
);

bindTouchBtn('touch-right',
  function() { window.fez.players[0].turnRight(); },
  function() { window.fez.players[0].right = false; }
);

bindTouchBtn('touch-jump',
  function() { window.fez.players[0].jump = true; },
  function() { window.fez.players[0].jump = false; }
);

bindTouchBtn('touch-shoot',
  function() { window.fez.players[0].shoot(); },
  null
);

bindTouchBtn('touch-rotate-cw', function() {
  if (running) return;
  var player1 = window.fez.players[0];
  var player2 = window.fez.players[1];
  var box = window.fez.box;
  var diamond = window.fez.diamond;
  running = true;
  setTimeout(function() { running = false; }, 900);
  box.rotateClockwise(function(currentFace) {
    currentFace.appendChild(player1.el);
    currentFace.appendChild(player2.el);
    currentFace.appendChild(diamond.dom);
  });
}, null);

bindTouchBtn('touch-rotate-ccw', function() {
  if (running) return;
  var player1 = window.fez.players[0];
  var player2 = window.fez.players[1];
  var box = window.fez.box;
  var diamond = window.fez.diamond;
  running = true;
  setTimeout(function() { running = false; }, 900);
  box.rotateAClockwise(function(currentFace) {
    currentFace.appendChild(player1.el);
    currentFace.appendChild(player2.el);
    currentFace.appendChild(diamond.dom);
  });
}, null);