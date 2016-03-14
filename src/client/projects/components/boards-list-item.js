/**
 * Brainfock - Community & Business Management Solution
 *
 * @link http://www.brainfock.org
 * @copyright Copyright (c) 2015 Sergii Gamaiunov <hello@webkadabra.com>
 */
import Component from 'react-pure-render/component';
import React, {PropTypes} from 'react';
import mui from 'material-ui';

import {Styles} from 'material-ui';
const Colors = Styles.Colors;

export default class Todo extends Component {

  static propTypes = {
    actions: PropTypes.object.isRequired,
    followItemOnClick: PropTypes.object,
    history: PropTypes.object,
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
            labelStyle.backgroundColor = Colors[labelConfig.bg]
            labelStyle.padding = '2px 3px 2px 3px';
            labelStyle.borderRadius = '3px';
          }
        }
        if (labelConfig.clr) {
          if (Colors[labelConfig.clr]) {
            labelStyle.color= Colors[labelConfig.clr]
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

    let priorityLabel;

    if(todo.priority) {
      let labelStyle = Object.assign({
        marginRight: todo.priority.value ? 5 : 0,
        fontWeight: 500,
        fontSize: '.85em',
        color: Colors.grey900
      }, this.configureLabel(todo.priority.labelConfig));
      priorityLabel = <span style={labelStyle} >{todo.priority.value}</span>;
    }

    let typeLabel = '';
    if(todo.type && todo.type.name) {
      let labelStyle = Object.assign({
        marginRight: 5,
        fontWeight: 500,
        fontSize: '.85em',
        color: Colors.grey900
      }, this.configureLabel(todo.type.labelConfig));
      typeLabel = <span style={labelStyle} >{todo.type.name}</span>;
    }

    return (
      <div style={style}>
        <mui.ListItem
          onClick={this._onClick.bind(this)}
          onDoubleClick={this._onDblClick.bind(this)}
          primaryText={
            <div>
              <div className="stats pull-right">
                <div className="prop">
                  123 topics, 321 posts
                </div>
              </div>
              {icon}
              {notice}
              {todo.summary}

              </div>
            }
          _primaryText={
            <div>
              <div className="pull-left" style={{marginRight:5}}>
                <div className="stats" style={{marginRight:5, width:'100%'}}>
                  <div className="prop" style={{width:'100%'}}>
                    {todo.contextTopicKey || todo.contextTopicNum}
                  </div>
                </div>
                <div className="label label-default" style={{width:'100%'}}>{todo.wfStage}</div>
              </div>
              {icon}
              {notice}
              {todo.summary}
              {priorityLabel}
              <span className="label label-info pull-right">{todo.type && todo.type.name}</span>
            </div>
            }
          _primaryText={
            <div>
              <div className="pull-left" style={{marginRight:5}}>
                <div className="stats" style={{marginRight:5, width:'100%'}}>
                  <div className="prop" style={{width:'100%'}}>
                    {todo.contextTopicKey || todo.contextTopicNum}
                  </div>
                </div>

              </div>
              {icon}
              {notice}
              {todo.summary}

            </div>
            }
          secondaryText={<span>
          {priorityLabel}
          {typeLabel}
          <span style={{fontSize: '.88em',color:'#333', fontWeight:600}}>— {todo.wfStage}</span>
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
    if (this.props.todo.type && this.props.todo.type.subtopicsEnabled) {
      return this.props.history.pushState(null,
        `/${this.props.params.namespace}/${this.props.params.board_id}/${this.props.topicGroupKey}/${this.props.todo.contextTopicNum}/browse`);
    } else {
      this.props.history.pushState(null, `/${this.props.params.namespace}/${this.props.params.board_id}/${this.props.topicGroupKey}/${this.props.todo.contextTopicNum}`);
    }
  }
}
