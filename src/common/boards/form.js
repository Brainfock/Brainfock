/**
 * Brainfock - Community & Business Management Solution
 *
 * @link http://www.brainfock.org
 * @copyright Copyright (c) 2015 Sergii Gamaiunov <hello@webkadabra.com>
 */
import ModelSchema from './model.js'

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
