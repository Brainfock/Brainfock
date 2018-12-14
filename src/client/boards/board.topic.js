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

var mui = require('material-ui');

export default class Todo extends Component {

  static propTypes = {
    actions: PropTypes.object.isRequired,
    todo: PropTypes.object.isRequired
  }

  render() {
    const {actions, todo} = this.props;

    return <mui.ListItem
      primaryText={todo.summary}
      secondaryText={todo.text}
      onClick={this._onClick.bind(this)}
      rightIcon={
          <div className="stats">
            <span className="unread prop">{todo.countActiveTopics}</span>
            topics
          </div>
        }
      > {this.confirmDialog()}
    </mui.ListItem>

    return (
      <li className="todo">
        <span className="editable view">{todo.summary}</span>
        <span className="button" onClick={() => actions.deleteTodo(todo)}>x</span>
      </li>
    );
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
    this.props.history.pushState(null, `/board/${this.props.params.board_id}/topic/${this.props.todo.id}`);
  }

}
