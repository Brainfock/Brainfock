import './newTodo.styl';
import Component from 'react-addons-pure-render-mixin';
import React, {PropTypes} from 'react';

export default class NewTodo extends React.Component {

  static propTypes = {
    actions: PropTypes.object.isRequired,
    msg: PropTypes.object.isRequired,
    newTodo: PropTypes.object.isRequired
  }

  onKeyDown(e) {
    const {actions, newTodo} = this.props;
    if (e.key === 'Enter' && newTodo.title.trim())
      actions.addTodo(newTodo);
  }

  render() {
    const {actions, msg, newTodo} = this.props;

    return (
      <input
        autoFocus
        className="new-todo"
        name="title"
        onChange={actions.setNewTodoField}
        onKeyDown={::this.onKeyDown}
        placeholder={msg.newTodoPlaceholder}
        value={newTodo.title}
      />
    );
  }

}
