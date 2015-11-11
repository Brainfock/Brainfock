/**
 * Brainfock - Community & Business Management Solution
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
