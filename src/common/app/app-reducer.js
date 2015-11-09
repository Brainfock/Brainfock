/**
 * Brainfock - Community & Business Management Solution
 *
 * @link http://www.brainfock.org
 * @copyright Copyright (c) 2015 Sergii Gamaiunov <hello@webkadabra.com>
 */
import * as actions from './actions';
import * as topicActions from '../topics/actions';
import {Record} from 'immutable';

const InitialState = Record({
  baseUrl: ''
});
const initialState = new InitialState;

export default function authReducer(state = initialState, action) {
  if (!(state instanceof InitialState)) return initialState.mergeDeep(state);

  switch (action.type) {
    case actions.APP_SET_BASEURL: {
      return state.set('baseUrl', action.payload);
    }
    case topicActions.LOAD_TOPIC_GROUP_ERROR: {
      const error = action.payload.message ? action.payload.message : null;
      if (error) {
      	alert(error);
      }
      //return state.set('baseUrl', action.payload);
    }
  }

  return state;
}
