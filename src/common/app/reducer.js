import {combineReducers} from 'redux';
import {reducer as formReducer} from 'redux-form';
import Immutable from 'immutable';

// Reducers
import auth from '../auth/reducer';
import device from '../device/reducer';
import intl from '../intl/reducer';
import todos from '../todos/reducer';
import users from '../users/reducer';
import wiki from '../wiki/reducer';
import boards from '../boards/reducer';
import app from './app-reducer';


//const immutableize = reducer => (state, action) =>
//  Immutable.fromJS(reducer(state && state.toJS ? state.toJS() : {}, action));
//const form = immutableize(formReducer);
const form = formReducer;


const appReducer = combineReducers({
  app,
  auth,
  device,
  intl,
  todos,
  users,
  wiki,
  boards,
  form
});

export default appReducer;
