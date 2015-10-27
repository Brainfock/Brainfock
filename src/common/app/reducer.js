import {combineReducers} from 'redux';
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
import form from '../form/reducer';

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
