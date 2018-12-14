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
  pageUid: '',
  namespace: '',
  accessPrivateYn: '',
  content: '',
  contentRendered: '',
  deletedYn: {},
  contextEntityId:'',
  entityId:'',
  updatedOn:'',

  // client-only
  clientSavedOn:'',

  loading:true
});