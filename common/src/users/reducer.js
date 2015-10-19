import * as authActions from '../auth/actions';
import User from './user';
import CurrentUser from './currentUser';
import {Record} from 'immutable';

const InitialState = Record({
  viewer: null
});
const initialState = new InitialState;

function revive({viewer}) {
  return initialState.merge({
    // Handle user authenticated on the server.
    viewer: viewer ? new CurrentUser(viewer) : null
  });
}

export default function usersReducer(state = initialState, action) {
  if (!(state instanceof InitialState)) return revive(state);

  switch (action.type) {

    case authActions.LOGIN_SUCCESS: {
      let setUser = {...action.payload.user, authToken:action.payload.id};
      return state.set('viewer', new CurrentUser(setUser));
    }
    // TODO: remove 'LOGOUT' action from list when logout fetch is fixed
    case authActions.LOGOUT:
    case authActions.LOGOUT_SUCCESS: {
      return state.set('viewer',null);
    }

  }

  return state;
}
