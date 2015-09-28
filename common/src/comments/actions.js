/**
 * Brainfock - community & issue management software
 * Copyright (c) 2015, Sergii Gamaiunov (“Webkadabra”)  All rights reserved.
 *
 * This program is free software: you can redistribute it and/or modify
 * it under the terms of the GNU Affero General Public License as
 * published by the Free Software Foundation, either version 3 of the
 * License, or (at your option) any later version.
 *
 * This program is distributed in the hope that it will be useful,
 * but WITHOUT ANY WARRANTY; without even the implied warranty of
 * MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
 * GNU Affero General Public License for more details.
 *
 * You should have received a copy of the GNU Affero General Public License
 * along with this program.  If not, see <http://www.gnu.org/licenses/>.
 *
 * @link http://www.brainfock.com/
 * @copyright Copyright (c) 2015 Sergii Gamaiunov <hello@webkadabra.com>
 */

export const LOAD_COMMENTS = 'LOAD_COMMENTS';
export const LOAD_COMMENTS_ERROR = 'LOAD_COMMENTS_ERROR';
export const LOAD_COMMENTS_SUCCESS = 'LOAD_COMMENTS_SUCCESS';
export const ADD_ONE_COMMENT = 'ADD_ONE_COMMENT';
export const POST_COMMENT = 'POST_COMMENT';
export const POST_COMMENT_SUCCESS = 'POST_COMMENT_SUCCESS';
export const POST_COMMENT_ERROR = 'POST_COMMENT_ERROR';

import {apiGet, apiPost} from '../lib/services';

export function loadEntityComments(entity_id) {

  let endpoint = 'entities/'+entity_id+'/comments?filter[include][user]' ;

  return ({fetch, validate}) => ({
    types: [
      LOAD_COMMENTS,
      LOAD_COMMENTS_SUCCESS,
      LOAD_COMMENTS_ERROR
    ],
    payload: {
      promise:  apiGet(fetch, endpoint)
        .catch(response => {
          throw response;
        })
    }
  });
}

export function catchComment(data) {
  console.log('catch comment');
  return {
    type: ADD_ONE_COMMENT,
    payload: data
  };
}
export function postComment(entity_id, data) {
  const endpoint = 'entities/'+entity_id+'/comments';

  return ({fetch, validate}) => ({
    types: [
      POST_COMMENT,
      POST_COMMENT_SUCCESS,
      POST_COMMENT_ERROR
    ],
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