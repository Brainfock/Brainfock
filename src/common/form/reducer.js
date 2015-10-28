/**
 * Brainfock - community & issue management software
 * Copyright (c) 2015, Sergii Gamaiunov (“Webkadabra”)  All rights reserved.
 *
 * @link http://www.brainfock.com/
 * @copyright Copyright (c) 2015 Sergii Gamaiunov <hello@webkadabra.com>
 */
import {createStore, combineReducers} from 'redux';
import {reducer as formReducer} from 'redux-form';

import {CREATE_ERROR} from '../workspace/actions';

module.exports =  formReducer.plugin({
  createWorkspace: (state, action) => {
    switch(action.type) {
      case CREATE_ERROR:
        if (action.error === true) {
          if (action.payload.error && action.payload.error.details) {
            return {
              ...state,
              namespace: {
                asyncError: action.payload.error.details.messages.namespace.join('; '),
                touched: true,
                value: state.namespace.value
              }
            };
          } else if (action.payload.error) {
            return { //
              ...state,
              _error: action.payload.error.message || 'Unknown Error!'
            };
          } else {
            return {
              ...state,
              _error: action.payload.message.length > 0 && action.payload.message || 'Unknown Error!'
            };
          }
        } else {
          return state;
        }
      default:
        return state;
    }
  }
})