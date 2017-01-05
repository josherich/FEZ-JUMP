window.requestAnimationFrame = window.requestAnimationFrame || window.mozRequestAnimationFrame ||
                              window.webkitRequestAnimationFrame || window.msRequestAnimationFrame;


function updatePerspective() {
  var ym = 0;
  var players = window.fez.players;
  players.map(function(player) {
    ym += player.y * 290 / 455 - 130;
  })
  window.fez.boxEl.style.top = (ym / players.length) + 'px';
};

function run() {
  var players = window.fez.players;
  var steps = window.fez.steps;
  var poop = window.fez.poop;

  function client_move() {
    if (!window.fez.control.playing()) return;
    players.map(function(player) {
      player.move();
    });
    steps.move();
    poop.move();
  }

  function client_draw() {
    if (!window.fez.control.playing()) return;
    players.map(function(player) {
      player.draw();
    });

    steps.draw();
    poop.draw();
    updatePerspective();
  }

  function server_move() {

  }

  if (this.server) {
    this.server_move();
  } else {
    this.client_move();
    this.client_draw();
  }

  requestAnimationFrame(run);
}

// run
requestAnimationFrame(run);