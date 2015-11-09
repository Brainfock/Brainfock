/**
 * Brainfock - Community & Business Management Solution
 *
 * @link http://www.brainfock.org
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
    loading: false,
    group: '',
    fields: List(),
  })),
  newTopic: new Model,
  viewPage: new Model,
  meta: new (Record({
    isFetching: false,
    loading: false,
    count: 0,
  })),
  active: new Model(),
});

const initialState = new InitialState;

const revive = (state) => initialState.merge({
  list: state.list.map(item => new Model(item))
});

export default function spacesReducer(state = initialState, action) {
  if (!(state instanceof InitialState)) return revive(state);

  switch (action.type) {

    case actions.CREATE:
      return state
        // lock form submit buttons etc.
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
          meta: new (Record({
            isFetching: false,
            hasError: false,
            errors: List()
          }))
        }));
  }

  return state;
}
