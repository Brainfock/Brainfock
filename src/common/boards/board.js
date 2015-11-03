/**
 * Brainfock - community & issue management software
 * Copyright (c) 2015, Sergii Gamaiunov (�Webkadabra�)  All rights reserved.
 *
 * This program is free software: you can redistribute it and/or modify
 * it under the terms of the GNU Affero General Public License as
 * published by the Free Software Foundation, either version 3 of the
 * License, or (at your option) any later version.
 *
 * This program is distributed in the hope that it will be useful,
 * but WITHOUT ANY WARRANTY; without even the implied warranty of
 * MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
 * GNU Affero General Public License for more details.
 *
 * You should have received a copy of the GNU Affero General Public License
 * along with this program.  If not, see <http://www.gnu.org/licenses/>.
 *
 * @link http://www.brainfock.com/
 * @copyright Copyright (c) 2015 Sergii Gamaiunov <hello@webkadabra.com>
 */

import {Record, List, Map} from 'immutable';

export default Record({
  cid: '',
  id: '',
  workspaceId: '',
  namespace: '',
  summary: '',
  text: '',
  entityId:'',
  contextTopicNum:'',
  contextTopicKey:'',
  contextTopicId:'',
  typeId:'',
  groupId:'',
  dueDate:'',
  accessPrivateYn:'',
  logoIcon:'',
  logoBackground:'',
  updatedOn:'',
  createdOn:'',

  // read-only, available via database view
  wfStage:'',
  wfStatus:'',

  // included via relations
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

  // included via `extra` filters
  operations: List(),

  // for POST only (not a model field)
  createGroup:'',

  // ui state fields
  loading: false,
  isFetching: false,
  // TODO: structurize all models like so:
  meta: new (Record({
    isFetching: false
  })),
});
