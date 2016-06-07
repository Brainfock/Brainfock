/**
 * Brainfock, <http://www.brainfock.org>
 *
 * Copyright (C) 2015-present Sergii Gamaiunov <hello@webkadabra.com>
 * All rights reserved.
 *
 * This source code is licensed under the GPL-style license found in the
 * LICENSE file in the root directory of this source tree.
 */
import {Record, List, Map} from 'immutable';

import ModelSchema from './model.js';

export default Record({
  cid: '',

  data: new (ModelSchema),

  // TODO: cleanup?
  id: '',
  workspaceId: '',
  namespace: '',
  summary: '',
  text: '',
  entityId:'',
  contextTopicNum:'',
  contextTopicKey:'',
  contextTopicId:'',
  parentTopicId:'',
  typeId:'',
  groupId:'',
  dueDate:'',
  accessPrivateYn:'',
  logoIcon:'',
  logoBackground:'',
  updatedOn:'',
  createdOn:'',
  deletedYn: '',
  priorityId: '',
  // read-only, available via database view
  wfStage:'',
  wfStatus:'',

  // included via relations
  priority: new (Record({
    id: '',
    value: '',
    labelConfig: ''
  })),
  parent: new (ModelSchema),
  contextTopic: new (ModelSchema),
  type: {},
  workspace: new (Record({
    id: '',
    namespace: '',
    name: '',
    accessPrivateYn: ''
  })),
  group: {},
  owner: {},
  author: {},
  comments: List(),
  menu: List(),

  // included via `extra` filters
  operations: List(),

  // for POST only (not a model field)
  createGroup:'',

  // ui state fields
  loading: false,
  isFetching: false,
  // TODO: structurize all models like so:
  meta: new (Record({
    isDeleting: false,
    isFetching: false,
    error: '',
  })),
});
