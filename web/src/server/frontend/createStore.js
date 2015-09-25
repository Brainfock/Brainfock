import Promise from 'bluebird';
import Todo from '@este/common/src/todos/todo';
import initialState from '../initialState';
import {configureStore} from '@este/common';
import {fromJS} from 'immutable';
import {mapDispatchToProps} from '@este/common';
import loopback from 'loopback';

export default function createStore(req) {
  return new Promise((resolve, reject) => {

    var ctx = loopback.getCurrentContext();
    var currentUser = ctx && ctx.get('currentUser');
    var _state ={
      device: {
        isMobile: ['phone', 'tablet'].indexOf(req.device.type) > -1
      },
      users: {
        viewer: currentUser ? ctx.get('currentUser') : null
      }
    };

    // provide auth token id to client
    if(currentUser) {
      _state.users.viewer.authToken = ctx.get('accessToken').id;
    }

    const requestState = fromJS(initialState).mergeDeep(_state);
    const store = configureStore(requestState.toJS());
    const {actions} = mapDispatchToProps(store.dispatch);

    actions.addTodo(new Todo({title: 'relax'}));
    resolve(store);
  });
}




