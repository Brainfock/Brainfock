/**
 * Brainfock - Community & Business Management Solution
 *
 * @link http://www.brainfock.org
 * @copyright Copyright (c) 2015 Sergii Gamaiunov <hello@webkadabra.com>
 */
module.exports = {

  path: ':userId',

  getComponent(location, cb) {
    if (process.env.IS_BROWSER) {
      require.ensure([], (require) => {
        cb(null, require('./components/View'))
      })
    } else {
      cb(null, require('./components/View'));
    }
  },

  // this also works:
  //getComponent(location, cb) {
  //  if (process.env.IS_BROWSER) {
  //    cb(null, require('react-router-proxy?!./components/View'))
  //  } else {
  //    cb(null, require('./components/View'));
  //  }
  //},
}