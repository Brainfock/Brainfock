/**
 * Brainfock - Community & Business Management Solution
 *
 * @link http://www.brainfock.org
 * @copyright Copyright (c) 2015 Sergii Gamaiunov <hello@webkadabra.com>
 */
import {mergeQuery} from 'loopback-datasource-juggler/lib/utils';
import loopback from 'loopback';

import FieldTypes from '../components/topicFields';
import FieldsHandler from '../components/topicFieldsHandler.js';

//import marked from 'marked';
//marked.setOptions({
//  renderer: new marked.Renderer(),
//  gfm: true,
//  tables: true,
//  breaks: false,
//  pedantic: false,
//  sanitize: true,
//  smartLists: true,
//  smartypants: false
//});

module.exports = function(Topic) {

  //Topic.prototype.applyContentParsers = function (next)
  //{
  //  const modelInstance = this;
  //
  //
  //  // This does work:
  //  marked(modelInstance.summary, function(err, content) {
  //
  //    if (err) return next(err);
  //
  //    modelInstance.summary = content;
  //
  //    return next();
  //  });
  //}

  //Topic.afterRemote( 'findOne', function( ctx, modelInstance, next) {
  //  if (modelInstance) {
  //    // TODO: apply on client rather
  //    //modelInstance.applyContentParsers(() => {
  //      next();
  //    //});
  //  } else {
  //    return next();
  //  }
  //});

  Topic.validatesPresenceOf('typeId', 'groupId', 'workspaceId', 'summary');

  Topic.validate('typeId', typeIdcustomValidator, {message: 'Type is required'});
  function typeIdcustomValidator(err) {
    if (!this.typeId || !(this.typeId > 0)) err();
  };

  Topic.validate('workspaceId', function (err) {
    if (!this.workspaceId || !(this.workspaceId > 0)) err();
  }, {message: 'is required'});

  Topic.validate('groupId', function (err) {
    if (!this.groupId || !(this.groupId > 0)) err();
  }, {message: 'is required'});

  Topic.validate('typeId', function (err) {
    if (!this.typeId || !(this.typeId > 0)) err();
  }, {message: 'is required'});

  //Topic.validate('contextTopicId', contextTopicIdcustomValidator, {message: 'is required'});
  //function contextTopicIdcustomValidator(err) {
  //  if (this.contextTopicId === 0) err();
  //};

  // TODO: require key only if no context id and gorup IS ROOT
  //Topic.validate('contextTopicKey', function (err) {
  //  if (!this.contextTopicId) {
  //    if (!this.contextTopicKey || this.contextTopicKey.trim() === '') err();
  //  }
  //}, {message: 'is required '});

  Topic.validate('contextTopicKey', function (err) {
    if (!this.contextTopicId) {
      let result = /^[a-zA-Z\-]+$/.test(this.contextTopicKey);
      if (!result)  err();
    }
  }, {message: 'only letters and `-` sign'});

  /**
   * Set `groupId` when topic is saved if `createGroup` is provided in `request`  as an alias to `TopicGroup.groupKey`
   */
  Topic.observe('before save', function normalizeUserInput(ctx, next) {
    const context = loopback.getCurrentContext();

    if (ctx.instance && !ctx.instance.groupId && context.get('http').req.body.createGroup) {
      const createGroup = context.get('http').req.body.createGroup;
      // make sure workspace exists
      Topic.app.models.TopicGroup.findOne({
        where:{
          groupKey: createGroup
        }
      }, function(wspcErr, TopicGroup) {

        if (wspcErr) throw wspcErr;

        if (!TopicGroup || !TopicGroup.id)
          return next({
            name: 'error',
            status: 404,
            message: `Can not find group "${createGroup}"`
          });

        ctx.instance.groupId = TopicGroup.id;
        next();
      });
    } else {
      next();
    }
  });

  /**
   * Set `groupSchemeId` for root topics to default group scheme if no value is provided by user
   */
  Topic.observe('before save', function normalizeUserInput(ctx, next) {

    if (ctx.instance && ctx.isNewInstance === true
        // Only root topics may have own group scheme settings
    && (!ctx.instance.contextTopicId || ctx.instance.contextTopicId === 0)) {
      // if no groupScheme is provided, set default
      if (!ctx.instance.groupSchemeId) {
        // find default
        Topic.app.models.TopicGroupScheme.findOne({
          where:{
            isDefault: 1
          }
        },
        function(err, groupScheme) {
          if (err) throw err;

          if (!groupScheme)
            return next(new Error('Can not find default group scheme!'));

          ctx.instance.groupSchemeId = groupScheme.id;
          next();
        });
      }
    } else {
      next();
    }
  });

  /**
   * validate workspace/namespace existence and access
   * set owner flags
   */
  Topic.observe('before save', function normalizeUserInput(ctx, next) {
    const currentUser = loopback.getCurrentContext().get('currentUser');

    if (!ctx.instance) {
      return next();
    }

    if (ctx.isNewInstance === true) {
      // make author an owner of this item
      ctx.instance.ownerUserId = currentUser.id;
      // theoretically, owner can be switched - save submitter as a separate value
      ctx.instance.submittedUserId = currentUser.id;
    }

    // inherit workspaceId from contextTopicId
    if (ctx.instance.contextTopicId) {
      Topic.findById(ctx.instance.contextTopicId, function (err, contextTopicInstance) {

        if (err) throw err;

        if (!contextTopicInstance) {
          return next({
            name: 'error',
            status: 404,
            message: `Can not find topic ${ctx.instance.contextTopicId}`
          });
        }

        contextTopicInstance.checkUserAccess(currentUser.id || 0, (err, isAllowed) => {
          if (err) throw err;
          if (!isAllowed) {
            return next({
              name: 'error',
              status: 403,
              message: 'Authorization Required'
            });
          } else {
            Topic.app.models.Workspace.promiseUserAccess(contextTopicInstance.workspaceId, currentUser.id || 0)
              .then((wspcInstance)=> {
                ctx.instance.workspaceId = wspcInstance.id;
                ctx.instance.namespace = wspcInstance.namespace;
                next();
              })
              .catch(function () {
                return next({
                  name: 'error',
                  status: 403,
                  message: 'Authorization Required'
                });
              });
          }
        });
      });
    }
    else if (ctx.instance.namespace && !ctx.instance.workspaceId) {
      // make sure workspace exists
      Topic.app.models.Workspace.findOne({where: {namespace: ctx.instance.namespace}}, function (wspcErr, wspcInstance) {

        if (wspcErr) throw wspcErr;

        if (!wspcInstance)
          return next({
            name: 'error',
            status: 404,
            message: `Can not find workspace "${ctx.instance.namespace}"`
          });

        if (wspcInstance.accessPrivateYn === 0 || currentUser && wspcInstance.ownerUserId === currentUser.id) {
          ctx.instance.workspaceId = wspcInstance.id;
          ctx.instance.namespace = wspcInstance.namespace;
          next();
        } else {
          return next({
            name: 'error',
            status: 403,
            message: 'Authorization Required'
          });
        }
      });
    } else if (!ctx.instance.namespace && ctx.instance.workspaceId) {
      // make sure workspace exists
      Topic.app.models.Workspace.findById(ctx.instance.workspaceId, function(wspcErr, wspcInstance) {

        if (wspcErr) throw wspcErr;

        if (!wspcInstance)
          return next({
            name: 'error',
            status: 404,
            message: `Can not find workspace ID:"${ctx.instance.workspaceId}"`
          });

        if (wspcInstance.accessPrivateYn === 0 || currentUser && wspcInstance.ownerUserId === currentUser.id) {
          ctx.instance.workspaceId = wspcInstance.id;
          ctx.instance.namespace = wspcInstance.namespace;
          next();
        } else {
          return next({
            name: 'error',
            status: 403,
            message: 'Authorization Required'
          });
        }
      });
    } else {
      next();
    }
  });

  /**
   * Apply initial workflow stage for topic on creation
   * Stage is resolved based on workflow for topic type in effective scheme
   */
  Topic.observe('before save', function applyInitialWorkflowStage(ctx, next) {
    if (ctx.instance) {
      // set initial workflow stage
      if (!ctx.instance.workflowStageId) {
        ctx.instance.getWorkflowTopicConfig(function(err, effectiveWorkflow) {
          if (err) return next(err);

          if (effectiveWorkflow === null) {
            return next({
              message: 'Could not find Workflow'
            });
          }

          effectiveWorkflow.getDefaultStage(function(err, wfStage) {
            if (err) return next(err);

            if (wfStage === null) {
              return next({
                message: 'Could not find initial Workflow Stage of ' + (effectiveWorkflow.name || effectiveWorkflow.id) + ' workflow'
              });
            } else {
              ctx.instance.workflowStageId = wfStage.id;
              next();
            }
          });
        });
      }
    } else {
      next();
    }
  });

  /**
   * Validate uniqueness of namespace per groupId/workspaceId pair
   */
  Topic.observe('before save', function normalizeUserInput(ctx, next) {
    const context = loopback.getCurrentContext();

    if (ctx.instance) {
      if ((!ctx.instance.contextTopicId || ctx.instance.contextTopicId === 0)
        && ctx.instance.contextTopicKey && ctx.instance.workspaceId) {

        if (!ctx.instance.groupId) {
          return next(new Error('groupId is missing!'));
        }

        // make sure it's unique among its group
        Topic.app.models.Topic.findOne({
          where:{
            contextTopicKey: ctx.instance.contextTopicKey,
            workspaceId: ctx.instance.workspaceId
          }
        }, function(err, existingTopic) {
          if (err) throw err;

          if (existingTopic && existingTopic.id) {
            next(new Error(`There is already topic with "${ctx.instance.contextTopicKey}" key in that namespace`));
          } else {
            next();
          }
        });
      } else {
        next();
      }
    } else {
      next();
    }
  });

  /**
   * get entityId
   */
  Topic.observe('before save', function normalizeUserInput(ctx, next) {
    if (ctx.instance) {
      if (ctx.isNewInstance === true) {
        Topic.app.models.Entity.create({
          name: ctx.instance.summary,
          accessPrivateYn: ctx.instance.accessPrivateYn,
          ownerUserId: ctx.instance.ownerUserId,
          modelClassName: 'Topic',
          modelPk: null
        }, function(err, entityInstance) {
          if (err) {
            throw err;
          }
          ctx.instance.entityId = entityInstance.id;
          next();
        });
      } else {
        next();
      }
    }else {
      next();
    }
  });

  /**
   * update `entity` relation to link back after new `topic` is created and PK is obtained
   */
  Topic.observe('after save', function updateTimestamp(ctx, next) {
    // after model has been saved, we have to pass model's ID back to entity registry:
    if (ctx.isNewInstance && ctx.instance.entityId) {
      Topic.app.models.Entity.findById(ctx.instance.entityId, function(err, entityInstance) {
        if (err) throw err;
        entityInstance.updateAttributes({modelPk:ctx.instance.id}, function(err) {
          if (err) throw err;
          next();
        });
      });
    } else {
      next();
    }
  });

  /**
   * populate topic `type` after remote create
   */
  Topic.afterRemote('upsert', function(ctx, modelInstance, next) {
    // reload topic to get updated values on columns that are managed by sql triggers (contextTopicNum etc.)
    modelInstance.reload(function(errReload, instance) {
      modelInstance.__data = instance.__data;
      // load extended type info
      modelInstance.type(function(err, type) {
        if (err) return next(err);
        // we can not modify properties of relations directly via `modelInstance.user=[Object]`:
        modelInstance.__data.type = type;
        next(err, modelInstance);
      });
    });
  });

  Topic.on('attached', function() {
    const override = Topic.findOne;
    Topic.findOneCore = override;
    Topic.findOne = function(filter, options, callback) {

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
          let parts = filter.where.id.split('-');
          let last = parts.pop();

          let _filter = {key:null, id:null};

          if (!Number.isInteger(last)) {
            _filter.key = null;
            _filter.id = filter.where.id;
          } else if (parts.length === 0) {
            _filter.key = null;
            _filter.id = last;
          } else {
            _filter.key = parts.implode('-');
            _filter.id = last;
          }

          if (!_filter.key && _filter.id) {
            delete filter.where.id;
            filter = mergeQuery(filter, {where: {
              and: [
                {or: [{contextTopicId: '0'}, {contextTopicId: null}]},
                {contextTopicKey: _filter.id}
              ]
            }});
          }
        }
      }

      // go on with regular `findOne` method
      return override.apply(this, [filter, options, callback]);
    };
  });

  Topic.afterRemote('find', function(ctx, data, next) {

    function populateValue($modelInstance, callback) {
      // TODO: remove placeholder/dummy icon

      $modelInstance.logo = {
        icon: 'star',
        background: 'pink'
      };

      if ($modelInstance.contextTopicKey) {
        if (!$modelInstance.contextTopicId || $modelInstance.contextTopicId === 0) {
          $modelInstance.uid =  $modelInstance.contextTopicKey;
        }
      } else if ($modelInstance.contextTopicNum) {
        $modelInstance.uid = $modelInstance.contextTopicNum;
      }
      callback();
    }

    if (ctx.result && data.length > 0) {
      let resCount = data.length;
      let lopRes = [];
      ctx.result.forEach(function(/*Topic model instance*/ item) {
        populateValue(item, function(result) {
          lopRes.push(1);
          if (lopRes.length === (resCount)) {
            next();
          }
        });
      });

    } else {
      return next();
    }
  });

  /**
   * Populate `operations` property with all available operations (if requested)
   * To add `operations` in server response, provide `extra.operations` filter, e.g.:
   * <code>
   *  api/topics/1234?filter[extra][operations]
   * </code>
   */
  Topic.afterRemote('findById', function(ctx, modelInstance, next) {
    if (modelInstance) {
      if (ctx.args.filter && ctx.args.filter.extra && ctx.args.filter.extra.hasOwnProperty('operations')) {
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
  Topic.afterRemote('findOne', function(ctx, modelInstance, next) {
    if (modelInstance) {
      if (ctx.args.filter && ctx.args.filter.extra && ctx.args.filter.extra.hasOwnProperty('operations')) {
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

  Topic.afterRemote('*.__get__topics', function(ctx, data, next) {
    function populateValue(modelInstance, callback) {
      modelInstance.getOperations(function(err, operations) {
        if (err) return next(err);
        modelInstance.operations = operations;
        return callback();
      });
    }

    if (ctx.args.filter && ctx.args.filter.extra && ctx.args.filter.extra.hasOwnProperty('operations') && ctx.result && data.length > 0) {

      let resCount = data.length;
      let lopRes = [];
      ctx.result.forEach(function(/*Topic model instance*/ item) {
        populateValue(item, function(result) {
          lopRes.push(1);
          if (lopRes.length === (resCount)) {
            next();
          }
        });
      });
    } else {
      return next();
    }
  });

  Topic.prototype.getOperations = function(next) {

    const self = this;
    self.getWorkflowTopicConfig(function(err, effectiveWorkflow) {
      if (err) return next(err);

      if (effectiveWorkflow === null) {
        return next({
          message: 'Could not find Workflow'
        });
      }

      Topic.app.models.WorkflowStageOperationMap.find({
        where: {
          workflowId: effectiveWorkflow.id,
          workflowStageId: self.workflowStageId,
        },
        include: ['operation']
      }, function(err, data) {
        if (err) return next(err);
        let operations = [];
        data.forEach(function(opMap) {
          opMap.operation(function(err, operation) {
            if (err) return next(err);
            if (operation)
              operations.push({
                id:operation.id,
                name:operation.name,
                summary:operation.summary
              });
          });
        });

        return next(null, operations);
      });
    });
  };

  /**
   * return (any) workflow scheme
   * @todo: should be based on context topic settings; there would be different schemes for `projects` and `issues` groups
   */
  Topic.prototype.getWorkflowScheme = function(next) {
    Topic.app.models.WorkflowScheme.findOne({where: {
      // TODO: allow to switch workflow schemes
    }}, function(err, wfScheme) {

      if (err) throw err;

      if (!wfScheme)
        next(null, null);
      else
        next(null, wfScheme);
    });
  };

  /**
   * Check if userId has read access on topic
   * @param {Number} userId
   * @param {Function} next
   * @returns {*}
   */
  Topic.prototype.checkUserAccess = function(userId, next) {
    if (this.accessPrivateYn === 0 || (this.accessPrivateYn === 1 && userId > 0 && this.ownerUserId === userId)) {
      return next(null, true);
    } else if (userId > 0) {

      Topic.app.models.EntityAccessAssign.findOne(
        {where:{
          authType:0,
          authId:userId,
          entityId:this.entityId
        }},
        (err, data) => next(null, !(err || !data))
      );
    } else {
      return next(null, false);
    }
  };

  Topic.promiseUserAccess = function(topicWhere, userId) {
    if (process.env.NODE_ENV === 'development') {
      console.log('> Topic.promiseUserAccess topicWhere', topicWhere)
    }
    return new Promise(
      function(resolve, reject) {
        Topic.findOne({where:topicWhere}, function(err, instance) {
          if(err || !instance) return reject(null, false);
          instance.checkUserAccess(userId, function(err,isAllowed) {
            if(err || !isAllowed) return reject(null, false);
            return resolve(instance, true);
          })
        });
      });
  }

  /**
   * @return Workflow|null - active workflow for current topic type in active scheme
   */
  Topic.prototype.getWorkflowTopicConfig = function(next) {
    const self = this;
    this.getWorkflowScheme(function(err, wfScheme) {
      if (err) return next(err);

      if (wfScheme === null) {
        return next({
          message: 'Could not find Workflow Scheme'
        });
      }

      Topic.app.models.WorkflowSchemeTopicTypeWorkflow.findOne({
        where:{
          workflowSchemeId:wfScheme.id,
          topicTypeId:self.typeId
        },
        include:['workflow']
      }, function(err, WorkflowSchemeTopicTypeWorkflow) {
        if (err) return next(err);

        // if there is no custom workflow for topic type, select default workflow in this scheme
        if (WorkflowSchemeTopicTypeWorkflow === null) {
          wfScheme.defaultWorkflow(
            function(err, workflow) {
              if (err) return next(err);
              if (workflow === null) {
                return next({
                  message: 'Could not find Workflow'
                });
              }
              return next(null, workflow);
            }
          );
        } else {
          WorkflowSchemeTopicTypeWorkflow.workflow(
            function(err, workflow) {
              if (err) return next(err);
              if (workflow === null) {
                return next({
                  message: 'Could not find Workflow'
                });
              }
              return next(null, workflow);
            }
          );
        }
      });
    });
  };

  /**
   * get primary keys of all public root topics (helper method for ACLS)
   * @param workspaces {Array} list of public workspaces to save some queries
   * @returns {Promise}
   */
  Topic.getPublicContextTopicIds = function(workspaces) {
    return new Promise(
      function(resolve, reject) {
        let ids = [];
        let where = {};
        where = {
          workspaceId: { inq: workspaces },
          accessPrivateYn: '0'
        };
        Topic.find({where: where}, function(err, data) {
          if (err || !data) return resolve([]);

          data.forEach(item => {
            ids.push(item.id)
          });
          resolve(ids);
        });
      });
  }

  /**
   *
   * @param id
   * @param groupKey
   * @param cb
   */
  Topic.loadFilters = function(id, groupKey, cb) {
    Topic.findOne({where:{id:id}}, function(err, contextTopic) {

      if (err) throw err;

      if (!contextTopic)
        return cb(null, []);

      // Find DEFAULT topic type scheme
      // TODO: allow to define different topic_type_scheme per root (so, project can have own)
      Topic.app.models.TopicTypeScheme.findOne({}, function(typeErr, typeSchemeInstance) {

        if (typeErr) throw typeErr;

        if (!typeSchemeInstance)
          return cb(null, []);

        Topic.app.models.TopicGroup.findOne({where:{groupKey:groupKey}}, function(groupErr, groupInstance) {

          if (groupErr) throw groupErr;

          if (!groupInstance)
            return cb(null, []);

          // contextTopic - root topic, e.g. `project`
          // groupInstance - group instance (e.g. `issues`)
          // typeSchemeInstance

          // basically, we need to get filters for all columns available in a view

          // filter by:
          // - topic type (`issue`, `epic` etc.) - get all available types for this group
          // - workflow stage (stage_id)
          // - summary text (or any text e.g. fulltext)
          // - additional fields:
          //    -- component (relational field, relation to topic of group "component" that has `contextTopic` as parent
          //       API endpoint: `api/topics/:namespace/:topicKey/topics/?where[groupKey]=component
          //    -- priority
          //    -- assignee
          //    -- reported_by

          // we must get all available fields (filterable) for this `groupInstance`
          groupInstance.types({}, function(err, types) {

            if (err) throw err;

            let TypeOptions = types.map(item => {
              return {
                value: item.id,
                label: item.name
              };
            });

            let response = [
              {
                id: 'type',
                label:'Type',
                options:TypeOptions,
                type:FieldTypes.multiselect
              }, {
                // draft example
                id: 'affectsVersion',
                label:'Affects Version',
                endpoint:`/api/topics/${id}/topics/?filter[where][groupKey]=version`,
                type:FieldTypes.select,
                options:[]
              }, {
                // draft example
                id: 'linledIssue',
                label:'Linked Issue',
                endpoint:'/api/topics?filter[where][groupKey]=issue',
                type:FieldTypes.select,
                options:[]
              }
              //{
              //  id: 'contextTopicId',
              //  defaultValue:id,
              //  defaultOptions: [
              //    {id:id, label:contextTopic.summary}
              //  ],
              //  endpoint:`/api/topics/${id}/?filter[where][groupKey]=project`
              //},
              //{
              //  id: 'field.milestone',
              //  label:"Milestone",
              //  endpoint:`/api/topics/${id}/?filter[where][groupKey]=milestone`
              //},
              //{
              //  id: 'field.assignee_user_id',
              //  label:"Assignee",
              //  endpoint:`/api/topics/${id}/users`,
              //  type:FieldTypes.select,
              //},
            ];

            cb(null, response);
          });
        });
      });
    });
  };

  /**
   * Load form fields for topic screen. Currently, supports default (create) screen only
   *
   * @todo: re-factor!
   *
   * @param id
   * @param groupKey
   * @param cb
   */
  Topic.loadFormFields = function(id, groupKey, cb) {

    if (id === '0') {
      Topic.app.models.TopicGroup.findOne({
        where:{
          groupKey:groupKey
        },
        include: ['parentGroup']
      },
      function(groupErr, groupInstance) {
        if (groupErr) return cb(groupErr);
        if (!groupInstance)
          return cb(null, []);


        /* concept: 1. get DEFAULT workspace per user (e.g. last WSP user user) that has this group available
                    2. build fields based on WSP group scheme?
        */
        // look for default group scheme for groupInstance.id group
        Topic.app.models.TopicGroupScheme.findOne({
          where:{
            isDefault: 1,
            rootGroupId: groupInstance.id,
          }
        },
        function(err, TopicGroupScheme) {
          if (err) return cb(err);
          if (!TopicGroupScheme) {
            return cb(null, []);
          }

          // find effective `TypeScheme` for this group in `TopicGroupScheme`
          Topic.app.models.TopicGroupSchemeTypeScheme.findOne({
            where:{
              topicGroupSchemeId: TopicGroupScheme.id,
              topicGroupId: groupInstance.id
            }
          }, function(err, TopicGroupSchemeTypeScheme) {
            if (err) return cb(err);
            if (!TopicGroupSchemeTypeScheme)
              return cb(null, []);

            // find effective `TypeScheme` for this group in `TopicGroupScheme`

            // Find DEFAULT topic type scheme for this group
            // TODO: allow to define different topic_type_scheme per parent context (so, project can have own)

            Topic.app.models.TopicTypeScheme.findById(TopicGroupSchemeTypeScheme.topicTypeSchemeId,
              function(err, typeSchemeInstance) {
                if (err) return cb(err);
                if (!typeSchemeInstance)
                  return cb(null, []);

                /** @property contextTopic object - root topic, e.g. `project` */
                /** @property groupInstance - group instance (e.g. `issues`) */
                /** @property typeSchemeInstance */

                Topic.app.models.TopicTypeSchemeTopicTypeMap.find({
                  where:{
                    topicTypeSchemeId:typeSchemeInstance.id
                  },
                  order:'sortWeight DESC',
                  include: [
                    'topicType'
                  ]

                }, function(err, types) {
                  if (err) return cb(err);
                  if (!types || types.length === 0)
                    return cb(new Error('No topic types defined for scheme ' + typeSchemeInstance.id), []);

                  let TypeOptions = types.map(item => {
                    let topicType = item.topicType();
                    return {
                      value: topicType.id,
                      label: topicType.name
                    };
                  });

                  const DefaultType = types[0].topicType();

                  if (!DefaultType) {
                    return cb(null, []);
                  }

                  // Find DEFAULT screen scheme
                  Topic.app.models.ScreenScheme.findOne({
                    // TODO: allow to provide non-default scheme
                    where:{
                      groupId: groupInstance.id
                    }
                  }, function(err, ScreenScheme) {
                    if (err) return cb(err);
                    if (!ScreenScheme)
                      return cb(null, []);

                    // Find what screen is configured for `DefaultType` type in `ScreenScheme` scheme
                    Topic.app.models.ScreenScheme_TopicTypeScreen_Map.findOne({
                      where: {
                        screenSchemeId: ScreenScheme.id,
                        topicTypeId: DefaultType.id
                      },
                      include: [
                        'screen'
                      ]
                    }, function(err, ScreenSchemeTopicTypeScreenMap) {
                      let Screen;
                      if (err) return cb(err);
                      if (!ScreenSchemeTopicTypeScreenMap) {
                        // then use ScreenScheme.defaultScreenId
                        Topic.app.models.Screen.findById(ScreenScheme.defaultScreenId,
                          (err, DefaultScreen) => {
                            if (err) return cb(err);
                            if (!DefaultScreen) return cb(null, []);

                            DefaultScreen.screenFields({
                              // provides values to be available at `field.field()`
                              include:['field']
                            }, function(err, screenFields) {
                              if (err) return cb(err);
                              if (!screenFields)
                                return cb(null, []);

                              let _screenFields = screenFields.map(field => {
                                let fieldConfig = field.field().__data;
                                return {
                                  group: groupInstance,
                                  contextTopic: null,
                                  ...fieldConfig
                                };
                              });

                              Promise
                                .all(_screenFields.map(FieldsHandler.populateFormField))
                                .then(function(dataDone) {
                                  // manually add "group" and "type" select fields, re-using already populated data
                                  // TODO: select first
                                  // isRequired
                                  FieldsHandler.typeIdFieldProps({
                                    group: groupInstance,
                                    contextTopic: null,
                                    key: 'typeId',
                                    options: TypeOptions,
                                    isRequired: 1,
                                    value: {
                                      value: DefaultType.id,
                                      label: DefaultType.name
                                    }
                                  })
                                    .then(function(moreData) {
                                      dataDone.unshift(moreData);
                                      // workspace is required for roots
                                      FieldsHandler.workspaceIdFieldProps({
                                        group: groupInstance,
                                        contextTopic: null,
                                        key: 'workspaceId',
                                        isRequired: 1
                                      })
                                        .then(function(moreData) {
                                          dataDone.unshift(moreData);

                                          return cb(null, dataDone);
                                        });
                                    });
                                })
                                .catch(e => {
                                  return cb(null, []);
                                })
                            });
                        });
                      } else {
                        // use type-specific screen (advanced):
                        Screen = ScreenSchemeTopicTypeScreenMap.screen();
                        Screen.screenFields({
                          // provides values to be available at `field.field()`
                          include:['field']
                        }, function(err, screenFields) {
                          if (err) return cb(err);
                          if (!screenFields)
                            return cb(null, []);

                          let _screenFields = screenFields.map(field => {
                            let fieldConfig = field.field().__data;
                            return {
                              group: groupInstance,
                              contextTopic: null,
                              ...fieldConfig
                            };
                          });

                          Promise
                            .all(_screenFields.map(FieldsHandler.populateFormField))
                            .then(function(dataDone) {
                              // manually add "group" and "type" select fields, re-using already populated data
                              // TODO: select first
                              // isRequired
                              FieldsHandler.typeIdFieldProps({
                                group: groupInstance,
                                contextTopic: null,
                                key: 'typeId',
                                options: TypeOptions,
                                isRequired: 1,
                                value: {
                                  value: DefaultType.id,
                                  label: DefaultType.name
                                }
                              })
                                .then(function(moreData) {
                                  dataDone.unshift(moreData);
                                  // workspace is required for roots
                                  FieldsHandler.workspaceIdFieldProps({
                                    group: groupInstance,
                                    contextTopic: null,
                                    key: 'workspaceId',
                                    isRequired: 1
                                  })
                                    .then(function(moreData) {
                                      dataDone.unshift(moreData);

                                      return cb(null, dataDone);
                                    });
                                });
                            })
                            .catch(e => {
                              return cb(null, []);
                            })
                        });
                      }
                    });
                  });
                });
              });
          });
        });
      });
    // for context:
    } else {
      Topic.findOne({where:{id:id}}, function(err, contextTopic) {
        if (err) return cb(err);
        if (!contextTopic)
          return cb(null, []);

        Topic.app.models.TopicGroup.findOne({
          where:{
            groupKey:groupKey
          },
          include: ['parentGroup']
        },
        function(err, groupInstance) {
          if (err) return cb(err);
          if (!groupInstance)
            return cb(null, []);

          let where = {};
          if (contextTopic.groupSchemeId > 0) {
            where.id = contextTopic.groupSchemeId;
          } else {
            where.isDefault = 1;
          }

          Topic.app.models.TopicGroupScheme.findOne({
            where: where
          },
          function(err, TopicGroupScheme) {
            if (err) return cb(err);

            if (!TopicGroupScheme)
              return cb(null, []);

            // find effective `TypeScheme` for this group in `TopicGroupScheme`
            Topic.app.models.TopicGroupSchemeTypeScheme.findOne({
              where:{
                topicGroupSchemeId: TopicGroupScheme.id,
                topicGroupId: groupInstance.id
              }
            }, function(err, TopicGroupSchemeTypeScheme) {
              if (err) return cb(err);

              if (!TopicGroupSchemeTypeScheme)
                return cb(null, []);

              // find effective `TypeScheme` for this group in `TopicGroupScheme` `````

              // Find DEFAULT topic type scheme for this group
              // TODO: allow to define different topic_type_scheme per parent context (so, project can have own)

              Topic.app.models.TopicTypeScheme.findById(TopicGroupSchemeTypeScheme.topicTypeSchemeId,
              function(err, typeSchemeInstance) {
                if (err) return cb(err);

                if (!typeSchemeInstance)
                  return cb(null, []);

                /** @property contextTopic object - root topic, e.g. `project` */
                /** @property groupInstance - group instance (e.g. `issues`) */
                /** @property typeSchemeInstance */

                Topic.app.models.TopicTypeSchemeTopicTypeMap.find({
                  where:{
                    topicTypeSchemeId:typeSchemeInstance.id
                  },
                  order:'sortWeight DESC',
                  include: [
                    'topicType'
                  ]

                }, function(err, types) {
                  if (err) return cb(err);

                  if (!types || types.length === 0)
                    return cb(new Error('No topic types defined for scheme ' + typeSchemeInstance.id), []);

                  let TypeOptions = types.map(item => {
                    let topicType = item.topicType();
                    return {
                      value: topicType.id,
                      label: topicType.name
                    };
                  });

                  const DefaultType = types[0].topicType();

                  if (!DefaultType) {
                    return cb(null, []);
                  }

                  // Find DEFAULT screen scheme
                  Topic.app.models.ScreenScheme.findOne({
                    // TODO: allow to provide non-default scheme
                    where:{
                      groupId: groupInstance.id
                    }
                  }, function(err, ScreenScheme) {
                    if (err) return cb(err);

                    if (!ScreenScheme)
                      return cb(null, []);

                    // Find what screen is configured for `DefaultType` type in `ScreenScheme` scheme
                    Topic.app.models.ScreenScheme_TopicTypeScreen_Map.findOne({
                      where: {
                        screenSchemeId: ScreenScheme.id,
                        topicTypeId: DefaultType.id
                      },
                      include: [
                        'screen'
                      ]
                    }, function(err, ScreenSchemeTopicTypeScreenMap) {

                      if (err) return cb(err);
                      if (!ScreenSchemeTopicTypeScreenMap) {
                        // then use ScreenScheme.defaultScreenId
                        Topic.app.models.Screen.findById(ScreenScheme.defaultScreenId,
                          (err, DefaultScreen) => {
                            if (err) return cb(err);
                            if (!DefaultScreen) return cb(null, []);

                            DefaultScreen.screenFields({
                              // provides values to be available at `field.field()`
                              include:['field']
                            }, function(err, screenFields) {
                              if (err) return cb(err);
                              if (!screenFields)
                                return cb(null, []);

                              let _screenFields = screenFields.map(field => {
                                let fieldConfig = field.field().__data;
                                return {
                                  group: groupInstance,
                                  contextTopic: null,
                                  ...fieldConfig
                                };
                              });

                              Promise
                                .all(_screenFields.map(FieldsHandler.populateFormField))
                                .then(function(dataDone) {
                                  // manually add "group" and "type" select fields, re-using already populated data
                                  // TODO: select first
                                  // isRequired
                                  FieldsHandler.typeIdFieldProps({
                                    group: groupInstance,
                                    contextTopic: null,
                                    key: 'typeId',
                                    options: TypeOptions,
                                    isRequired: 1,
                                    value: {
                                      value: DefaultType.id,
                                      label: DefaultType.name
                                    }
                                  })
                                    .then(function(moreData) {
                                      dataDone.unshift(moreData);
                                      // workspace is required for roots
                                      return cb(null, dataDone);
                                    });
                                })
                                .catch(e => {
                                  return cb(null, []);
                                })
                            });
                          });
                      } else {
                        const Screen = ScreenSchemeTopicTypeScreenMap.screen();

                        Screen.screenFields({
                          // provides values to be available at `field.field()`
                          include:['field']
                        }, function(err, screenFields) {
                          if (err) return cb(err);

                          if (!screenFields)
                            return cb(null, []);

                          let _screenFields = screenFields.map(field => {
                            let fieldConfig = field.field().__data;
                            return {
                              group: groupInstance,
                              contextTopic: contextTopic,
                              ...fieldConfig
                            };
                          });

                          Promise
                            .all(_screenFields.map(FieldsHandler.populateFormField))
                            .then(function(dataDone) {

                              let dataFiltered = dataDone.filter(function(n){ return n !== undefined && n !== null });

                              // manually add "group" and "type" select fields, re-using already populated data
                              FieldsHandler.typeIdFieldProps({
                                group: groupInstance,
                                contextTopic: contextTopic,
                                key: 'typeId',
                                options: TypeOptions,
                                isRequired: 1,
                                value: {
                                  value: DefaultType.id,
                                  label: DefaultType.name
                                }
                              })
                                .then(function(moreData) {
                                  dataFiltered.unshift(moreData);
                                  return cb(null, dataFiltered);
                                });
                            });
                        });
                      }
                    });
                  });
                });
              });
            });
          });
        });
      });
    }

  };

  Topic.runOperation = function(id, operation, cb) {

    Topic.findOne({where:{id:id}}, function(err, contextTopic) {
      if (err) return cb(err);
      if (!contextTopic)
        return cb(null, []);

      const currentUser = loopback.getCurrentContext().get('currentUser');

      Topic.app.models.WorkflowOperation.findById(operation,
        function(err, WorkflowOperation) {
          if (err) return cb(err);
          if (!WorkflowOperation)
            return cb(null, []);

          contextTopic.getWorkflowScheme(function(err3, wfScheme) {
            if (err3) return cb(err3);

            if (wfScheme === null) {
              return cb({
                message: 'Could not find Workflow Scheme'
              });
            }

            Topic.app.models.WorkflowSchemeTopicTypeWorkflow.findOne({
              where:{
                workflowSchemeId:wfScheme.id,
                topicTypeId:contextTopic.typeId
              },
              include:['workflow']
            }, function(err, WorkflowSchemeTopicTypeWorkflow) {
              if (err) return cb(err);
              contextTopic.getOperations(function(err, operations) {
                if (err) return cb(err);

                if (operations.filter((e) => e.id === operation).length > 0) {
                  // operation is allowed
                  Topic.beginTransaction('READ COMMITTED', function(err, tx) {
                    if (err) return cb(err);
                    // Now we have a transaction (tx)
                    Topic.app.models.EntityWorkflowOperation.create({
                      workflowOperationId: WorkflowOperation.id,
                      entityId: contextTopic.entityId,
                      userId: currentUser.id,
                      inStageId: contextTopic.workflowStageId,
                      outStageId: WorkflowOperation.outgoingStageId
                    }, {transaction: tx}, function(err, savedRecord) {
                      if (err) return cb(err);
                      // update topic
                      contextTopic.updateAttributes({
                        workflowStageId: WorkflowOperation.outgoingStageId
                      },
                      {transaction:tx},
                      function(err, updatedContextTopic) {
                        if (err) return cb(err);
                        tx.commit(function(err) {
                          if (err) return cb(err);
                          updatedContextTopic.reload(function(err, updatedContextTopic) {
                            if (err) return cb(err);
                            updatedContextTopic.getOperations(function(err, operations) {
                              if (err) return cb(err);
                              updatedContextTopic.operations = operations;
                              return cb(null, updatedContextTopic);
                            });
                          });
                        });
                      });
                    });
                  });
                } else {
                  return cb(null, []);
                }
              });
              // if there is no custom workflow for topic type, select default workflow in this scheme
              // if (WorkflowSchemeTopicTypeWorkflow === null) {

              //   wfScheme.defaultWorkflow(
              //     function(err, workflow) {
              //       if (err) return cb(err);
              //       if (workflow === null) {
              //         return cb({
              //           message: 'Could not find Workflow'
              //         });
              //       }
              //       return cb(null, workflow);
              //     }
              //   );
              // } else {

              //   WorkflowSchemeTopicTypeWorkflow.workflow(function(err, workflow) {
              //     if (err) return cb(err);
              //     if (workflow === null) {
              //       return cb({
              //         message: 'Could not find Workflow'
              //       });
              //     }
              //     return cb(null, workflow);
              //   });
              // }
            });
          });
        });
    });
  };

  /**
   * REST API endpoint `api/topics/:contextTopicKey/filters`
   */
  Topic.remoteMethod(
    'loadFilters',
    {
      accepts: [
        {arg: 'id', type: 'any', http: {source: 'path'}, required: true},
        {arg: 'groupKey', type: 'string', http: {source: 'path'}, required: true}
      ],
      http: {verb: 'get', path: '/:id/filters/:groupKey'},
      returns: {arg: 'filters', type: 'Array'}
    }
  );

  /**
   * REST API endpoint `api/topics/:contextTopicKey/formFields`
   */
  Topic.remoteMethod(
    'loadFormFields',
    {
      accepts: [
        {arg: 'id', type: 'any', http: {source: 'path'}, required: true},
        {arg: 'groupKey', type: 'string', http: {source: 'path'}, required: true}
      ],
      http: {verb: 'get', path: '/:id/formFields/:groupKey'},
      returns: {arg: 'filters', type: 'Array'}
    }
  );

  /**
   * REST API endpoint `api/topics/:contextTopicKey/runOperation`
   */
  Topic.remoteMethod(
    'runOperation',
    {
      accepts: [
        {arg: 'id', type: 'any', http: {source: 'path'}, required: true},
        {
          arg: 'custom',
          type: 'number',
          http: function(ctx) {
            const req = ctx.req;
            return +req.param('operation');
          },
          required: true
        }
      ],
      http: {verb: 'post', path: '/:id/runOperation'},
      returns: {arg: 'topic', type: 'Array'}
    }
  );

};
