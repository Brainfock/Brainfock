import frontend from '../frontend';

module.exports = function(server) {
  var restApiRoot = server.get('restApiRoot');

  server.use(restApiRoot, server.loopback.rest());

  server.get('/status', function(req, res) {
    let baseUrl = server.get('url').replace(/\/$/, '');

    res.send({
      pong:Date.now(),
      baseUrl:baseUrl,
      host:server.get('host'),
      port:server.get('port'),
      publicHost:server.get('publicHost'),
    });
  });

  server.use(frontend);
};
