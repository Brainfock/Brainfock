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

export const FIND = 'TOPIC_FIND_PENDING';
export const FIND_SUCCESS = 'TOPIC_FIND_SUCCESS';
export const FIND_ERROR = 'TOPIC_FIND_ERROR';

export const FIND_ONE = 'TOPIC_FIND_ONE_PENDING';
export const FIND_ONE_SUCCESS = 'TOPIC_FIND_ONE_SUCCESS';
export const FIND_ONE_ERROR = 'TOPIC_FIND_ONE_ERROR';

export const LOAD_TOPIC = 'LOAD_TOPIC_PENDING';
export const LOAD_TOPIC_SUCCESS = 'LOAD_TOPIC_SUCCESS';
export const LOAD_TOPIC_ERROR = 'LOAD_TOPIC_ERROR';

export const LOAD_TOPIC_GROUP = 'LOAD_TOPIC_GROUP_PENDING';
export const LOAD_TOPIC_GROUP_SUCCESS = 'LOAD_TOPIC_GROUP_SUCCESS';
export const LOAD_TOPIC_GROUP_ERROR = 'LOAD_TOPIC_GROUP_ERROR';

export const SET_EDIT_FIELD = 'TOPIC_SET_EDIT_FIELD';
export const SAVE = 'TOPIC_SAVE_PENDING';
export const SAVE_ERROR = 'TOPIC_SAVE_ERROR';
export const SAVE_SUCCESS = 'TOPIC_SAVE_SUCCESS';

export const COUNT = 'TOPIC_COUNT_PENDING';
export const COUNT_SUCCESS = 'TOPIC_COUNT_SUCCESS';
export const COUNT_ERROR = 'TOPIC_COUNT_ERROR';

export const LOAD_FILTERS = 'TOPIC_LOAD_FILTERS_PENDING';
export const LOAD_FILTERS_SUCCESS = 'TOPIC_LOAD_FILTERS_SUCCESS';
export const LOAD_FILTERS_ERROR = 'TOPIC_LOAD_FILTERS_ERROR';

export const LOAD_FORM_FIELDS = 'TOPIC_LOAD_FORM_FIELDS_PENDING';
export const LOAD_FORM_FIELDS_SUCCESS = 'TOPIC_LOAD_FORM_FIELDS_SUCCESS';
export const LOAD_FORM_FIELDS_ERROR = 'TOPIC_LOAD_FORM_FIELDS_ERROR';

export const SET_NEW_TOPIC = 'SET_NEW_TOPIC';
export const SET_NEW_TOPIC_FIELD = 'SET_NEW_TOPIC_FIELD';
export const PREPARE_NEW_TOPIC_FORM_DATA = 'PREPARE_NEW_TOPIC_FORM_DATA';
export const APPLY_TOPIC_FORM_DEFAULTS = 'APPLY_TOPIC_FORM_DEFAULTS';
export const CLEAN_FORM_GENERAL_ERRORS = 'TOPIC_CLEAN_FORM_GENERAL_ERRORS';

export const CREATE = 'TOPIC_CREATE_PENDING';
export const CREATE_SUCCESS = 'TOPIC_CREATE_SUCCESS';
export const CREATE_ERROR = 'TOPIC_CREATE_ERROR';
export const SET_CURRENT_TOPIC = 'TOPIC_SET_CURRENT_TOPIC';

const validateForm = (validate, fields) => validate(fields)
  .prop('summary').required()
  //.prop('password').required().simplePassword()
  .promise;

const getApi = (fetch, endpoint) =>
  fetch(`/api/${endpoint}`, {
    headers: {'Accept': 'application/json', 'Content-Type': 'application/json'},
    method: 'get',
    credentials: 'include', // accept cookies from server, for authentication
  })
    .then(response => {
      if (response.status === 200) return response.json();
      throw response;
    });

const deleteApi = (fetch, endpoint) =>
  fetch(`/api/${endpoint}`, {
    headers: {'Accept': 'application/json', 'Content-Type': 'application/json'},
    method: 'DELETE',
    credentials: 'include', // accept cookies from server, for authentication
  })
    .then(response => {
      if (response.status === 200) return response.json();
      throw response;
    });


/**
 * @author Jrop <http://stackoverflow.com/a/31415775/360292>
 * @param obj
 * @param urlEncode
 * @returns {*}
 */
function toQueryString(obj, urlEncode) {
  //
  // Helper function that flattens an object, retaining key structer as a path array:
  //
  // Input: { prop1: 'x', prop2: { y: 1, z: 2 } }
  // Example output: [
  //     { path: [ 'prop1' ],      val: 'x' },
  //     { path: [ 'prop2', 'y' ], val: '1' },
  //     { path: [ 'prop2', 'z' ], val: '2' }
  // ]
  //
  function flattenObj(x, path) {
    var result = [];

    path = path || [];
    Object.keys(x).forEach(function(key) {
      if (!x.hasOwnProperty(key)) return;

      var newPath = path.slice();
      newPath.push(key);

      var vals = [];
      if (typeof x[key] == 'object') {
        vals = flattenObj(x[key], newPath);
      } else {
        vals.push({path: newPath, val: x[key]});
      }
      vals.forEach(function(obj) {
        return result.push(obj);
      });
    });

    return result;
  } // flattenObj

  // start with  flattening `obj`
  var parts = flattenObj(obj); // [ { path: [ ...parts ], val: ... }, ... ]

  // convert to array notation:
  parts = parts.map(function(varInfo) {
    if (varInfo.path.length == 1) varInfo.path = varInfo.path[0]; else {
      var first = varInfo.path[0];
      var rest = varInfo.path.slice(1);
      varInfo.path = first + '[' + rest.join('][') + ']';
    }
    return varInfo;
  }); // parts.map

  // join the parts to a query-string url-component
  var queryString = parts.map(function(varInfo) {
    return varInfo.path + '=' + varInfo.val;
  }).join('&');
  if (urlEncode) return encodeURIComponent(queryString); else return queryString;
}

export function find(type, query, contextTopicId, namespace) {
  let endpoint = '';
  if(namespace) {
    endpoint += `workspaces/${namespace}/`;
  }

  if (contextTopicId && contextTopicId !== '*') {
    endpoint += `topics/${contextTopicId}/topics/?filter[where][groupKey]=${type}`;
  } else {
    endpoint += 'topics/?filter[where][groupKey]=' + type;
    if (contextTopicId !== '*')
      // exclude non-root items, e.g. boards of some project
      endpoint += '&filter[where][contextTopicId]=null';
  }

  // include some additional info
  endpoint += '&filter[include][0][type]';
  endpoint += '&filter[include][1][workspace]';
  endpoint += '&filter[include][2][parent]';
  // TODO: do not include everything all the time; e.g. `contextTopic` is not required when looking at a list of project's issues
  endpoint += '&filter[include][3][contextTopic]';

  let queryString;
  if (query) {
    queryString = toQueryString({filter: {where: query}}, false);
    endpoint += '&' + queryString;
  }

  return ({fetch, validate}) => ({
    type: 'TOPIC_FIND',
    meta: {
      groupKey: type,
      queryString: queryString
    },
    payload: {
      promise:  getApi(fetch, endpoint)
        .catch(response => {
          if (!response) throw new Error('No response');
          else if (response.ok === false) return response.json();
          else throw response;
        })
        .then((jsonResponce) => {
          if (jsonResponce.error) throw jsonResponce;
          else return jsonResponce;
        }, (response) => {
          // throw errors that don't have `.json()` available further
          throw response;
        })
    }
  });
}

export function count(group, query, contextTopicId, namespace) {

  let endpoint = '';
  if (namespace) {
    endpoint += `workspaces/${namespace}/`;
  } else {
    console.warn('Topics count: `namespace` is missing!');
  }

  if (contextTopicId) {
    endpoint += `topics/${contextTopicId}/topics/count?where[groupKey]=${group}`;
  } else {
    endpoint += 'topics/count?where[groupKey]=' + group;
  }

  if (query) {
    endpoint += '&' + toQueryString({where:query}, false);
  }

  return ({fetch, validate}) => ({
    type: 'TOPIC_COUNT',
    payload: {
      promise: getApi(fetch, endpoint)
        .catch(response => {
          throw response;
        })
    }
  });
}

export function loadCurrent(id, namespace) {

  let endpoint = '';
  if(namespace) {
    endpoint += `workspaces/${namespace}/`;
  }
  endpoint += 'topics/' + id;

  return ({fetch, validate}) => ({
    type: 'TOPIC_FIND_ONE',
    payload: {
      promise:  getApi(fetch, endpoint)
        .catch(response => {
          throw response;
        })
    }
  });
}

export function loadTopic(id) {

  let endpoint = 'topics/' + id + '?filter[include][1][type]&filter[include][2][author]&filter[extra][operations]';

  return ({fetch, validate}) => ({
    type: 'LOAD_TOPIC',
    payload: {
      promise:  getApi(fetch, endpoint)
        .catch(response => {
          throw response;
        })
    }
  });
}

/**
 * Load single topic in a `namespace` by `groupKey` and `contextTopicNum` or `contextTopicKey`
 * @param contextTopicId
 * @param groupKey
 * @param topicNum
 * @returns {Function}
 */
export function loadContextGroupTopicByNum(contextTopicId, groupKey, topicNum) {

  let endpoint = `topics/${contextTopicId}/topics/?filter[include][1][type]&filter[include][2][author]&filter[extra][operations]`;
  endpoint += `&filter[where][groupKey]=${groupKey}`;

  if(isNaN(topicNum))
    endpoint += `&filter[where][contextTopicKey]=${topicNum}`;
  else
    endpoint += `&filter[where][contextTopicNum]=${topicNum}`;

  return ({fetch, validate}) => ({
    type: 'LOAD_TOPIC',
    payload: {
      promise:  getApi(fetch, endpoint)
        .catch(response => {
          throw response;
        })
    }
  });
}

/**
 * Load single topic in a `namespace` by `groupKey` and `contextTopicNum` or `contextTopicKey`
 * @param contextTopicId
 * @param groupKey
 * @param topicNum
 * @returns {Function}
 */
export function loadNamespaceTopicByNum(namespace, ownerTopicKeyOrId, groupKey, topicNum) {

  let endpoint = `workspaces/${namespace}/topics/${ownerTopicKeyOrId}/topics/${groupKey}/${topicNum}?filter[include][1][type]&filter[include][2][author]&filter[extra][operations]`;
  //endpoint += `&filter[where][groupKey]=${groupKey}` ;
  //
  //if(isNaN(topicNum))
  //  endpoint += `&filter[where][contextTopicKey]=${topicNum}` ;
  //else
  //  endpoint += `&filter[where][contextTopicNum]=${topicNum}` ;

  return ({fetch, validate}) => ({
    type: 'LOAD_TOPIC',
    payload: {
      promise:  getApi(fetch, endpoint)
        .catch(response => {
          throw response;
        })
    }
  });
}

/**
 * Set current topic marker - describes which item in list is clicked on (e.g. to preload details)
 * @param {number} id
 * @returns {{type: string, payload: number}}
 */
export function setCurrentTopicMarker(id) {
  return {
    type: SET_CURRENT_TOPIC,
    payload: id
  };
}

export function loadTopicGroup(name) {

  let endpoint = `topicGroups/findOne?filter[where][group_key]=${name}`;

  return ({fetch, validate}) => ({
    type: 'LOAD_TOPIC_GROUP',
    meta: {
      groupKey: name
    },
    payload: {
      promise: apiGet(fetch, endpoint)
        .then(function(value) {
          if (value.error) {
            throw value.error;
          }
          else
            return value;
        }, function(reason) {
          // rejection
        })
        .catch(response => {
          throw response;
        })
    }
  });
}

export function loadTopicGroupBoard(name) {
 // workspaces/sandbox/topics/demosand/topics/board/3
  // http://localhost:3000/api/workspaces/sandbox/topics/demosand/topics/board/3
  let endpoint = `topicGroups/findOne?filter[where][group_key]=${name}`;

  return ({fetch, validate}) => ({
    type: 'LOAD_TOPIC_GROUP',
    meta: {
      groupKey: name
    },
    payload: {
      promise: apiGet(fetch, endpoint)
        .then(function(value) {
          if (value.error) {
            throw value.error;
          }
          else
            return value;
        }, function(reason) {
          // rejection
        })
        .catch(response => {
          throw response;
        })
    }
  });
}

export function loadFilters(group, query, contextTopicId) {

  let endpoint;
  if(contextTopicId) {
    endpoint = `topics/${contextTopicId}/filters/${group}`;
  } else {
    console.log('contextTopic must be provided for `loadFilters`');
  }

  return ({fetch, validate}) => ({
    type: 'TOPIC_LOAD_FILTERS',
    payload: {
      promise:  getApi(fetch, endpoint)
        .catch(response => {
          throw response;
        })
    }
  });
}
export function loadFormFields(group, contextTopicId) {

  let endpoint;
  if(contextTopicId) {
    endpoint = `topics/${contextTopicId}/formFields/${group}`;
  } else {
    endpoint = `topics/${contextTopicId}/formFields/${group}`;
  }

  return ({fetch, validate}) => ({
    type: 'TOPIC_LOAD_FORM_FIELDS',
    payload: {
      promise:  getApi(fetch, endpoint)
        .catch(response => {
          throw response;
        }),
    },
    meta: {
      contextTopicId: contextTopicId,
      group: group
    }
  });
}

export function findOrCreateForm(ownerTopicId, groupKey, initialValues) {
  return {
    type: PREPARE_NEW_TOPIC_FORM_DATA,
    payload: {
      ownerTopicId: ownerTopicId > 0 ? ownerTopicId : 99999999,
      groupKey,
      initialValues
    }
  };
}

export function makeTopicUpdateFormRecord(id, initialValues) {
  return {
    type: PREPARE_NEW_TOPIC_FORM_DATA,
    payload: {
      topicId: id,
      initialValues
    }
  };
}

export function applyTopicFormDefaults(cid, data, overwrite = false) {
  return {
    type: APPLY_TOPIC_FORM_DEFAULTS,
    payload: data,
    meta: {
      formCid: cid,
      overwrite: overwrite
    }
  };
}

export function setNewTopicField({target: {name, value}}, {cid, id}) {
  return {
    type: SET_NEW_TOPIC_FIELD,
    payload: {name, value, cid, id}
  };
}

export function setNewTopic(data) {
  return {
    type: SET_NEW_TOPIC,
    payload: data
  };
}
export function cleanErrorSummary(data) {
  return {
    type: CLEAN_FORM_GENERAL_ERRORS,
    payload: data
  };
}

export function create(data) {

  const endpoint = 'topics';

  return ({fetch, validate}) => ({
    type: 'TOPIC_CREATE',
    payload: {
      promise: validateForm(validate, data)
        .then(() => apiPut(fetch, endpoint, data))
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

/**
 *
 * @param cid
 * @param data
 * @returns {Function}
 */
export function postTopicFormData(cid, data) {

  const endpoint = 'topics';

  return ({fetch, validate}) => ({
    type: 'TOPIC_CREATE',
    meta: {
      formCid: cid
    },
    payload: {
      promise: validateForm(validate, data)
        .then(() => apiPut(fetch, endpoint, data))
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

export function save(id, data) {

  const endpoint = 'topics/' + id;

  return ({fetch, validate}) => ({
    type: 'TOPIC_SAVE',
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

export const RUN_OPERATION = 'TOPIC_RUN_OPERATION_PENDING';
export const RUN_OPERATION_SUCCESS = 'TOPIC_RUN_OPERATION_SUCCESS';
export const RUN_OPERATION_ERROR = 'TOPIC_RUN_OPERATION_ERROR';

export function runOperation(topicId, operation) {

  const endpoint = `topics/${topicId}/runOperation`;

  return ({fetch, validate}) => ({
    type: 'TOPIC_RUN_OPERATION',
    payload: {
      promise: apiPost(fetch, endpoint, {operation:operation})
        .catch(response => {
          throw response;
        }),
      data: {
        topicId:topicId,
        operation:operation
      }
    }
  });
}

export const DELETE_TOPIC = 'DELETE_TOPIC_PENDING';
export const DELETE_TOPIC_SUCCESS = 'DELETE_TOPIC_SUCCESS';
export const DELETE_TOPIC_ERROR = 'DELETE_TOPIC_ERROR';

export function deleteTopic(topicId) {

  const endpoint = `rawTopics/${topicId}`;

  return ({fetch, validate}) => ({
    type: 'DELETE_TOPIC',
    meta: {
      topicId: topicId
    },
    payload: {
      promise: fetch(`/api/${endpoint}`, {
        credentials: 'include', // send cookies to server for authentication
        headers: {'Accept': 'application/json', 'Content-Type': 'application/json'},
        method: 'DELETE',
      })
        .then(response => {
          if (response.status === 200) return true;
          throw response;
        })
        .catch(response => {
          if (!response) throw new Error('No response');
          else if (response.ok === false) return response.json();
          else throw response;
        })
        .then((jsonResponce) => {
          if (jsonResponce.error) throw jsonResponce;
          else return jsonResponce;
        }, (response) => {
          throw new Error(response);
        })
    }
  });
}

export const FETCH_ENTITY_MENU = 'FETCH_ENTITY_MENU_PENDING';
export const FETCH_ENTITY_MENU_SUCCESS = 'FETCH_ENTITY_MENU_SUCCESS';
export const FETCH_ENTITY_MENU_ERROR = 'FETCH_ENTITY_MENU_ERROR';

export function fetchEntityMenu(id) {

  let endpoint = `entities/${id}/menu`;

  return ({fetch, validate}) => ({
    type: 'FETCH_ENTITY_MENU',
    payload: {
      promise:  getApi(fetch, endpoint)
        .catch(response => {
          throw response;
        })
    }
  });
}

export const FETCH_TOPIC_MENU = 'FETCH_TOPIC_MENU_PENDING';
export const FETCH_TOPIC_MENU_SUCCESS = 'FETCH_TOPIC_MENU_SUCCESS';
export const FETCH_TOPIC_MENU_ERROR = 'FETCH_TOPIC_MENU_ERROR';

export function fetchTopicMenu(id, namespace) {

  let endpoint = `workspaces/${namespace}/topics/${id}/menu`;

  return ({fetch, validate}) => ({
    type: 'FETCH_TOPIC_MENU',
    meta: {
      topicId: id
    },
    payload: {
      promise:  getApi(fetch, endpoint)
        .catch(response => {
          throw response;
        })
    }
  });
}
