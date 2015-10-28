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

import Component from 'react-pure-render/component';
import React, {PropTypes} from 'react';
import Router, {Route, Redirect, Link} from 'react-router';
import mui from 'material-ui';

// TODO: i18n
// TODO: add ability to reorder & add custom elements
var menuItems = [
  {
    // matching any of these routes will make this link "active"
    //routes: ['projects','project'],
    // actual router route:
    route: '/projects',
    params:{},
    text: 'Projects',
  },
  // { route: '/issues', params:{}, text: 'Issues' },
  { route: '/boards', params:{}, text: 'Boards' },
  { route: '/wiki/Index', params:{uid:'Index'}, text: 'Wiki' },
  { type: mui.MenuItem.Types.SUBHEADER, text: 'Resources' },
  // Link to Brainfock guides in global wiki:
  { route: '/wiki/BFK_Guide',
    text: 'Brainfock Help' },
  // TODO: hide from non-admin users
  { type: mui.MenuItem.Types.SUBHEADER, text: ' '},
  { route: '/admin', params:{}, text: <span>System Admin <i className="fa fa-cog"></i></span>},
  { route: '/workspaces/create', params:{}, text: "Create Workspace"},
  // Link to Brainfock website & version, don't remove
  { route: '/wiki/Brainfock:About',
    text: <div style={{
      position: 'absolute',
      bottom: 0,
      marginLeft: '-24px',
      fontSize:'11px'
    }}>
      <img src="/assets/img/logo_white_bg.png"
           style={{
                  height:"50px"
               }}
           alt={VERSION_FULL}
           title={VERSION_FULL}
        />
      Powered by {VERSION_FULL}</div>
  },
];

/**
 * AppLeftNav - component representing main off-screen navigation of application
 *
 * @author sergii gamaiunov <hello@webkadabra.com>
 */
export default class AppLeftNav extends Component {

  static propTypes = {
    history: PropTypes.object,
    location: PropTypes.object
  };
  constructor(props) {
    super(props);
    this.state = {
      selectedIndex: null
    };
  }

  render() {
    const header = <div className="logo" onClick={this._onHeaderClick}>Brainfock</div>;
    return (
      <mui.LeftNav
        docked={this.props.location.pathname === '/'}
        header={header}
        isInitiallyOpen={this.props.location.pathname !== '/'}
        menuItems={menuItems}
        onChange={this._onLeftNavChange.bind(this)}
        ref="leftNav"
        selectedIndex={this._getSelectedIndex()}
        />
    );
  }

  toggle() {
    this.refs.leftNav.toggle();
  }

  /**
   * helper to correctly highlight LeftNav's active item: matches agains single "route" parameter of item, or anyone
   * of provided array of "routes"
   * @returns {number}
   * @private
   */
  _getSelectedIndex() {
    // turn this off until we can make it so clicking active link still does the navigation
    return;

    let currentItem;
    for (let i = menuItems.length - 1; i >= 0; i--) {
      currentItem = menuItems[i];
      // multiple routes match support:
      if (currentItem.routes) {
        // see if any *one* route is valid
        for (let i2 = currentItem.routes.length - 1; i2 >= 0; i2--) {
          let _routeName = currentItem.routes[i2];
          if (this.props.history.isActive(_routeName, (currentItem.params ? currentItem.params : []))) return i;

        }
      }
      if (currentItem.route && this.props.history.isActive(currentItem.route, (currentItem.params ? currentItem.params: []))) return i;
    }
  }

  /**
   * fired only when LeftNav has changed selected item
   * 
   * @param e
   * @param key
   * @param payload
   * @private
   */
  _onLeftNavChange(e, key, payload) {
    this.props.history.pushState(null, payload.route);
    this.refs.leftNav.close();
    //this.transitionTo(payload.route, (payload.params?payload.params:[]));
  }

  _onHeaderClick() {
    // uncomment to send user somewhere:
    //this.transitionTo('root');
    // close panel
    this.refs.leftNav.close();
  }
};

module.exports = AppLeftNav;
