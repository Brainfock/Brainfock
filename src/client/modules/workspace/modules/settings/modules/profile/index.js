module.exports = { // eslint-disable-line no-undef
  path: 'profile',
  getComponent(location, cb) {

    if (process.env.IS_BROWSER) {
      require.ensure([], (require) => {
        cb(null, require('./Profile'));
      });
    } else {
      cb(null, require('./Profile'));
    }
  }
};
