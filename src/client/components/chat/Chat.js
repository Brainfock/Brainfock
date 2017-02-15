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
import React, {PropTypes} from 'react';
import {TextField, ListItem, List, LeftNav, Avatar,  MenuItem,  FloatingActionButton} from 'material-ui';

export default class ChatWidget extends React.Component {

  static propTypes = {
    msg: PropTypes.object,
    pathname: PropTypes.string,
    viewer: PropTypes.object
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
  /*
   <FloatingActionButton
   iconClassName=""
   mini

   >
   <IconButton onClick={()=>{this.setState({sidebarOpen:true})}}
   onTouchTap={()=>{this.setState({sidebarOpen:true})}}
   onTouchtap={()=>{this.setState({sidebarOpen:true})}} iconClassName="fa fa-list" tooltip="GitHub"/>
   </FloatingActionButton>
   */
  render() {
    return (
      <div>
        <FloatingActionButton
          iconClassName="fa fa-comments"
          mini
          onClick={()=>{this.refs.sideBar.toggle();}}

          secondary
          style={{
            position:'fixed',
            bottom: 10,
            right: 10
          }}
          />

        <LeftNav
          docked={false}
          openRight
          ref="sideBar"
          style={{
            position: 'relative',
          }} >
          <MenuItem index={0}>Speak up!</MenuItem>
          <MenuItem index={1}><a href="/me/chatConfig">Settings</a></MenuItem>

          <List subheader="Previous chats">
            <ListItem
              leftAvatar={<Avatar src="https://randomuser.me/api/portraits/med/women/94.jpg" />}
              primaryText="Annie Hoffman"
               />
            <ListItem
              leftAvatar={<Avatar src="https://randomuser.me/api/portraits/med/women/20.jpg" />}
              primaryText="Felecia Lambert"
              />
          </List>
          <div style={{
            position: 'absolute',
            bottom: 0,
            left:10,
            right: '20px'
          }}>
            <TextField placeholder='Look for anything (TODO)' />
          </div>
        </LeftNav>
      </div>
    );
  }
}
