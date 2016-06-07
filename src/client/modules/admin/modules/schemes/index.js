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
  path: 'schemes',

  getComponent(location, cb) {

    const Component = (process.env.IS_BROWSER)
      ? require('react-router-proxy?!./GroupSchemes.page.js')
      : require('./GroupSchemes.page.js');

    cb(null, Component);
  },

  getChildRoutes(location, cb) {

    // currently, this is working better than 'react-router-proxy-loader'
    if (process.env.IS_BROWSER)
      require.ensure([], (require) => {
        [
          cb(null, require('./modules/groupScheme'))
        ];
      });
    else cb(null, [
      require('./modules/groupScheme'),
    ]);
  },

};
