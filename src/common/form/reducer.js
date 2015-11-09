/**
 * Brainfock - Community & Business Management Solution
 *
 * @link http://www.brainfock.org
 * @copyright Copyright (c) 2015 Sergii Gamaiunov <hello@webkadabra.com>
 */
import {createStore, combineReducers} from 'redux';
import {reducer as formReducer} from 'redux-form';

import {CREATE_ERROR} from '../workspace/actions';
import {SET_NEW_TOPIC_FIELD} from '../topics/actions';
import {CREATE_ERROR as TOPIC_CREATE_ERROR} from '../topics/actions';

module.exports =  formReducer.plugin({
  // `createWorkspace` is the name of form
  createWorkspace: (state, action) => {
    switch (action.type) {
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
  },
  createTopic: (state, action) => {
    switch (action.type) {
      case TOPIC_CREATE_ERROR:
        if (action.error === true) {
          if (action.payload.error && action.payload.error.details) {

            // loop
            for (let fieldName in action.payload.error.details.messages) {
              if (action.payload.error.details.messages.hasOwnProperty(fieldName)) {
                const message = action.payload.error.details.messages[fieldName];
                if (!state[fieldName]) {
                  state[fieldName] = {};
                }
                state[fieldName].asyncError = message.join('; ');
                state[fieldName].touched = true;
              }
              ;
            }
            return { //
              ...state,
            };
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

      case SET_NEW_TOPIC_FIELD: {
        if (state[action.payload.name]) {
          state[action.payload.name].value = action.payload.value;
        } else {
          state[action.payload.name] = {value: action.payload.value};
        }
        // reset error when we reset form value
        state[action.payload.name].error = null;
        //state[action.payload.name].asyncError = null;
        state[action.payload.name].touched = true;
        return state;
        //return {
        //  ...state,
        //  namespace: {
        //    asyncError: action.payload.error.details.messages.namespace.join('; '),
        //    touched: true,
        //    value: state.namespace.value
        //  }
        //};

        //const {name, value} = action.payload;
        //return state.setIn(['newTopic', name], value);
      }
      default:
        return state;
    }
  }
})