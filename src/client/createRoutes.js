import App from './app/app.react';
import Home from './pages/home.react';
import Login from './pages/auth.react';
import Me from './pages/me.react';
import NotFound from './pages/notFound.react';
import React from 'react';
import Todos from './pages/todos.react';
import {IndexRoute, Route} from 'react-router';

import Wiki from './wiki/pages/wiki';
import WikiEdit from './wiki/pages/edit';

export default function createRoutes(getState) {

  function requireAuth(nextState, replaceState) {
    const loggedIn = getState().users.viewer;
    if (!loggedIn) {
      replaceState({nextPathname: nextState.location.pathname}, '/login');
    }
  }

  const AdminModule = (process.env.IS_BROWSER) ? require('react-router-proxy?!./modules/admin/components/AdminHome') : require('./modules/admin/components/AdminHome');

  return (
    <Route component={App} path="/">
      <IndexRoute component={Home} />
      <Route component={Login} path="login" />
      <Route component={Me} onEnter={requireAuth} path="me" />
      <Route component={Todos} path="todos" />

      <Route component={require('./boards/index.js')} path="boards"/>
      <Route component={require('./boards/pages/board.js')} path="/board/:board_id">
        <Route component={require('./boards/pages/topic.js')} path="/board/:board_id/topic/:id" />
      </Route>

      <Route component={require('./boards/pages/board.js')} path="/board/:board_id/:key">
        <Route component={require('./boards/pages/topic.js')} path="/board/:board_id/topic/:id" />
      </Route>

      <Route component={Wiki} path="wiki/:uid" />
      <Route component={WikiEdit} path="wiki/:uid/edit" />

      <Route path="admin"
             component={AdminModule}
             childRoutes={[
                require('./modules/admin/modules/users'),
                //require('./modules/admin/routes/Course'),
            ]}
        />
      <Route component={require('./projects/index')} path="projects"/>
      <Route component={require('./projects/project-wrapper')}  >
        { /*  <Route component={require('./projects/topic.js')} path="/:namespace/:board_id-:id" />*/ }
        <Route component={require('./projects/dashboard')} path="/:namespace/:board_id"  />
        <Route component={require('./projects/issues')} path="/:namespace/:board_id/issues" />
        {/* View topic in a group by topic num (ordered) */}
        <Route component={require('./projects/topic.js')} path="/:namespace/:board_id/:group_key/:id" />
        <Route component={require('./projects/boards')} path="/:namespace/:board_id/boards" />
        <Route component={require('./projects/issues')} path="/:namespace/:board_id/milestones" />
        <Route component={require('./projects/issues')} path="/:namespace/:board_id/deals" />
        <Route component={require('./projects/users')} path="/:namespace/:board_id/users" />
        <Route component={require('./projects/settings')} path="/:namespace/:board_id/settings" />
        {/* e.g. 'version', 'component', 'milestone' */}
        <Route component={require('./projects/settings')} path="/:namespace/:board_id/settings/g/:group" />
        {/* <Route component={require('./projects/menuItem')} path="/:namespace/:root_board_id/g/:group_key" /> */}
        {/* <Route component={require('./projects/menuItem')} path="/:namespace/:root_board_id/g/:group_key/i/:item_id" /> */}
      </Route>

      <Route component={NotFound} path="*" />
    </Route>
  );

}
