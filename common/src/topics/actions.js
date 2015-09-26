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
export const FIND_ERROR = 'TOPIC_FIND_ERROR';
export const FIND_SUCCESS = 'TOPIC_FIND_SUCCESS';
export const SAVE = 'TOPIC_SAVE';
export const SAVE_ERROR = 'TOPIC_SAVE_ERROR';
export const SAVE_SUCCESS = 'TOPIC_SAVE_SUCCESS';
export const SET_EDIT_FIELD = 'TOPIC_SET_EDIT_FIELD';


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

  let endpoint = 'topics/?filter[where][groupKey]='+type ;
  if(contextTopicId > 0) {
    endpoint += '&filter[where][contextTopicId]='+contextTopicId;
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