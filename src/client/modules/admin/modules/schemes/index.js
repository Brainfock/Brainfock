module.exports = {
  path: 'schemes',

  getComponent(location, cb) {

    const Component = (process.env.IS_BROWSER)
      ? require('react-router-proxy?!./GroupSchemes.page.js')
      : require('./GroupSchemes.page.js');

    cb(null, Component);
  },

  getChildRoutes(location, cb) {

    // currently, this is working better than 'react-router-proxy-loader'
    if(process.env.IS_BROWSER)
      require.ensure([], (require) => {
        [
          cb(null, require('./modules/groupScheme'))
        ]
      })
    else cb(null, [
      require('./modules/groupScheme'),
    ])
  },

}