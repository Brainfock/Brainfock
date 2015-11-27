/**
 * Brainfock - Community & Business Management Solution
 *
 * @link http://www.brainfock.org
 * @copyright Copyright (c) 2015 Sergii Gamaiunov <hello@webkadabra.com>
 */
module.exports = {
  path: 'workspaces',

  getComponent(location, cb) {
    const Component = (process.env.IS_BROWSER)
      ? require('react-router-proxy?!./components/workspaces.page')
      : require('./components/workspaces.page');

    cb(null, Component);
  },

  getChildRoutes(location, cb) {

    // currently, this is working better than 'react-router-proxy-loader'
    if(process.env.IS_BROWSER)
      require.ensure([], (require) => {
        [
          cb(null, require('./modules/workspace'))
        ]
      })
    else cb(null, [
      require('./modules/workspace'),
    ])
  },

}