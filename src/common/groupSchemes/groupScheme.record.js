/**
 * Brainfock - Community & Business Management Solution
 *
 * @link http://www.brainfock.org
 * @copyright Copyright (c) 2015 Sergii Gamaiunov <hello@webkadabra.com>
 */

import {Record, List} from 'immutable';

const GroupSchemeRecord = Record({
  id: '',
  isDefault: '',
  name: '',
  groups: List(),
});

export default GroupSchemeRecord;
