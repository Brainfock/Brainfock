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
var path = require('path');

const config = require('../config');
require('babel/register')({stage: 0});
// To ignore webpack custom loaders on server.
config.webpackStylesExtensions.forEach(function(ext) {
  require.extensions['.' + ext] = function() {};
});

const pkg = require('../../../package.json');
VERSION = JSON.stringify(pkg.version);
VERSION_FULL = JSON.stringify(pkg.name + ' ' + pkg.version);

var app = require(path.resolve(__dirname, '../main'));

function debug(data) {
  console.log(data);
}

var accounts = [
  {username: 'Admin', email: 'admin@brainfock.com', password: 'brainfock'},
  {username: 'John', email: 'john@doe.com', password: 'password'},
  {username: 'Jane', email: 'jane@doe.com', password: 'password'}
];

var dataSource = app.dataSources.db;

var User = app.models.user;
var Role = app.models.Role;
var RoleMapping = app.models.RoleMapping;
//var Team = app.models.Team;

//dataSource.automigrate('User', function(err) {
 // if (err) throw err;

  //var Account = app.models.Account;
  //var count = accounts.length;

  app.models.User.create([
    {username: 'Admin', email: 'admin@brainfock.com', password: 'brainfock'},
    {username: 'John', email: 'john@doe.com', password: 'password'},
    {username: 'Jane', email: 'jane@doe.com', password: 'password'},
    {username: 'Bob', email: 'bob@projects.com', password: 'password'}
  ], function(err, users) {
    if (err) return debug(err);

    // Create projects, assign project owners and project team members

    // Create the admin role
    app.models.Role.create({
      name: 'Admin'
    }, function(err, role) {
      if (err) return debug(err);

      debug(role);

      role.principals.create({
        principalType: RoleMapping.USER,
        principalId: users[0].id
      }, function(err, principal) {
        if (err) return debug(err);

        console.log(principal);
        dataSource.disconnect();
      });
    });
  });


  //accounts.forEach(function(account) {
  //  Account.create(account, function(err, record) {
  //    if (err) return console.log(err);
  //
  //    console.log('Record created:', record);
  //
  //    count--;
  //
  //    if (count === 0) {
  //      console.log('done');
  //      dataSource.disconnect();
  //    }
  //  });
  //});
//});