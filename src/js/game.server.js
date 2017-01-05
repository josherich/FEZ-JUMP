var game_server = module.exports = {
  games: {},
  game_count: 0
},
  UUID = require('node-uuid'),
  verbose = true;

global.window = global.document = global;

require('./game.core.js');

game_server.log = function() {
  if(verbose) console.log.apply(this, arguments);
};

game_server.fake_latency = 0;
game_server.local_time = 0;
game_server._dt = new Date().getTime();
game_server._dte = new Date().getTime();

game_server.messages = [];

setInterval(function() {
  game_server._dt = new Date().getTime() - game_server._dte;
  game_server._dte = new Date().getTime();
  game_server.local_time += game_server._dt / 1000.0;
}, 4);

game_server.onMessage = function(client, message) {
  if (this.fake_latency && message.split('.')[0].substr(0, 1) === 'i') {
    game_server.messages.push({client:client, message:message});

    setTimeout(function(){
        if(game_server.messages.length) {
            game_server._onMessage( game_server.messages[0].client, game_server.messages[0].message );
            game_server.messages.splice(0,1);
        }
    }.bind(this), this.fake_latency);
  } else {
    game_server._onMessage(client, message);
  }
  
};

game_server._onMessage = function(client, message) {
  var parts = message.split('.');
  var type = parts[0];
  var other_client = (client.game.player_host.userid == client.userid) 
    ? client.game.player_client 
    : client.game.player_host;

  if (type === 'i') {
    this.onInput(client, parts);
  } else if (type === 'p') {
    client.send('s.p.' + parts[1]);
  } else if (type === 'c') {
    if (other_client) {
      other_client.send('s.c.' + parts[1]);
    }
  } else if (type === 'l') {
    this.fake_latency = parseFloat(parts[1]);
  }
}

game_server.onInput = function(client, parts) {
  var commands = parts[1].split('-');
  var time = parts[2].replace('-', '.');
  var seq = parts[3];

  if (client && client.game && client.game.gamecore) {
    client.game.gamecore.handle_server_input(client, commands, time, seq);
  }
};

game_server.createGame = function(player) {
  var newgame = {
    id: UUID(),
    host: player,
    client: null,
    count: 1
  };

  this.games[newgame.id] = newgame;

  this.game_count++;

  newgame.gamecore = new game_core(newgame);
  newgame.gamecore.update(new Date().getTime());

  player.send('s.h.' + String(newgame.gamecore.local_time).replace('.', '-'));
  console.log('server host at ' + newgame.gamecore.local_time);
  player.game = newgame;
  player.hosting = true;
  this.log('player ' + player.userid + ' created a game with id ' + player.game.id);
  return newgame;
};

game_server.endGame = function(gameid, useid) {
  var thegame = this.games[gameid];
  if (thegame) {
    thegame.gamecore.stop_update();
    
    if (thegame.player_count > 1) {
      
      if (userid === thegame.player_host.userid) {

        if (thegame.player_client) {
          thegame.player_client.send('s.e');

          this.findGame(thegame.player_client);
        }
      } else {
        if (thegame.player_host) {
          thegame.player_host.send('s.e');
          thegame.player_host.hosting = false;
          this.findGame(thegame.player_host);
        }
      }
    }

    delete this.games[gameid];
    this.game_count--;
    this.log('game removed. now ' + this.game_count + ' games');
  } else {
    this.log('game not found');
  }
};

game_server.startGame = function(game) {
  game.player_client.send('s.j.' + game.player_host.userid);
  game.player_client.game = game;

      //now we tell both that the game is ready to start
      //clients will reset their positions in this case.
  game.player_client.send('s.r.'+ String(game.gamecore.local_time).replace('.','-'));
  game.player_host.send('s.r.'+ String(game.gamecore.local_time).replace('.','-'));
  
      //set this flag, so that the update loop can run it.
  game.active = true;
};

game_server.findGame = function(player) {
  
  this.log('looking for a game. We have : ' + this.game_count);

      //so there are games active,
      //lets see if one needs another player
  if(this.game_count) {
          
      var joined_a_game = false;

          //Check the list of games for an open game
      for(var gameid in this.games) {
              //only care about our own properties.
          if(!this.games.hasOwnProperty(gameid)) continue;
              //get the game we are checking against
          var game_instance = this.games[gameid];

              //If the game is a player short
          if(game_instance.player_count < 2) {

                  //someone wants us to join!
              joined_a_game = true;
                  //increase the player count and store
                  //the player as the client of this game
              game_instance.player_client = player;
              game_instance.gamecore.players.other.instance = player;
              game_instance.player_count++;

                  //start running the game on the server,
                  //which will tell them to respawn/start
              this.startGame(game_instance);

          } //if less than 2 players
      } //for all games

          //now if we didn't join a game,
          //we must create one
      if(!joined_a_game) {

          this.createGame(player);

      } //if no join already

  } else { //if there are any games at all

          //no games? create one!
      this.createGame(player);
  }
}


