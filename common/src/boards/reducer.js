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

import * as actions from '../topics/actions';
import Todo from './board';
import getRandomString from '../lib/getRandomString';
import {List, Range, Record} from 'immutable';

const InitialState = Record({
  list: List(),
  newTodo: new Todo,
  viewPage: new Todo,
  parentBoard: null,
  currentTopic: null,
  meta:{
    loading: true
  }
});

const initialState = new InitialState;

// Note how JSON from server is revived to immutable record.
const revive = (state) => initialState.merge({
  list: state.list.map(todo => new Todo(todo)),
  newTodo: new Todo(state.newTodo),
  viewPage: new Todo(state.viewPage || {}),
  parentBoard:  new Todo(),
  currentTopic: new Todo(),
  meta:{
    loading: true
  }
});

export default function boardsReducer(state = initialState, action) {
  if (!(state instanceof InitialState)) return revive(state);

  switch (action.type) {

    case actions.FIND:
      return state
        .set('meta',{loading: true})
        .update('list', list => list.clear());

    case actions.FIND_ERROR:
      return state.set('meta',{loading: false})

    case actions.FIND_SUCCESS: {

      const newlist = action.payload.data.map((item) => {
        console.log('item',item)
        item.cid = getRandomString();
        return new Todo(item);
      });
      return state
        .update('list', list => list.clear())
        .update('list', list => list.push(...newlist))
        .set('meta',{loading: false});
    }
  }

  return state;
}
