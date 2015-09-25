/**
 * Brainfock - community & issue management software
 * Copyright (c) 2015, Sergii Gamaiunov (“Webkadabra”)  All rights reserved.
 *
 * This program is free software: you can redistribute it and/or modify
 * it under the terms of the GNU Affero General Public License as
 * published by the Free Software Foundation, either version 3 of the
 * License, or (at your option) any later version.
 *
 * This program is distributed in the hope that it will be useful,
 * but WITHOUT ANY WARRANTY; without even the implied warranty of
 * MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
 * GNU Affero General Public License for more details.
 *
 * You should have received a copy of the GNU Affero General Public License
 * along with this program.  If not, see <http://www.gnu.org/licenses/>.
 *
 * @link http://www.brainfock.com/
 * @copyright Copyright (c) 2015 Sergii Gamaiunov <hello@webkadabra.com>
 */

import * as actions from './actions';
import Todo from './wiki-page';
import getRandomString from '../lib/getRandomString';
import {List, Range, Record} from 'immutable';

const InitialState = Record({
  list: List(),
  newTodo: new Todo,
  viewPage: new Todo,
  meta:{
    loading: true
  }
});
const initialState = new InitialState;

// Note how JSON from server is revived to immutable record.
const revive = (state) => initialState.merge({
  list: state.list.map(todo => new Todo(todo)),
  newTodo: new Todo(state.newTodo),
  viewPage: new Todo(state.viewPage || {})
});
//
export default function todosReducer(state = initialState, action) {
  if (!(state instanceof InitialState)) return revive(state);

  switch (action.type) {

    case actions.SET_NEW_TODO_FIELD: {
      const {name, value} = action.payload;
      return state.setIn(['newTodo', name], value);
    }

    case actions.ADD_TODO: {
      const {todo} = action.payload;
      const newTodo = todo.merge({
        id: getRandomString(),
        title: todo.title.trim()
      });
      return state
        .update('list', list => list.push(newTodo))
        .set('newTodo', new Todo);
    }

    case actions.DELETE_TODO: {
      const {id} = action.payload;
      return state.update('list', list =>
          list.delete(list.findIndex(todo => todo.id === id))
      );
    }

    case actions.CLEAR_ALL: {
      return state
        .update('list', list => list.clear())
        .set('newTodo', new Todo);
    }

    case actions.ADD_HUNDRED_TODOS: {
      const todos = Range(0, 100).map(() => {
        const id = getRandomString();
        return new Todo({id, title: `Item #${id}`});
      }).toArray();
      return state.update('list', list => list.push(...todos));
    }

  }

  return state;
}
