/**
 * Brainfock, <http://www.brainfock.org>
 *
 * Copyright (C) 2015-present Sergii Gamaiunov <hello@webkadabra.com>
 * All rights reserved.
 *
 * This source code is licensed under the GPL-style license found in the
 * LICENSE file in the root directory of this source tree.
 */
import {Record, List} from 'immutable';

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
  }))
});
