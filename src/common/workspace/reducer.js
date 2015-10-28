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

import * as actions from './actions';
import Model from './model';
import getRandomString from '../lib/getRandomString';
import {List, Range, Record} from 'immutable';

const InitialState = Record({
  list: List(),
  listFilters: List(),
  formFields: new (Record({
    loading: true,
    group: '',
    fields: List(),
  })),
  newTopic: new Model,
  viewPage: new Model,
  meta: new (Record({
    loading: true,
    count: 0,
  })),
  active: new Model(),
});

const initialState = new InitialState;

const revive = (state) => initialState.merge({
  list: state.list.map(item => new Model(item)),
});

export default function spacesReducer(state = initialState, action) {
  if (!(state instanceof InitialState)) return revive(state);

  switch (action.type) {

    case actions.CREATE:
      return state
        // lockform submit buttons etc.
        .setIn(['formFields', 'loading'], true);

    case actions.CREATE_SUCCESS:
      return state
        .update('list', list => list.unshift(Model({data: action.payload})))
        .setIn(['formFields', 'loading'], false);

    case actions.FIND_ONE:
      return state
        .setIn(['active', 'meta', 'isFetching'], true);

    case actions.FIND_ONE_ERROR:
      return state
        .setIn(['active', 'meta', 'isFetching'], false)
        .setIn(['active', 'meta', 'errors'], ['Something went wrong']);

    case actions.FIND_ONE_SUCCESS:
      return state
        .set('active', new Model({
          data: action.payload,
          meta: {
            isFetching: false
          }
        }));

  }

  return state;
}
