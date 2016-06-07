import {combineReducers} from 'redux';

// Reducers
import auth from '../auth/reducer';
import device from '../device/reducer';
import intl from '../intl/reducer';
import todos from '../todos/reducer';
import users from '../users/reducer';
import groupSchemes from '../groupSchemes/reducer';
import wiki from '../wiki/reducer';
import boards from '../boards/reducer';
import app from './app-reducer';
import workspace from '../workspace/reducer';
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
  form,
  workspace,
  groupSchemes
});

export default appReducer;
