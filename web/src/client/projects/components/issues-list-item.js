/**
 * Brainfock - community & issue management software
 * Copyright (c) 2015, Sergii Gamaiunov (“Webkadabra”)  All rights reserved.
 *
 * This program is free software: you can redistribute it and/or modify
 * it under the terms of the GNU Affero General Public License as
 * published by the Free Software Foundation, either version 3 of the
 * License, or (at your option) any later version.
 *
 * This program is distributed in the hope that it will be useful,
 * but WITHOUT ANY WARRANTY; without even the implied warranty of
 * MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
 * GNU Affero General Public License for more details.
 *
 * You should have received a copy of the GNU Affero General Public License
 * along with this program.  If not, see <http://www.gnu.org/licenses/>.
 *
 * @link http://www.brainfock.com/
 * @copyright Copyright (c) 2015 Sergii Gamaiunov <hello@webkadabra.com>
 */
import Component from 'react-pure-render/component';
import React, {PropTypes} from 'react';

var mui = require('material-ui-io');

export default class Todo extends Component {

  static propTypes = {
    actions: PropTypes.object.isRequired,
    todo: PropTypes.object.isRequired
  }

  render() {
    const {actions, todo} = this.props;

    let icon;
    if(todo.accessPrivateYn==1) {
      icon = (<i className="fa fa-eye-slash"></i>);
    }
    return <mui.ListItem
      primaryText={
          <div>
            <span className="stats" style={{marginRight:5}}><span className="prop">{todo.contextTopicKey || todo.contextTopicNum}</span></span>
            {icon} {todo.summary}
            <span className="label label-info pull-right">{todo.type && todo.type.name}</span>
          </div>}
      secondaryTextLines={2}
      secondaryText={<div>
          <span className="label label-default">{todo.status && todo.status.label}</span>
          <br />
          {todo.text}
          </div>
          }

      onClick={this._onClick.bind(this)}

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
