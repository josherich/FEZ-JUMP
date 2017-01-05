var gameport = process.env.PORT || 4004,
    // io = require('socket.io'),
    express = require('express'),
    verbose = true,
    UUID = require('node-uuid');

var app = express();

var server = app.listen(gameport);
console.log('\t :: Express :: Listening on port ' + gameport );

app.get('/', function(req, res) {
  res.sendfile('/index.html', {root: __dirname});
});

app.get('/*', function(req, res, next) {
  var file = req.params[0];

      //For debugging, we can track what files are requested.
  if(verbose) console.log('\t :: Express :: file requested : ' + file);

      //Send the requesting client the file.
  res.sendfile( __dirname + '/' + file );
});

// var sio = io(app);

// sio.configure(function() {
//   sio.set('log level', 0);
//   sio.set('authorization', function(handshakeDate, callback) {
//     callback(null, true);
//   });
// });

// var game_server = require('./fez.server.js');

// sio.on('connection', function(client) {
//   client.userid = UUID();
//   client.emit('onconnected', { id: client.userid });

//   game_server.findGame(client);

//   console.log('\t socket.io:: player ' + client.userid + ' connected');

//   client.on('message', function(m) {
//     game_server.onMessage(client, m);
//   });

//   client.on('disconnect', function() {
//     console.log('\t socket.io:: client disconnected ' + client.userid + ' ' + client.game_id);
//     if(client.game && client.game.id) {
//       game_server.endGame(client.game.id, client.userid);
//     }
//   });
// });