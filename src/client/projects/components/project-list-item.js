/**
 * Brainfock - Community & Business Management Solution
 *
 * @link http://www.brainfock.org
 * @copyright Copyright (c) 2015 Sergii Gamaiunov <hello@webkadabra.com>
 */
import Component from 'react-pure-render/component';
import React, {PropTypes} from 'react';
import {Link} from 'react-router';
import mui, {Styles, Avatar, IconButton} from 'material-ui';
import {OverlayTrigger, Tooltip} from 'react-bootstrap';
const Colors = Styles.Colors;

export default class Todo extends Component {

  static propTypes = {
    group: PropTypes.object,
    actions: PropTypes.object,
    todo: PropTypes.object.isRequired,
    isPreview: PropTypes.bool
  }

  render() {
    const {actions, todo} = this.props;

    const color = Colors[todo.logoBackground];
    const icon = "fa "+todo.logoIcon;

    let privacyIcon;
    if (todo.accessPrivateYn) {
      privacyIcon = (
        <span>
          <IconButton iconClassName="fa fa-eye-slash"
                      tooltip="Private & Invisible"
                      style={{
              marginTop:'-25px',
              height:'16px'
            }}
                      iconStyle={{
              height:'16px',
              fontSize:'19px',
            }}
            />
        </span>
      );
    }

    let rightAvatar;

    if (todo.workspace) {

      let currentQuery = this.props.location.query;
      if (currentQuery['filter'])
        currentQuery['filter'].workspaceId = todo.workspace.id;
      else
        currentQuery = {filter: {workspaceId: todo.workspace.id}};

      const tooltip = (
        <Tooltip>Show only items in this workspace</Tooltip>
      );
      rightAvatar = ( <div className="">
          <OverlayTrigger placement="top" overlay={tooltip} id="listTooltip">
            <span className='label label-info'
              onClick={(e)=>{
                e.preventDefault();
                e.stopPropagation();
                this.props.history.replaceState(null, this.props.location.pathname, currentQuery)
              }}>{todo.workspace.name}
            </span>
          </OverlayTrigger>
        </div>
        );
    }

    // TODO: this should display cound of total open (biz status) items that have this topic as `contextTopicId` and
    // are in main gorup for this topic's `GroupScheme`, so for projects we'll see open issues, for sales - open deals etc.

    //if(!this.props.isPreview) {
    //  rightAvatar = (
    //    <div className="stats">
    //      <span className="unread prop">{todo.countActiveTopics}</span>
    //      topics
    //    </div>
    //  );
    //}

    return <mui.ListItem
      primaryText={<div>{todo.summary}{privacyIcon}</div>}
      secondaryText={todo.text}
      onClick={this._onClick.bind(this)}
      rightAvatar={rightAvatar}
      leftAvatar={<Avatar icon={<span className={icon}/>} backgroundColor={color} />}
      > {this.confirmDialog()}
    </mui.ListItem>
  }

  confirmDialog() {

    var dialogActions = [
      <mui.FlatButton
        label='BTN_CANCEL'
        secondary={true}
        onTouchTap={this._onDialogCancel}
        onClick={this._onDialogCancel}
        ref="BTN_CANCEL"
        />,
      { text:'BTN_DELETE', onClick: this.delete }
    ];

    var Dialog = <mui.Dialog title='projects_deleteDialog_TITLE' ref="confirmDialog" actions={dialogActions}>
      <p>Are you sure you want to delete this project? </p>
    </mui.Dialog>

    return Dialog;
  }

  _onClick() {
    if(this.props.isPreview === true) {
      alert('This is a preview :)');
      return;
    }

    let link = this.props.group.permalink;
    let replaced = link.replace(/:topic_key/g, this.props.todo.contextTopicKey);
    replaced = replaced.replace(/:id/g, this.props.todo.id);
    replaced = replaced.replace(/:board_key/g, this.props.params.key);
    replaced = replaced.replace(/:context_id/g, this.props.todo.contextTopicId);
    replaced = replaced.replace(/:namespace/g, this.props.todo.workspace && this.props.todo.workspace.namespace || this.props.todo.namespace);

    this.props.history.pushState(null, replaced);
  }
}
