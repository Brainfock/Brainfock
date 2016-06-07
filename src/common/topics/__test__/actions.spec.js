/**
 * Brainfock, <http://www.brainfock.org>
 *
 * Copyright (C) 2015-present Sergii Gamaiunov <hello@webkadabra.com>
 * All rights reserved.
 *
 * This source code is licensed under the GPL-style license found in the
 * LICENSE file in the root directory of this source tree.
 */
//import {Map, fromJS} from 'immutable';
//import reducer from '../../../common/boards/reducer.js';
import {configureStore} from '../../';
import {
  expect,
  //assert,
  //React,
  //sinon,
  //TestUtils
} from '../../../../test/mochaTestHelper';

import {/*SET_NEW_TOPIC_FIELD, */setNewTopicField, makeTopicUpdateFormRecord} from '../../../common/topics/actions';

// TODO: write tests to capture errors that occur because of store's
// `reive()` mistakes e.g. setting `newTopic` to bad record

/*describe('actions', () => {

  it('should create an action to add a todo', () => {
    const event = {
      target: {
        name: 'namespace',
        value: 'someNamespace'
      }
    };
    const expectedAction = {
      type: SET_NEW_TOPIC_FIELD,
      payload: {
        name: 'namespace',
        value: 'someNamespace'
      }
    };
    expect(setNewTopicField(event)).to.eql(expectedAction);
  });
});*/

describe('actions reduxers', () => {

  it('is a Redux store configured with the correct reducer', () => {
    const store = configureStore();
    const event = {
      target: {
        name: 'namespace',
        value: 'someNamespace'
      }
    };

    store.dispatch(makeTopicUpdateFormRecord('test', {}));
    store.dispatch(setNewTopicField(event, {id: 'test'}));
    expect(store.getState().boards.getIn(['forms', 'id', 'test', 'data', 'namespace'])).to.equal('someNamespace');

    store.dispatch(setNewTopicField({
      target: {
        name: 'summary',
        value: 'Summary Text'
      }
    }, {id: 'test'}));
    expect(store.getState().boards.getIn(['forms', 'id', 'test', 'data', 'summary'])).to.equal('Summary Text');
    expect(store.getState().boards.getIn(['forms', 'id', 'test']).toJS()).to.have.ownProperty('meta');
    expect(store.getState().boards.getIn(['forms', 'id', 'test']).toJS()).to.have.ownProperty('data');
  });
});
