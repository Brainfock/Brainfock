/**
 * Brainfock - Community & Business Management Solution
 *
 * @link http://www.brainfock.org
 * @copyright Copyright (c) 2015 Sergii Gamaiunov <hello@webkadabra.com>
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

const topic_actions = [
  topicActions
];

export default function mapDispatchToProps(dispatch) {
  const creators = Map()
    .merge(...actions)
    .filter(value => typeof value === 'function')
    .toObject();

  const topic_actions_creators = Map()
    .merge(...topic_actions)
    .filter(value => typeof value === 'function')
    .toObject();

  return {
    actions: bindActionCreators(creators, dispatch),
    topic_actions: bindActionCreators(topic_actions_creators, dispatch),
    dispatch
  };
}
