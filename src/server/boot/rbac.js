/**
 * Brainfock, <http://www.brainfock.org>
 *
 * Copyright (C) 2015-present Sergii Gamaiunov <hello@webkadabra.com>
 * All rights reserved.
 *
 * This source code is licensed under the GPL-style license found in the
 * LICENSE file in the root directory of this source tree.
 */
import {mergeQuery} from 'loopback-datasource-juggler/lib/utils';

/**
 * Role-Based Access Control of Brianfock
 *
 * @todo clean up code
 */
module.exports = function(app) {

  const Role = app.models.Role;
  //const ACL = app.models.ACL;
  const Topic = app.models.Topic;
  const Workspace = app.models.Workspace;

  /*Role.registerResolver('teamMember', function(role, context, cb) {
    function reject() {
      process.nextTick(function() {
        cb(null, false);
      });
    }

    // if the target model is not project
    if (context.modelName !== 'project') {
      return reject();
    }

    // do not allow anonymous users
    var userId = context.accessToken.userId;
    if (!userId) {
      return reject();
    }

    // check if userId is in team table for the given project id
    context.model.findById(context.modelId, function(err, project) {
      if (err || !project)
        return reject();

      var Team = app.models.Team;
      Team.count({
        ownerId: project.ownerId,
        memberId: userId
      }, function(err, count) {
        if (err) {
          console.log(err);
          return cb(null, false);
        }

        cb(null, count > 0); // true = is a team member
      });
    });
  });*/

  /**
   * check if user can create this topic
   *
   * @todo: do not allow updating locked topics
   */
  Role.registerResolver('$createTopic', function(role, context, cb) {

    function reject() {
      process.nextTick(function() {
        cb(null, false);
      });
    }

    console.log('> $createTopic data', context.remotingContext.args.data);

    //const userId = context.accessToken.userId || null;

    const ownerContainerId = context.remotingContext.args.data.contextTopicId > 0
      // post/update topic of some other topic (e.g. update `issue` of some `project`)
      ? context.remotingContext.args.data.contextTopicId
      : (
      context.remotingContext.args.data.id > 0
        // post/update root topic, e.g. update `project` topic
        ? context.remotingContext.args.data.id
        : 0
    );

    console.log('[RBAC $createTopic] Validate access to  operation `' + context.remotingContext.method.name
      + '` of model `' + context.modelName + '`:' + ownerContainerId);

    Role.isInRole('$authenticated', context, (err, isAllowed) => {

      // TODO: allow to configure guest posting access per workspace (e.g. gather web form data)
      if (err) {
        return reject(err);
      } else if (!isAllowed) {
        return reject();
      } else {
        // currently, acccess to context and workspace is checked in 'before save'
        // find topic, check workspace access, then context access, then topic access
        return cb(null, true);
      }
    });
  });

  /**
   * @todo: do not allow updating locked topics
   */
  Role.registerResolver('$updateTopic', function(role, context, cb) {

    const userId = context.accessToken.userId || null;
    console.log('[RBAC $updateTopic] Validate access to  operation `' + context.remotingContext.method.name + '` of model `' + context.modelName + '`, user:' + userId);

    function reject() {
      process.nextTick(function() {
        cb(null, false);
      });
    }

    //ACL.isMappedToRole('USER', userId, '$authenticated', (err, isAllowed) => {
    Role.isInRole('$authenticated', context, (err, isAllowed) => {
      if (err) {
        return reject(err);
      } else if (!isAllowed) {
        return reject();
      }
      let where = {};
      if (context.modelId) {
        where = {id: context.modelId};
      } else if (context.remotingContext.args.filter && context.remotingContext.args.filter.where) {
        where = context.remotingContext.args.filter.where;
      } else {
        return cb(null, false);
      }

      Topic.promiseUserAccess(where, userId)
        .then((topicInstance) => {
          // check if user has access to topic CONTEXT and workspace
          // topicInstance
          if (topicInstance.contextTopicId > 0) {
            topicInstance.contextTopic((err, contextTopicInstance) => {

              if (err || !contextTopicInstance) return cb(null, false);

              contextTopicInstance.checkUserAccess(userId, function(err, isAllowed) {
                if (err || !isAllowed) return reject(null, false);

                Workspace.promiseUserAccess(topicInstance.workspaceId, userId)
                  .then((wspcInstance) => {
                    return cb(null, true);
                  })
                  .catch(() => cb(null, false));
              });
            });
          } else {
            Workspace.promiseUserAccess(topicInstance.workspaceId, userId)
              .then((wspcInstance) => {
                return cb(null, true);
              })
              .catch(() => cb(null, false));
          }
        })
        .catch(() => cb(null, false));
      //// find Topic and validate access
      //if (context.modelId) {
      //  /* when api request is like /api/someModel/findOne/123 */
      //  context.model.findById(context.modelId, afterFindCb);
      //} else if (context.remotingContext.args.filter) {
      //  /* when api request is like /api/wikiPage/findOne/?filter[where][pageUid]=SomeWikiPage */
      //  context.model.findOne(context.remotingContext.args.filter, afterFindCb);
      //} else {
      //  return cb(null, false);
      //}
      // if user is authenticated, we must check if everybody can update or only owner,
      // if there is access to workspace, context and topic

      // console.log('ACCESS', );

      //Role.isInRole('allowUpdateTopics', context, (err, isAllowed) => {
      //  console.log('ACCESS', isAllowed);
      //  return cb(null,userId > 0)
      //})

    });

    //,
    //{
    //  "accessType": "*",
    //  "principalType": "ROLE",
    //  "principalId": "$authenticated",
    //  "permission": "ALLOW",
    //  "property": "runOperation"
    //}
    // check if current user has role ""

    // hardcoded rule to deny anonymous from updating topics. we could also check for composite role,
    // e.g. "$canUpdateTopics" which would be allowed for $authenticated role
    //Role.isInRole('$authenticated', context, (err, isInRole) => {
    //Role.isInRole('allowUpdateTopics', context, (err, isInRole) => {
    //  console.log('isInRole', isInRole)
    //Role.getRoles(context, (err, roles) => {
    //  console.log('roles',roles)
    //return cb(null, isInRole);
    //})
    //Role.isInRole('contextAndTopicAccess', context, (err, isInRole) => {
    //  console.log('isInRole', isInRole)

    //})
    //})


    // ACL - is to check if some actual USER has access to some specific model/object
    //ACL.checkPermission('USER', userId, 'Topic', 'runOperation', 'EXECUTE', function(err, access) {
    //  console.log('ERR',err);
    //  console.log('access: ',access);
    //  return cb(null, userId > 0);
    //});


    //ACL.checkAccessForContext(context, function(err, access) {
    //  console.log('err', err)
    //  console.log('access: ', access)
    //  return cb(null, userId > 0);
    //  // check access to wsp, context & topic
    //})


    //ACL.resolvePrincipal('USER', userId || 0, function(err, principal) {
    //  console.log('RESOLVED PRINCIPAL', principal);
    //  let principals = [];
    //  if (principal) {
    //    principals.push({
    //      type: 'USER',
    //      id: principal.id
    //    });
    //  }
    //  ACL.checkAccessForContext({
    //    principals: principals,
    //    //principals: [{
    //    //  type: 'USER',
    //    //  id: '$authenticated'
    //    //}],
    //    model: Topic,
    //    id: context.modelId,
    //    // check if current user (?) at all has this operation enabled
    //    methodNames: ['updateAttributes'],
    //    method: method,
    //    //property: 'updateAttributes',
    //    property: 'updateAttributes',
    //    accessType: 'WRITE'
    //  }, function(err, access) {
    //    console.log('err', err)
    //    console.log('access: ', access)
    //    return cb(null, userId > 0);
    //    // check access to wsp, context & topic
    //  })
    //
    //})


    // ACL.checkPermission("USER", principalId, model, property, accessType, callback)


  });

  /**
   * `$entityReadAccess` role resolver
   */
  Role.registerResolver('$entityReadAccess', function(role, context, cb) {

    const userId = context.accessToken.userId;
    console.log('[RBAC $entityReadAccess] Validate access to  operation `' + context.remotingContext.method.name + '` of model `' + context.modelName + '`, user:' + userId);
    function reject() {
      process.nextTick(function() {
        cb(null, false);
      });
    }
    if (context.modelName !== 'Entity') {
      console.log('[RBAC] Model [' + context.modelName + '] is not supported by `$entityReadAccess` resolver');
      return reject();
    }
    //let allowedEntities = [];
    const afterFindCb = function(err, Topic) {

      if (err || !Topic)
        return reject();

      if (Topic.accessPrivateYn !== 1 || Topic.ownerUserId === userId)
        return cb(null, true);

      if (userId) {

        let whereFilter = {
          authType:0,
          authId:userId
        };
        if (context.modelName === 'Entity') {
          whereFilter.entityId = Topic.id;
        } else {
          whereFilter.entityId = Topic.entityId;
        }
        // TODO: ACL to test if current user ($everyone, guest etc.) can access this operation
        app.models.EntityAccessAssign.findOne({where:whereFilter},

          function(err, data) {
            if (err || !data) {
              return cb(null, false);
            }
            return cb(null, true);
          });
      } else {
        return cb(null, false);
      }
    };

    if (context.modelId) {
      /* when api request is like /api/someModel/findOne/123 */
      console.log('[RBAC] Lookup with `findById`, model id:', context.modelId);
      context.model.findById(context.modelId, afterFindCb);
    } else if (context.remotingContext.args.filter) {
      /* when api request is like /api/wikiPage/findOne/?filter[where][pageUid]=SomeWikiPage */
      console.log('[RBAC] Lookup with `findOne`, model id:', context.remotingContext.args);
      context.model.findOne(context.remotingContext.args.filter, afterFindCb);
    } else {
      return cb(null, false);
    }

  });

  /**
   * topicEntityAccess ROLE
   */
  Role.registerResolver('topicEntityAccess', function(role, context, cb) {

    const userId = context.accessToken.userId;
    console.log('[RBAC topicEntityAccess] Validate access to  operation `' + context.remotingContext.method.name + '` of model `' + context.modelName + '`, user:' + userId);
    function reject() {
      process.nextTick(function() {
        cb(null, false);
      });
    }

    // if the target model is not project
    if (context.modelName !== 'Topic'
      && context.modelName !== 'Comment'
      && context.modelName !== 'WikiPage'
      && context.modelName !== 'Entity'
    ) {
      console.log('[RBAC] Model [' + context.modelName + '] is not supported by `topicEntityAccess` resolver');
      return reject();
    }

    let allowedEntities = [];

    // TODO: currently, even if user does not have access to entity, he will be able to fetch EMPTY comments list like /api/entities/1699/comments
    if (context.remotingContext.method.name === 'find'
      || context.remotingContext.method.name === '__get__comments'
      || context.remotingContext.method.name === '__get__topics'
    ) {

      // get allowed workspaces IDs for current user
      app.models.Workspace.getSecuredWorkspacesIdsForUser(userId)
        .then(ids => {
          if (userId) {

            app.models.EntityAccessAssign.find({where:{
              authType:0,
              authId:userId
            }},
              (err, data) => {

                function final() {
                  // TODO: add validation of either empty CONTEXT topic id or in list of accessibles
                  if (allowedEntities.length > 0) {
                    context.remotingContext.args.filter = mergeQuery(context.remotingContext.args.filter,
                      {where: {
                        and: [
                          {workspaceId: {inq: ids}},
                          {or: [
                            {ownerUserId: userId},
                            {and: [{accessPrivateYn: '1', ownerUserId: userId}]},
                            {accessPrivateYn: '0'},
                            {entityId:{inq:allowedEntities}}
                          ]}
                        ],
                      }}
                    );
                  } else {
                    // base constraints: do not show private topics of other users:
                    context.remotingContext.args.filter = mergeQuery(context.remotingContext.args.filter,
                      {where: {
                        and: [
                          {workspaceId: {inq: ids}},
                          {or: [
                            {ownerUserId: userId},
                            {and: [{accessPrivateYn: '1', ownerUserId: userId}]},
                            {accessPrivateYn: '0'}
                          ]}
                        ],
                      }}
                    );
                  }

                  //context.remotingContext.args.filter = mergeQuery(context.remotingContext.args.filter,
                  //  {where: {
                  //    or: [
                  //      {entityId:{inq:allowedEntities}}
                  //    ]
                  //  }});
                  //console.log('context.remotingContext.args.filter:',context.remotingContext.args.filter);

                  return cb(null, true);
                }

                function populateValue($modelInstance, callback) {
                  allowedEntities.push($modelInstance.entity_id);
                  return callback();
                }

                if (err || data.length === 0) {
                  // apply base
                  context.remotingContext.args.filter = mergeQuery(context.remotingContext.args.filter,
                    {where: {
                      and: [
                        {workspaceId: {inq: ids}},
                        {or: [
                          {ownerUserId: userId},
                          {and: [{accessPrivateYn: '1', ownerUserId: userId}]},
                          {accessPrivateYn: '0'}
                        ]}
                      ],
                    }}
                  );
                  return cb(null, true);
                } else {
                  let resCount = data.length;
                  let lopRes = [];
                  data.forEach(function(item) {
                    populateValue(item, function(result) {
                      lopRes.push(1);
                      if (lopRes.length === (resCount)) {
                        return final();
                      }
                    });
                  });
                }
              });
          } else {
            app.models.Topic.getPublicContextTopicIds(ids)
              .then(topicsIds => {
                context.remotingContext.args.filter = mergeQuery(context.remotingContext.args.filter,
                  // allow either public roots or public issues in public contexts
                  {where: {
                    workspaceId: {inq: ids},
                    or: [
                      {and: [{accessPrivateYn: '0', contextTopicId: null}]},
                      {and: [{accessPrivateYn: '0', contextTopicId: {inq: topicsIds}}]},
                    ]
                  }});
                return cb(null, true);
              });
          }
        });

      //if(context.remotingContext.args.filter.group) {
      //  //app.models.TopicGroup.findOne({where:{groupKey:context.remotingContext.args.filter.group}},
      //  //  function(err,groupInstance)
      //  //  {
      //  //    if (err) {
      //  //      return reject();
      //  //      //return callback(err);
      //  //    }
      //  //  //console.log('find method');
      //  //  delete context.remotingContext.args.filter.group;
      //  //    console.log('!!!!',context.remotingContext.args.filter);
      //  //  context.remotingContext.args.filter.group_id = groupInstance.id;
      //  //  context.remotingContext.args.filter = mergeQuery(context.remotingContext.args.filter,
      //  //    {where: {
      //  //      or: [
      //  //        {and: [{accessPrivateYn: "1", "ownerUserId": userId}]},
      //  //        {accessPrivateYn: "0"}
      //  //      ]
      //  //      // TODO: add validationvia au
      //  //      //or: [{accessPrivateYn: '0'}, {ownerUserId: userId}]
      //  //    }});
      //  //  return cb(null, true);
      //  //})
      //} else {
        //console.log('find method');

      //}
      return;

    // these methods expect `context.remotingContext.args.where`, not `context.remotingContext.args.filter.where`:
    } else if (context.remotingContext.method.name === '__count__topics'
      || context.remotingContext.method.name === 'count') {

      app.models.Workspace.getSecuredWorkspacesIdsForUser(userId)
        .then(ids => {
          if (userId) {
            app.models.EntityAccessAssign.find({where:{
              authType:0,
              authId:userId
            }},
              function(err, data) {
                if (err) {
                  // apply base
                  context.remotingContext.args = mergeQuery(context.remotingContext.args,
                    {where: {
                      and: [
                        {workspaceId: {inq: ids}},
                        {or: [
                          {ownerUserId: userId},
                          {and: [{accessPrivateYn: '1', ownerUserId: userId}]},
                          {accessPrivateYn: '0'}
                        ]}
                      ],
                    }});
                  return cb(null, true);
                }
                function final() {
                  if (allowedEntities.length > 0) {
                    context.remotingContext.args = mergeQuery(context.remotingContext.args,
                      {where: {
                        or: [
                          {ownerUserId: userId},
                          {and: [{accessPrivateYn: '1', ownerUserId: userId}]},
                          {accessPrivateYn: '0'},
                          {entityId:{inq:allowedEntities}}
                        ],
                        workspaceId: {inq: ids}
                      }});
                  } else {
                    // base constraints: do not show private topics of other users:
                    context.remotingContext.args = mergeQuery(context.remotingContext.args,
                      {where: {
                        or: [
                          {ownerUserId: userId},
                          {and: [{accessPrivateYn: '1', ownerUserId: userId}]},
                          {accessPrivateYn: '0'}
                        ],
                        workspaceId: {inq: ids}
                        //or: [{accessPrivateYn: '0'}, {ownerUserId: userId}]
                      }});
                  }

                  //context.remotingContext.args = mergeQuery(context.remotingContext.args,
                  //  {where: {
                  //    or: [
                  //      {entityId:{inq:allowedEntities}}
                  //    ]
                  //  }});
                  //console.log('context.remotingContext.args:',context.remotingContext.args);

                  return cb(null, true);
                }
                function populateValue($modelInstance, callback) {
                  allowedEntities.push($modelInstance.entity_id);
                  return callback();
                }

                let resCount = data.length;
                let lopRes = [];
                data.forEach(function(/*SettingsField model instance*/ item) {
                  populateValue(item, function(result) {
                    lopRes.push(1);
                    if (lopRes.length === (resCount)) {
                      return final();
                    }
                  });
                });
              });
          } else {
            app.models.Topic.getPublicContextTopicIds(ids)
              .then(topicsIds => {
                context.remotingContext.args = mergeQuery(context.remotingContext.args,
                  // allow either public roots or public issues in public contexts
                  {where: {
                    workspaceId: {inq: ids},
                    or: [
                      {and: [{accessPrivateYn: '0', contextTopicId: null}]},
                      {and: [{accessPrivateYn: '0', contextTopicId: {inq: topicsIds}}]},
                    ]
                  }});
                return cb(null, true);
              });
          }
        });

      return;
    }

    // TODO: validate workspace access

    const afterFindCb = function(err, Topic) {

      if (err || !Topic) {
        return reject();
      }

      //console.log('Topic:',Topic);
      if (Topic.accessPrivateYn !== 1
        || Topic.ownerUserId === userId)
        return cb(null, true);

      if (userId) {
        let whereFilter = {
          authType:0,
          authId:userId
        };

        if (context.modelName === 'Entity') {
          whereFilter.entityId = Topic.id;
        } else {
          whereFilter.entityId = Topic.entityId;
        }

        app.models.EntityAccessAssign.findOne({where:whereFilter},
          function(err, data) {
            if (err || !data) {
              return cb(null, false);
            }
            return cb(null, true);
          });
      } else {
        return cb(null, false);
      }
    };

    if (context.modelId) {
      /* when api request is like /api/someModel/findOne/123 */
      console.log('[RBAC] Lookup with `findById`, model id:', context.modelId);
      context.model.findById(context.modelId, afterFindCb);
    } else if (context.remotingContext.args.filter) {
      /* when api request is like /api/wikiPage/findOne/?filter[where][pageUid]=SomeWikiPage */
      console.log('[RBAC] Lookup with `findOne`, model id:', context.remotingContext.args);
      context.model.findOne(context.remotingContext.args.filter, afterFindCb);
    } else {
      return cb(null, false);
    }

  });

  /**
   * $createWikiPage ROLE
   */
  Role.registerResolver('$createWikiPage', function(role, context, cb) {

    console.log('[RBAC $createWikiPage] Validate access to  operation `' + context.remotingContext.method.name + '` of model `' + context.modelName + '`');
    //const userId = context.accessToken.userId;

    const reject = () => process.nextTick(() => {
      cb(null, false);
    });

    if (context.modelName !== 'WikiPage') {
      return reject();
    }

    if (context.remotingContext.method.name === 'upsert') {
      // posting to global wiki
      if (!context.remotingContext.args.data.contextEntityId) {
        Role.isInRole('$authenticated', context, (err, isAllowed) => {
          // TODO: allow guest posts to root wiki via admin
          if (err) {
            return reject(err);
          } else if (!isAllowed) {
            return reject();
          } else {
            // currently, acccess to context and workspace is checked in 'before save'
            // find topic, check workspace access, then context access, then topic access
            return cb(null, true);
          }
        });
      } else {
        Role.isInRole('$authenticated', context, (err, isAllowed) => {
          if (err) {
            return reject(err);
          } else if (!isAllowed) {
            // TODO: allow to configure guest posting access per workspace (e.g. gather web form data)
            return reject();
          } else {
            // TODO: check if it is a root wiki
            // TODO: namespace wiki can allow guests to post
            // TODO: we must validate if user can create pages in selected `context.remotingContext.args.data.contextEntityId` space
            console.log('>>', context.remotingContext.args.data.contextEntityId);
            return cb(null, true);
          }
        });
      }
    } else {
      return reject();
    }
  });

  /**
   * DRAFT
   *
   * @todo: do not allow updating locked topics
   */
  Role.registerResolver('$updateWikiPage', function(role, context, cb) {

    const userId = context.accessToken.userId || null;
    console.log('[RBAC $updateWikiPage] Validate access to  operation `' + context.remotingContext.method.name + '` of model `' + context.modelName + ':' + context.modelId  + '`, user:' + userId);

    console.log('>>', context.remotingContext.args.data);

    const reject = () => process.nextTick(() => {
      cb(null, false);
    });

    if (context.modelName !== 'WikiPage') {
      return reject();
    }

    if (context.remotingContext.method.name === 'updateAttributes') {
      // posting to global wiki
      if (!context.remotingContext.args.data.contextEntityId) {
        console.log('>root wiki');
        Role.isInRole('$authenticated', context, (err, isAllowed) => {
          // TODO: allow guest posts to root wiki via admin
          if (err) {
            return reject(err);
          } else if (!isAllowed) {
            return reject();
          } else {
            // currently, acccess to context and workspace is checked in 'before save'
            // find topic, check workspace access, then context access, then topic access
            return cb(null, true);
          }
        });
      } else {
        Role.isInRole('$authenticated', context, (err, isAllowed) => {
          if (err) {
            return reject(err);
          } else if (!isAllowed) {
            // TODO: allow to configure guest posting access per workspace (e.g. gather web form data)
            return reject();
          } else {
            // TODO: check if it is a root wiki
            // TODO: namespace wiki can allow guests to post
            // TODO: we must validate if user can create pages in selected `context.remotingContext.args.data.contextEntityId` space
            return cb(null, true);
          }
        });
      }
    } else {
      return reject();
    }
  });

  Role.registerResolver('commentEntityAccess', function(role, context, cb) {

    console.log('[RBAC commentEntityAccess] Validate access to  operation `' + context.remotingContext.method.name + '` of model `' + context.modelName);

    const userId = context.accessToken.userId;

    function reject() {
      process.nextTick(function() {
        cb(null, false);
      });
    }

    if (context.modelName !== 'Comment') {
      return reject();
    }

    let allowedEntities = [];

    if (context.remotingContext.method.name === 'find') {

      if (userId) {

        app.models.EntityAccessAssign.find({where:{
          authType:0,
          authId:userId,
        }},
        function(err, data) {
          if (err) {
            //console.log('err:',err)
            // apply base
            context.remotingContext.args.filter = mergeQuery(context.remotingContext.args.filter,
              {where: {
                or: [
                  {and: [{accessPrivateYn: '1', ownerUserId: userId}]},
                  {accessPrivateYn: '0'}
                ]
                //or: [{accessPrivateYn: '0'}, {ownerUserId: userId}]
              }});
            return cb(null, true);
          }

          function final() {

            if (allowedEntities.length > 0) {
              context.remotingContext.args.filter = mergeQuery(context.remotingContext.args.filter,
                {where: {
                  or: [
                    {and: [{accessPrivateYn: '1', ownerUserId: userId}]},
                    {accessPrivateYn: '0'}
                   // {entityId:{inq:allowedEntities}}
                  ]
                  //or: [{accessPrivateYn: '0'}, {ownerUserId: userId}]
                }});
            } else {
              // base constraints: do not show private topics of other users:
              context.remotingContext.args.filter = mergeQuery(context.remotingContext.args.filter,
                {where: {
                  or: [
                    {and: [{accessPrivateYn: '1', ownerUserId: userId}]},
                    {accessPrivateYn: '0'}
                  ]
                  //or: [{accessPrivateYn: '0'}, {ownerUserId: userId}]
                }});

            }


            //context.remotingContext.args.filter = mergeQuery(context.remotingContext.args.filter,
            //  {where: {
            //    or: [
            //      {entityId:{inq:allowedEntities}}
            //    ]
            //  }});
            //console.log('context.remotingContext.args.filter:',context.remotingContext.args.filter);

            return cb(null, true);
          }
          function populateValue($modelInstance, callback) {
            allowedEntities.push($modelInstance.entity_id);
            return callback();
          }

          let resCount = data.length;
          let lopRes = [];
          data.forEach(function(/*SettingsField model instance*/ item) {
            populateValue(item, function() {
              lopRes.push(1);
              if (lopRes.length === (resCount)) {
                return final();
              }
            });
          });
        });
      } else {
        // base constraints: do not show private topics of other users:
        context.remotingContext.args.filter = mergeQuery(context.remotingContext.args.filter,
          {where: {
            accessPrivateYn: '0'
            //or: [{accessPrivateYn: '0'}, {ownerUserId: userId}]
          }});

        return cb(null, true);
      }

      //if(1==2 && context.remotingContext.args.filter.group) {
      //  console.log('yes');
      //  //app.models.TopicGroup.findOne({where:{groupKey:context.remotingContext.args.filter.group}},
      //  //  function(err,groupInstance)
      //  //  {
      //  //    if (err) {
      //  //      return reject();
      //  //      //return callback(err);
      //  //    }
      //  //  //console.log('find method');
      //  //  delete context.remotingContext.args.filter.group;
      //  //    console.log('!!!!',context.remotingContext.args.filter);
      //  //  context.remotingContext.args.filter.group_id = groupInstance.id;
      //  //  context.remotingContext.args.filter = mergeQuery(context.remotingContext.args.filter,
      //  //    {where: {
      //  //      or: [
      //  //        {and: [{accessPrivateYn: "1", "ownerUserId": userId}]},
      //  //        {accessPrivateYn: "0"}
      //  //      ]
      //  //      // TODO: add validationvia au
      //  //      //or: [{accessPrivateYn: '0'}, {ownerUserId: userId}]
      //  //    }});
      //  //  return cb(null, true);
      //  //})
      //} else {
      //console.log('find method');

      //}
      return;
    }

    // do not allow anonymous users

    if (!userId) {
      //console.log('reject 2!')
      return reject();
    }

    // check if userId is in team table for the given project id
    context.model.findById(context.modelId, function(err, Topic) {
      if (err || !Topic) {
        return reject();
      }

      if (Topic.accessPrivateYn === 0
        || Topic.ownerUserId === userId)
        return cb(null, true);

      if (userId) {
        app.models.EntityAccessAssign.findOne({where:{
          authType:0,
          authId:userId,
          entityId:Topic.entityId
        }},
        function(err, data) {
          if (err || !data) {
            return cb(null, false);
          }

          return cb(null, true);
        });
      } else {
        return cb(null, false);
      }
    });
  });

  Role.registerResolver('groupTopicEntityAccess', function(role, context, cb) {
    const userId = context.accessToken.userId;

    function reject() {
      process.nextTick(function() {
        cb(null, false);
      });
    }

    // if the target model is not project
    if (context.modelName !== 'TopicGroup') {
      return reject();
    }

    if (context.remotingContext.method.name === 'find') {
      context.remotingContext.args.filter = mergeQuery(context.remotingContext.args.filter,
        {
          where: {or: [{accessPrivateYn: '0'}, {ownerUserId: userId}]}
        }
      );
      return cb(null, true);
    } else if (context.remotingContext.method.name === 'findOne') {
      context.remotingContext.args.filter = mergeQuery(context.remotingContext.args.filter,
        {
          include: {
            relation: 'topics', // include the owner object
            scope: { // further filter the owner object
              where: {or: [{accessPrivateYn: '0'}, {ownerUserId: userId}]}
            }
          }
        });

      return cb(null, true);
    } else
        return reject();

    if (!userId) {
      //console.log('reject 2!')
      return reject();
    }

    // check if userId is in team table for the given project id
    context.model.findById(context.modelId, function(err, Topic) {
      if (err || !Topic) {
        return reject();
      }

      if (Topic.accessPrivateYn === 0
        || Topic.ownerUserId === userId)
        return cb(null, true);

      return cb(null, false);
    });


  });

  /**
   * Check if user is allowed to post new topic
   * @todo add workspace access validation
   */
  Role.registerResolver('createTopicAccess', function(role, context, cb) {

    function reject() {
      process.nextTick(function() {
        cb(null, false);
      });
    }
    function accept() {
      process.nextTick(function() {
        cb(null, true);
      });
    }

    if (context.modelName !== 'Topic') {
      return reject();
    }

    // TODO: check namespace access

    // check access to entity
    const userId = context.accessToken.userId;

    try {

      const ownerContainerId = context.remotingContext.args.data.contextTopicId > 0
      // post/update topic of some other topic (e.g. update `issue` of some `project`)
      ? context.remotingContext.args.data.contextTopicId
      : (
      context.remotingContext.args.data.id > 0
        // post/update root topic, e.g. update `project` topic
        ? context.remotingContext.args.data.id
        : 0
    );

      console.log('[RBAC createTopicAccess] Validate access to  operation `' + context.remotingContext.method.name
      + '` of model `' + context.modelName + '`:' + ownerContainerId);

    // creating root topic, e.g. project, board etc.
      if (ownerContainerId === 0) {
      // TODO: DO NOT ALLOW GUESTS
        return accept();
      } else {
        app.models.Topic.findOne({where:{
          id:ownerContainerId
        }},
      function(err, ContextTopic) {
        // TODO: support for root topics
        if (err || !ContextTopic) {
          return reject();
        }
        if (ContextTopic.accessPrivateYn !== 1
          || ContextTopic.ownerUserId === userId) {
          return accept();
        } else {
          // if access is private, check user permissions:
          app.models.EntityAccessAssign.findOne({where:{
            authType:0,
            authId:userId,
            entityId:ContextTopic.entityId
          }},
          function(errEa, dataEa) {
            if (errEa || !dataEa) {
              return reject();
            }
            // user has access to context entity:
            return accept();
          });
        }
      });
      }
    } catch (e) {
      return reject();
    }
  });

  /**
   * Check if user is allowed to post new topic
   *
   * @todo review; add validation of a workspace; make work together with other roles
   */
  Role.registerResolver('deleteTopicAccess', function(role, context, cb) {
    console.log('[RBAC deleteTopicAccess] ' + context.remotingContext.method.name);
    function reject() {
      process.nextTick(function() {
        cb(null, false);
      });
    }
    function accept() {
      process.nextTick(function() {
        cb(null, true);
      });
    }
    if (context.modelName !== 'RawTopic') {
      return reject();
    }

    console.log('[RBAC deleteTopicAccess] Validate access to  operation `' + context.remotingContext.method.name
    + '` of model `' + context.modelName + '`:' + context.modelId);

    // check access to entity
    const userId = context.accessToken.userId;

    context.model.findById(context.modelId, function(err, ContextTopic) {
      if (err || !ContextTopic) {
        return reject();
      }
      if (ContextTopic.accessPrivateYn !== 1
        || ContextTopic.ownerUserId === userId) {
        return accept();
      } else {
        // if access is private, check user permissions:
        app.models.EntityAccessAssign.findOne({where:{
          authId:userId,
          authType:0,
          entityId:ContextTopic.entityId
        }},
        function(errEa, dataEa) {
          if (errEa || !dataEa) {
            return reject();
          }
          // user has access to context entity:
          return accept();
        });
      }
    });
  });

  /**
   * Validate context and children topic access
   */
  Role.registerResolver('contextAndTopicAccess', function(role, context, cb) {

    const userId = context.accessToken.userId;

    console.log('[RBAC contextAndTopicAccess] Validate access to  operation `' + context.remotingContext.method.name + '` of model `' + context.modelName + '`, user:' + userId);

    function reject() {
      process.nextTick(function() {
        cb(null, false);
      });
    }

    // if the target model is not project
    if (context.modelName !== 'Topic') {
      return reject();
    }

    // these methods expect `context.remotingContext.args.where`, not `context.remotingContext.args.filter.where`
    if (context.remotingContext.method.name !== '__findById__topics') {
      return reject();
    }

    // TODO: allow guest access
    if (!userId) {
      return reject();
    }

    // check context topic access:
    context.model.findById(context.modelId, function(err, Topic) {

      if (err || !Topic) {
        return reject();
      }

      if (Topic.accessPrivateYn !== 1
      || Topic.ownerUserId === userId) {
        // user has access to context, check topic access
        context.model.findById(context.remotingContext.args.fk, function(err, ViewTopic) {

          if (err || !ViewTopic) {
            return reject();
          }

          if (ViewTopic.accessPrivateYn !== 1
          || ViewTopic.ownerUserId === userId) {
            return cb(null, true);
          } else if (userId && userId > 0) {

            let whereFilter = {
              authType:0,
              authId:userId,
              entityId:ViewTopic.entityId
            };

            app.models.EntityAccessAssign.findOne({where:whereFilter},
              function(err, data) {
                if (err || !data) {
                  return cb(null, false);
                }

                return cb(null, true);
              });
          } else {
            return cb(null, false);
          }
        });
      } else if (userId && userId > 0) {

        let whereFilter = {
          authType:0,
          authId:userId,
          entityId:Topic.entityId
        };

        app.models.EntityAccessAssign.findOne({where:whereFilter},
          function(err, data) {
            if (err || !data) {
              return cb(null, false);
            }

            // user has access to context, checl view topic access:
            context.model.findById(context.remotingContext.args.fk, function(err, ViewTopic) {

              if (err || !ViewTopic) {
                return reject();
              }

              if (ViewTopic.accessPrivateYn !== 1
              || ViewTopic.ownerUserId === userId) {
                return cb(null, true);
              } else if (userId && userId > 0) {

                let whereFilter = {
                  authType:0,
                  authId:userId,
                  entityId:ViewTopic.entityId
                };

                app.models.EntityAccessAssign.findOne({where:whereFilter},
                  function(err, data) {
                    if (err || !data) {
                      return cb(null, false);
                    }

                    return cb(null, true);
                  });
              } else {
                return cb(null, false);
              }
            });
          });
      } else {
        return cb(null, false);
      }
    });
  });

  /**
   * Validate access to endpoint:
   *
   * `api/workspaces/[name]/topics/[topicId]`
   *
   * @todo: check if user has access to workspace via workspace_user relational table
   */
  Role.registerResolver('wspcTopicAccess', function(role, context, cb) {

    const userId = context.accessToken.userId;

    console.log('[RBAC wspcTopicAccess] Validate access to  operation `' + context.remotingContext.method.name + '` of model `' + context.modelName + ':' + context.modelId + '`, user:' + userId);

    function reject() {
      process.nextTick(function() {
        cb(null, false);
      });
    }
    if (context.modelName !== 'Workspace') {
      return reject();
    }
    if (context.remotingContext.method.name !== '__findById__topics') {
      return reject();
    }

    // TODO: check ACL if current user (gues, authenticated, etc.) has access

    // check workspace access
    context.model.findById(context.modelId, function(err, wspcInstance) {

      if (err || !wspcInstance) {
        return reject();
      }

      if (wspcInstance.accessPrivateYn !== 1
      || wspcInstance.ownerUserId === userId) {
        // user has access to context, check topic access

        let whereFilter = {
          workspaceId:context.modelId
        };
        if (isNaN(context.remotingContext.args.fk)) {
          whereFilter.contextTopicKey = context.remotingContext.args.fk;
        } else {
          whereFilter.id = context.remotingContext.args.fk;
        }
        app.models.Topic.findOne({where:whereFilter}, function(err, ViewTopic) {

          if (err || !ViewTopic) {
            return reject();
          }

          if (ViewTopic.accessPrivateYn !== 1
          || ViewTopic.ownerUserId === userId) {
            return cb(null, true);
          } else if (userId && userId > 0) {

            let whereFilter = {
              authType:0,
              authId:userId,
              entityId:ViewTopic.entityId
            };

            app.models.EntityAccessAssign.findOne({where:whereFilter},
              function(err, data) {
                if (err || !data) {
                  return cb(null, false);
                }

                return cb(null, true);
              });
          } else {
            return cb(null, false);
          }
        });
      } else if (userId && userId > 0) {
        // TODO: check if user has access to workspace via workspace_user relational table
        return reject();
      } else {
        return cb(null, false);
      }
    });
  });

  /**
   * Validate access endpoints:
   *
   * `api/workspaces/[name]/topics/[topicId]/topics`
   */
  Role.registerResolver('wspcTopicsList', function(role, context, cb) {
    const userId = context.accessToken.userId;
    function reject() {
      process.nextTick(function() {
        cb(null, false);
      });
    }

    // little debug won't hurt nobody
    console.log('[RBAC wspcTopicsList] Validate access to  operation `' + context.remotingContext.method.name + '` of model `' + context.modelName + '`, user:' + userId);

    if (context.modelName !== 'Workspace') {
      console.log('[RBAC] Model [' + context.modelName + '] is not supported by `wspcTopicsList` resolver');
      return reject();
    }

    // check if workspace exists
    if (context.modelId) {

      let accessValidators = [
        context.model.promiseUserAccess(context.modelId, userId)
      ];

      if (context.remotingContext.method.name === '__get__topics__topics'
      || context.remotingContext.method.name === '__count__topics__topics') {
        accessValidators.push(app.models.Topic.promiseUserAccess({
          workspaceId: context.modelId,
          contextTopicKey: context.remotingContext.args.nk
        }, userId));
        //accessValidators.push(app.models.Topic.promiseUserAccess(`${context.remotingContext.ctorArgs}:${context.remotingContext.args.nk}`, userId));
      }

      Promise.all(accessValidators)
        .then(function() {
          // apply additional rules
          let allowedEntities = [];

          ///////////////////////////////////////////////
          if (context.remotingContext.method.name === '__get__topics__topics'
          || context.remotingContext.method.name === '__get__topics') {
            if (userId) {

              app.models.EntityAccessAssign.find({where:{
                authType:0,
                authId:userId
              }},
                function(err, data) {
                  if (err || data.length === 0) {
                    // apply base
                    context.remotingContext.args.filter = mergeQuery(context.remotingContext.args.filter,
                      {where: {
                        or: [
                          {and: [{accessPrivateYn: '1', ownerUserId: userId}]},
                          {accessPrivateYn: '0'}
                        ]
                        //or: [{accessPrivateYn: '0'}, {ownerUserId: userId}]
                      }});
                    return cb(null, true);
                  }

                  function final() {
                    if (allowedEntities.length > 0) {
                      context.remotingContext.args.filter = mergeQuery(context.remotingContext.args.filter,
                        {where: {
                          or: [
                            {and: [{accessPrivateYn: '1', ownerUserId: userId}]},
                            {accessPrivateYn: '0'},
                            {entityId:{inq:allowedEntities}}
                          ]
                          //or: [{accessPrivateYn: '0'}, {ownerUserId: userId}]
                        }});
                    } else {
                      // base constraints: do not show private topics of other users:
                      context.remotingContext.args.filter = mergeQuery(context.remotingContext.args.filter,
                        {where: {
                          or: [
                            {and: [{accessPrivateYn: '1', ownerUserId: userId}]},
                            {accessPrivateYn: '0'}
                          ]
                          //or: [{accessPrivateYn: '0'}, {ownerUserId: userId}]
                        }});
                    }
                    return cb(null, true);
                  }
                  function populateValue($modelInstance, callback) {
                    allowedEntities.push($modelInstance.entity_id);
                    return callback();
                  }

                  let resCount = data.length;
                  let lopRes = [];
                  data.forEach(function(/*SettingsField model instance*/ item) {
                    populateValue(item, function(result) {
                      lopRes.push(1);
                      if (lopRes.length === (resCount)) {
                        return final();
                      }
                    });
                  });
                });
            } else {
              // do not show private topics:
              context.remotingContext.args.filter = mergeQuery(context.remotingContext.args.filter,
                {where: {
                  accessPrivateYn: '0'
                }});
              return cb(null, true);
            }
            // these methods expect `context.remotingContext.args.where`, not `context.remotingContext.args.filter.where`:
          } else if (context.remotingContext.method.name === '__count__topics'
            || context.remotingContext.method.name === '__count__topics__topics') {

            if (userId) {
              app.models.EntityAccessAssign.find({where:{
                authType:0,
                authId:userId
              }},
                function(err, data) {
                  if (err) {
                    // apply base
                    context.remotingContext.args = mergeQuery(context.remotingContext.args,
                      {where: {
                        or: [
                          {and: [{accessPrivateYn: '1', ownerUserId: userId}]},
                          {accessPrivateYn: '0'}
                        ]
                        //or: [{accessPrivateYn: '0'}, {ownerUserId: userId}]
                      }});
                    return cb(null, true);
                  }
                  function final() {
                    if (allowedEntities.length > 0) {
                      context.remotingContext.args = mergeQuery(context.remotingContext.args,
                        {where: {
                          or: [
                            {and: [{accessPrivateYn: '1', ownerUserId: userId}]},
                            {accessPrivateYn: '0'},
                            {entityId:{inq:allowedEntities}}
                          ]
                          //or: [{accessPrivateYn: '0'}, {ownerUserId: userId}]
                        }});
                    } else {
                      // base constraints: do not show private topics of other users:
                      context.remotingContext.args = mergeQuery(context.remotingContext.args,
                        {where: {
                          or: [
                            {and: [{accessPrivateYn: '1', ownerUserId: userId}]},
                            {accessPrivateYn: '0'}
                          ]
                          //or: [{accessPrivateYn: '0'}, {ownerUserId: userId}]
                        }});
                    }

                    return cb(null, true);
                  }
                  function populateValue($modelInstance, callback) {
                    allowedEntities.push($modelInstance.entity_id);
                    return callback();
                  }

                  let resCount = data.length;
                  let lopRes = [];
                  data.forEach(function(/*SettingsField model instance*/ item) {
                    populateValue(item, function(result) {
                      lopRes.push(1);
                      if (lopRes.length === (resCount)) {
                        return final();
                      }
                    });
                  });
                });
            } else {
              // base constraints: do not show private topics of other users:
              context.remotingContext.args.filter = mergeQuery(context.remotingContext.args.filter,
                {where: {
                  accessPrivateYn: '0'
                }});

              return cb(null, true);
            }
          } else {
            return reject();
          }
        })
        .catch(function() {
          return cb(null, false);
        });
    } else {
      return reject();
    }
  });

  /**
   * Validate access endpoints:
   *
   * `api/workspaces`
   */
  Role.registerResolver('wspcList', function(role, context, cb) {

    const userId = context.accessToken.userId;
    console.log('[RBAC wspcList] Validate access to  operation `' + context.remotingContext.method.name + '` of model `' + context.modelName + '`, user:' + userId);
    function reject() {
      process.nextTick(function() {
        cb(null, false);
      });
    }

    // if the target model is not project
    if (context.modelName !== 'Workspace'
    ) {
      console.log('[RBAC] Model [' + context.modelName + '] is not supported by `wspcList` resolver');
      return reject();
    }

    if ('find' === context.remotingContext.method.name) {
      if (userId) {
        // TODO: check if user has access provider for private non-owned workspace
        context.remotingContext.args.filter = mergeQuery(context.remotingContext.args.filter,
          {where: {
            or: [
              {and: [{accessPrivateYn: '1', ownerUserId: userId}]},
              {accessPrivateYn: '0'}
            ]
          }});

        return cb(null, true);
      } else {

        // base constraints: do not show private topics of other users:
        context.remotingContext.args.filter = mergeQuery(context.remotingContext.args.filter,
          {where: {
            accessPrivateYn: '0'
          }});

        return cb(null, true);
      }

      // these methods expect `context.remotingContext.args.where`, not `context.remotingContext.args.filter.where`:
    } else if ('count' === context.remotingContext.method.name) {

      if (userId) {
        // TODO: check if user has access provider for private non-owned workspace
        context.remotingContext.args = mergeQuery(context.remotingContext.args,
          {where: {
            or: [
              {and: [{accessPrivateYn: '1', ownerUserId: userId}]},
              {accessPrivateYn: '0'}
            ]
          }});

        return cb(null, true);
      } else {

        // base constraints: do not show private topics of other users:
        context.remotingContext.args = mergeQuery(context.remotingContext.args,
          {where: {
            accessPrivateYn: '0'
          }});

        return cb(null, true);
      }
    } else {
      return reject();
    }
  });
};
