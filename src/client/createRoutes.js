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

  const CreateWorkspace = (process.env.IS_BROWSER) ? require('react-router-proxy?!./workspace/create') : require('./workspace/create');

  return (
    <Route component={App} path="/">
      <IndexRoute component={Home} />
      <Route component={Login} path="login" />
      <Route component={Me} onEnter={requireAuth} path="me" />
      <Route component={Todos} path="todos" />

      <Route component={require('./issues/index.js')} path="tasks"/>

      <Route component={require('./boards/index.js')} path="boards"/>
      <Route component={require('./boards/pages/board.js')} path="/board/:board_id">
        <Route component={require('./boards/pages/topic.js')} path="/board/:board_id/topic/:id" />
      </Route>
      <Route component={require('./projects/settings')} path="/board/edit/:board_id" />
      <Route component={require('./boards/pages/board.js')} path="/board/:board_id/:key">
        { /*<Route component={require('./boards/pages/topic.js')} path="/board/:board_id/topic/:id" /> */ }
      </Route>
      <Route component={require('./boards/pages/topic.js')} path="/board/:board_id/:boardKey/:id"/>
      <Route component={require('./boards/pages/topic.js')} path="/board/:board_id/:boardKey/:id/:key"/>

      <Route component={Wiki} path="wiki/:uid" />
      <Route component={WikiEdit} path="wiki/:uid/edit" />

      <Route component={CreateWorkspace} path="/workspaces/create" />

      <Route {...require('./modules/admin')} onEnter={requireAuth} />

      <Route {...require('./modules/workspace')} />

      <Route component={require('./projects/index')} path="projects"/>
      <Route component={require('./projects/project-wrapper')}  >
        { /*  <Route component={require('./projects/topic.js')} path="/:namespace/:board_id-:id" />*/ }
        <Route component={require('./projects/dashboard')} path="/:namespace/:board_id"  />

        /* routes superseeded by `list.controller.js` */
        { /*<Route component={require('./projects/issues')} path="/:namespace/:board_id/issues" />
        <Route component={require('./projects/boards')} path="/:namespace/:board_id/boards" />
        <Route component={require('./projects/issues')} path="/:namespace/:board_id/milestones" />
        <Route component={require('./projects/issues')} path="/:namespace/:board_id/deals" /> */ }

        <Route component={require('./projects/users')} path="/:namespace/:board_id/users" />
        <Route component={require('./projects/settings')} path="/:namespace/:board_id/settings" />
        /* e.g. 'version', 'component', 'milestone' */
        <Route component={require('./projects/settings')} path="/:namespace/:board_id/settings/g/:group" />

        /* LIST TOPICS, e.g. view issues, opportunities, courses, lectures */
        { /*<Route component={require('./projects/issues.js')} path="/:namespace/:board_id/:group_key" /> */ }
        <Route component={require('./projects/discussions.controller.js')} path="/:namespace/:board_id/discussions" />
        <Route component={require('./projects/boards.controller.js')} path="/:namespace/:board_id/discussions" />
        <Route component={require('./projects/list.controller.js')} path="/:namespace/:board_id/:groupKey" />

        <Route component={require('./projects/browse.controller.js')} path="/:namespace/:board_id/:groupKey/:sub_board_num/:slug/browse" />
        <Route component={require('./projects/browse.controller.js')} path="/:namespace/:board_id/:groupKey/:sub_board_num/browse" />
        /* View topic in a group by topic num (ordered) */
        <Route component={require('./projects/topic.js')} path="/:namespace/:board_id/:group_key/:id" />

        /* LIST TOPICS, e.g. view issues, opportunities, courses, lectures */


        {/* <Route component={require('./projects/menuItem')} path="/:namespace/:root_board_id/g/:group_key" /> */}
        {/* <Route component={require('./projects/menuItem')} path="/:namespace/:root_board_id/g/:group_key/i/:item_id" /> */}
      </Route>

      <Route {...require('./workspace/homepage')} />

      <Route component={NotFound} path="*" />
    </Route>
  );

}
