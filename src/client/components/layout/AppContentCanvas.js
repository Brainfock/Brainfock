/**
 * Brainfock, <http://www.brainfock.org>
 *
 * Copyright (C) 2015-present Sergii Gamaiunov <hello@webkadabra.com>
 * All rights reserved.
 *
 * This source code is licensed under the GPL-style license found in the
 * LICENSE file in the root directory of this source tree.
 */
let React = require('react');
import StylePropable from 'material-ui';

/**
 * AppContentCanvas is an attempt to keep code in KISS
 */
let AppContentCanvas = React.createClass({
  mixins: [StylePropable],

  contextTypes: {
    muiTheme: React.PropTypes.object,
  },

  render() {
    let styles = this.props.style ? this.props.style : {};

    let header = this.props.header ?
        <div className="page-header clearfix">{this.props.header}</div> : null;
    return (
        <div style={styles} className="app-content-canvas bfk-browse">
          {header}
          <div className="container-fluid">
          <div className="row">
            {this.props.children}
          </div>
          </div>
        </div>
    );
  },

});

module.exports = AppContentCanvas;
