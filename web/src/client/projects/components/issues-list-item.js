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

  getDefaultProps() {
    return {
      followItemOnClick: true,
    }
  }
  render() {
    const {actions, todo} = this.props;

    let icon;
    if(todo.accessPrivateYn==1) {
      icon = (<i className="fa fa-eye-slash"></i>);
    }

    let style={};
    if(this.props.viewTopic && this.props.viewTopic.id == todo.id) {
      style={background:'rgb(243, 243, 243)'};
    }
    return  <div style={style}>
      <mui.ListItem
      primaryText={
          <div>
            <div className="pull-left" style={{marginRight:5}}>
              <div className="stats" style={{marginRight:5,width:'100%'}}>
                <div className="prop" style={{width:'100%'}}>
                  {todo.contextTopicKey || todo.contextTopicNum}
                </div>
              </div>
              <div className="label label-default" style={{width:'100%'}}>{todo.wfStage}</div>
            </div>
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
      onDoubleClick={this._onDblClick.bind(this)}

      > {this.confirmDialog()}
    </mui.ListItem>
      </div>

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
    if(this.props.followItemOnClick) {
      this.props.history.pushState(null, `/board/${this.props.params.board_id}/topic/${this.props.todo.id}`);
    } else {
      this.props.actions.setCurrentTopicMarker(this.props.todo.id);
      this.props.actions.loadTopic(this.props.todo.id);
    }
      //this.props.actions.topic.query('board_topic', {}, this.props.board_id);

    //this.props.actions.pushState(null, `/board/${this.props.params.board_id}/topic/${this.props.todo.id}`);
   // this.props.history.pushState(null, `/board/${this.props.params.board_id}/topic/${this.props.todo.id}`);
  }
  _onDblClick() {
    this.props.history.pushState(null, `/board/${this.props.params.board_id}/topic/${this.props.todo.id}`);
  }

}
