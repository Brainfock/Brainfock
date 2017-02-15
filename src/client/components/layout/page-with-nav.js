/**
 * Brainfock, <http://www.brainfock.org>
 *
 * Copyright (C) 2015-present Sergii Gamaiunov <hello@webkadabra.com>
 * All rights reserved.
 *
 * This source code is licensed under the GPL-style license found in the
 * LICENSE file in the root directory of this source tree.
 */
import React from 'react';
import {Menu, Mixins} from 'material-ui';
import {spacing, typography, zIndex, Colors} from 'material-ui/styles';
// let {StylePropable} = Mixins;
/**
 * Page With Navigation, based on material-ui's PageWithNav
 */
let PageWithNav = React.createClass({

  propTypes: {
    children: React.PropTypes.object,
    history: React.PropTypes.object,
    menuItems: React.PropTypes.array,
  },

  // mixins: [StylePropable],

  contextTypes: {
    router: React.PropTypes.func
  },

  getDefaultProps() {
    return {
      menuItems:[]
    };
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

  getStyles() {
    let subNavWidth = spacing.desktopKeylineIncrement * 3 + 'px';
    let styles = {
      root: {
        //paddingTop: (spacing.desktopKeylineIncrement/2) + 'px'
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
        //maxWidth: (spacing.desktopKeylineIncrement * 20) + 'px'
        //padding: spacing.desktopGutter + 'px',
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

    // TODO: implement or drop, from 0.28.0
    // if (this.isDeviceSize(StyleResizable.statics.Sizes.MEDIUM) ||
    //     this.isDeviceSize(StyleResizable.statics.Sizes.LARGE)) {
    //   styles.root = this.mergeStyles(styles.root, styles.rootWhenMedium);
    //   styles.secondaryNav = this.mergeStyles(styles.secondaryNav, styles.secondaryNavWhenMedium);
    //   styles.content = this.mergeStyles(styles.content, styles.contentWhenMedium);
    // }

    return styles;
  },

  _getSelectedIndex() {
    let currentItem;
    let menuItems = this.props.menuItems;
    for (let i = menuItems.length - 1; i >= 0; i--) {
      currentItem = menuItems[i];
      // multiple routes match support:
      if (currentItem.routes) {
        // see if any *one* route is valid
        for (let i2 = currentItem.routes.length - 1; i2 >= 0; i2--) {
          let _routeName = currentItem.routes[i2];
          if (this.props.history.isActive(_routeName)) {return i;}
        }
      }
      if (currentItem.route && this.props.history.isActive(currentItem.route)) return i;
    }
  },

  _onMenuItemClick(e, index, payload) {
    this.props.history.pushState(null, payload.route);
  },

  render: function() {

    const {children, ...passProps} = this.props;

    let styles = this.getStyles();
    return (
        <div style={styles.root}>
          <div style={styles.secondaryNav}>
            <Menu
              menuItems={this.props.menuItems}
              multiple
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

module.exports = PageWithNav; // eslint-disable-line no-undef
