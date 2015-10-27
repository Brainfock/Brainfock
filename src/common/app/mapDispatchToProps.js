import * as appActions from './actions';
import * as authActions from '../auth/actions';
import * as todosActions from '../todos/actions';
import * as wikiActions from '../wiki/actions';
import * as topicActions from '../topics/actions';
import * as commentsActions from '../comments/actions';
import * as workspaceActions from '../workspace/actions';

import {Map} from 'immutable';
import {bindActionCreators} from 'redux';

const actions = [
  appActions,
  authActions,
  todosActions,
  wikiActions,
  commentsActions,
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
