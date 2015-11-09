/**
 * Brainfock - Community & Business Management Solution
 *
 * @link http://www.brainfock.org
 * @copyright Copyright (c) 2015 Sergii Gamaiunov <hello@webkadabra.com>
 */
import {Record, Map} from 'immutable';

export default Record({
  cid: '',
  data: new  (Record({
    password: '',
    confirmPassword: '',
    currentPassword: '',
    newEmail: '',
  })),
  meta: new (Record({
    isSubmitting: false,
    postedOn: '',
    error: '',
    errors: new Map()
  }))
});
