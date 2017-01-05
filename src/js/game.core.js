window.$ = require('jquery');

var Box = require('./box');
var Steps = require('./steps');
var Poop = require('./poop');

window.fez = {};

window.fez.boxEl = window.document.querySelectorAll('.box')[0];
window.fez.boxEl.style.webkitAnimationName = 'cspin1';
window.fez.boxEl.style.position = 'fixed';
window.fez.box = new Box();

// require('./players');

window.fez.poop = new Poop();
window.fez.steps = new Steps()

require('./control');

// require('./run');

// require('./client');

Number.prototype.fixed = function(n) { n = n || 3; return parseFloat(this.toFixed(n)); };

var FEZ = function(game_instance) {
  this.instance = game_instance;
  this.server = this.instance !== undefined;

  if (this.server) {
    this.players = {
      self: new game_player(this, this.instance.player_host),
      other: new game_player(this, this.instance.player_client)
    };
  } else {
    this.players = {
      self: new game_player(this),
      other: new game_player(this)
    };

    this.ghosts = {
      server_pos_self: new game_player(this),

      server_pos_other: new game_player(this),

      pos_other: new game_palyer(this)
    };

    this.ghosts.pos_other.state = 'dest_pos';

    this.ghosts.pos_other.info_color = 'rgba(255,255,255,0.1)';

    this.ghosts.server_pos_self.info_color = 'rgba(255,255,255,0.2)';
    this.ghosts.server_pos_other.info_color = 'rgba(255,255,255,0.2)';

    this.ghosts.server_pos_self.state = 'server_pos';
    this.ghosts.server_pos_other.state = 'server_pos';

    // todo: ghost position init
  }
};

FEZ.prototype.update = function(t) {
  this.dt = this.lastframetime ? ( (t - this.lastframetime) / 1000.0).fixed() : 0.016;

  this.lastframetime = t;

  if (this.server) {
    this.server_update();
  } else {
    this.client_update();
  }

  this.updateid = window.requestAnimationFrame(this.update.bind(this), this.viewport);
};

module.exports = FEZ;