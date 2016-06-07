/**
 * Brainfock, <http://www.brainfock.org>
 *
 * Copyright (C) 2015-present Sergii Gamaiunov <hello@webkadabra.com>
 * All rights reserved.
 *
 * This source code is licensed under the GPL-style license found in the
 * LICENSE file in the root directory of this source tree.
 */
import {Map, fromJS} from 'immutable';
import reducer from '../../../common/boards/reducer.js';
import {configureStore} from '../../';
import {
  expect,
  assert,
  React,
  sinon,
  TestUtils
} from '../../../../test/mochaTestHelper';

import {SET_NEW_TOPIC_FIELD, setNewTopicField} from '../../../common/topics/actions';

// TODO: write tests to captura errors that occur because of store's
// `reive()` mistakes e.g. setting `newTopic` to bad record

describe('actions', () => {

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
});

describe('actions reduxers', () => {

  it('is a Redux store configured with the correct reducer', () => {
    const store = configureStore();
    const event = {
      target: {
        name: 'namespace',
        value: 'someNamespace'
      }
    };
    store.dispatch(setNewTopicField(event));
    expect(store.getState().boards.newTopic.data.namespace).to.equal('someNamespace');
    store.dispatch(setNewTopicField({
      target: {
        name: 'summary',
        value: 'Summary Text'
      }
    }));
    expect(store.getState().boards.newTopic.data.summary).to.equal('Summary Text');
    expect(store.getState().boards.newTopic.toJS()).to.have.ownProperty('meta');
    expect(store.getState().boards.newTopic.toJS()).to.have.ownProperty('data');
  });
});
/*

describe('boards reducer', () => {

  //it('should return the initial state', () => {
  //  expect(
  //    reducer(undefined, {})
  //  ).toEqual([
  //      {
  //        text: 'Use Redux',
  //        completed: false,
  //        id: 0
  //      }
  //    ])
  //})

  const event = {
    target: {
      name: 'namespace',
      value: 'someNamespace'
    }
  }

  const expectedAction = {
    type: SET_NEW_TOPIC_FIELD,
    payload: {
      name: 'namespace',
      value: 'someNamespace'
    }
  }

  it('should handle setNewTopicField action', () => {

    const reply = reducer({}, setNewTopicField(event)).newTopic.toJS();
    console.log('> reply',reply)
    expect(
      //reducer(new InitialState, setNewTopicField(event)).newTopic.data
      reply
    ).to.have.property('data', 'namespace');
    //).to.have.property('namespace', 'someNamespace');

    //expect(reducer(new InitialState, setNewTopicField(event)).newTopic.data.toJS()).to.have.ownProperty('meta');
    //).to.have({namespace: 'someNamespace'})

    //expect(
    //  reducer(
    //    [
    //      {
    //        text: 'Use Redux',
    //        completed: false,
    //        id: 0
    //      }
    //    ],
    //    {
    //      type: types.ADD_TODO,
    //      text: 'Run the tests'
    //    }
    //  )
    //).toEqual(
    //  [
    //    {
    //      text: 'Run the tests',
    //      completed: false,
    //      id: 1
    //    },
    //    {
    //      text: 'Use Redux',
    //      completed: false,
    //      id: 0
    //    }
    //  ]
    //)
  })
})

*/
