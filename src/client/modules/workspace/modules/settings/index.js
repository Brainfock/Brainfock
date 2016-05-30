module.exports = {
  path: 'settings',

  getComponent(location, cb) {

    if (process.env.IS_BROWSER) {
      require.ensure([], (require) => {
        cb(null, require('./components/Home'))
      })
    } else {
      cb(null, require('./components/Home'));
    }
  },

  /**
   * profile
   * access control
   */
    getChildRoutes(location, cb) {

    if (process.env.IS_BROWSER)
      require.ensure([], (require) => {
        [
        cb(null, require('./modules/profile'))
        ]
      })
    else cb(null, [
      require('./modules/profile'),
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