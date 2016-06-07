import frontend from '../frontend';

module.exports = function(server) {
  let restApiRoot = server.get('restApiRoot');
  server.use(restApiRoot, server.loopback.rest());
  server.use(frontend);
};
