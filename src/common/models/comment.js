/**
 * Brainfock, <http://www.brainfock.org>
 *
 * Copyright (C) 2015-present Sergii Gamaiunov <hello@webkadabra.com>
 * All rights reserved.
 *
 * This source code is licensed under the GPL-style license found in the
 * LICENSE file in the root directory of this source tree.
 */
const marked = require('marked');
const loopback = require('loopback');

module.exports = function(Comment) {

  //Comment.afterRemote( '**', function( ctx, data, next) {
  //  console.log(ctx.methodString, 'was invoked remotely');
  //  next();
  //});

  //Comment.observe('after save', function updateTimestamp(ctx, next) {
  //  console.log('after save of ',ctx.instance);
  //  if (ctx.instance) {
  //    Comment.app.io.sockets.in('comments-'+ctx.instance.entity_id).emit('new-comment', {data: ctx.instance.__data});
  //  }
  //  next();
  //});

  Comment.observe('before save', function updateTimestamp(ctx, next) {

    let context = loopback.getCurrentContext();
    let currentUser = context && context.get('currentUser');
    let currentIP;
    try {
      currentIP = context.get('http').req.ip;
    } catch (err) {
      // see https://github.com/tjanczuk/iisnode/issues/94
      console.log('Could not determine client ip'); // eslint-disable-line no-console, no-undef
    }

    if (ctx.instance) {
      if (ctx.isNewInstance === true) {
        ctx.instance.authorIp = currentIP || '0.0.0.0';
        ctx.instance.deleted = 0;
        ctx.instance.createdOn = new Date();
        if (currentUser) {
          ctx.instance.authorId = currentUser.id;
        }
      } else {
        ctx.instance.updatedOn = new Date();
        ctx.instance.authorIp = '127.0.0.1';
      }
    }
    next();
  });

  Comment.afterRemote('find', function(ctx, data, next) {
    if (ctx.result) {
      function populateValue($modelInstance, callback) {

        marked($modelInstance.text, {
          renderer: new marked.Renderer(),
          gfm: true,
          tables: true,
          breaks: false,
          pedantic: false,
          sanitize: true,
          smartLists: true,
          smartypants: false
        }, function(err, content) {
          if (err) throw err;
          $modelInstance.contentRendered = content;
          return callback();
        });
      }

      let resCount = data.length;
      let lopRes = [];
      ctx.result.forEach(function(/* SettingsField model instance */ item) {
        populateValue(item, function(result) {
          lopRes.push(1);
          if (lopRes.length == (resCount)) {
            next();
          }
        });
      });
    } else {
      return next();
    }
  });

  Comment.afterRemote('create', function(ctx, modelInstance, next) {
    if (modelInstance) {
      marked(modelInstance.text, {
        renderer: new marked.Renderer(),
        gfm: true,
        tables: true,
        breaks: false,
        pedantic: false,
        sanitize: true,
        smartLists: true,
        smartypants: false
      }, function(err, content) {

        if (err) throw err;
        modelInstance.contentRendered = content;
        Comment.app.io.sockets.in('comments-' + modelInstance.entityId).emit('new-comment', {data: modelInstance.__data});
        return next();
      });
    } else {
      return next();
    }
  });
};
