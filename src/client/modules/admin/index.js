/**
 * Admin module router configuration
 *
 * @category client/modules/admin
 * @type {{path: string, getComponent, getChildRoutes}}
 */
module.exports = {
  path: 'admin',

  getComponent(location, cb) {
    if (process.env.IS_BROWSER) {
      require.ensure([], (require) => {
        cb(null, require('./pages/AdminHome'))
      })
    } else {
      cb(null, require('./pages/AdminHome'));
    }
  },

  getChildRoutes(location, cb) {
    if (process.env.IS_BROWSER)
      require.ensure([], (require) => {[
          cb(null, require('./modules/users')),
          cb(null, require('./modules/schemes')),
      ]})
    else
      cb(null, [
        require('./modules/users'),
        require('./modules/schemes'),
      ]);
  },
}