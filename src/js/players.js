var Player = require('./player');
window.fez.players = [];
window.fez.players.push(new Player({
  id: 1,
  birth: {x:0, y:0}
}));
window.fez.players.push(new Player({
  id: 2,
  birth: {x:640, y:0}
}));