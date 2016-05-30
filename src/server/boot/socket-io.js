/**
 * Brainfock, <http://www.brainfock.org>
 *
 * Copyright (C) 2015-present Sergii Gamaiunov <hello@webkadabra.com>
 * All rights reserved.
 *
 * This source code is licensed under the GPL-style license found in the
 * LICENSE file in the root directory of this source tree.
 */
var loopback = require('loopback');

var onlineUsers = 0;
var started = false;

function checkAuthToken(tokenId, next) {
  next(null, tokenId!==null);
}

module.exports = function(app) {

  //app.once('started', function(server) {
  app.on('started', function(server)
  {
    app.io = require('socket.io')();
    app.io.listen(server);

    app.io.use(function(socket, next)
    {
      var auth_token = socket.handshake.query.auth_token || null;
      if (auth_token) {
        app.models.AccessToken.findById(auth_token, function(err, token) {
          if (err) {
            next(err);
          } else if (token) {
            token.validate(function(err, isValid) {
              if (err) {
                return next(err);
              } else if (isValid) {
                var ctx = loopback.getCurrentContext();
                if (ctx) {
                  ctx.set('accessToken', token);
                  socket.authWasRequired=true;
                  return next(null, token);
                } else {
                  return next(null, token);
                }
              } else {
                var e = new Error('Invalid Access Token');
                e.status = e.statusCode = 401;
                e.code = 'INVALID_TOKEN';
                return next(e);
              }
            });
          } else {
            next();
          }
        });
      } else {
        socket.accessToken = false;
        next();
      }
    });

      /**
       * this is what happens per connected socket client
       *
       * Important: do not bind to 'connection' event, which is fired before all i.middlewares() are run
       */
      app.io.on('connect', function(socket){

        var ctx = require('loopback').getCurrentContext();
        var currentUser = ctx && ctx.get('currentUser');
        console.log('[SOCKET] NEW CONNECTION', currentUser, socket.authWasRequired);

        onlineUsers++;

        app.io.sockets.emit('onlineUsers', { onlineUsers: onlineUsers });

        setTimeout(function(){socket.emit('testAuth', { authOk: !!(currentUser) });},5000);

        /**
         * subscribe to comments
         */
        socket.on('sub-comments', function (data) {
          app.models.Entity.findById(data.entity_id, function(_err, instance){
            if(!_err) {
              instance.checkUserAccess((currentUser ? (currentUser.id) : null),function(accessError, accessGranted){
                // check if user CAN join here
                if(accessGranted==true) {
                  socket.join('comments-'+data.entity_id); // We are using room of socket io
                }
              });
            }
          })
        });

        socket.on('disconnect', function() {
          console.log('[SOCKET] LOST CONNECTION' + (currentUser ? (currentUser.username + ':'+currentUser.id) : '%GUEST%'));
          onlineUsers--;
          app.io.sockets.emit('onlineUsers', { onlineUsers: onlineUsers });
        });
      });
  })
}