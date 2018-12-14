/**
 * Brainfock, <http://www.brainfock.org>
 *
 * Copyright (C) 2015-present Sergii Gamaiunov <hello@webkadabra.com>
 * All rights reserved.
 *
 * This source code is licensed under the GPL-style license found in the
 * LICENSE file in the root directory of this source tree.
 */
import loopback from 'loopback';
import {mergeQuery} from 'loopback-datasource-juggler/lib/utils';
import app from '../../server/main';

module.exports = function(Workspace) {

  const config = app.get('bfk');
  Workspace.validatesPresenceOf('name', 'namespace');
  Workspace.validatesUniquenessOf('namespace', {message: 'Namespace is not available'});
  // add reserved namespaces under {bfk:{reservedNamespace:[]} property at config.json
  if (config.reservedNamespace) {
    Workspace.validatesExclusionOf('namespace', {'in': config.reservedNamespace});
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
          instance.checkUserAccess(userId, function (err, isAllowed) {
            if (err || !isAllowed) return reject(null, false);
            return resolve(instance, true);
          });
        });
      });
  }

  /**
   * Get IDs of all workspaces available for user to read
   * @todo add workspaces that user explicitly assigned to
   * @param userId
   * @returns {Promise}
   */
  Workspace.getSecuredWorkspacesIdsForUser = function(userId) {
    return new Promise(
      function(resolve, reject) {
        let ids = [];
        let where = {};
        if (userId) {
          where = {
            or: [
              {and: [{accessPrivateYn: '1', ownerUserId: userId}]},
              {accessPrivateYn: '0'}
            ]
          };
        } else {
          where = {
            accessPrivateYn: '0'
          }
        }
        Workspace.find({where: where}, function(err, data) {
          if (err || !data) return resolve([]);

          data.forEach(item => {
            ids.push(item.id)
          });
          // TODO: add workspaces that user explicitly assigned to
          resolve(ids);
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

       // modelInstance.applyContentParsers(() => {
          modelInstance.getOperations(function(err, operations) {
            if (err) return next(err);
            modelInstance.operations = operations;
            return next();
          });
        //});

      } else {
        //modelInstance.applyContentParsers(() => {
          return next();
        //});
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
   * Find children of topic `topicNum` in `nTopicId` context
   * API: /:namespace/topics/:nTopicId/topics/:groupKey/:topicNum/topics
   *
   * @param id
   * @param groupKey
   * @param cb
   * @private
   */
  Workspace.__findByKey__topics__topics = function(namespace, nTopicId, groupKey, topicNum, cb) {

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
                Workspace.app.models.Topic.findOne({where:{
                  groupKey: groupKey,
                  workspaceId: wspcInstance.id,
                  contextTopicId: ownerTopicInstance.id,
                  contextTopicNum: topicNum
                }}, function(err, topicInstance) {

                  if (err) return cb(err, []);
                  if (!topicInstance) return cb(new Error('Not found'), []);

                  topicInstance.checkUserAccess(userId, function(err, isAllowed) {

                    if (err) return cb(err, null);
                    if (!isAllowed) {
                      let e = new Error('Authorization Required');
                      e.status = e.statusCode = 401;
                      e.code = 'AUTHORIZATION_REQUIRED';
                      return cb(e, null);
                    } else {


                      // Finally, find topics

                      let filter;
                      if (context.get('http').req.query && context.get('http').req.query.filter) {
                        filter = mergeQuery({where:{
                          workspaceId: wspcInstance.id,
                          parentTopicId: topicInstance.id
                        }}, context.get('http').req.query.filter);
                      } else {
                        filter = {where:{
                          workspaceId: wspcInstance.id,
                          parentTopicId: topicInstance.id
                        }};
                      }

                      Workspace.app.models.Topic.find(filter, (err, data) => {
                        if (err) return cb(err, null);
                        cb(null, data);
                      });
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


  /**
   * REST API endpoint `/:namespace/topics/:nTopicId/topics/:groupKey/:topicNum/topics`
   */
  Workspace.remoteMethod(
    '__findByKey__topics__topics',
    {
      accepts: [
        {arg: 'namespace', type: 'any', http: {source: 'path'}, required: true},
        {arg: 'nTopicId', type: 'any', http: {source: 'path'}, required: true},
        {arg: 'groupKey', type: 'string', http: {source: 'path'}, required: true},
        {arg: 'topicNum', type: 'any', http: {source: 'path'}, required: true}
      ],
      http: {verb: 'get', path: '/:namespace/topics/:nTopicId/topics/:groupKey/:topicNum/topics'},
      returns: {arg: 'topic', type: 'Array', root: true}
    }
  );

};
