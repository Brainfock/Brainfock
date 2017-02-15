/**
 * Brainfock, <http://www.brainfock.org>
 *
 * Copyright (C) 2015-present Sergii Gamaiunov <hello@webkadabra.com>
 * All rights reserved.
 *
 * This source code is licensed under the GPL-style license found in the
 * LICENSE file in the root directory of this source tree.
 */
import Component from 'react-addons-pure-render-mixin';
import React, {PropTypes} from 'react';
import mui from 'material-ui';

import {Styles} from 'material-ui';
import Colors from 'material-ui/styles/colors';

export default class Todo extends React.Component {

  static propTypes = {
    actions: PropTypes.object.isRequired,
    followItemOnClick: PropTypes.object,
    history: PropTypes.object,
    location: PropTypes.object,
    params: PropTypes.object.isRequired,
    todo: PropTypes.object.isRequired,
    topicGroupKey: PropTypes.string.isRequired,
    viewTopic: PropTypes.object
  };

  static defaultProps = {
    followItemOnClick: true
  };

  /**
   * `ava` - avatar url
   * `bg` - label background color code or image URL
   * `icn` -CSS selector for Font Awesome icon (or any CSS icon)
   * `fg` - icon color, if icon is present
   * `clr` - label color (e.g. no other values are present - paint text)
   *
   * @param possibleConfig
   * @returns {{}}
   */
  configureLabel(possibleConfig) {
    let labelStyle = {};
    if (possibleConfig) {
      try {
        const labelConfig = JSON.parse(possibleConfig);
        if (labelConfig.bg) {
          if (Colors[labelConfig.bg]) {
            labelStyle.backgroundColor = Colors[labelConfig.bg];
            labelStyle.padding = '2px 3px 2px 3px';
            labelStyle.borderRadius = '3px';
          }
        }
        if (labelConfig.clr) {
          if (Colors[labelConfig.clr]) {
            labelStyle.color = Colors[labelConfig.clr];
          }
        }
      } catch (e) {}
    }
    return labelStyle;
  }

  render() {

    const {todo} = this.props;

    let {icon, notice} = '';
    let style = {
      borderBottom: `1px solid ${Colors.grey200}`
    };

    if (todo.accessPrivateYn) {
      icon = (<i className="fa fa-eye-slash" style={{marginRight:5}}></i>);
    }

    if (this.props.viewTopic && this.props.viewTopic.id === todo.id) {
      style = {background: 'rgb(243, 243, 243)'};
    }

    if (todo.deletedYn === 1) {
      style.opacity = 0.2;
      // TODO: add l18n
      notice = '(item is deleted) ';
    }

    let contextLabel;
    if (todo.contextTopic.id) {
      contextLabel = (<span className='label label-default' style={{marginRight:3}}>
        {todo.workspace.name && <span>{todo.workspace.name} &rarr; </span>}
        {todo.contextTopic.summary}</span>);
    } else if (todo.workspace) {
      contextLabel = <span className='label label-default' style={{marginRight:3}}>{todo.workspace.name}</span>;
    }

    let priorityLabel;
    if (todo.priority) {
      let labelStyle = Object.assign({
        marginRight: todo.priority.value ? 5 : 0,
        fontWeight: 500,
        fontSize: '.85em',
        color: Colors.grey900
      }, this.configureLabel(todo.priority.labelConfig));
      priorityLabel = <span style={labelStyle} >{todo.priority.value}</span>;
    }

    let typeLabel = '';
    if (todo.type && todo.type.name) {
      let labelStyle = Object.assign({
        marginRight: 5,
        fontWeight: 500,
        fontSize: '.85em',
        color: Colors.grey900
      }, this.configureLabel(todo.type.labelConfig));
      typeLabel = <span style={labelStyle} >{todo.type.name}</span>;
    }
    let parentLink = '';
    if (todo.parent) {

      let currentQuery = this.props.location.query;
      if (currentQuery['filter'])
        currentQuery['filter'].parentTopicId = todo.parent.id;
      else
        currentQuery = {filter: {parentTopicId: todo.parent.id}};

      parentLink = (<div className="">

            <span className='label label-info'
                  onClick={(e)=>{
                    e.preventDefault();
                    e.stopPropagation();
                    this.props.history.pushState(null, this.props.location.pathname, currentQuery);
                  }}>{todo.parent.summary}
            </span>
        </div>
      );
    }

    return (
      <div style={style}>
        <mui.ListItem
          onClick={this._onClick.bind(this)}
          onDoubleClick={this._onDblClick.bind(this)}
          primaryText={
            <div>
              {parentLink}
 {(todo.contextTopicKey || todo.contextTopicNum) &&
              <div className="stats pull-right">
                <div className="prop">
                  {todo.contextTopicKey || todo.contextTopicNum}
                </div>
              </div>}
              {icon}
              {notice}
              {todo.summary}

              </div>
            }
          secondaryText={<span>
            {contextLabel}
            {priorityLabel}
            {typeLabel}
            <span style={{fontSize: '.88em', color:'#333', fontWeight:600}}>— {todo.wfStage}</span>
            {todo.text && <br />}
            {todo.text}

            </span>}
          secondaryTextLines={(todo.text ? 2 : 1)}
          >
          {this.confirmDialog()}
        </mui.ListItem>
      </div>
    );
  }

  confirmDialog() {

    let dialogActions = [
      <mui.FlatButton
        label='BTN_CANCEL'
        onClick={this._onDialogCancel}
        onTouchTap={this._onDialogCancel}
        ref="BTN_CANCEL"
        secondary
        />,
      {text: 'BTN_DELETE', onClick: this.delete}
    ];

    return (
      <mui.Dialog actions={dialogActions} ref='confirmDialog' title='projects_deleteDialog_TITLE'>
        <p>Are you sure you want to delete this item? </p>
      </mui.Dialog>
    );
  }

  _onClick() {
    if (this.props.todo.deletedYn === 1) {
      return;
    }
    if (this.props.followItemOnClick) {
      this.handleClickRedirect();
    } else {
      this.props.actions.setCurrentTopicMarker(this.props.todo.id);
      this.props.actions.loadTopic(this.props.todo.id);
    }
  }

  _onDblClick() {
    this.handleClickRedirect();
  }

  handleClickRedirect() {
    this.props.history.pushState(null, `/tasks/${this.props.todo.id}`);
  }
}
