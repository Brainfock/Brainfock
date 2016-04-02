/**
 * Brainfock, <http://www.brainfock.org>
 *
 * Copyright (C) 2015-present Sergii Gamaiunov <hello@webkadabra.com>
 * All rights reserved.
 *
 * This source code is licensed under the GPL-style license found in the
 * LICENSE file in the root directory of this source tree.
 */
import {apiGet, apiPost} from '../lib/services';
import {toQueryString} from '../utils/model.js';

export const FIND = 'FIND_SCHEMES_PENDING';
export const FIND_SUCCESS = 'FIND_SCHEMES_SUCCESS';
export const FIND_ERROR = 'FIND_SCHEMES_ERROR';

export function findGroupSchemes(includes, query) {
  let endpoint = '';

  endpoint += 'topicGroupSchemes/?'+includes;

  if(query) {
    endpoint += '&'+toQueryString({filter:{where:query}},false);
  }

  return ({fetch, validate}) => ({
    type: 'FIND_SCHEMES',
    payload: {
      promise:  apiGet(fetch, endpoint)
        .catch(response => {
          throw response;
        })
    }
  });
}