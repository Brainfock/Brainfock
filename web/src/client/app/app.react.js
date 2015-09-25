import './app.styl';
import Component from 'react-pure-render/component';
import Footer from './footer.react';
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

@connect(mapStateToProps, mapDispatchToProps)
export default class App extends Component {

  static propTypes = {
    children: PropTypes.object.isRequired,
    location: PropTypes.object.isRequired,
    msg: PropTypes.object.isRequired,
    users: PropTypes.object.isRequired
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
    if(process.env.IS_BROWSER && !this.io)
    {
      // appActions.setupIo((this.props.users.viewer && this.props.users.viewer.authToken) ? this.props.users.viewer.authToken : null);
      // important: create socket connection during willMount
      this.io = io('http://localhost:3000', this.props.users.viewer ? {
        query: "auth_token=" + this.props.users.viewer.authToken,
        forceNew: true,
        'force new connection': true,
      } : {});

      this.io.on('connect', function(){
        console.log('[BFK] sockets connection established');
        this.setState({'socket':this.socket});
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
    const {location: {pathname}, msg, users: {viewer}} = this.props;

    return (
      <mui.AppCanvas predefinedLayout={1}>
      <div className="page">
        <Header msg={msg.app.header} {...{viewer, pathname}} />
        {React.cloneElement(this.props.children, this.props)}
        <Footer msg={msg.app.footer} />
      </div>
      </mui.AppCanvas>
    );
  }

}
