import './app.styl';

import Component from 'react-pure-render/component';
import Header from './header.react';
import React, {PropTypes} from 'react';
import {mapDispatchToProps, mapStateToProps} from '@este/common';
import {connect} from 'react-redux';

var io = require('socket.io-client');

var mui = require('material-ui-io'),
  {MenuItem, LeftNav, AppCanvas, AppBar, IconButton, Menu} = mui,
  Icon = mui.FontIcon;

var Colors = mui.Styles.Colors;
var Typography = mui.Styles.Typography;
var ThemeManager = new mui.Styles.ThemeManager();

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
    ThemeManager.setComponentThemes({
      appBar: {
        color: "#444444",
        height: 40
      },
      raisedButton: {
        primaryColor: '#4b8cf7',
      },
    });
  }

  render() {
    // Use location pathname to ensure header is rerendered on url change, so
    // links update their active className.
    const {children, ...props} = this.props;
    props.io = this.io;
    const {location: {pathname}, msg, users: {viewer}} = this.props;


    // todo: looks like we may remove `onLeftIconButtonTouchTap` event
    return (
      <mui.AppCanvas predefinedLayout={1}>
        <mui.AppBar
          autoWidth={false}
          title="Brainfock"
          zDepth={0}
          onLeftIconButtonTouchTap={this._onLeftIconButtonTouchTap.bind(this)}
          onLeftIconButtonClick={this._onLeftIconButtonTouchTap.bind(this)}
         /*iconElementRight={iconElementRight} */
          />
        <AppSideNav ref="leftNav" {...this.props} />
        { /*<Header msg={msg.app.header} {...{viewer, pathname}} /> */ }
        <div style={{paddingTop:40}}>
        {React.cloneElement(children, props)}
        </div>
      </mui.AppCanvas>
    );
  }

  _onLeftIconButtonTouchTap (test,two) {
    if(this.refs.leftNav)
      this.refs.leftNav.toggle();
  }

}
