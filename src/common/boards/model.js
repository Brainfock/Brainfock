/**
 * Brainfock, <http://www.brainfock.org>
 *
 * Copyright (C) 2015-present Sergii Gamaiunov <hello@webkadabra.com>
 * All rights reserved.
 *
 * This source code is licensed under the GPL-style license found in the
 * LICENSE file in the root directory of this source tree.
 */
import {Record} from 'immutable';

export default Record({
  id: '',
  workspaceId: '',
  namespace: '',
  summary: '',
  text: '',
  entityId: '',
  contextTopicNum: '',
  contextTopicKey: '',
  contextTopicId: '',
  parentTopicId: '',
  typeId: '',
  groupId: '',
  dueDate: '',
  accessPrivateYn: '',
  logoIcon: '',
  logoBackground: '',
  updatedOn: '',
  createdOn: '',
  deletedYn: '',
  priorityId: '',

  // for POST only (not a model field)
  createGroup:'',

  // read-only, available via database view
  wfStage: '',
  wfStatus: '',

  // included via relations
  priority: new (Record({
    id: '',
    value: '',
    labelConfig: ''
  })),
  type: {},
});
