import Promise from 'bluebird';
import Todo from '@este/common/src/todos/todo';
import initialState from '../initialState';
import {configureStore} from '@este/common';
import {fromJS} from 'immutable';
import {mapDispatchToProps} from '@este/common';
import loopback from 'loopback';
import app from '../main';

import createRoutes from '../../client/createRoutes.js';
import createLocation from 'history/lib/createLocation';
import {RoutingContext, match} from 'react-router';

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
    actions.setAppBaseUrl(app.get('baseUrl'));

    const routes = createRoutes(() => store.getState());
    const location = createLocation(req.url);

    match({routes, location}, (error, redirectLocation, renderProps) => {

      if (redirectLocation) {
        resolve(store);
        return;
      }

      if (error) {
        resolve(store);
        return;
      }

      if (renderProps == null) {
        resolve(store);
        return;
      }

      if(renderProps.routes[1] && renderProps.routes[1]){

        let resolveProps = store.getState();
        resolveProps.params = renderProps.params;
        resolveProps.actions = actions;

        let resolvingComponent = new renderProps.routes[1].component;
        if(resolvingComponent.resolveData) {
          resolvingComponent.resolveData(resolveProps, store.dispatch)
          .then(function(resolved){
              resolve(store);
            })
        }
        else {
          resolve(store);
        }
      }
    });
  });
}




