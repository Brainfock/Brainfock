/**
 * Part of Brainfock.
 * Copyright (C) 2015-present Sergii Gamaiunov <hello@webkadabra.com>
 * All rights reserved.
 *
 * This source code is licensed under the GPL-style license found in the
 * LICENSE file in the root directory of this source tree.
 *
 * @link http://www.brainfock.org
 */
import * as actions from '../topics/actions';
import * as commentsActions from '../comments/actions';
import Todo from './board';
import FormRecord from './form';
import MemberForm from './member-form';
import MemberFormModel from '../topics/topic-user.js';
import ModelSchema from './model.js';
import TopicGroup from './topic-group';
import Comment from '../comments/comment';
import getRandomString from '../lib/getRandomString';
import {List, Record, Map} from 'immutable';

const InitialState = Record({
  list: List(),
  listFilters: List(),
  formFields: new (Record({
    loading: true,
    group: '',
    fields: List()
  })),
  // represents form to create/edit topic
  newTopic: new FormRecord,
  // TODO: add 'updateTopic' store, or else update & create forms have conflict
  board: new Todo,
  viewTopic: new Todo,
  group: new TopicGroup,
  groups: new Map(),

  //forms: new Map(),
  forms: new Map(),
  formsRegistry: new Map(),

  // `meta` represents meta state of a list
  meta: new (Record({
    groupKey: '', // group key of a list, changes only on request end (success or error)
    queryString: '',
    // TODO: clean up using of 'loading' in favor of more descriptiove 'isFetching'
    loading: true,
    count: 0,
    isSubmitting: false,
    isFetching: false,
    error: '',
    errors: new Map()
  })),
  form: new FormRecord
});

const initialState = new InitialState;

// Note how JSON from server is revived to immutable record.
const revive = (state) => initialState.merge({
  list: state.list ? state.list.map(todo => new Todo(todo)) : List(),
  listFilters: state.listFilters ? state.listFilters.map(todo => (new Record(todo))) : List(),
  newTopic: new FormRecord,
  board: new Todo,
  viewTopic: new Todo({loading: false}),
  forms: new Map(),
  formsRegistry: new Map(),
  group: new TopicGroup
});

export default function boardsReducer(state = initialState, action) {
  if (!(state instanceof InitialState)) return revive(state);

  switch (action.type) {

    case actions.FIND:

      if (action.meta.groupKey && state.meta.groupKey
        && action.meta.groupKey !== state.meta.groupKey) {
        state.update('list', list => list.clear());
      }

      return state
        .setIn(['meta', 'loading'], true)
        .setIn(['meta', 'isFetching'], true)
        .deleteIn(['meta', 'error']); // reset list errors (e.g. there was problem fetchin sometihng and user switched lists)

    case actions.FIND_ERROR: {

      if (action.meta.groupKey && (!state.meta.groupKey || (state.meta.groupKey
        && action.meta.groupKey !== state.meta.groupKey))) {
        // clear list, or else user may see error message with items of another list
        state = state.update('list', list => list.clear());
      }

      if (action.error === true) {

        if (action.payload.error) {
          return state
            .setIn(['meta', 'error'], action.payload.error.message || 'Unknown Error!')
            .setIn(['meta', 'isFetching'], false)
            .setIn(['meta', 'loading'], false);
        } else {
          return state
            .setIn(['meta', 'error'], action.payload.message.length > 0 && action.payload.message || 'Unknown Error!')
            .setIn(['meta', 'isFetching'], false)
            .setIn(['meta', 'loading'], false);
        }
      } else {
        return state
          .setIn(['meta', 'loading'], false)
          .setIn(['meta', 'isFetching'], false);
      }
    }

    case actions.FIND_SUCCESS: {

      const newlist = action.payload.map((item) => {
        item.cid = getRandomString();
        return new Todo(item);
      });
      return state
        .update('list', list => list.clear())
        .update('list', list => list.push(...newlist))

        .setIn(['meta', 'groupKey'], action.meta.groupKey)
        //.setIn(['meta', 'queryString'],  action.meta.queryString || '')

        .setIn(['meta', 'isFetching'], false)
        .setIn(['meta', 'loading'], false)
        // cleanup list fetch errors after list is loaded successfully
        .deleteIn(['meta', 'error'])
        .deleteIn(['meta', 'errors']);
    }

    case actions.FIND_ONE:
      return state
        .setIn(['board', 'isFetching'], true)
        .setIn(['board', 'loading'], true);
    // todo: board.meta.isFetching - if fetching form serer
    // todo: board.meta.isLoaded - if model has been loaded (redundant if we have id)

    case actions.FIND_ONE_SUCCESS:

      return state
        //.set('board', new Todo(action.payload))
        .setIn(['board', 'data'], new ModelSchema(action.payload || {}))
        .setIn(['board', 'id'], action.payload.id)
        .setIn(['board', 'isFetching'], false)
        .setIn(['board', 'loading'], false)
        .setIn(['board', 'cid'], getRandomString());

    case actions.LOAD_TOPIC:
      return state
        .setIn(['viewTopic', 'isFetching'], true)
        .setIn(['viewTopic', 'loading'], true);

    case actions.SET_CURRENT_TOPIC:
      return state
        .setIn(['viewTopic', 'id'], action.payload);

    case actions.LOAD_TOPIC_SUCCESS: {
      // payload *may* be an array if we were looking for topic inside of another topic e.g. ``/api/topics/SomeTopic/topics/?filter...``
      const data = action.payload.length && action.payload.length > 0 ? action.payload[0] : action.payload;
      return state
        .set('viewTopic', new Todo(data))
        .setIn(['viewTopic', 'isFetching'], false)
        .setIn(['viewTopic', 'loading'], false);
    }

    // load all comments
    case commentsActions.LOAD_COMMENTS_SUCCESS: {
      const newlist = action.payload.map((item) => {
        item.cid = getRandomString();
        return new Comment(item);
      });
      return state
        .updateIn(['viewTopic', 'comments'], list => list.clear())
        .updateIn(['viewTopic', 'comments'], list => list.push(...newlist));
    }

    // post or catch new comment via sockets:
    case commentsActions.ADD_ONE_COMMENT:
      return state
        .updateIn(['viewTopic', 'comments'], comments => comments.push(Comment(action.payload)));

    case actions.LOAD_TOPIC_GROUP:
      return state
        // TODO: set group as a part of topic if there is topicId in action.meta ?
        //.setIn(['board', 'group'],new TopicGroup())
        .set('group', new TopicGroup());

    case actions.LOAD_TOPIC_GROUP_SUCCESS: {
      if (action.meta.groupKey && !state.groups.get(action.meta.groupKey)) {
        state = state.setIn(['groups', action.meta.groupKey], new TopicGroup(action.payload));
      }

      return state
        //.setIn(['board', 'group'], new TopicGroup(action.payload))
        .set('group', new TopicGroup(action.payload));
    }

    case action.LOAD_TOPIC_GROUP_ERROR:
      return state;

    case actions.COUNT_SUCCESS:
      return state
        .setIn(['meta', 'count'], action.payload.count);

    case actions.LOAD_FILTERS_SUCCESS: {
      const newlist = action.payload.filters.map((item) => {
        item.cid = getRandomString();
        return new (Record(item));
      });
      return state
        .update('listFilters', list => list.clear())
        .update('listFilters', list => list.push(...newlist))
        ;
    }

    case actions.LOAD_FORM_FIELDS:
      return state
        .setIn(['formFields', 'loading'], true)
        ;

    case actions.LOAD_FORM_FIELDS_SUCCESS: {
      const newlist = action.payload.filters.map((item) => {
        if (item === null)
          item = {};
        item.cid = getRandomString();
        return new (Record(item));
      });
      return state
        .updateIn(['formFields', 'fields'], list => list.clear())
        .updateIn(['formFields', 'fields'], list => list.push(...newlist))
        .setIn(['formFields', 'group'], action.meta.group)
        .setIn(['formFields', 'loading'], false)
        ;
    }

    case actions.APPLY_TOPIC_FORM_DEFAULTS: {
      if (action.meta.formCid.overwrite === true
        || !(state.getIn(['forms', 'cid', action.meta.formCid, 'defaultsApplied']) === true)) {
        return state
          .setIn(['forms', 'cid', action.meta.formCid, 'defaultsApplied'], true)
          .setIn(['forms', 'cid', action.meta.formCid, 'defaultValues'], new ModelSchema(action.payload))
          .mergeIn(['forms', 'cid', action.meta.formCid, 'data'], action.payload);
      }
      return state;
    }

    case actions.PREPARE_NEW_TOPIC_FORM_DATA: {

      // basically, create empty form data record if it's not present
      // TODO: find form in `forms` by CID and set it as active

      // instantiate update form
      if (action.payload.topicId) {
        if (!state.getIn(['forms', 'id', action.payload.topicId])) {
          let cid = getRandomString();
          return state
            .setIn(['formsRegistry', 'cid',  cid], action.payload.topicId) // map `cid` to actual topic id in case we need it
            .setIn(['forms', 'id', action.payload.topicId], new FormRecord({
              cid: cid,
              data: new ModelSchema(action.payload.initialValues || {})
            }));

        } else {
          return state;
        }
      } else {

        const contextId = action.payload.ownerTopicId > 0 ? action.payload.ownerTopicId : '0';

        if (!state.getIn(['formsRegistry', contextId,  action.payload.groupKey])) {

          let cid = getRandomString();

          return state
            .setIn(['formsRegistry', contextId,  action.payload.groupKey], cid)
            .setIn(['forms', 'cid', cid], new FormRecord({
              cid: cid,
              data: new ModelSchema(action.payload.initialValues || {})
            }));

        } else {
          return state;
        }
      }
    }

    case actions.SET_NEW_TOPIC: {
      // TODO: find form in `forms` by CID and set it as active
      return state.set('newTopic', new FormRecord({data:action.payload}));
    }

    case actions.SET_NEW_TOPIC_FIELD: {

      let {name, value, cid, id} = action.payload;

      if (cid) {
        return state
          .setIn(['forms', 'cid', cid, 'data', name], value)
          .deleteIn(['forms', 'cid', cid, 'meta', 'errors', name])
          .deleteIn(['forms', 'cid', cid, 'meta', 'postedOn'])
          // TODO: clean up:
          .deleteIn(['newTopic', 'meta', 'errors', name])
          .deleteIn(['form', 'meta', 'errors', name]);
      } else if (id) {
        return state
          .setIn(['forms', 'id', id, 'data', name], value)
          .deleteIn(['forms', 'id', id, 'meta', 'errors', name]);
      } else {
        // @deprecated
        return state.setIn(['newTopic', 'data', name], value)
          // TODO: clean up errors in that `
          .deleteIn(['newTopic', 'meta', 'errors', name])
          .deleteIn(['form', 'meta', 'errors', name]);
      }
    }

    case actions.CREATE:
      if (action.meta.formCid) {
        return state
          .setIn(['forms', 'cid', action.meta.formCid, 'meta', 'isSubmitting'], true)
          .deleteIn(['forms', 'cid', action.meta.formCid, 'meta', 'error']);
      } else {
        // TODO: cleamup:
        // @deprecated:
        return state
          // lockform submit buttons etc.
         // .setIn(['formFields', 'loading'], true)
          .setIn(['form', 'meta', 'isSubmitting'], true)
          .deleteIn(['form', 'meta', 'error']);
      }


    case actions.CREATE_SUCCESS:
      if (action.meta.formCid) {
        return state
          .setIn(['forms', 'cid', action.meta.formCid, 'meta', 'isSubmitting'], false)
          .setIn(['forms', 'cid', action.meta.formCid, 'meta', 'postedOn'], new Date())
          .setIn(['forms', 'cid', action.meta.formCid, 'meta', 'errors'], Map())
          .setIn(['forms', 'cid', action.meta.formCid, 'data', 'summary'], '')
          .deleteIn(['forms', 'cid', action.meta.formCid, 'meta', 'error'], Map())
          .update('list', list => list.unshift(Todo(action.payload)));
      } else {
        return state
          .update('list', list => list.unshift(Todo(action.payload)));
      }

    case actions.CLEAN_FORM_GENERAL_ERRORS:
      return state
        .deleteIn(['form', 'meta', 'error']);

    case actions.CREATE_ERROR: {

      if (action.meta.formCid) {

        let cid = action.meta.formCid;
        if (action.payload.error && action.payload.error.details) {

          // error with details
          let errorDetails = {};
          for (let fieldName in action.payload.error.details.messages) {
            if (action.payload.error.details.messages.hasOwnProperty(fieldName)) {
              const message = action.payload.error.details.messages[fieldName];
              errorDetails[fieldName] = message.join('; ');
            }
          }
          return state
            .setIn(['forms', 'cid', cid, 'meta', 'errors'], Map(errorDetails))
            .setIn(['forms', 'cid', cid, 'meta', 'isSubmitting'], false);
        } else if (action.payload.error) {

          // non-detailed errror
          return state
            .setIn(['forms', 'cid', cid, 'meta', 'error'], action.payload.error.message || 'Unknown Error!')
            .setIn(['forms', 'cid', cid, 'meta', 'isSubmitting'], false);
        } else {

          // general error e.g. connection/fetch failed
          return state
            .setIn(['forms', 'cid', cid, 'meta', 'error'], action.payload.message.length > 0 && action.payload.message || 'Unknown Error!')
            .setIn(['forms', 'cid', cid, 'meta', 'isSubmitting'], false);
        }
      } else {
        // TODO: if there is `cid` in mets
        // TODO: review, cleanup:
        state.setIn(['newTopic', 'meta', 'isSubmitting'], false);

        if (action.error === true) {

          if (action.payload.error && action.payload.error.details) {
            let errorDetails = {};
            // loop
            for (let fieldName in action.payload.error.details.messages) {
              if (action.payload.error.details.messages.hasOwnProperty(fieldName)) {
                const message = action.payload.error.details.messages[fieldName];
                errorDetails[fieldName] = message.join('; ');
              }
            }

            return state
              .setIn(['newTopic', 'meta', 'errors'], Map(errorDetails))
              .setIn(['newTopic', 'meta', 'isSubmitting'], false)
              // TODO: review if we need to modify `form` here at all
              .setIn(['form', 'meta', 'errors'], Map(errorDetails))
              .setIn(['form', 'meta', 'isSubmitting'], false);
            //.setIn(['formFields', 'loading'], false);

          } else if (action.payload.error) {
            return state
              .setIn(['newTopic', 'meta', 'error'], action.payload.error.message || 'Unknown Error!')
              .setIn(['newTopic', 'meta', 'isSubmitting'], false)
              // TODO: review if we need to modify `form` here at all
              .setIn(['form', 'meta', 'error'], action.payload.error.message || 'Unknown Error!')
              .setIn(['form', 'meta', 'isSubmitting'], false);
            //.setIn(['formFields', 'loading'], false);
          } else {
            return state
              .setIn(['newTopic', 'meta', 'error'], action.payload.message.length > 0 && action.payload.message || 'Unknown Error!')
              .setIn(['newTopic', 'meta', 'isSubmitting'], false)
              // TODO: review if we need to modify `form` here at all
              .setIn(['form', 'meta', 'error'], action.payload.message.length > 0 && action.payload.message || 'Unknown Error!')
              .setIn(['form', 'meta', 'isSubmitting'], false);
            //.setIn(['formFields', 'loading'], false);
          }
        } else {
          return state
            .setIn(['newTopic', 'meta', 'isSubmitting'], false)
            .setIn(['form', 'meta', 'isSubmitting'], false);
        }
      }
    }

    case actions.SAVE:
      return state
        .setIn(['forms', 'id', action.meta.topicId, 'meta', 'isSubmitting'], true);

    case actions.SAVE_SUCCESS: {
      //  todo: clear form in `forms`
      if (state.board && state.board.id === action.meta.topicId) {
        state = state
          // TODO: `board.data`
          .setIn(['board', 'data'], new Todo(action.payload))
          .setIn(['board', 'id'], action.payload.id);
      }
      return state
        .setIn(['forms', 'id', action.meta.topicId, 'meta', 'isSubmitting'], false)
        .setIn(['forms', 'id', action.meta.topicId, 'meta', 'error'], '')
        .setIn(['forms', 'id', action.meta.topicId, 'meta', 'errors'], Map());
    }

    case actions.SAVE_ERROR: {

      if (action.error === true) {
        if (action.payload.error && action.payload.error.details) {
          let errorDetails = {};
          // loop
          for (let fieldName in action.payload.error.details.messages) {
            if (action.payload.error.details.messages.hasOwnProperty(fieldName)) {
              const message = action.payload.error.details.messages[fieldName];
              errorDetails[fieldName] = message.join('; ');
            }
          }

          return state
            .setIn(['forms', 'id', action.meta.topicId, 'meta', 'errors'], Map(errorDetails))
            .setIn(['forms', 'id', action.meta.topicId, 'meta', 'error'], '')
            .setIn(['forms', 'id', action.meta.topicId, 'meta', 'isSubmitting'], false);

        } else if (action.payload.error) {
          return state
            .setIn(['forms', 'id', action.meta.topicId, 'meta', 'error'], action.payload.error.message || 'Unknown Error!')
            .setIn(['forms', 'id', action.meta.topicId, 'meta', 'isSubmitting'], false);
        } else {
          return state
            .setIn(['forms', 'id', action.meta.topicId, 'meta', 'error'], action.payload.message.length > 0 && action.payload.message || 'Unknown Error!')
            .setIn(['forms', 'id', action.meta.topicId, 'meta', 'isSubmitting'], false);
        }
      } else {
        return state
          .setIn(['forms', 'id', action.meta.topicId, 'meta', 'error'], 'Unknown Error!')
          .setIn(['forms', 'id', action.meta.topicId, 'meta', 'isSubmitting'], false);
      }
    }


    case actions.RUN_OPERATION:
      return state
        .setIn(['viewTopic', 'loading'], true)
        .setIn(['viewTopic', 'isFetching'], true);

    case actions.RUN_OPERATION_SUCCESS:
      return state
        //  .set('viewTopic', new Todo(action.payload.topic))
        .setIn(['viewTopic', 'wfStatus'], action.payload.topic.wfStatus)
        .setIn(['viewTopic', 'wfStage'], action.payload.topic.wfStage)
        .setIn(['viewTopic', 'operations'], action.payload.topic.operations)
        .setIn(['viewTopic', 'isFetching'], false)
        .setIn(['viewTopic', 'loading'], false);

    case actions.RUN_OPERATION_ERROR:
      return state
        .setIn(['viewTopic', 'isFetching'], false)
        .setIn(['viewTopic', 'loading'], false);

    case actions.DELETE_TOPIC: {

      if (action.meta.topicId && state.viewTopic && state.viewTopic.id === action.meta.topicId) {
        return state
          .setIn(['viewTopic', 'meta', 'isDeleting'], false);
      }
      return state;
    }

    case actions.DELETE_TOPIC_ERROR: {

      if (action.meta.topicId && state.viewTopic && state.viewTopic.id === action.meta.topicId) {
        return state
          .setIn(['viewTopic', 'data', 'deletedYn'], 0)
          .setIn(['viewTopic', 'meta', 'isDeleting'], false)
          .setIn(['viewTopic', 'meta', 'error'], action.payload.error.message);

        // deleting from project's settings pagedd
      } else if (action.meta.topicId && state.newTopic && state.newTopic.data.id === action.meta.topicId) {

        return state
          .setIn(['newTopic', 'data', 'deletedYn'], 0)
          .setIn(['newTopic', 'meta', 'isDeleting'], false)
          .setIn(['newTopic', 'meta', 'error'], (action.payload.error.message
            ? action.payload.error.message
            : (action.payload.message ? action.payload.message : 'ERROR')
          ));
      }
      return state;
    }

    case actions.DELETE_TOPIC_SUCCESS: {

      if (action.meta.topicId && state.viewTopic && state.viewTopic.id === action.meta.topicId) {
        return state
          .setIn(['viewTopic', 'deletedYn'], 1)
          .setIn(['viewTopic', 'data', 'deletedYn'], 1)
          .setIn(['viewTopic', 'meta', 'isDeleting'], false)
          .setIn(['viewTopic', 'meta', 'error'], '')
          .update('list', list =>
            list.update(list.findIndex(function(item) {
              return item.id === action.meta.topicId;
            }), function(v) {
              return v.set('deletedYn', 1);
            })
        );
      }
      return state;
    }

    case actions.FETCH_TOPIC_MENU_SUCCESS: {
      if (action.meta.topicId) {
        const newMenu = action.payload.map((item) => {
          return new (Record(item));
        });
        return state
          .updateIn(['board', 'menu'], list => list.clear())
          .updateIn(['board', 'menu'], list => list.push(...newMenu));
      }
    }

    case actions.SETUP_TOPIC_MEMBER_INVITE_FORM: {
      if (action.payload.topicId) {
        if (!state.getIn(['forms', 'member-invite', action.payload.topicId])) {
          let cid = getRandomString();
          return state
            .setIn(['forms', 'member-invite', action.payload.topicId], new MemberForm({
              cid: cid,
              data: new MemberFormModel(action.payload.initialValues || {})
            }));

        } else {
          return state;
        }
      }
      return state;
    }

    case actions.SET_TOPIC_MEMBER_INVITE_FORM_FIELD: {
      let {name, value, topicId} = action.payload;
      return state
        .setIn(['forms', 'member-invite', topicId, 'data', name], value)
        .deleteIn(['forms', 'member-invite', topicId, 'meta', 'errors', name]);

    }
  }

  return state;
}
