/**
 * Brainfock, <http://www.brainfock.org>
 *
 * Copyright (C) 2015-present Sergii Gamaiunov <hello@webkadabra.com>
 * All rights reserved.
 *
 * This source code is licensed under the GPL-style license found in the
 * LICENSE file in the root directory of this source tree.
 */
import {Map} from 'immutable';
import {bindActionCreators} from 'redux';

import * as appActions from '../app/actions';
import * as authActions from '../auth/actions';
import * as wikiActions from '../wiki/actions';
import * as topicActions from '../topics/actions';
import * as commentsActions from '../comments/actions';
import * as usersActions from '../users/actions';
import * as groupSchemes from '../groupSchemes/actions.js';
import * as workspaceActions from '../workspace/actions';

const actions = [
  appActions,
  authActions,
  wikiActions,
  commentsActions,
  usersActions,
  groupSchemes,
  workspaceActions
];

const appTopicActions = [
  topicActions
];

export default function mapDispatchToProps(dispatch) {
  const creators = Map()
    .merge(...actions)
    .filter(value => typeof value === 'function')
    .toObject();

  const topicActionsCreators = Map()
    .merge(...appTopicActions)
    .filter(value => typeof value === 'function')
    .toObject();

  return {
    actions: bindActionCreators(creators, dispatch),
    topicActions: bindActionCreators(topicActionsCreators, dispatch),
    dispatch
  };
}
