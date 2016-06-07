module.exports = function mountLoopBackExplorer(server) {
  let explorer;
  try {
    explorer = require('loopback-explorer');
  } catch (err) {
    // Print the message only when the app was started via `server.listen()`.
    // Do not print any message when the project is used as a component.
    server.once('started', function(baseUrl) {
      console.log(
        'Run `npm install loopback-explorer` to enable the LoopBack explorer'
      );
    });
    return;
  }

  let restApiRoot = server.get('restApiRoot');
  let explorerApp = explorer(server, {basePath: restApiRoot});
  server.use('/explorer', explorerApp);
  server.once('started', function() {
    let baseUrl = server.get('url').replace(/\/$/, '');
    // express 4.x (loopback 2.x) uses `mountpath`
    // express 3.x (loopback 1.x) uses `route`
    let explorerPath = explorerApp.mountpath || explorerApp.route;
    console.log('Browse your REST API at %s%s', baseUrl, explorerPath);
  });
};
