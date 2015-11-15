/**
 * Brainfock - Community & Business Management Solution
 *
 * @link http://www.brainfock.org
 * @copyright Copyright (c) 2015 Sergii Gamaiunov <hello@webkadabra.com>
 */
import Component from 'react-pure-render/component';
import React, {PropTypes} from 'react';
import {Link} from 'react-router';
import {IconMenu, TextField, ListItem, List, LeftNav, Avatar, IconButton, RaisedButton, FloatingActionButton} from 'material-ui';
import MenuItem from 'material-ui/lib/menus/menu-item';
import MenuDivider from 'material-ui/lib/menus/menu-divider';

export default class QuickAdd extends Component {

  static propTypes = {
    //msg: PropTypes.object.isRequired,
    //pathname: PropTypes.string.isRequired,
    //viewer: PropTypes.object
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
    return <h1>yo</h1>;
  }

  render() {
    const {msg, viewer} = this.props;
    const sidebarContent = this.renderUsersList();

    return (
      <div style={{
          position:'fixed',
          bottom: 10,
          right: 10,
          zIndex:99999999999
        }}>
        <IconMenu
          style={{
            position:'relative',
            bottom: 10,
            right: 10
          }}
          menuStyle={{
            position:'fixed',
            bottom: 10,
            right: 10
          }}
          openDirection='top-left'
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
          }>
          <MenuItem primaryText="Opportunity" />
          <MenuItem primaryText="Task" />
          <MenuItem primaryText="Discussion" />
          <MenuItem primaryText="Message" />
        </IconMenu>
</div>


    );
  }

}
