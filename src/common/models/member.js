/**
 * Brainfock, <http://www.brainfock.org>
 *
 * Copyright (C) 2015-present Sergii Gamaiunov <hello@webkadabra.com>
 * All rights reserved.
 *
 * This source code is licensed under the GPL-style license found in the
 * LICENSE file in the root directory of this source tree.
 */
import {clearBaseACLs} from '../utils/model';

module.exports = function(Member) {
  const acls = [
    {
      "principalType": "ROLE",
      "principalId": "$everyone",
      "permission": "DENY"
    },
    //{
    //  "principalType": "ROLE",
    //  "principalId": "$everyone",
    //  "permission": "ALLOW",
    //  "property": "create"
    //},
    //{
    //  "principalType": "ROLE",
    //  "principalId": "$owner",
    //  "permission": "ALLOW",
    //  "property": "deleteById"
    //},
    //{
    //  "principalType": "ROLE",
    //  "principalId": "$everyone",
    //  "permission": "ALLOW",
    //  "property": "login"
    //},
    //{
    //  "principalType": "ROLE",
    //  "principalId": "$everyone",
    //  "permission": "ALLOW",
    //  "property": "logout"
    //},
    //{
    //  "principalType": "ROLE",
    //  "principalId": "$owner",
    //  "permission": "ALLOW",
    //  "property": "findById"
    //},
    //{
    //  "principalType": "ROLE",
    //  "principalId": "$owner",
    //  "permission": "ALLOW",
    //  "property": "updateAttributes"
    //},
    //{
    //  "principalType": "ROLE",
    //  "principalId": "$everyone",
    //  "permission": "ALLOW",
    //  "property": "confirm"
    //},
    //{
    //  "principalType": "ROLE",
    //  "principalId": "$everyone",
    //  "permission": "ALLOW",
    //  "property": "resetPassword",
    //  "accessType": "EXECUTE"
    //},

    // Brainfock custom ACLs for built-in `User` model:
    {
      "principalType": "ROLE",
      "principalId": "Admin",
      "permission": "ALLOW",
      "property": "find"
    },
    {
      "principalType": "ROLE",
      "principalId": "Admin",
      "permission": "ALLOW",
      "property": "*"
    }

  ]
  clearBaseACLs(Member, {acls:acls});
};

