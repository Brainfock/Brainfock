/**
 * Brainfock - community & issue management software
 * Copyright (c) 2015, Sergii Gamaiunov (“Webkadabra”)  All rights reserved.
 *
 * This program is free software: you can redistribute it and/or modify
 * it under the terms of the GNU Affero General Public License as
 * published by the Free Software Foundation, either version 3 of the
 * License, or (at your option) any later version.
 *
 * This program is distributed in the hope that it will be useful,
 * but WITHOUT ANY WARRANTY; without even the implied warranty of
 * MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
 * GNU Affero General Public License for more details.
 *
 * You should have received a copy of the GNU Affero General Public License
 * along with this program.  If not, see <http://www.gnu.org/licenses/>.
 *
 * @link http://www.brainfock.com/
 * @copyright Copyright (c) 2015 Sergii Gamaiunov <hello@webkadabra.com>
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
    let styles = this.props.style?this.props.style:{};

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
