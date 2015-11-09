/**
 * Brainfock - Community & Business Management Solution
 *
 * @link http://www.brainfock.org
 * @copyright Copyright (c) 2015 Sergii Gamaiunov <hello@webkadabra.com>
 */
var React = require('react');
var Loader = require('../Loader');

let { Menu, Mixins, Styles } = require('material-ui');

let { Spacing, Colors } = Styles;
let { StyleResizable, StylePropable } = Mixins;

import * as mui from 'material-ui';
//const Events = mui.Utils.Events;

/**
 * Page With Navigation, based on material-ui's PageWithNav
 */
var PageWithNav = React.createClass({

  mixins: [StyleResizable, StylePropable],

  contextTypes: {
    router: React.PropTypes.func
  },

  getDefaultProps() {
    return {
      menuItems:[]
    }
  },

  //componentDidMount() {
  //  this._updateDeviceWith();
  //  if (!this.manuallyBindResize) this._bindResizeWidth();
  //},
  //componentWillUnmount() {
  //  this._unbindResizeWidth();
  //},
  //_updateDeviceWith() {
  //  let width = window.innerWidth;
  //  this.setState({deviceWidth: width});
  //},
  //_bindResizeWidth() {
  //  Events.on(window, 'resize', this._updateDeviceWidth);
  //},
  //_unbindResizeWidth() {
  //  Events.off(window, 'resize', this._updateDeviceWidth);
  //},

  getStyles(){
    let subNavWidth = Spacing.desktopKeylineIncrement * 3 + 'px';
    let styles = {
      root: {
        //paddingTop: (Spacing.desktopKeylineIncrement/2) + 'px'
      },
      rootWhenMedium: {
        position: 'relative'
      },
      secondaryNav: {
        borderBottom: 'solid 1px ' + Colors.grey300,
        overflow: 'hidden'
      },
      content: {
        // removed maxWidth - this component is used as full-width container with side nav
        //maxWidth: (Spacing.desktopKeylineIncrement * 20) + 'px'
        //padding: Spacing.desktopGutter + 'px',
        boxSizing: 'border-box',
      },
      secondaryNavWhenMedium: {
        borderTop: 'none',
        position: 'absolute',
        top: '18px',
        width: subNavWidth
      },
      contentWhenMedium: {
        borderLeft: 'solid 1px ' + Colors.grey300,
        marginLeft: subNavWidth,
        minHeight: '800px'
      }
    };

    if (this.isDeviceSize(StyleResizable.statics.Sizes.MEDIUM) ||
        this.isDeviceSize(StyleResizable.statics.Sizes.LARGE)) {
      styles.root = this.mergeStyles(styles.root, styles.rootWhenMedium);
      styles.secondaryNav = this.mergeStyles(styles.secondaryNav, styles.secondaryNavWhenMedium);
      styles.content = this.mergeStyles(styles.content, styles.contentWhenMedium);
    }

    return styles;
  },

  _getSelectedIndex: function()
  {
    var currentItem;
    let menuItems = this.props.menuItems;
    for (var i = menuItems.length - 1; i >= 0; i--) {
      currentItem = menuItems[i];
      // multiple routes match support:
      if(currentItem.routes) {
        // see if any *one* route is valid
        for (var i2 = currentItem.routes.length - 1; i2 >= 0; i2--) {
          let _routeName = currentItem.routes[i2];
          if (this.props.history.isActive(_routeName, (currentItem.params?currentItem.params:[]))) return i;

        }
      }
      if (currentItem.route && this.props.history.isActive(currentItem.route, (currentItem.params?currentItem.params:[]))) return i;
    };
  },


  _onMenuItemClick(e, index, payload) {
    this.props.history.pushState(null, payload.route);
  },

  render: function () {

    const {children, ...passProps} = this.props;

    let styles = this.getStyles();
    return (
        <div style={styles.root}>
          <div style={styles.secondaryNav}>
            <mui.Menu
              menuItems={this.props.menuItems}
              onItemTap={this._onMenuItemClick}
              ref="menuItems"
              selectedIndex={this._getSelectedIndex()}
              zDepth={0}
              />
          </div>
          <div style={styles.content}>
            {React.cloneElement(children, passProps)}
          </div>

        </div>
    );
  }
});
module.exports=PageWithNav;