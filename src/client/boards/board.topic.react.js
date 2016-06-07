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
import React from 'react';

export default class Todo extends Component {

  static propTypes = {
    actions: React.PropTypes.object.isRequired,
    todo: React.PropTypes.object.isRequired
  }

  render() {
    const {todo} = this.props;

    return (
      <mui.ListItem
        onClick={this._onClick.bind(this)}
        primaryText={todo.summary}
        rightIcon={
            <div className="stats">
              <span className="unread prop">{todo.countActiveTopics}</span>
              topics
            </div>
          }
        secondaryText={todo.text}
        > {this.confirmDialog()}
      </mui.ListItem>
    );
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

    return (
      <mui.Dialog actions={dialogActions} ref="confirmDialog" title='projects_deleteDialog_TITLE'>
        <p>Are you sure you want to delete this project? </p>
      </mui.Dialog>
    );
  }

  _onClick() {
    this.context.router.transitionTo('board_topic', {
      'board_id': this.props.parent.id,
      'id': this.props.todo.id,
    });
  }

}
