import Component from 'react-pure-render/component';
import React from 'react';
import Todo from './boards.board.react';

export default class List extends Component {

  static propTypes = {
    //actions: React.PropTypes.object.isRequired,
    list: React.PropTypes.isRequired,
    group: React.PropTypes.isRequired,
    itemComponent: React.PropTypes.element,
    //msg: React.PropTypes.object.isRequired
  }

  static defaultProps = {
    itemComponent: Todo
  };

  render() {
    //const {actions, list, msg, group, board} = this.props;
    const {children, ...passProps} = this.props;

    if (!this.props.list.size) return (
      <p>{this.props.msg.emptyList}</p>
    );

    let Item = this.props.itemComponent;

    return (
      <div>
        {this.props.list.map(todo =>
          <Item key={todo.id} todo={todo} {...passProps} />
        )}
      </div>
    );
  }



}
