import frontend from '../frontend';

module.exports = function(server) {
  var restApiRoot = server.get('restApiRoot');
  server.use(restApiRoot, server.loopback.rest());
  server.use(frontend);
};
