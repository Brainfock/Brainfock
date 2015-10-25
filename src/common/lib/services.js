/**
 * Brainfock - community & issue management software
 * Copyright (c) 2015, Sergii Gamaiunov ("Webkadabra")  All rights reserved.
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

export const apiGet = (fetch, endpoint) =>
  fetch(`/api/${endpoint}`, {
    headers: {'Accept': 'application/json', 'Content-Type': 'application/json'},
    method: 'get',
    credentials: 'include', // accept cookies from server, for authentication
  })
    .then(response => {
      if (response.status === 200) return response.json();
      return response.json();
    });

export const apiPost = (fetch, endpoint, body) =>
  fetch(`/api/${endpoint}`, {
    body: JSON.stringify(body),
    credentials: 'include', // accept cookies from server, for authentication
    headers: {'Accept': 'application/json', 'Content-Type': 'application/json'},
    method: 'post'
  })
    .then(response => {
      if (response.status === 200) return response.json();
      throw response;
    });

export const apiPut = (fetch, endpoint, body) =>
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
