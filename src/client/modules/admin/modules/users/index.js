/**
 * Brainfock - Community & Business Management Solution
 *
 * @link http://www.brainfock.org
 * @copyright Copyright (c) 2015 Sergii Gamaiunov <hello@webkadabra.com>
 */
module.exports = {
  path: 'users',

  getComponent(location, cb) {

    const Component = (process.env.IS_BROWSER)
      ? require('react-router-proxy?!./components/Users')
      : require('./components/Users');

    cb(null, Component);
  },

  getChildRoutes(location, cb) {

    // currently, this is working better than 'react-router-proxy-loader'
    if(process.env.IS_BROWSER)
      require.ensure([], (require) => {
        [
        cb(null, require('./modules/user'))
        ]
      })
    else cb(null, [
      require('./modules/user'),
    ])
  },

}