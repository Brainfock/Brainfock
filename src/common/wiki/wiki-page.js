/**
 * Brainfock - Community & Business Management Solution
 *
 * @link http://www.brainfock.org
 * @copyright Copyright (c) 2015 Sergii Gamaiunov <hello@webkadabra.com>
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