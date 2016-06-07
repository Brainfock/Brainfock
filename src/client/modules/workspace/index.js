module.exports = { // eslint-disable-line no-undef
  path: '/workspaces/:namespace',

  //getIndexRoute(location, cb) {
  //
  //  const Component = (process.env.IS_BROWSER)
  //    ? require('react-router-proxy?!./components/Users')
  //    : require('./components/Users');
  //
  //  cb(null, Component);
  //},

  getComponent(location, cb) {
    if (process.env.IS_BROWSER) {
      require.ensure([], (require) => {
        cb(null, require('./pages/Home'));
      });
    } else {
      cb(null, require('./pages/Home'));
    }
  },

  getChildRoutes(location, cb) {

    if (process.env.IS_BROWSER)
      require.ensure([], (require) => {
        [
          cb(null, require('./modules/settings')),
          cb(null, require('./modules/members'))
        ];
      });
    else cb(null, [
      require('./modules/settings'),
      require('./modules/members'),
    ]);
  },

};
