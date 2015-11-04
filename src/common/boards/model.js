/**
 * Brainfock - business & community management software
 * Copyright (c) 2015, Sergii Gamaiunov
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
 * @link http://www.brainfock.org
 * @copyright Copyright (c) 2015 Sergii Gamaiunov <hello@webkadabra.com>
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
  typeId: '',
  groupId: '',
  dueDate: '',
  accessPrivateYn: '',
  logoIcon: '',
  logoBackground: '',
  updatedOn: '',
  createdOn: '',
  deletedYn: '',

  // for POST only (not a model field)
  createGroup:'',

  // read-only, available via database view
  wfStage: '',
  wfStatus: '',
});
