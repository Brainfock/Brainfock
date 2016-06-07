/**
 * Brainfock, <http://www.brainfock.org>
 *
 * Copyright (C) 2015-present Sergii Gamaiunov <hello@webkadabra.com>
 * All rights reserved.
 *
 * This source code is licensed under the GPL-style license found in the
 * LICENSE file in the root directory of this source tree.
 */
import * as authActions from '../auth/actions';
import * as actions from './actions';
import GroupSchemeRecord from './groupScheme.record.js';
import {List, Range, Record} from 'immutable';
import getRandomString from '../lib/getRandomString';

const InitialState = Record({
  listFilters: List(),
  list: List(),
  listMeta: new (Record({
    isFetching: true,
    count: 0,
  }))
});
const initialState = new InitialState;

function revive({viewer}) {
  // TODO: add revive
  return initialState;
}

export default function usersReducer(state = initialState, action) {
  if (!(state instanceof InitialState)) return revive(state);

  switch (action.type) {

    case actions.FIND:
      return state
        .setIn(['listMeta', 'isFetching'], true)
        .update('list', list => list.clear());

    case actions.FIND_ERROR:
      return state.setIn(['listMeta', 'isFetching'], false);

    case actions.FIND_SUCCESS: {
      const newlist = action.payload.map((item) => {
        item.cid = getRandomString();
        return new GroupSchemeRecord(item);
      });
      return state
        .update('list', list => list.clear())
        .update('list', list => list.push(...newlist))
        .setIn(['listMeta', 'isFetching'], false)
        ;
    }
  }

  return state;
}
