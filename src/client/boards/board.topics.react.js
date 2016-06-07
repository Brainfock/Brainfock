/**
 * Brainfock, <http://www.brainfock.org>
 *
 * Copyright (C) 2015-present Sergii Gamaiunov <hello@webkadabra.com>
 * All rights reserved.
 *
 * This source code is licensed under the GPL-style license found in the
 * LICENSE file in the root directory of this source tree.
 */
import Component from 'react-pure-render/component';
import React from 'react';
import Todo from './board.topic.react';

export default class List extends Component {

  static propTypes = {
    actions: React.PropTypes.object,
    list: React.PropTypes.object.isRequired,
    msg: React.PropTypes.object,
    parentBoard: React.PropTypes.object,
  }

  render() {
    const {actions, list, msg} = this.props;

    if (!list.size) return (
      <p>{msg.emptyList}</p>
    );

    return (
      <ol className="todos">
        {list.map(todo =>
            <Todo
              actions={actions}
              key={todo.id}
              parent={this.props.parentBoard}
              todo={todo}
              />
        )}
      </ol>
    );
  }
}
