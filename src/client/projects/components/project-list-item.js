/**
 * Brainfock - Community & Business Management Solution
 *
 * @link http://www.brainfock.org
 * @copyright Copyright (c) 2015 Sergii Gamaiunov <hello@webkadabra.com>
 */
import Component from 'react-pure-render/component';
import React, {PropTypes} from 'react';
import mui from 'material-ui';

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

  render() {

    const {todo} = this.props;

    let {icon, notice} = '';
    let style = {};

    if (todo.accessPrivateYn) {
      icon = (<i className="fa fa-eye-slash"></i>);
    }

    if (this.props.viewTopic && this.props.viewTopic.id === todo.id) {
      style = {background: 'rgb(243, 243, 243)'};
    }

    if (todo.deletedYn === 1) {
      style.opacity = 0.2;
      // TODO: add l18n
      notice = '(item is deleted) ';
    }

    return (
      <div style={style}>
        <mui.ListItem
          onClick={this._onClick.bind(this)}
          onDoubleClick={this._onDblClick.bind(this)}
          primaryText={
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
              <span className="label label-info pull-right">{todo.type && todo.type.name}</span>
            </div>
            }
          secondaryText={todo.text}
          secondaryTextLines={2}
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
      this.props.history.pushState(null, `/${this.props.params.namespace}/${this.props.params.board_id}/${this.props.topicGroupKey}/${this.props.todo.contextTopicNum}`);
    } else {
      this.props.actions.setCurrentTopicMarker(this.props.todo.id);
      this.props.actions.loadTopic(this.props.todo.id);
    }
  }

  _onDblClick() {
    this.props.history.pushState(null, `/${this.props.params.namespace}/${this.props.params.board_id}/${this.props.topicGroupKey}/${this.props.todo.contextTopicNum}`);
  }
}
