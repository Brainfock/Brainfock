import Component from 'react-pure-render/component';
import React, {PropTypes} from 'react';

var mui = require('material-ui-io');

export default class Todo extends Component {

  static propTypes = {
    group: PropTypes.object.isRequired,
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
    let link = this.props.group.permalink;
    console.log('LINK: '+link);
    const topic_key = this.props.todo.contextTopicKey;
    let replaced = link.replace(/:topic_key/g, topic_key);
    replaced = replaced.replace(/:id/g, this.props.todo.id);
    replaced = replaced.replace(/:board_key/g, this.props.todo.contextTopicKey);
    replaced = replaced.replace(/:namespace/g, this.props.todo.namespace);

    //this.props.history.pushState(null, link);
    this.props.history.pushState(null, replaced);
  }

}
