/**
 * Brainfock - Community & Business Management Solution
 *
 * @link http://www.brainfock.org
 * @copyright Copyright (c) 2015 Sergii Gamaiunov <hello@webkadabra.com>
 */
import {apiGet, apiPost} from '../lib/services';
import {toQueryString} from '../utils/model.js';

export const FIND = 'FIND_USERS';
export const FIND_SUCCESS = 'FIND_USERS_SUCCESS';
export const FIND_ERROR = 'FIND_USERS_ERROR';

export function findGroupSchemes(includes, query) {
  let endpoint = '';

  endpoint += 'topicGroupSchemes/?'+includes;

  if(query) {
    endpoint += '&'+toQueryString({filter:{where:query}},false);
  }

  return ({fetch, validate}) => ({
    type: [
      FIND,
      FIND_SUCCESS,
      FIND_ERROR
    ],
    payload: {
      promise:  apiGet(fetch, endpoint)
        .catch(response => {
          throw response;
        })
    }
  });
}