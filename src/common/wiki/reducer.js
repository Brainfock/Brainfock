/**
 * Brainfock, <http://www.brainfock.org>
 *
 * Copyright (C) 2015-present Sergii Gamaiunov <hello@webkadabra.com>
 * All rights reserved.
 *
 * This source code is licensed under the GPL-style license found in the
 * LICENSE file in the root directory of this source tree.
 */
import * as actions from './actions';
import Todo from './wiki-page';
import {List, Record} from 'immutable';

const InitialState = Record({
  list: List(),
  newTodo: new Todo,
  viewPage: new Todo,
  meta: new (Record({
    loading: true
  }))
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
        .setIn(['viewPage', 'loading'], false)
        .setIn(['viewPage', 'clientSavedOn'], Date.now());
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
