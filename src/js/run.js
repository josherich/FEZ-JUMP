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
  if (window.fez.control.playing()) {
    players.map(function(player) {
      player.move();
    });
    steps.move();
    poop.move();

    players.map(function(player) {
      player.draw();
    });

    steps.draw();
    poop.draw();
    updatePerspective();
  }

  requestAnimationFrame(run);
}

// run
requestAnimationFrame(run);