/**
 * Brainfock, <http://www.brainfock.org>
 *
 * Copyright (C) 2015-present Sergii Gamaiunov <hello@webkadabra.com>
 * All rights reserved.
 *
 * This source code is licensed under the GPL-style license found in the
 * LICENSE file in the root directory of this source tree.
 */
import Component from 'react-addons-pure-render-mixin';
import React from 'react';
import {IconMenu, FloatingActionButton} from 'material-ui';
import MenuItem from 'material-ui/MenuItem';

export default class QuickAdd extends React.Component {

  static propTypes = {
    //msg: React.PropTypes.object.isRequired,
    //pathname: React.PropTypes.string.isRequired,
    //viewer: React.PropTypes.object
  }

  constructor(props) {
    super(props);
    this.state = {
      sidebarOpen: false
    };
  }

  onSetSidebarOpen(open) {
    this.setState({sidebarOpen: open});
  }

  renderUsersList() {
    return <h4>[in development]</h4>;
  }

  render() {
    return (
      <div style={{
        position:'fixed',
        bottom: 10,
        right: 10,
        zIndex:99999999999
      }}>
        <IconMenu
          iconButtonElement={
            <FloatingActionButton
              iconClassName="fa fa-plus"
              mini
              onClick={()=>{this.refs.sideBar.toggle();}}
              primary
              style={{
                position:'fixed',
                bottom: 10,
                right: 10
              }}
              />
          }
          menuStyle={{
            position:'fixed',
            bottom: 10,
            right: 10
          }}
          openDirection='top-left'
          style={{
            position:'relative',
            bottom: 10,
            right: 10
          }}
          >
          <MenuItem primaryText="Opportunity" />
          <MenuItem primaryText="Task" />
          <MenuItem primaryText="Discussion" />
          <MenuItem primaryText="Message" />
        </IconMenu>
      </div>
    );
  }
}
