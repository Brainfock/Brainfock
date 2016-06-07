/**
 * Brainfock, <http://www.brainfock.org>
 *
 * Copyright (C) 2015-present Sergii Gamaiunov <hello@webkadabra.com>
 * All rights reserved.
 *
 * This source code is licensed under the GPL-style license found in the
 * LICENSE file in the root directory of this source tree.
 */
import ModelSchema from './model.js';

import {Record, Map} from 'immutable';
export default Record({
  cid: '',
  data: new ModelSchema,
  defaultValues: new ModelSchema,
  defaultsApplied: false,
  meta: new (Record({
    isSubmitting: false,
    isFetching: false,
    isDeleting: false,
    postedOn: '',
    error: '',
    errors: new Map()
  }))
});
