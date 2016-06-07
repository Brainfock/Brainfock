/**
 * Brainfock, <http://www.brainfock.org>
 *
 * Copyright (C) 2015-present Sergii Gamaiunov <hello@webkadabra.com>
 * All rights reserved.
 *
 * This source code is licensed under the GPL-style license found in the
 * LICENSE file in the root directory of this source tree.
 */
import Component from 'react-pure-render/component';
import React, {PropTypes} from 'react';
import mui, {Styles, Avatar, IconButton} from 'material-ui';
import {OverlayTrigger, Tooltip} from 'react-bootstrap';
const Colors = Styles.Colors;

export default class Todo extends Component {

  static propTypes = {
    actions: PropTypes.object,
    group: PropTypes.object,
    history: PropTypes.object,
    isPreview: PropTypes.bool,
    location: PropTypes.object,
    params: PropTypes.object,
    todo: PropTypes.object.isRequired,
  }

  render() {
    const {todo} = this.props;

    const color = Colors[todo.logoBackground];
    const icon = 'fa ' + todo.logoIcon;

    let privacyIcon;
    if (todo.accessPrivateYn) {
      privacyIcon = (
        <span>
          <IconButton iconClassName="fa fa-eye-slash"
                      iconStyle={{height:'16px', fontSize:'19px'}}
                      style={{marginTop:'-25px', height:'16px'}}
                      tooltip="Private & Invisible"
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
      rightAvatar = (<div className="">
          <OverlayTrigger
            id="listTooltip"
            overlay={tooltip}
            placement="top"
            >
            <span className='label label-info'
              onClick={(e)=>{
                e.preventDefault();
                e.stopPropagation();
                this.props.history.replaceState(null, this.props.location.pathname, currentQuery);
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

    return (<mui.ListItem
      backgroundColor={color}
      leftAvatar={<Avatar icon={<span className={icon}/>} />}
      onClick={this._onClick.bind(this)}
      primaryText={<div>{todo.summary} {privacyIcon}</div>}
      rightAvatar={rightAvatar}
      secondaryText={todo.text}
      > {this.confirmDialog()}
    </mui.ListItem>);
  }

  confirmDialog() {

    const dialogActions = [
      <mui.FlatButton
        label='BTN_CANCEL'
        onClick={this._onDialogCancel}
        onTouchTap={this._onDialogCancel}
        ref="BTN_CANCEL"
        secondary
        />,
      {text:'BTN_DELETE', onClick: this.delete}
    ];

    return (<mui.Dialog actions={dialogActions} ref="confirmDialog" title='projects_deleteDialog_TITLE'>
      <p>Are you sure you want to delete this project? </p>
    </mui.Dialog>);
  }

  _onClick() {
    if (this.props.isPreview === true) {
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
