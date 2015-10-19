import './app.styl';
import '../../less/main.less';

import Component from 'react-pure-render/component';
import Header from './header.react';
import React, {PropTypes} from 'react';
import {mapDispatchToProps, mapStateToProps} from '@este/common';
import {connect} from 'react-redux';
import {Link} from 'react-router';

let io = require('socket.io-client');

import {ButtonToolbar, Overlay, Popover, Grid, Row, Col} from 'react-bootstrap';

const {MenuItem, LeftNav, AppCanvas, AppBar, IconButton, Menu, Styles, FontIcon, Avatar, RaisedButton}
    = require('material-ui');
const {Colors, Spacing, Typography} = Styles;
const ThemeManager = Styles.ThemeManager;
const DefaultRawTheme = Styles.LightRawTheme;

import AppSideNav from './components/app-left-nav';

@connect(mapStateToProps, mapDispatchToProps)
export default class App extends Component {

  static propTypes = {
    app: PropTypes.object.isRequired,
    children: PropTypes.any,
    location: PropTypes.object.isRequired,
    msg: PropTypes.object.isRequired,
    users: PropTypes.object.isRequired,
  }

  static childContextTypes = {
    muiTheme: React.PropTypes.object
  };

  getChildContext() {
    return {
      muiTheme: this.state.muiTheme
    };
  }

  constructor(...args) {
    super(...args);
    this.state = {
      showUserMenu: false,
      muiTheme: ThemeManager.getMuiTheme(DefaultRawTheme)
    };
  }

  // componentWillReceiveProps(nextProps, nextContext) {
  //   let newMuiTheme = nextContext.muiTheme ? nextContext.muiTheme : this.state.muiTheme;
  //   this.setState({
  //     muiTheme: newMuiTheme,});
  // }

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

    let newMuiTheme = this.state.muiTheme;

    newMuiTheme.appBar.color = '#FBFBFB';
    newMuiTheme.appBar.textColor = '#3E3E3E';
    newMuiTheme.appBar.height = 58;

    newMuiTheme.raisedButton.primaryColor = '#4b8cf7';

    this.setState({
      muiTheme: newMuiTheme
    });

    //newMuiTheme.appBar.textColor = Colors.deepPurpleA700;

    //ThemeManager.modifyRawThemeSpacing(this.state.muiTheme, {
    //  desktopKeylineIncrement: 58,
    //});
  }

  render() {
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
        <Avatar
          onClick={e => this.setState({ target: e.target, showUserMenu: !this.state.showUserMenu })}
          >
            {viewer.username.charAt(0)}
        </Avatar>

        <Overlay
          show={this.state.showUserMenu}
          target={()=> React.findDOMNode(this.state.target)}
          placement="bottom"
          container={this}
          containerPadding={20}
          >
          <Popover id="signin" _title={<span>Logged in as <strong>{viewer.username}</strong></span>} >

            <Grid fluid={true}>
              <Row className="show-grid">
                <Col xs={12} md={3}>
                  <Avatar>
                    {viewer.username.charAt(0)}
                  </Avatar>
                </Col>
                <Col xs={6} md={9}>
                  <span>Logged in as <strong>{viewer.username}</strong> ({viewer.email})</span>
                </Col>
              </Row>
              </Grid>
            <hr />
            <RaisedButton
              label="Sign out"
              style={{marginRight:10}}
              onClick={e => this.props.actions.logout(viewer.authToken)}
              />
            <RaisedButton
              primary={true}
              label="My account"
              onClick={e => this.props.history.pushState(null, `/me/`)}
              />
          </Popover>
        </Overlay>
      </ButtonToolbar>


        )
    //    <IconMenu
    //  iconButtonElement={<Avatar>{viewer.username.charAt(0)}</Avatar>}
    //closeOnItemTouchTap={false}
    //openDirection='bottom-left'
    //  >
    //  <MenuItem>Logged in as <strong>{viewer.username}</strong></MenuItem>
    //  <MenuItem primaryText="Refresh" />
    //  <MenuItem>
    //    <RaisedButton label="Sign out" className="pull-left" />
    //    <RaisedButton label="My account"  className="pull-right"  />
    //  </MenuItem>
    //  </IconMenu>
    }
    else {
      rightElement = (
        <div style={{
          margin:'12px 10px 0 0'
        }}>
          <Link to="/login"><i className="fa fa-lg fa-sign-in"></i> Sign in</Link>
        </div>
      )
    }

    // todo: looks like we may remove `onLeftIconButtonTouchTap` event
    return (
      <AppCanvas predefinedLayout={1}>
        <AppBar
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
          paddingTop:this.state.muiTheme.rawTheme.spacing.desktopKeylineIncrement
          }}>
        {React.cloneElement(children, props)}
        </div>
      </AppCanvas>
    );
  }

  _onLeftIconButtonTouchTap () {
    if(this.refs.leftNav)
      this.refs.leftNav.toggle();
  }

}
