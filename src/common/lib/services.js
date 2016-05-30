/**
 * Brainfock, <http://www.brainfock.org>
 *
 * Copyright (C) 2015-present Sergii Gamaiunov <hello@webkadabra.com>
 * All rights reserved.
 *
 * This source code is licensed under the GPL-style license found in the
 * LICENSE file in the root directory of this source tree.
 */
export const apiGet = (fetch, endpoint, host) =>
  fetch((host ? host : '/') + `api/${endpoint}`, {
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
