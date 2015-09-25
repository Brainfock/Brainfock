var loopback = require('loopback');
var boot = require('loopback-boot');

var app = module.exports = loopback();
console.log('Trying to boot server...');

app.start = function() {
  // start the web server
  var server = app.listen(function() {
    app.emit('started', server);
    console.log('Web server listening at: %s', app.get('url'));
  });
  return server;
};

app.use(loopback.cookieParser("SECRET"));

var bodyParser= require('body-parser');

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

//s Bootstrap the application, configure models, datasources and middleware.
// Sub-apps like REST API are mounted via boot scripts.
boot(app, __dirname, function(err) {
  if (err) throw err;
  // start the server if `$ node server.js`
  if (require.main === module) {
    console.log('Starting App...');
    app.start();
  }
});
