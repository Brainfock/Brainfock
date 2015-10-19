import React from 'react';
import ReactDOM from 'react-dom';
import Router from 'react-router';
import {configureStore} from '@este/common';
import createBrowserHistory from 'history/lib/createBrowserHistory';
import createRoutes from './createRoutes';
import {IntlProvider} from 'react-intl';
import {Provider} from 'react-redux';
import { Resolver } from "react-resolver";
import injectTapEventPlugin from "react-tap-event-plugin";

const app = document.getElementById('app');
const initialState = window.__INITIAL_STATE__;

const store = configureStore(initialState);
const routes = createRoutes(() => store.getState());

//Needed for onTouchTap
//Can go away when react 1.0 release
//Check this repo:
//https://github.com/zilverline/react-tap-event-plugin
injectTapEventPlugin();

ReactDOM.render(
  <Provider store={store}>
    <IntlProvider>
      <Router history={createBrowserHistory()}>
        {routes}
      </Router>
    </IntlProvider>
  </Provider>,
  app
);

//Resolver.render(
//  () => <Provider store={store}>
//    <IntlProvider>
//      <Router history={createBrowserHistory()}>
//        {routes}
//      </Router>
//    </IntlProvider>
//  </Provider>,
//  document.getElementById("app")
//);
