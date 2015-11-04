import Component from 'react-pure-render/component';
import React, {PropTypes} from 'react';
import {Link} from 'react-router';
import {TextField, ListItem, List, LeftNav, Avatar, IconButton, MenuItem, RaisedButton, FloatingActionButton} from 'material-ui';

export default class ChatWidget extends Component {

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
    const {msg, viewer} = this.props;
    const sidebarContent = this.renderUsersList();
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

        <LeftNav ref="sideBar" openRight docked={false} tyle={{
            position: 'relative',
          }}>
          <MenuItem index={0}>Speak up!</MenuItem>
          <MenuItem index={1}><a href="/me/chatConfig">Settings</a></MenuItem>

          <List subheader="Previous chats">
            <ListItem
              primaryText="Annie Hoffman"
              leftAvatar={<Avatar src="https://randomuser.me/api/portraits/med/women/94.jpg" />} />
            <ListItem
              primaryText="Felecia Lambert"
              leftAvatar={<Avatar src="https://randomuser.me/api/portraits/med/women/20.jpg" />} />
          </List>
          <div style={{
            position: 'absolute',
            bottom: 0,
            left:10,
            right: '20px'
          }}>
            <TextField
              placeholder='Look for anything (TODO)'

              />


        </div>
        </LeftNav>
      </div>

    );
  }

}
