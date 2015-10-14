import './app.styl';
import '../../less/main.less';

import Component from 'react-pure-render/component';
import Header from './header.react';
import React, {PropTypes} from 'react';
import {mapDispatchToProps, mapStateToProps} from '@este/common';
import {connect} from 'react-redux';
import {Link} from 'react-router';

let io = require('socket.io-client');

let mui = require('material-ui-io'),
  {MenuItem, LeftNav, AppCanvas, AppBar, IconButton, Menu} = mui,
  Icon = mui.FontIcon;

import {ButtonToolbar, Overlay, Popover, Grid, Row, Col} from 'react-bootstrap';

let Colors = mui.Styles.Colors;
let Typography = mui.Styles.Typography;
let ThemeManager = new mui.Styles.ThemeManager();
let Spacing = require('material-ui/lib/styles/spacing');

import AppSideNav from './components/app-left-nav';

@connect(mapStateToProps, mapDispatchToProps)
export default class App extends Component {

  static propTypes = {
    children: PropTypes.any,
    location: PropTypes.object.isRequired,
    msg: PropTypes.object.isRequired,
    users: PropTypes.object.isRequired,
    app: PropTypes.object.isRequired
  }

  static childContextTypes = {
    muiTheme: React.PropTypes.object
  };

  getChildContext() {
    return {
      muiTheme: ThemeManager.getCurrentTheme()
    }
  }

  constructor(...args) {
    super(...args);
    this.state = { showUserMenu: false };
  }

  componentWillMount()
  {
    // socket connection must be created during willMount, so io is available when rendering
    if(process.env.IS_BROWSER && !this.io)
    {
      const host = this.props.app.baseUrl;

      if(!this.props.app.baseUrl) {
        console.warn('[BFK] missing `baseUrl` config value, check your `server/config.json` and environment settings.');
      }

      // TODO: move to actions e.g. appActions.setupIo((this.props.users.viewer && this.props.users.viewer.authToken) ? this.props.users.viewer.authToken : null);
      // TODO: SSL option
      this.io = io(`http://${host}`, this.props.users.viewer ? {
        query: "auth_token=" + this.props.users.viewer.authToken,
        forceNew: true,
        'force new connection': true,
      } : {});

      this.io.on('connect', function(){
        console.log('[BFK] sockets connection established');

        this.io.on('new-comment',function(data) {
          this.props.actions.catchComment(data.data);
        }.bind(this))

      }.bind(this));

      this.io.on('authenticated', function() {
        console.log('[BFK] sockets authenticated')
      });
      this.io.on('unauthorized', function() {
        console.log('[BFK] could not authenticate user')
      });

      this.io.on('close', function(){
        console.log('[BFK] disconnected from sockets')
      });
    } else {
      this.io = {};
    }

    // Overriding Theme Variables, see http://material-ui.com/#/customization/themes
    ThemeManager.setSpacing({
      desktopKeylineIncrement: 58,
    });
    ThemeManager.setComponentThemes({
      appBar: {
        color: "#FBFBFB",
        textColor: "#3E3E3E",
        height: 58,
      },
      raisedButton: {
        primaryColor: '#4b8cf7',
      },
    });

  }

  render() {

    const currentTheme = ThemeManager.getCurrentTheme();

    // Use location pathname to ensure header is rerendered on url change, so
    // links update their active className.
    const {children, ...props} = this.props;
    props.io = this.io;
    const {location: {pathname}, msg, users: {viewer}} = this.props;

    let rightElement;

    if(viewer && viewer.username) {
      // TODO: use avatar instead when available
      rightElement = (

      <ButtonToolbar style={{marginRight:10}}>
        <mui.Avatar
          onClick={e => this.setState({ target: e.target, showUserMenu: !this.state.showUserMenu })}
          >
            {viewer.username.charAt(0)}
        </mui.Avatar>

        <Overlay
          show={this.state.showUserMenu}
          target={()=> React.findDOMNode(this.state.target)}
          placement="bottom"
          container={this}
          containerPadding={20}
          >
          <Popover _title={<span>Logged in as <strong>{viewer.username}</strong></span>} >

            <Grid fluid={true}>
              <Row className="show-grid">
                <Col xs={12} md={3}>
                  <mui.Avatar>
                    {viewer.username.charAt(0)}
                  </mui.Avatar>
                </Col>
                <Col xs={6} md={9}>
                  <span>Logged in as <strong>{viewer.username}</strong> ({viewer.email})</span>
                </Col>
              </Row>
              </Grid>
            <hr />
            <mui.RaisedButton
              label="Sign out"
              style={{marginRight:10}}
              onClick={e => this.props.actions.logout(viewer.authToken)}
              />
            <mui.RaisedButton
              primary={true}
              label="My account"
              onClick={e => this.props.history.pushState(null, `/me/`)}
              />
          </Popover>
        </Overlay>
      </ButtonToolbar>


        )
    //    <mui.IconMenu
    //  iconButtonElement={<mui.Avatar>{viewer.username.charAt(0)}</mui.Avatar>}
    //closeOnItemTouchTap={false}
    //openDirection='bottom-left'
    //  >
    //  <MenuItem>Logged in as <strong>{viewer.username}</strong></MenuItem>
    //  <MenuItem primaryText="Refresh" />
    //  <MenuItem>
    //    <mui.RaisedButton label="Sign out" className="pull-left" />
    //    <mui.RaisedButton label="My account"  className="pull-right"  />
    //  </MenuItem>
    //  </mui.IconMenu>
    }
    else {
      rightElement = <Link to="/login"><i className="fa fa-lg fa-sign-in"></i> Sign in</Link>
    }

    // todo: looks like we may remove `onLeftIconButtonTouchTap` event
    return (
      <mui.AppCanvas predefinedLayout={1}>
        <mui.AppBar
          autoWidth={false}
          title="Brainfock"
          zDepth={0}
          onLeftIconButtonTouchTap={this._onLeftIconButtonTouchTap.bind(this)}
          onLeftIconButtonClick={this._onLeftIconButtonTouchTap.bind(this)}
          iconElementRight={rightElement}
          style={{
            borderBottom:'1px solid #E0E0E0'
          }}
          />
        <AppSideNav ref="leftNav" {...this.props} />
        { /*<Header msg={msg.app.header} {...{viewer, pathname}} /> */ }
        <div style={{
          paddingTop:currentTheme.spacing.desktopKeylineIncrement
          }}>
        {React.cloneElement(children, props)}
        </div>
      </mui.AppCanvas>
    );
  }

  _onLeftIconButtonTouchTap () {
    if(this.refs.leftNav)
      this.refs.leftNav.toggle();
  }

}
