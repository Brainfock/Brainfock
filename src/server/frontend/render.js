import DocumentTitle from 'react-document-title';
import Html from './html.react';
import React from 'react';
import ReactDOMServer from 'react-dom/server';
import config from '../config';
import createLocation from 'history/lib/createLocation';
import useragent from 'useragent';
import {HOT_RELOAD_PORT} from '../../../webpack/constants';
import {IntlProvider} from 'react-intl';
import {Provider} from 'react-redux';
import {RoutingContext, match} from 'react-router';
import serialize from 'serialize-javascript';
import Promise from 'bluebird';
import Todo from '../../common/todos/todo';
import initialState from '../initialState';
import {configureStore} from '../../common';
import {fromJS} from 'immutable';
import {mapDispatchToProps} from '../../common';

import createRoutes from '../../client/createRoutes.js';
import {createMemoryHistory} from 'history';

import loopback from 'loopback';
import app from '../main';

/*export default function render(req, res, next) {
  createStore(req, res)
    .then((store, renderProps) => renderPage(store, renderProps, req, res, next))
    .then(html => res.send(html))
    .catch(next);
}*/

export default function render(req, res, next) {
  const ctx = loopback.getCurrentContext();
  const currentUser = ctx && ctx.get('currentUser');
  let _state ={
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

  const state = fromJS(initialState).mergeDeep(_state).toJS();
  const store = configureStore({initialState: state});

  const {actions} = mapDispatchToProps(store.dispatch);
  actions.setAppBaseUrl(app.get('baseUrl'));

  // Fetch logged in user here because routes may need it. Remember we can use
  // store.dispatch method.
  const routes = createRoutes(() => store.getState());
  const location = createMemoryHistory().createLocation(req.url);

  match({routes, location}, (error, redirectLocation, renderProps) => {

    if (redirectLocation) {
      res.redirect(301, redirectLocation.pathname + redirectLocation.search);
      return;
    }

    if (error) {
      next(error);
      return;
    }

    // // Not possible with * route.
    // if (renderProps == null) {
    //   res.send(404, 'Not found');
    //   return;
    // }

    fetchComponentData(store.dispatch, req, renderProps, store.getState())
      .then(() => renderPage(store, renderProps, req))
      .then(html => res.send(html))
      .catch(next);
  });
}

function renderPage(store, renderProps, req) {
  const clientState = store.getState();
  const {headers, hostname} = req;
  const appHtml = getAppHtml(store, renderProps);
  const scriptHtml = getScriptHtml(clientState, headers, hostname);

  return '<!DOCTYPE html>' + ReactDOMServer.renderToStaticMarkup(
      <Html
        appCssHash={config.assetsHashes.appCss}
        bodyHtml={`<div id="app">${appHtml}</div>${scriptHtml}`}
        googleAnalyticsId={config.googleAnalyticsId}
        isProduction={config.isProduction}
        title={DocumentTitle.rewind()}
        />
    );
}

function fetchComponentData(dispatch, req, {components, location, params},{app, users}) {
  const fetchActions = components.reduce((actions, component) => {
    return actions.concat(component.fetchAction || []);
  }, []);
  const promises = fetchActions.map(action => dispatch(action({
    location,
    params,
    app, users
  })));
  return Promise.all(promises);
}

function renderPage(store, renderProps, req) {
  const clientState = store.getState();
  const {headers, hostname} = req;
  const appHtml = getAppHtml(store, renderProps);
  const scriptHtml = getScriptHtml(clientState, headers, hostname);

  return '<!DOCTYPE html>' + ReactDOMServer.renderToStaticMarkup(
      <Html
        appCssHash={config.assetsHashes.appCss}
        bodyHtml={`<div id="app">${appHtml}</div>${scriptHtml}`}
        googleAnalyticsId={config.googleAnalyticsId}
        isProduction={config.isProduction}
        title={DocumentTitle.rewind()}
        />
    );
}

function getAppHtml(store, renderProps) {
  return ReactDOMServer.renderToString(
    <Provider store={store}>
      <IntlProvider>
        <RoutingContext {...renderProps} />
      </IntlProvider>
    </Provider>
  );
}

function getScriptHtml(clientState, headers, hostname) {
  let scriptHtml = '';

  const ua = useragent.is(headers['user-agent']);
  const needIntlPolyfill = ua.safari || (ua.ie && ua.version < '11');
  if (needIntlPolyfill) {
    scriptHtml += `
      <script src="/node_modules/intl/dist/Intl.min.js"></script>
      <script src="/node_modules/intl/locale-data/jsonp/en-US.js"></script>
    `;
  }

  const appScriptSrc = config.isProduction
    ? '/_assets/app.js?' + config.assetsHashes.appJs
    : `//${hostname}:${HOT_RELOAD_PORT}/build/app.js`;

  // Note how clientState is serialized. JSON.stringify is anti-pattern.
  // https://github.com/yahoo/serialize-javascript#user-content-automatic-escaping-of-html-characters
  return scriptHtml + `
    <script>
      window.__INITIAL_STATE__ = ${serialize(clientState)};
    </script>
    <script src="${appScriptSrc}"></script>
  `;
}
