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
import {mergeQuery} from 'loopback-datasource-juggler/lib/utils';
import app from '../../server/main';

module.exports = function(Workspace) {

  const config = app.get('bfk');
  Workspace.validatesPresenceOf('name', 'namespace');
  Workspace.validatesUniquenessOf('namespace', {message: 'Namespace is not available'});
  // add reserved namespaces under {bfk:{reservedNamespace:[]} property at config.json
  if (config.reservedNamespace) {
    Workspace.validatesExclusionOf('namespace', {in: config.reservedNamespace});
  }

  /**
   * Check if userId has read access on workspace
   * @param {Number} userId
   * @param {Function} next
   * @returns {*}
   */
  Workspace.prototype.checkUserAccess = function(userId, next) {
    if (this.accessPrivateYn === 0 || (this.accessPrivateYn === 1 && userId > 0 && this.ownerUserId === userId)) {
      return next(null, true);
    } else if (userId > 0) {

      return next(null, false);

      // TODO: implement workspace users
      //Topic.app.models.EntityAccessAssign.findOne(
      //  {where:{
      //    authType:0,
      //    authId:userId,
      //    entityId:this.entityId
      //  }},
      //  (err, data) => next(null, !(err || !data))
      //);
    } else {
      return next(null, false);
    }
  };

  Workspace.promiseUserAccess = function(modelId, userId) {
    return new Promise(
      function(resolve, reject) {
        Workspace.findById(modelId, function(err, instance) {
          if (err || !instance) return reject(null, false);
          instance.checkUserAccess(userId,function(err,isAllowed) {
            if (err || !isAllowed) return reject(null, false);
            return resolve(modelId, true);
          });
        });
      });
  }

  Workspace.on('attached', function() {
    Workspace.nestRemoting('topics');

    const override = Workspace.findOne;
    Workspace.findOneCore = override;
    Workspace.findOne = function(filter, options, callback) {

      // from dao.js:
      if (options === undefined && callback === undefined) {
        if (typeof filter === 'function') {
          callback = filter;
          filter = {};
        }
      } else if (callback === undefined) {
        if (typeof options === 'function') {
          callback = options;
          options = {};
        }
      }

      callback = callback || {};
      filter = filter || {};
      options = options || {};
      // END [from dao.js]

      /**
       * allow users to find topics by their contextTopicKey, eg. /api/topics/BF
       * currently this is designed to work with topics that don't have contextTopicId (root topics)
       */
      if (filter.where.id) {
        if (isNaN(filter.where.id)) {
          let namespaceFilter = filter.where.id;
          delete filter.where.id;
          filter = mergeQuery(filter, {where: {
            and: [
              {namespace: namespaceFilter}
            ]
          }});
        }
      }

      // go on with regular `findOne` method
      return override.apply(this, [filter, options, callback]);
    };
  });

  /**
   * after remote hook to validate user view access
   * @param ctx
   * @param instance
   * @param next
   * @returns {*}
   */
  function validateWorkspaceViewAccess(ctx, instance, next) {
    console.log('validateWorkspaceViewAccess')
    console.log(instance)
    const currentUser = loopback.getCurrentContext().get('currentUser');
    if (instance) {
      let e = new Error('Authorization Required');
      e.status = e.statusCode = 401;
      e.code = 'AUTHORIZATION_REQUIRED';

      if (instance.accessPrivateYn === 1 && (!currentUser || instance.ownerUserId !== currentUser.id)) {
        return next(e);
      } else {
        // TODO: implement workspace users
        return next();
      }
    } else {
      return next();
    }
  }

  Workspace.afterRemote('findOne', validateWorkspaceViewAccess);
  Workspace.afterRemote('findById', validateWorkspaceViewAccess);

  Workspace.afterRemote('__findByKey__topics',
  /**
   *
   * @param {Object} ctx
   * @param {Object|modelInstance} modelInstance
   * @param next
   */
  (ctx, modelInstance, next) => {
    if (modelInstance) {
      if (ctx.req.query && ctx.req.query.filter && ctx.req.query.filter.extra && ctx.req.query.filter.extra.hasOwnProperty('operations')) {
        // lookup operations based && next()
        modelInstance.getOperations(function(err, operations) {
          if (err) return next(err);
          modelInstance.operations = operations;
          return next();
        });
      } else {
        return next();
      }
    } else {
      return next();
    }
  });

  /**
   * API: /:id/topics/:nTopicId/topics/:groupKey/:topicNum
   *
   * @param id
   * @param groupKey
   * @param cb
   * @private
   */
  Workspace.__findByKey__topics = function(namespace, nTopicId, groupKey, topicNum, cb) {

    const currentUser = loopback.getCurrentContext().get('currentUser');
    const userId = currentUser ? currentUser.id : null;

    Workspace.findOne({where:{
      namespace: namespace
    }}, function(err, wspcInstance) {

      if (err) throw err;

      if (!wspcInstance) return cb(null, []);

      wspcInstance.checkUserAccess(userId, function(err, isAllowed) {

        if(err) return cb(err, null);
        if(!isAllowed) {
          let e = new Error('Authorization Required');
          e.status = e.statusCode = 401;
          e.code = 'AUTHORIZATION_REQUIRED';
          return cb(e, null);
        } else {
          // find context (owner) topic
          Workspace.app.models.Topic.findOne({where:{
            workspaceId: wspcInstance.id,
            contextTopicKey: nTopicId
          }}, function(err, ownerTopicInstance) {

            if (err) throw err;
            if (!ownerTopicInstance)
              return cb(null, []);
            ownerTopicInstance.checkUserAccess(userId, function(err, isAllowed) {

              if (err) return cb(err, null);
              if (!isAllowed) {
                let e = new Error('Authorization Required');
                e.status = e.statusCode = 401;
                e.code = 'AUTHORIZATION_REQUIRED';
                return cb(e, null);
              } else {

                const context = loopback.getCurrentContext();
                let filter;

                if (context.get('http').req.query && context.get('http').req.query.filter) {
                  filter = mergeQuery({where:{
                    groupKey: groupKey,
                    workspaceId: wspcInstance.id,
                    contextTopicId: ownerTopicInstance.id,
                    contextTopicNum: topicNum,
                  }}, context.get('http').req.query.filter);
                } else {
                  filter = {where:{
                    groupKey: groupKey,
                    workspaceId: wspcInstance.id,
                    contextTopicId: ownerTopicInstance.id,
                    contextTopicNum: topicNum
                  }};
                }

                Workspace.app.models.Topic.findOne(filter, function(err, topicInstance) {

                  if (err) throw err;
                  if (!topicInstance) return cb(null, []);


                  topicInstance.checkUserAccess(userId, function(err, isAllowed) {

                    if (err) return cb(err, null);
                    if (!isAllowed) {
                      let e = new Error('Authorization Required');
                      e.status = e.statusCode = 401;
                      e.code = 'AUTHORIZATION_REQUIRED';
                      return cb(e, null);
                    } else {
                      cb(null, topicInstance);
                    }
                  });
                });
              }
            });
          });
        }
      });
    });
  };

  /**
   * REST API endpoint `api/topics/:contextTopicKey/formFields`
   */
  Workspace.remoteMethod(
    '__findByKey__topics',
    {
      accepts: [
        {arg: 'namespace', type: 'any', http: {source: 'path'}, required: true},
        {arg: 'nTopicId', type: 'any', http: {source: 'path'}, required: true},
        {arg: 'groupKey', type: 'string', http: {source: 'path'}, required: true},
        {arg: 'topicNum', type: 'any', http: {source: 'path'}, required: true}
      ],
      http: {verb: 'get', path: '/:namespace/topics/:nTopicId/topics/:groupKey/:topicNum'},
      returns: {arg: 'topic', type: 'Array', root: true}
    }
  );

};
