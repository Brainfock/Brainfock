/**
 * Brainfock - Community & Business Management Solution
 *
 * @link http://www.brainfock.org
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