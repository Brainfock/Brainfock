import Component from 'react-pure-render/component';
import React from 'react';
import Todo from './boards.board.react';

export default class List extends Component {

  static propTypes = {
    //actions: React.PropTypes.object.isRequired,
    list: React.PropTypes.object.isRequired,
    itemComponent: React.PropTypes.element,
    //msg: React.PropTypes.object.isRequired
  }

  static defaultProps = {
    itemComponent: Todo
  };

  render() {
    const {actions, list, msg} = this.props;

    if (!list.size) return (
      <p>{msg.emptyList}</p>
    );

    let Item = this.props.itemComponent;

    return (
      <ol className="todos">
        {list.map(todo =>
          <Item actions={actions} key={todo.id} todo={todo} history={this.props.history} params={this.props.params} />
        )}
      </ol>
    );
  }



}
