module.exports = {
  path: '/workspaces/:namespace',
  //
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
        cb(null, require('./pages/Home'))
      })
    } else {
      cb(null, require('./pages/Home'));
    }
  },

  getChildRoutes(location, cb) {

    if (process.env.IS_BROWSER)
      require.ensure([], (require) => {
        cb(null, require('./modules/settings'))
      })
    else cb(null, [
      require('./modules/settings'),
    ])

    //const UserModule = (process.env.IS_BROWSER)
    //  ? require('react-router-proxy?!./modules/user')
    //  : require('./modules/user');
    //
    //cb(null, [
    //  UserModule,
    //])
  },

}