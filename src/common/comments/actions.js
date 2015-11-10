/**
 * Brainfock - Community & Business Management Solution
 *
 * @link http://www.brainfock.org
 * @copyright Copyright (c) 2015 Sergii Gamaiunov <hello@webkadabra.com>
 */
export const LOAD_COMMENTS = 'LOAD_COMMENTS_PENDING';
export const LOAD_COMMENTS_ERROR = 'LOAD_COMMENTS_ERROR';
export const LOAD_COMMENTS_SUCCESS = 'LOAD_COMMENTS_SUCCESS';

export const ADD_ONE_COMMENT = 'ADD_ONE_COMMENT';

export const POST_COMMENT = 'POST_COMMENT_PENDING';
export const POST_COMMENT_SUCCESS = 'POST_COMMENT_SUCCESS';
export const POST_COMMENT_ERROR = 'POST_COMMENT_ERROR';

import {apiGet, apiPost} from '../lib/services';

export function loadEntityComments(entity_id) {

  let endpoint = 'entities/'+entity_id+'/comments?filter[include][user]' ;

  return ({fetch, validate}) => ({
    type: 'LOAD_COMMENTS',
    payload: {
      promise:  apiGet(fetch, endpoint)
        .catch(response => {
          throw response;
        })
    }
  });
}

export function catchComment(data) {
  return {
    type: ADD_ONE_COMMENT,
    payload: data
  };
}
export function postComment(entity_id, data) {
  const endpoint = 'entities/'+entity_id+'/comments?include=user';

  return ({fetch, validate}) => ({
    type: 'POST_COMMENT',
    payload: {
      promise: apiPost(fetch, endpoint, data)
        .catch(response => {
          throw response;
        })
      // TODO: add validation
      //promise: validateForm(validate, fields)
      //  .then(() => post(fetch, endpoint, fields))
      //  .catch(response => {
      //    throw response;
      //  })
    }
  });
}

//: function(data) {
//  // todo: remove workaround
//  dispatch(constants.ADD_ONE,data);
//},