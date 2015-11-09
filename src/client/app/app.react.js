/**
 * Brainfock - Community & Business Management Solution
 *
 * @link http://www.brainfock.org
 * @copyright Copyright (c) 2015 Sergii Gamaiunov <hello@webkadabra.com>
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
  Styles,
  Avatar,
  RaisedButton
} from 'material-ui';

import './app.styl';
import '../../less/main.less';

import {mapDispatchToProps, mapStateToProps} from '../../common';
import AppSideNav from './components/app-left-nav';

const ThemeManager = Styles.ThemeManager;
const DefaultRawTheme = Styles.LightRawTheme;

@connect(mapStateToProps, mapDispatchToProps)
class App extends Component {

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
    newMuiTheme.appBar.height = 58;

    newMuiTheme.raisedButton.primaryColor = '#4b8cf7';
    newMuiTheme.rawTheme.spacing.desktopKeylineIncrement = 58;

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
          title="Brainfock"
          zDepth={0}
          />
        <AppSideNav ref="leftNav" {...this.props} />
        <div style={{
          paddingTop:this.state.muiTheme.rawTheme.spacing.desktopKeylineIncrement
        }}>
        {React.cloneElement(children, props)}
        </div>
      </AppCanvas>
    );
  }

  _onLeftIconButtonTouchTap() {
    if (this.refs.leftNav)
      this.refs.leftNav.toggle();
  }
}

export default App;
