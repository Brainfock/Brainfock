/**
 * Brainfock, <http://www.brainfock.org>
 *
 * Copyright (C) 2015-present Sergii Gamaiunov <hello@webkadabra.com>
 * All rights reserved.
 *
 * This source code is licensed under the GPL-style license found in the
 * LICENSE file in the root directory of this source tree.
 */
import Component from 'react-pure-render/component';
import React, {PropTypes} from 'react';
import {connect} from 'react-redux';
import {Link} from 'react-router';
import io from 'socket.io-client';
import {
  ButtonToolbar,
  Overlay,
  Popover,
  Grid,
  Row,
  Col
} from 'react-bootstrap';
import {
  AppCanvas,
  AppBar,
  DropDownMenu,
  Styles,
  Avatar,
  RaisedButton,
  TextField
} from 'material-ui';

import './app.styl';
import '../../less/main.less';

import {mapDispatchToProps, mapStateToProps} from '../../common';
import AppSideNav from './components/app-left-nav';
import Chat from '../components/chat/Chat';
import QuickAdd from './components/QuickAdd';

const ThemeManager = Styles.ThemeManager;
const DefaultRawTheme = Styles.LightRawTheme;

export class App extends Component {

  static propTypes = {
    actions: PropTypes.object.isRequired,
    app: PropTypes.object.isRequired,
    children: PropTypes.any,
    history: PropTypes.object.isRequired,
    location: PropTypes.object.isRequired,
    msg: PropTypes.object.isRequired,
    users: PropTypes.object.isRequired
  };

  static childContextTypes = {
    muiTheme: React.PropTypes.object
  };

  getChildContext() {
    return {
      muiTheme: this.state.muiTheme
    };
  }

  constructor(args) {
    super(args);
    this.state = {
      showUserMenu: false,
      muiTheme: ThemeManager.getMuiTheme(DefaultRawTheme)
    };
  }

  componentWillMount() {
    // socket connection must be created during willMount, so io is available when rendering
    if (process.env.IS_BROWSER && !this.io) {
      const host = this.props.app.baseUrl;

      if (!this.props.app.baseUrl) {
        this.props.actions.appWarn('[BFK] missing `baseUrl` config value, check your `server/config.json` and environment settings.');
      }

      // TODO: move to actions e.g. appActions.setupIo((this.props.users.viewer && this.props.users.viewer.authToken) ? this.props.users.viewer.authToken : null);
      // TODO: SSL option
      this.io = io(host, this.props.users.viewer ? {
        query: 'auth_token=' + this.props.users.viewer.authToken,
        forceNew: true,
        'force new connection': true
      } : {});

      this.io.on('connect', function() {
        //console.log('[BFK] sockets connection established');

        if (!this.ioSubscribed) {
          this.ioSubscribed = true;
          this.io.on('new-comment', function (data) {
            this.props.actions.catchComment(data.data);
          }.bind(this));
        }

      }.bind(this));

      this.io.on('authenticated', function() {
        //console.log('[BFK] sockets authenticated');
      });
      this.io.on('unauthorized', function() {
        //console.log('[BFK] could not authenticate user');
      });

      this.io.on('close', function() {
        //console.log('[BFK] disconnected from sockets');
      });
    } else {
      this.io = {};
    }

    // Overriding Theme Variables, see http://material-ui.com/#/customization/themes

    let newMuiTheme = this.state.muiTheme;

    newMuiTheme.appBar.color = '#FBFBFB';
    newMuiTheme.appBar.textColor = '#3E3E3E';

    newMuiTheme.raisedButton.primaryColor = '#4b8cf7';

    this.setState({
      muiTheme: newMuiTheme
    });
  }

  render() {
    // Use location pathname to ensure header is rerendered on url change, so
    // links update their active className.
    const {children, ...props} = this.props;
    props.io = this.io;
    const {location: {pathname}, msg, users: {viewer}} = this.props;

    let rightElement;


    let sectionTitle = this.props.app.activeSectionLabel || 'Brainfock';
    if (this.props.app.activeSectionLabel && this.props.app.activeSubSectionLabel) {
      sectionTitle = `${this.props.app.activeSectionLabel} » ${this.props.app.activeSubSectionLabel}`
    }
    if (viewer && viewer.username) {
      // TODO: use avatar instead when available
      rightElement = (
        <ButtonToolbar style={{marginRight:10}}>
          <Avatar
            onClick={e => this.setState({target: e.target, showUserMenu: !this.state.showUserMenu})}
            >
            {viewer.username.charAt(0)}
          </Avatar>

          <Overlay
            container={this}
            containerPadding={20}
            placement="bottom"
            show={this.state.showUserMenu}
            target={()=> React.findDOMNode(this.state.target)}
            >
            <Popover id="signin">

              <Grid fluid>
                <Row className="show-grid">
                  <Col md={3} xs={12}>
                    <Avatar>
                      {viewer.username.charAt(0)}
                    </Avatar>
                  </Col>
                  <Col md={9} xs={6}>
                    <span>{msg.app.header.user.welcome} <strong>{viewer.username}</strong> ({viewer.email})</span>
                  </Col>
                </Row>
              </Grid>
              <hr />
              <RaisedButton
                label="Sign out"
                onClick={e => {
                  this.props.actions.logout(viewer.authToken);
                  this.setState({showUserMenu: !this.state.showUserMenu});
                  this.props.history.pushState(null, '/login/');
                }}
                style={{marginRight:10}}
                />
              <RaisedButton
                label={msg.app.header.user.accountButton.label}
                onClick={e => {
                  this.setState({showUserMenu: !this.state.showUserMenu});
                  this.props.history.pushState(null, '/me/');
                }}
                primary
                />
            </Popover>
          </Overlay>
        </ButtonToolbar>
      );
    } else {
      rightElement = (
        <div style={{
          margin:'12px 10px 0 0'
        }}>
          <Link to="/login"><i className="fa fa-lg fa-sign-in"></i> {msg.app.header.user.signinButton.label}</Link>
        </div>
      );
    }
    let menuItems = [
      { payload: '1', text: 'Never' },
      { payload: '2', text: 'Every Night' },
      { payload: '3', text: 'Weeknights' },
      { payload: '4', text: 'Weekends' },
      { payload: '5', text: 'Weekly' },
    ];

    /*title={
     <div>
     <h3 style={{
     margin:0,
     padding:0,
     lineHeight:`${this.state.muiTheme.appBar.height}px`,
     }}>
     Brainfock
     <DropDownMenu menuItems={menuItems} />

     <TextField style={{position:'absolute',left:'37%'}}/>
     </h3>
     </div>} */

    // todo: looks like we may remove `onLeftIconButtonTouchTap` event
    return (
      <AppCanvas predefinedLayout={1}>
        <AppBar
          autoWidth={false}
          iconElementRight={rightElement}
          onLeftIconButtonClick={this._onLeftIconButtonTouchTap.bind(this)}
          onLeftIconButtonTouchTap={this._onLeftIconButtonTouchTap.bind(this)}
          pathname={pathname}
          style={{borderBottom:'1px solid #E0E0E0'}}
          title={this.props.workspace.active.data.name}
          title={this.props.app.activeSectionLabel || 'Brainfock'}
          title={sectionTitle}
          __title="Brainfock"
          _title={<DropDownMenu menuItems={menuItems} />}
          zDepth={0}
          >
        </AppBar>
        <AppSideNav ref="leftNav" {...this.props} />

        <div style={{
          paddingTop:this.state.muiTheme.rawTheme.spacing.desktopKeylineIncrement
        }}>
          {/* <Chat  /> */}
          <QuickAdd />
          {React.cloneElement(children, props)}
        </div>
      </AppCanvas>
    );
  }

  _onLeftIconButtonTouchTap() {
    if (this.refs.leftNav)
      this.refs.leftNav.toggle();
  }
};

@connect(mapStateToProps, mapDispatchToProps)
export default class extends App{};
