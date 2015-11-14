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
    const Item = this.props.itemComponent;

    if (!this.props.list.size) return (
      <p>{this.props.msg.emptyList}</p>
    );

    const groupBy = this.props.location.query.groupBy;
    if (groupBy) {
      let shadowCollection = [];
      let shadowCollectionGroups = [];
      this.props.list.forEach((item)=>{
        if (item[groupBy]) {
          if (!shadowCollection[item[groupBy].id]) {
            shadowCollection[item[groupBy].id] = [];
            shadowCollectionGroups[item[groupBy].id] = item[groupBy];
          }
          shadowCollection[item[groupBy].id].push(item);
        }
      });

      return (
        <div>
          {shadowCollectionGroups.map((collection, idx) =>
            <div>
              <h3 style={{paddingLeft:25}}>{collection.name || collection.summary}:</h3>
              {shadowCollection[idx].length && shadowCollection[idx].map(todo =>
                  <Item key={todo.id} todo={todo} {...passProps} />
              )}
            </div>
          )}
        </div>
      );
    } else {

      return (
        <div>
          {this.props.list.map(todo =>
            <Item key={todo.id} todo={todo} {...passProps} />
          )}
        </div>
      );
    }
  }
}
