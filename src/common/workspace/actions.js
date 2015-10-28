/**
 * Brainfock - community & issue management software
 * Copyright (c) 2015, Sergii Gamaiunov (�Webkadabra�)  All rights reserved.
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

export const CREATE = 'WORKSPACE_SAVE';
export const CREATE_ERROR = 'WORKSPACE_SAVE_ERROR';
export const CREATE_SUCCESS = 'WORKSPACE_SAVE_SUCCESS';
export const FIND_ONE = 'WORKSPACE_FIND_ONE';
export const FIND_ONE_SUCCESS = 'WORKSPACE_FIND_ONE_SUCCESS';
export const FIND_ONE_ERROR = 'WORKSPACE_FIND_ONE_ERROR';
export const SET_EDIT_WIKI_FIELD = 'WORKSPACE_EDIT_WIKI_FIELD';

import {apiPost, apiGet} from '../lib/services';

export function postWorkspace(fields) {
  const endpoint = 'workspaces';

  return ({fetch, validate}) => ({
    type: [
      CREATE,
      CREATE_SUCCESS,
      CREATE_ERROR
    ],
    payload: {
      promise: apiPost(fetch, endpoint, fields)
        .catch(response => {
          // decode validation error messages from server
          if (response.status === 422) return response.json();
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
        }, function (reason) {
          // other errors, i.e. 50x
          throw response;
        })
    }
  });
}

export function findByIdWorkspace(id) {
  const endpoint = `workspaces/${id}`;

  return ({fetch}) => ({
    type: [
      FIND_ONE,
      FIND_ONE_SUCCESS,
      FIND_ONE_ERROR
    ],
    payload: {
      promise: getApi(fetch, endpoint)
        .catch(response => {
          throw response;
        })
    }
  });
}

/**
 * Fetch data for workspace homepage, fired by @fetch decorator and is isomorphic
 *
 * @todo since this action is executed on a last route in app and receives wildcard value, handle 404 globally
 * @param data
 * @returns {Function}
 */
export function fetchWorkspaceHomepage(data) {
  const {
    location,
    params,
    props,
    app,
    users
    } = data;

  const host = app.baseUrl;
  const id = params.namespace;

  let endpoint = `workspaces/${id}`;
  return ({fetch, validate}) => ({
    type: [
      FIND_ONE,
      FIND_ONE_SUCCESS,
      FIND_ONE_ERROR
    ],
    payload: {
      promise: apiGet(fetch, endpoint, host)
        .catch(response => {
          throw response;
        })
    }
  });
}
