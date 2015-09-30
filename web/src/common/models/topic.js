var app = require("../../server/main");

import {mergeQuery} from 'loopback-datasource-juggler/lib/utils';

module.exports = function(Topic) {

  Topic.on('attached', function() {
    var override = Topic.findOne;
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
       */
      if(filter.where.id) {

        if(isNaN(filter.where.id))
        {
          let parts = filter.where.id.split('-');
          let last = parts.pop();

          let _filter={key:null,id:null};

          if(!Number.isInteger(last)) {
            _filter.key=null;
            _filter.id=filter.where.id;
          }
          else if (parts.length==0) {
            _filter.key=null;
            _filter.id=last;
          }
          else {
            _filter.key=parts.implode('-');
            _filter.id=last;
          }

          if(!_filter.key && _filter.id)
          {
            delete filter.where.id;
            filter = mergeQuery(filter, {where: {
              and: [
                {or: [{contextTopicId: "0", "contextTopicId": null}]},
                {contextTopicKey: _filter.id}
              ]
            }});
          }
        }
      }

      // go on with regular `findOne` method
      return override.apply(this, [filter, options, callback])
    }
  });

  /*Topic.on('attached', function() {
    var override = Topic.find;
    Topic.findCore = override;
    Topic.find = function(query, options, cb) {

      if (options === undefined && cb === undefined) {
        if (typeof query === 'function') {
          // find(cb);
          cb = query;
          query = {};
        }
      } else if (cb === undefined) {
        if (typeof options === 'function') {
          // find(query, cb);
          cb = options;
          options = {};
        }
      }

      cb = cb || utils.createPromiseCallback();
      query = query || {};
      options = options || {};

      if(query.where.group) {
        app.models.TopicGroup.findOne({where:{
            groupKey:query.where.group
          }},
          function(err,groupInstance)
          {
            if (err) {
              return cb(err, false);

            }

            delete query.where.group;
            query.where.group_id = groupInstance.id;
            console.log('!!!!',query.where);

            return Topic.findCore.apply(this, [query, options, cb]);
            //return cb(null, true);
          })
      } else {
        console.log('no group, FILTER:',query,'OPTIONS:',options);
        return Topic.findCore.apply(this, [query, options, cb]);
      }



      if(cb) return cb.promise;
    }
  });*/

  //Topic.afterRemote('find', function(ctx, car, next) {
  //
  //  if(ctx.result) {
  //    var result = ctx.result;
  //    ctx.result = {
  //      data: result,
  //      meta: {
  //        limit: 20,
  //        next: ctx.req.baseUrl,
  //        offset: 0,
  //        previous: '',
  //      }
  //    };
  //    if(Array.isArray(ctx.result.data)) {
  //      ctx.result.meta.count = ctx.result.data.length;
  //    }
  //  }
  //  next();
  //});
  ///

  /*Topic.beforeRemote( 'find', function( context, data, next) {

    console.log('context.args.filter', context.args.filter);

    if(context.args.filter.where.group) {
      console.log('yes');
      Topic.app.models.TopicGroup.findOne({where:{
          groupKey:context.args.filter.where.group
        }},
        function(err,groupInstance)
        {
          if (err) {
            return reject();
            //return callback(err);
          }
        //console.log('find method');
        delete context.args.filter.where.group;
          console.log('!!!!',context.args.filter.where);

          context.args.filter.where.group_id = groupInstance.id;
          context.args.filter = mergeQuery(context.args.filter,
          {where: {
            or: [
              {and: [{accessPrivateYn: "1", "ownerUserId": userId}]},
              {accessPrivateYn: "0"}
            ]
            // TODO: add validationvia au
            //or: [{accessPrivateYn: '0'}, {ownerUserId: userId}]
          }});
        return cb(null, true);
      })
    } else {
      return next();
    }
  });*/
//
  Topic.afterRemote( 'find', function( ctx, data, next) {
    if(ctx.result && data.length>0) {

      function populateValue($modelInstance, callback) {
        // TODO: remove placeholder/dummy icon

        $modelInstance.logo = {
          icon: 'star',
          background: 'pink'
        }

        if($modelInstance.contextTopicKey) {
          if(!$modelInstance.contextTopicId || $modelInstance.contextTopicId == 0) {
            $modelInstance.uid =  $modelInstance.contextTopicKey;
          }
        } else {
          if($modelInstance.contextTopicNum) {
            $modelInstance.uid= $modelInstance.contextTopicNum;
          }
        }
        // TODO: port completely:
        //public function getUid() {
        //  if($this->context_topic_key) {
        //    if(!$this->context_topic_id || $this->context_topic_id == 0) {
        //      return $this->context_topic_key;
        //    }
        //  else {
        //      return CHtml::value($this,'contextTopic.uid');
        //    }
        //  }
        //  if($this->context_topic_num) {
        //    return $this->context_topic_num;
        //  }
        //}
        //
        callback();
      }

      let resCount = data.length;
      let lopRes = [];
      ctx.result.forEach(function(/*Topic model instance*/ item){
        populateValue(item, function(result){
          lopRes.push(1);
          if(lopRes.length == (resCount)) {
            next();
          }
        });
      })

    } else {
      return next();
    }
  });

  /**
   * in progress
   * @param id
   * @param cb
   */
  Topic.loadFilters = function(id, groupKey, cb) {
    Topic.findOne( {where:{id:id}}, function (err, instance) {

      if(err) throw err;

      if(!instance)
        return cb(null, [])

      // Find DEFAULT topic type scheme
      // TODO: allow to define different topic_type_scheme per root (so, project can have own)
      Topic.app.models.TopicTypeScheme.findOne({},function(typeErr,typeInstance){

        if(typeErr) throw typeErr;

        if(!typeInstance)
          return cb(null, [])

        Topic.app.models.TopicGroup.findOne({where:{groupKey:groupKey}},function(groupErr,groupInstance){

          if(groupErr) throw groupErr;

          if(!groupInstance)
            return cb(null, [])

          let response = [
            {
              id: 'type',
              defaultValue:1,
              optionsRest:'/api/topics?filter[where][groupKey]=topic'
            },
            {
              id: 'contextEntityId',
              defaultValue:id,
              defaultLabel:instance.summary,
              optionsRest:'/api/topics?filter[where][groupKey]=project'
            },
          ];

          cb(null, response);
        })
      })


    });
  };

  /**
   * REST API endpoint `api/topics/123/filters`
   */
  Topic.remoteMethod(
    'loadFilters',
    {
      accepts: [
        {arg: 'id', type: 'any', http: { source: 'path' }, required: true },
        {arg: 'groupKey', type: 'string', http: { source: 'path' }, required: true },
      ],
      http: {verb: 'get', path: '/:id/filters/:groupKey'},
      returns: {arg: 'filters', type: 'Array'}
    }
  );

};
