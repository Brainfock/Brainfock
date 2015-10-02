/**
 * Brainfock - community & issue management software
 * Copyright (c) 2015, Sergii Gamaiunov (�Webkadabra�)  All rights reserved.
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
import * as commentsActions from '../comments/actions';
import Todo from './board';
import TopicGroup from './topic-group';
import Comment from '../comments/comment';
import getRandomString from '../lib/getRandomString';
import {List, Range, Record} from 'immutable';

const InitialState = Record({
  list: List(),
  listFilters: List(),
  newTodo: new Todo,
  viewPage: new Todo,
  board: new Todo,
  viewTopic: new Todo,
  group: new TopicGroup,
  meta: new (Record({
    loading: true,
    count:0,
  }))
});

const initialState = new InitialState;

// Note how JSON from server is revived to immutable record.
const revive = (state) => initialState.merge({
  list: state.list.map(todo => new Todo(todo)),
  listFilters: state.listFilters.map(todo => (new Record(todo))),
  newTodo: new Todo(state.newTodo),
  viewPage: new Todo(state.viewPage || {}),
  board:  new Todo(),
  viewTopic: new Todo({loading: false}),
  group: new TopicGroup,
  meta: new (Record({
    loading: true,
    count:0,
  }))
});

export default function boardsReducer(state = initialState, action) {
  if (!(state instanceof InitialState)) return revive(state);

  switch (action.type) {

    case actions.FIND:
      return state
        .setIn(['meta','loading'], true)
        .update('list', list => list.clear());

    case actions.FIND_ERROR:
      return state.setIn(['meta','loading'], false)

    case actions.FIND_SUCCESS:
    {
      const newlist = action.payload.map((item) => {
        item.cid = getRandomString();
        return new Todo(item);
      });
      return state
        .update('list', list => list.clear())
        .update('list', list => list.push(...newlist))
        .setIn(['meta','loading'], false)
        ;
    }

    case actions.FIND_ONE:
      return state
        .set('board', {'loading': true});

    case actions.FIND_ONE_SUCCESS:
      return state
        .set('board', new Todo(action.payload))
        .setIn(['board', 'loading'], false);

    case actions.LOAD_TOPIC:
      return state
        .set('viewTopic', {'loading': true});

    case actions.LOAD_TOPIC_SUCCESS:
      return state
        .set('viewTopic', new Todo(action.payload))
        .setIn(['viewTopic', 'loading'], false);

    // load all comments
    case commentsActions.LOAD_COMMENTS_SUCCESS:
    {

      const newlist = action.payload.map((item) => {
        console.log('item', item)
        item.cid = getRandomString();
        return new Comment(item);
      });
      return state
        .updateIn(['viewTopic', 'comments'], list => list.clear())
        .updateIn(['viewTopic', 'comments'], list => list.push(...newlist));
    }

    // post or catch new comment via sockets:
    case commentsActions.ADD_ONE_COMMENT:
      return state
        .updateIn(['viewTopic','comments'], comments => comments.push(Comment(action.payload)))

    case actions.LOAD_TOPIC_GROUP:
      return state
        //.setIn(['board', 'group'],new TopicGroup())
        .set('group', new TopicGroup());

    case actions.LOAD_TOPIC_GROUP_SUCCESS:
      return state
        //.setIn(['board', 'group'], new TopicGroup(action.payload))
        .set('group', new TopicGroup(action.payload));

    case actions.COUNT_SUCCESS:
      return state
        .setIn(['meta','count'], action.payload.count);

    case actions.LOAD_FILTERS_SUCCESS:
    {
      const newlist = action.payload.filters.map((item) => {
        item.cid = getRandomString();
        return new (Record(item));
      });
      return state
        .update('listFilters', list => list.clear())
        .update('listFilters', list => list.push(...newlist))
        ;
    }
  }

  return state;
}
