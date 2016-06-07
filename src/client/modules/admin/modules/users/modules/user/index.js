/**
 * Brainfock, <http://www.brainfock.org>
 *
 * Copyright (C) 2015-present Sergii Gamaiunov <hello@webkadabra.com>
 * All rights reserved.
 *
 * This source code is licensed under the GPL-style license found in the
 * LICENSE file in the root directory of this source tree.
 */
module.exports = { // eslint-disable-line no-undef

  path: ':userId',

  getComponent(location, cb) {
    if (process.env.IS_BROWSER) {
      require.ensure([], (require) => {
        cb(null, require('./components/View'));
      });
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
};
