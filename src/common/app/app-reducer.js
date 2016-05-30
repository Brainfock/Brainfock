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
import * as topicActions from '../topics/actions';
import {Record} from 'immutable';

const InitialState = Record({
  baseUrl: '',
  activeSectionId: '',
  activeSectionLabel: '',
  activeSubSectionLabel: '',
});
const initialState = new InitialState;

export default function authReducer(state = initialState, action) {
  if (!(state instanceof InitialState)) return initialState.mergeDeep(state);

  switch (action.type) {
    case actions.APP_SET_BASEURL: {
      return state.set('baseUrl', action.payload);
    }
    case actions.APP_SET_ACTIVE_SECTION: {
      return state
        .set('activeSectionLabel', action.payload.label)
        .set('activeSubSectionLabel', action.payload.subLabel);
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
