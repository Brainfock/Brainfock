/**
 * Brainfock, <http://www.brainfock.org>
 *
 * Copyright (C) 2015-present Sergii Gamaiunov <hello@webkadabra.com>
 * All rights reserved.
 *
 * This source code is licensed under the GPL-style license found in the
 * LICENSE file in the root directory of this source tree.
 */
import {apiGet, apiPost, apiPut} from '../lib/services';
import {toQueryString} from '../utils/model.js';

export const FIND = 'FIND_USERS_PENDING';
export const FIND_SUCCESS = 'FIND_USERS_SUCCESS';
export const FIND_ERROR = 'FIND_USERS_ERROR';

export const SETUP_USER_UPDATE_FORM = 'SETUP_USER_UPDATE_FORM';

export const SET_USER_UPDATE_FORM_FIELD = 'SET_USER_UPDATE_FORM_FIELD';

export const SAVE_USER_UPDATE_FORM = 'SAVE_USER_UPDATE_FORM_PENDING';
export const SAVE_USER_UPDATE_FORM_SUCCESS = 'SAVE_USER_UPDATE_FORM_SUCCESS';
export const SAVE_USER_UPDATE_FORM_ERROR = 'SAVE_USER_UPDATE_FORM_ERROR';

export const SAVE_USER_CREATE_FORM = 'SAVE_USER_CREATE_FORM_PENDING';
export const SAVE_USER_CREATE_FORM_SUCCESS = 'SAVE_USER_CREATE_FORM_SUCCESS';
export const SAVE_USER_CREATE_FORM_ERROR = 'SAVE_USER_CREATE_FORM_ERROR';

export function findUsers(includes, query) {

  let endpoint = 'members/?'+includes;

  if(query) {
    endpoint += '&'+toQueryString({filter:{where:query}},false);
  }

  return ({fetch, validate}) => ({
    type: 'FIND_USERS',
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

export function setUserCreateFormField({target: {name, value}}, userId, formKey) {
  return {
    type: SET_USER_UPDATE_FORM_FIELD,
    payload: {name, value, userId, formKey}
  };
}

export function saveUserUpdateForm(id, formKey, data) {

  const endpoint = `users/${id}`;

  return ({fetch, validate}) => ({
    type: 'SAVE_USER_UPDATE_FORM',
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
        .then(function(jsonResponce) {
          if (jsonResponce.error) {
            throw jsonResponce;
          }
          else
            return jsonResponce;
        }, function(response) {
          // throw other errors (i.e. 50x) that don't have `.json()` available
          throw response;
        })
    }
  });
}


export function saveUserCreateForm(id, formKey, data) {

  const endpoint = `users`;

  return ({fetch, validate}) => ({
    type: 'SAVE_USER_CREATE_FORM',
    meta: {
      userId: id,
      formKey
    },
    payload: {
      promise: apiPost(fetch, endpoint, data)
        .catch(response => {
          // decode validation error messages from server
          if (!response) {
            throw new Error('No response');
          } else if (response.ok === false) return response.json();
          else {
            throw response;
          }
        })
        .then(function(jsonResponce) {
          if (jsonResponce.error) {
            throw jsonResponce;
          }
          else
            return jsonResponce;
        }, function(response) {
          // throw other errors (i.e. 50x) that don't have `.json()` available
          throw response;
        })
    }
  });
}
