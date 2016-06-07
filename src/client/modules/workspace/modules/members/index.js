module.exports = {
  path: 'members',

  getComponent(location, cb) {

    if (process.env.IS_BROWSER) {
      require.ensure([], (require) => {
        cb(null, require('./components/list'));
      });
    } else {
      cb(null, require('./components/list'));
    }
  },


  __getChildRoutes(location, cb) {

    if (process.env.IS_BROWSER)
      require.ensure([], (require) => {
        [
          cb(null, require('./modules/profile'))
        ];
      });
    else cb(null, [
      require('./modules/profile'),
    ]);

    //const UserModule = (process.env.IS_BROWSER)
    //  ? require('react-router-proxy?!./modules/user')
    //  : require('./modules/user');
    //
    //cb(null, [
    //  UserModule,
    //])
  },

};
