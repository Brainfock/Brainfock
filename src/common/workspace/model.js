/**
 * Brainfock - Community & Business Management Solution
 *
 * @link http://www.brainfock.org
 * @copyright Copyright (c) 2015 Sergii Gamaiunov <hello@webkadabra.com>
 */
import {Record, List, Map} from 'immutable';

export default Record({
  cid: '',
  data: new (Record({
    id: '',
    namespace: '',
    name: '',
    accessPrivateYn: ''
  })),
  meta: new (Record({
    isFetching: false,
    hasError: false,
    errors: List()
  })),
});
