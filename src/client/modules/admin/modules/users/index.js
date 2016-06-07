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
  path: 'users',

  getComponent(location, cb) {

    const Component = (process.env.IS_BROWSER)
      ? require('react-router-proxy?!./components/Users')
      : require('./components/Users');

    cb(null, Component);
  },

  getChildRoutes(location, cb) {

    // currently, this is working better than 'react-router-proxy-loader'
    if (process.env.IS_BROWSER)
      require.ensure([], (require) => {
        [
          cb(null, require('./modules/user'))
        ];
      });
    else cb(null, [
      require('./modules/user'),
    ]);
  },

};
