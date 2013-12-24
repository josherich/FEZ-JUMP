var express   = require('express'),
    fs        = require('fs'),
    app       = express(),
    httpProxy = require('http-proxy');

app.use("/", express.static(__dirname + '/'));
app.use("/css", express.static(__dirname + '/css'));

// var proxy = new httpProxy.RoutingProxy();

// app.all('/api/*', function(req, res) {
//   if ( req.xhr ) {
//     // req.url = req.url.substr(4);
//     console.log('api: ' + req.url + '; ' + req.query.toString());

//     proxy.proxyRequest(req, res, {
//       host: '127.0.0.1',
//       port: 9000
//     });
//   }
// });

// app.get("*", function(req, res) {
//   fs.createReadStream("./index.html").pipe(res);
// });

app.use(function(req, res, next){
  console.log('%s %s', req.method, req.url);
  next();
});

app.listen(process.env.PORT || 4000);


