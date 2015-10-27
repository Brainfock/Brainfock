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
        if(action.error === true && action.payload.error) {
          return {
          ...state,
          namespace: {
            asyncError: action.payload.error.details.messages.namespace.join('; '),
            touched: true,
            value: state.namespace.value
          }
        };
        } else {
          return state;
        }
      default:
        return state;
    }
  }
})