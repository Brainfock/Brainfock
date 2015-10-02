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


export function find(type, query, contextTopicId) {
  let endpoint;
  if(contextTopicId) {
    endpoint = `topics/${contextTopicId}/topics/?filter[where][groupKey]=${type}` ;
  } else {
    endpoint = 'topics/?filter[where][groupKey]='+type ;
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


  return ({fetch, validate}) => ({
    types: [
      COUNT,
      COUNT_SUCCESS,
      COUNT_ERROR
    ],
    payload: {
      promise:  getApi(fetch, endpoint)
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

  let endpoint = 'topics/'+id+'?filter[include][type]' ;

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