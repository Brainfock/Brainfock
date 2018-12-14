/**
 * Brainfock, <http://www.brainfock.org>
 *
 * Copyright (C) 2015-present Sergii Gamaiunov <hello@webkadabra.com>
 * All rights reserved.
 *
 * This source code is licensed under the GPL-style license found in the
 * LICENSE file in the root directory of this source tree.
 */
export const FIND = 'WIKI_FIND_PENDING';
export const FIND_ERROR = 'WIKI_FIND_ERROR';
export const FIND_SUCCESS = 'WIKI_FIND_SUCCESS';
export const SAVE = 'WIKI_SAVE_PENDING';
export const SAVE_ERROR = 'WIKI_SAVE_ERROR';
export const SAVE_SUCCESS = 'WIKI_SAVE_SUCCESS';
export const SET_EDIT_WIKI_FIELD = 'SET_EDIT_WIKI_FIELD';


const getApi = (fetch, endpoint, host='/') =>
  fetch(`${host}api/${endpoint}`, {
    headers: {'Accept': 'application/json', 'Content-Type': 'application/json'},
    method: 'get',
    credentials: 'include', // accept cookies from server, for authentication
  })
    .then(response => {
      if (response.status === 200) return response.json();
      throw response;
    });

export function fetchContextPage(data) {

  const {
    location,
    params,
    props,
    app,
    users
    } = data;

  let query = [];
  query.push('filter[where][contextEntityId]=0');
  query.push('filter[where][pageUid]='+params.uid);
  if(users && users.viewer) {
    query.push('access_token='+users.viewer.authToken)
  }

//let query = [];
  //query.push('filter[where][contextEntityId]=0');
  //query.push('filter[where][pageUid]='+params.uid);
  //if(props.users && props.users.viewer) {
  //  query.push('access_token='+props.users.viewer.authToken)
  //}
  const host = app.baseUrl;
  console.log('host',host)
  //return fetch('/api/wikiPages/findOne?'+ query.join('&'), {
  //  headers: {'Accept': 'application/json', 'Content-Type': 'application/json'},
  //  method: 'get',
  //  credentials: 'include', // accept cookies from server, for authentication
  //})
  //  .then(response => {
  //    if (response.status === 200) return response.json();
  //    throw response;
  //  });
  //
  //return promisingagent.get(`http://localhost:3000/api/wikiPages/findOne?` + query.join('&'))
  //  .then((response) => {
  //    findWikiSuccess(response.body);
  //    return response.body
  //  });

  let endpoint =  'wikiPages/findOne?'+ query.join('&');
  console.log("ENDPOINT", endpoint);
  return ({fetch, validate}) => ({
    type: 'WIKI_FIND',
    payload: {
      promise:  getApi(fetch, endpoint, host)
        .catch(response => {
          throw response;
        })
    }
  });
}

export function findContextPage(context_id, uid) {
  return ({fetch, validate}) => ({
    type: 'WIKI_FIND',
    payload: {
      promise:  getApi(fetch, 'wikiPages/findOne?filter[where][contextEntityId]='+context_id+'&filter[where][pageUid]='+uid)
        .catch(response => {
          throw response;
        })
    }
  });
}

export function findWikiSuccess(data) {
  return {
    type: FIND_SUCCESS,
    payload: data
  };
}

export function setWikiViewPageField({target: {name, value}}) {
  switch (name) {
    case 'title':
      value = value.slice(0, 250); break;
  }
  return {
    type: SET_EDIT_WIKI_FIELD,
    payload: {name, value}
  };
}

const validateForm = (validate, fields) => validate(fields)
  .prop('email').required().email()
  .prop('password').required().simplePassword()
  .promise;

const post = (fetch, endpoint, body) =>
  fetch(`/api/${endpoint}`, {
    body: JSON.stringify(body),
    credentials: 'include', // accept cookies from server, for authentication
    headers: {'Accept': 'application/json', 'Content-Type': 'application/json'},
    method: 'put'
  })
    .then(response => {
      if (response.status === 200) return response.json();
      throw response;
    });


export function saveWikiChanges(id, fields) {
  let endpoint;
  if (id) {
    endpoint = 'wikiPages/' + id;
  } else {
    let query = [];
    if (fields.pageUid) {
      query.push('filter[where][pageUid]=' + fields.pageUid);
    }
    if (fields.contextEntityId) {
      query.push('filter[where][contextEntityId]=' + fields.contextEntityId);
    }
    endpoint = 'wikiPages/?' + query.join('&');
  }

  return ({fetch, validate}) => ({
    type: 'SAVE_WIKI',
    payload: {
      promise: post(fetch, endpoint, fields)
        .catch(response => {
          throw response;
        })
      //promise: validateForm(validate, fields)
      //  .then(() => post(fetch, endpoint, fields))
      //  .catch(response => {
      //    throw response;
      //  })
    }
  });
}
