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

export const FIND = 'WIKI_FIND';
export const FIND_ERROR = 'WIKI_FIND_ERROR';
export const FIND_SUCCESS = 'WIKI_FIND_SUCCESS';
export const SAVE = 'WIKI_SAVE';
export const SAVE_ERROR = 'WIKI_SAVE_ERROR';
export const SAVE_SUCCESS = 'WIKI_SAVE_SUCCESS';
export const SET_EDIT_WIKI_FIELD = 'SET_EDIT_WIKI_FIELD';


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

export function findContextPage(context_id, uid) {
  return ({fetch, validate}) => ({
    types: [
      FIND,
      FIND_SUCCESS,
      FIND_ERROR
    ],
    payload: {
      promise:  getApi(fetch, 'wikiPages/findOne?filter[where][contextEntityId]='+context_id+'&filter[where][pageUid]='+uid)
        .catch(response => {
          // We can handle different password/username server errors here.
          //if (response.status === 401)
          //  throw validate.wrongPassword('password');
          throw response;
        })
    }
  });
}

export function findWikiSuccess(data) {
  return {
    type: FIND_SUCCESS,
    payload: {data}
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

  if(id) {
    var endpoint = 'wikiPages/'+id;
  }
  else {
    let query=[];
    if(fields.pageUid) {
      query.push('filter[where][pageUid]='+fields.pageUid);
    }
    if(fields.contextEntityId) {
      query.push('filter[where][contextEntityId]='+fields.contextEntityId);
    }
    var endpoint =  'wikiPages/?'+query.join('&')
  }

  return ({fetch, validate}) => ({
    types: [
      SAVE,
      SAVE_SUCCESS,
      SAVE_ERROR
    ],
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
