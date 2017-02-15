import Component from 'react-addons-pure-render-mixin';
import React from 'react';
import Todo from './boards.board.react';

export default class List extends React.Component {

  static propTypes = {
    actions: React.PropTypes.object.isRequired,
    children: React.PropTypes.object,
    followItemOnClick: React.PropTypes.bool, // whether list should follow link when list item is clicked or just load u details
    group: React.PropTypes.isRequired,
    groupBy: React.PropTypes.string,
    itemComponent: React.PropTypes.element,
    list: React.PropTypes.isRequired,
    msg: React.PropTypes.object.isRequired,
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

    const groupBy = this.props.groupBy;
    if (groupBy) {
      let shadowCollection = [];
      let looseCollection = [];
      let shadowCollectionGroups = [];
      this.props.list.forEach((item)=>{
        if (item[groupBy] && item[groupBy].id) {
          if (!shadowCollection[item[groupBy].id]) {
            shadowCollection[item[groupBy].id] = [];
            shadowCollectionGroups[item[groupBy].id] = item[groupBy];
          }
          shadowCollection[item[groupBy].id].push(item);
        } else {
          looseCollection.push(item);
        }
      });

      return (
        <div>
          {looseCollection.length > 0 &&
            <div>
              {looseCollection.map(todo =>
                  <Item key={todo.id} todo={todo} {...passProps} />
              )}
              {shadowCollectionGroups.length > 0 && <h4 style={{paddingLeft:15}}>Subcategories:</h4>}
            </div>
          }
          {shadowCollectionGroups.map((collection, idx) =>
            <div>
              <h3 style={{paddingLeft:15}}>{collection.name || collection.summary || collection.label || collection.value}:</h3>
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
