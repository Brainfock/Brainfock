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
//import Todo from './todo.react';

export default class List extends Component {

  static propTypes = {
    //actions: React.PropTypes.object.isRequired,
    list: React.PropTypes.object.isRequired,
    //msg: React.PropTypes.object.isRequired
  }

  render() {
    const {actions, list, msg} = this.props;

    if (!list.size) return (
      <p>{msg.emptyList}</p>
    );

    return (
      <ol className="todos">
        {list.map(todo =>
            <Todo actions={actions} key={todo.id} todo={todo} parent={this.props.parentBoard} />
        )}
      </ol>
    );
  }
}