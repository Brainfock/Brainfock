import Component from 'react-pure-render/component';
import React from 'react';
import Todo from './boards.board.react';

export default class List extends Component {

  static propTypes = {
    actions: React.PropTypes.object.isRequired,
    // whether list should follow link when list item is clicked or just load u details
    followItemOnClick: React.PropTypes.bool,
    group: React.PropTypes.isRequired,
    itemComponent: React.PropTypes.element,
    list: React.PropTypes.isRequired,
    msg: React.PropTypes.object.isRequired
  };

  static defaultProps = {
    itemComponent: Todo
  };

  render() {
    const {children, ...passProps} = this.props;

    if (!this.props.list.size) return (
      <p>{this.props.msg.emptyList}</p>
    );

    const Item = this.props.itemComponent;

    return (
      <div>
        {this.props.list.map(todo =>
          <Item key={todo.id} todo={todo} {...passProps} />
        )}
      </div>
    );
  }
}
