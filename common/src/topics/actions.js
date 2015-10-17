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
import {apiGet, apiPost, apiPut} from '../lib/services';

export const FIND = 'TOPIC_FIND';
export const FIND_SUCCESS = 'TOPIC_FIND_SUCCESS';
export const FIND_ERROR = 'TOPIC_FIND_ERROR';

export const FIND_ONE = 'TOPIC_FIND_ONE';
export const FIND_ONE_SUCCESS = 'TOPIC_FIND_SUCCESS_ONE';
export const FIND_ONE_ERROR = 'TOPIC_FIND_ERROR_ONE';

export const LOAD_TOPIC = 'LOAD_TOPIC';
export const LOAD_TOPIC_SUCCESS = 'LOAD_TOPIC_SUCCESS';
export const LOAD_TOPIC_ERROR = 'LOAD_TOPIC_ERROR';

export const LOAD_TOPIC_GROUP = 'LOAD_TOPIC_GROUP';
export const LOAD_TOPIC_GROUP_SUCCESS = 'LOAD_TOPIC_GROUP_SUCCESS';
export const LOAD_TOPIC_GROUP_ERROR = 'LOAD_TOPIC_GROUP_ERROR';

export const SET_EDIT_FIELD = 'TOPIC_SET_EDIT_FIELD';
export const SAVE = 'TOPIC_SAVE';
export const SAVE_ERROR = 'TOPIC_SAVE_ERROR';
export const SAVE_SUCCESS = 'TOPIC_SAVE_SUCCESS';

export const COUNT = 'TOPIC_COUNT';
export const COUNT_SUCCESS = 'TOPIC_COUNT_SUCCESS';
export const COUNT_ERROR = 'TOPIC_COUNT_ERROR';

export const LOAD_FILTERS = 'TOPIC_LOAD_FILTERS';
export const LOAD_FILTERS_SUCCESS = 'TOPIC_LOAD_FILTERS_SUCCESS';
export const LOAD_FILTERS_ERROR = 'TOPIC_LOAD_FILTERS_ERROR';

export const LOAD_FORM_FIELDS = 'TOPIC_LOAD_FORM_FIELDS';
export const LOAD_FORM_FIELDS_SUCCESS = 'TOPIC_LOAD_FORM_FIELDS_SUCCESS';
export const LOAD_FORM_FIELDS_ERROR = 'TOPIC_LOAD_FORM_FIELDS_ERROR';

export const SET_NEW_TOPIC = 'SET_NEW_TOPIC';
export const SET_NEW_TOPIC_FIELD = 'SET_NEW_TOPIC_FIELD';
export const CREATE = 'TOPIC_CREATE';
export const CREATE_SUCCESS = 'TOPIC_CREATE_SUCCESS';
export const CREATE_ERROR = 'TOPIC_CREATE_ERROR';
export const SET_CURRENT_TOPIC = 'TOPIC_SET_CURRENT_TOPIC';

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
    Object.keys(x).forEach(function (key) {
      if (!x.hasOwnProperty(key)) return;

      var newPath = path.slice();
      newPath.push(key);

      var vals = [];
      if (typeof x[key] == 'object') {
        vals = flattenObj(x[key], newPath);
      } else {
        vals.push({ path: newPath, val: x[key] });
      }
      vals.forEach(function (obj) {
        return result.push(obj);
      });
    });

    return result;
  } // flattenObj

  // start with  flattening `obj`
  var parts = flattenObj(obj); // [ { path: [ ...parts ], val: ... }, ... ]

  // convert to array notation:
  parts = parts.map(function (varInfo) {
    if (varInfo.path.length == 1) varInfo.path = varInfo.path[0];else {
      var first = varInfo.path[0];
      var rest = varInfo.path.slice(1);
      varInfo.path = first + '[' + rest.join('][') + ']';
    }
    return varInfo;
  }); // parts.map

  // join the parts to a query-string url-component
  var queryString = parts.map(function (varInfo) {
    return varInfo.path + '=' + varInfo.val;
  }).join('&');
  if (urlEncode) return encodeURIComponent(queryString);else return queryString;
}
export function find(type, query, contextTopicId) {
  let endpoint;
  if(contextTopicId) {
    endpoint = `topics/${contextTopicId}/topics/?filter[where][groupKey]=${type}` ;
  } else {
    endpoint = 'topics/?filter[where][groupKey]='+type ;
  }

  // include some additional info
  endpoint += '&filter[include][type]';

  if(query) {
    endpoint += '&'+toQueryString({filter:{where:query}},false);
  }

  return ({fetch, validate}) => ({
    types: [
      FIND,
      FIND_SUCCESS,
      FIND_ERROR
    ],
    payload: {
      promise:  getApi(fetch, endpoint)
        .catch(response => {
          throw response;
        })
    }
  });
}

export function count(group, query, contextTopicId) {

  let endpoint;
  if(contextTopicId) {
    endpoint = `topics/${contextTopicId}/topics/count?where[groupKey]=${group}` ;
  } else {
    endpoint = 'topics/count?where[groupKey]='+group ;
  }

  if(query) {
    endpoint += '&'+toQueryString({where:query},false);
  }

  return ({fetch, validate}) => ({
    types: [
      COUNT,
      COUNT_SUCCESS,
      COUNT_ERROR
    ],
    payload: {
      promise: getApi(fetch, endpoint)
        .catch(response => {
          throw response;
        })
    }
  });
}

export function loadCurrent(id) {

  let endpoint = 'topics/'+id ;

  return ({fetch, validate}) => ({
    types: [
      FIND_ONE,
      FIND_ONE_SUCCESS,
      FIND_ONE_ERROR
    ],
    payload: {
      promise:  getApi(fetch, endpoint)
        .catch(response => {
          throw response;
        })
    }
  });
}

export function loadTopic(id) {

  let endpoint = 'topics/'+id+'?filter[include][1][type]&filter[include][2][author]&filter[extra][operations]' ;

  return ({fetch, validate}) => ({
    types: [
      LOAD_TOPIC,
      LOAD_TOPIC_SUCCESS,
      LOAD_TOPIC_ERROR
    ],
    payload: {
      promise:  getApi(fetch, endpoint)
        .catch(response => {
          throw response;
        })
    }
  });
}

export function loadNamespaceTopic(namespace,topicKey) {

  let endpoint = `topics/findOne?filter[include][1][type]&filter[include][2][author]&filter[extra][operations]` ;
  endpoint += `&filter[where][namespace]=${namespace}` ;
  endpoint += `&filter[where][contextTopicKey]=${topicKey}` ;

  return ({fetch, validate}) => ({
    types: [
      LOAD_TOPIC,
      LOAD_TOPIC_SUCCESS,
      LOAD_TOPIC_ERROR
    ],
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
 * @param namespace
 * @param groupKey
 * @param topicNum
 * @returns {Function}
 */
export function loadNamespaceGroupTopicByNum(namespace, groupKey, topicNum) {

  let endpoint = `topics/findOne?filter[include][1][type]&filter[include][2][author]&filter[extra][operations]` ;
  endpoint += `&filter[where][namespace]=${namespace}` ;
  endpoint += `&filter[where][groupKey]=${groupKey}` ;

  if(isNaN(topicNum))
    endpoint += `&filter[where][contextTopicKey]=${topicNum}` ;
  else
    endpoint += `&filter[where][contextTopicNum]=${topicNum}` ;

  return ({fetch, validate}) => ({
    types: [
      LOAD_TOPIC,
      LOAD_TOPIC_SUCCESS,
      LOAD_TOPIC_ERROR
    ],
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

  let endpoint = `topicGroups/findOne?filter[where][group_key]=${name}` ;

  return ({fetch, validate}) => ({
    types: [
      LOAD_TOPIC_GROUP,
      LOAD_TOPIC_GROUP_SUCCESS,
      LOAD_TOPIC_GROUP_ERROR
    ],
    payload: {
      promise:  getApi(fetch, endpoint)
        .catch(response => {
          throw response;
        })
    }
  });
}

export function loadFilters(group, query, contextTopicId) {

  let endpoint;
  if(contextTopicId) {
    endpoint = `topics/${contextTopicId}/filters/${group}` ;
  } else {
    console.log('contextTopic must be provided for `loadFilters`')
  }

  return ({fetch, validate}) => ({
    types: [
      LOAD_FILTERS,
      LOAD_FILTERS_SUCCESS,
      LOAD_FILTERS_ERROR
    ],
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
    endpoint = `topics/${contextTopicId}/formFields/${group}` ;
  } else {
    console.log('contextTopic must be provided for `formFields`')
  }

  return ({fetch, validate}) => ({
    types: [
      LOAD_FORM_FIELDS,
      LOAD_FORM_FIELDS_SUCCESS,
      LOAD_FORM_FIELDS_ERROR
    ],
    payload: {
      promise:  getApi(fetch, endpoint)
        .catch(response => {
          throw response;
        })
    }
  });
}

export function setNewTopicField({target: {name, value}}) {
  return {
    type: SET_NEW_TOPIC_FIELD,
    payload: {name, value}
  };
}

export function setNewTopic(data) {
  return {
    type: SET_NEW_TOPIC,
    payload: data
  };
}

export function create(data) {

  const endpoint = 'topics';

  return ({fetch, validate}) => ({
    types: [
      CREATE,
      CREATE_SUCCESS,
      CREATE_ERROR
    ],
    payload: {
      promise: apiPut(fetch, endpoint, data)
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

export function save(id, data) {

  const endpoint = 'topics/'+id;

  return ({fetch, validate}) => ({
    types: [
      SAVE,
      SAVE_SUCCESS,
      SAVE_ERROR
    ],
    payload: {
      promise: apiPut(fetch, endpoint, data)
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