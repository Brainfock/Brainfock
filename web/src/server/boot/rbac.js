/**
 * Brainfock - community & issue management software
 * Copyright (c) 2015, Sergii Gamaiunov (�Webkadabra�)  All rights reserved.
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

/**
 * Role-Based Access Control of Brianfock
 *
 * @todo clean up code
 */
import {mergeQuery} from 'loopback-datasource-juggler/lib/utils';

module.exports = function(app) {

  const Role = app.models.Role;

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

    // these methods expect `context.remotingContext.args.where`, not `context.remotingContext.args.filter.where`:
    } else if (context.remotingContext.method.name === '__count__topics'
      || context.remotingContext.method.name === 'count') {

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
        // base constraints: do not show private topics of other users:
        context.remotingContext.args.filter = mergeQuery(context.remotingContext.args.filter,
          {where: {
            accessPrivateYn: '0'
          }});

        return cb(null, true);
      }

      return;
    }

    // do not allow anonymous users

    if (!userId) {
      return reject();
    }

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

  Role.registerResolver('createWikiPage', function(role, context, cb) {
    console.log('[RBAC createWikiPage] Validate access to  operation `' + context.remotingContext.method.name + '` of model `' + context.modelName + '`');
    const userId = context.accessToken.userId;

    function reject() {
      //console.log('[RBAC] Reject access to ['+context.modelName+'] operation `'+context.remotingContext.method.name+'`')
      process.nextTick(function() {
        cb(null, false);
      });
    }

    // if the target model is not project
    if (context.modelName !== 'WikiPage'
    ) {
      //console.log('[RBAC] Model ['+context.modelName+'] is not supported by `topicEntityAccess` resolver')
      return reject();
    }

    if (context.remotingContext.method.name === 'upsert') {

      // TODO: we must validate if user can create pages in selected contextEntityId space
      if (userId) {
        let allowedEntities = [];

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
    }else {
      return reject();
    }

  });

  Role.registerResolver('commentEntityAccess', function(role, context, cb) {
    console.log('[RBAC commentEntityAccess] Validate access to  operation `' + context.remotingContext.method.name + '` of model `' + context.modelName);
    const userId = context.accessToken.userId;
    //console.log('[topicEntityAccess]: userId='+userId)
    //console.log('context.result',context.remotingContext.result);
    //console.log('context.remotingContext.req',context.remotingContext.req);
    //console.log('context.remotingContext.method.name',context.remotingContext.method.name);
    function reject() {
      process.nextTick(function() {
        cb(null, false);
      });
    }

    // if the target model is not project
    if (context.modelName !== 'Comment') {
      //console.log('Not Comment')
      return reject();
    }
//

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
   *
   * @todo review; add validation of a workspace; make work together with other roles
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
      console.log(err);
      console.log(ContextTopic);
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
      reject();
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
};
