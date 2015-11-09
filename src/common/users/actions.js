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
import {apiGet, apiPost, apiPut} from '../lib/services';
import {toQueryString} from '../utils/model.js';

export const FIND = 'FIND_USERS';
export const FIND_SUCCESS = 'FIND_USERS_SUCCESS';
export const FIND_ERROR = 'FIND_USERS_ERROR';

export const SETUP_USER_UPDATE_FORM = 'SETUP_USER_UPDATE_FORM';

export const SET_USER_UPDATE_FORM_FIELD = 'SET_USER_UPDATE_FORM_FIELD';
export const SAVE_USER_UPDATE_FORM = 'SAVE_USER_UPDATE_FORM';
export const SAVE_USER_UPDATE_FORM_SUCCESS = 'SAVE_USER_UPDATE_FORM_SUCCESS';
export const SAVE_USER_UPDATE_FORM_ERROR = 'SAVE_USER_UPDATE_FORM_ERROR';

export function findUsers(includes, query) {

  let endpoint = 'members/?'+includes;

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

export function makeUserUpdateFormRecord(userId, formKey, initialValues) {
  return {
    type: SETUP_USER_UPDATE_FORM,
    payload: {
      userId: userId,
      formKey: formKey,
      initialValues
    }
  };
}

export function setUserUpdateFormField({target: {name, value}}, userId, formKey) {
  return {
    type: SET_USER_UPDATE_FORM_FIELD,
    payload: {name, value, userId, formKey}
  };
}

export function saveUserUpdateForm(id, formKey, data) {

  const endpoint = `users/${id}`;

  return ({fetch, validate}) => ({
    type: [
      SAVE_USER_UPDATE_FORM,
      SAVE_USER_UPDATE_FORM_SUCCESS,
      SAVE_USER_UPDATE_FORM_ERROR
    ],
    meta: {
      topicId: id
    },
    payload: {
      promise: apiPut(fetch, endpoint, data)
        .catch(response => {
          // decode validation error messages from server
          if (!response) {
            throw new Error('No response');
          } else if (response.ok === false) return response.json();
          else {
            throw response;
          }
        })
        .then(function (jsonResponce) {
          if (jsonResponce.error) {
            throw jsonResponce;
          }
          else
            return jsonResponce;
        }, function (response) {
          // throw other errors (i.e. 50x) that don't have `.json()` available
          throw response;
        })
    }
  });
}
