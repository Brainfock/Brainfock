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

