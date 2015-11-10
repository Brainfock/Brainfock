/**
 * Brainfock - Community & Business Management Solution
 *
 * @link http://www.brainfock.org
 * @copyright Copyright (c) 2015 Sergii Gamaiunov <hello@webkadabra.com>
 */
import {apiPost, apiGet} from '../lib/services';

export const CREATE = 'WORKSPACE_SAVE_PENDING';
export const CREATE_ERROR = 'WORKSPACE_SAVE_ERROR';
export const CREATE_SUCCESS = 'WORKSPACE_SAVE_SUCCESS';

export const FIND_ONE = 'WORKSPACE_FIND_ONE_PENDING';
export const FIND_ONE_SUCCESS = 'WORKSPACE_FIND_ONE_SUCCESS';
export const FIND_ONE_ERROR = 'WORKSPACE_FIND_ONE_ERROR';

export const SET_EDIT_WIKI_FIELD = 'WORKSPACE_EDIT_WIKI_FIELD';

/**
 * Create new workspace
 *
 * @param fields
 * @returns {Function}
 */
export function postWorkspace(fields) {

  const endpoint = 'workspaces';

  return ({fetch, validate}) => ({
    type: 'WORKSPACE_SAVE',
    payload: {
      promise: apiPost(fetch, endpoint, fields)
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

/**
 * Find workspace by id (or namespace)
 *
 * @param id
 * @returns {Function}
 */
export function workspaceFindById(id) {

  const endpoint = `workspaces/${id}`;

  return ({fetch}) => ({
    type: 'WORKSPACE_FIND_ONE',
    payload: {
      promise: apiGet(fetch, endpoint)
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

  let query = [];
  if (users && users.viewer) {
    query.push('access_token=' + users.viewer.authToken)
  }

  const host = app.baseUrl;
  const id = params.namespace;
  const endpoint = `workspaces/${id}?` + query.join('&');

  return ({fetch, validate}) => ({
    type: 'WORKSPACE_FIND_ONE',
    payload: {
      promise: apiGet(fetch, endpoint, host)
        .catch(response => {
          throw response;
        })
    }
  });
}
