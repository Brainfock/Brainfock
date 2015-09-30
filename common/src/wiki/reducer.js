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

    case actions.SET_EDIT_WIKI_FIELD: {
      const {name, value} = action.payload;
      return state.setIn(['viewPage', name], value);
    }

    case actions.SAVE: {
      return state
        // disable form buttons from being pressed while page is being loaded
        .setIn(['viewPage', 'loading'], true);
    }
    case actions.SAVE_ERROR:
      return state
        // enable form buttons from being pressed while page is being loaded
        .setIn(['viewPage', 'loading'], false);

    case actions.SAVE_SUCCESS: {
      return state
        // ensure we'll have page `id` after save for correct REST API calls
        .set('viewPage', new Todo(action.payload))
        .setIn(['viewPage', 'loading'], false);
    }

    case actions.FIND: {
      return state
        // disable form buttons from being pressed while page is being loaded
        .setIn(['viewPage', 'loading'], true);
    }

    case actions.FIND_SUCCESS: {
      return state
        .set('viewPage', new Todo(action.payload))
        .setIn(['viewPage', 'loading'], false);
    }

  }

  return state;
}
