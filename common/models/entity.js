var marked = require('marked');
var enable_debug=false;
module.exports = function(Entity) {

  /**
   * @url http://localhost:3000/api/entities/1699
   */
  Entity.afterRemote( '**', function( ctx, data, next) {
      console.log(ctx.methodString, 'was invoked remotely1');
    next();
  });


  Entity.afterRemote( '*.__get__comments', function( ctx, data, next) {
    if(enable_debug) {
      console.log(ctx.methodString, 'was invoked remotely');
      console.log('ctx.result:',ctx.result)
      console.log('ctx.methodString:',ctx.methodString)
    }
    if(ctx.result && ctx.result.length>0) {
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
      ctx.result.forEach(function(/*SettingsField model instance*/ item){
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
  })

  /**
   * format comment text
   * include `user` relation data
   */
  Entity.afterRemote( '*.__create__comments', function( ctx, modelInstance, next) {

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

          modelInstance.user(function(err, user) {
            if (err) return next(err);
            // we can not modify properties of relations directly via `modelInstance.user=[Object]`:
            modelInstance.__data.user = user;
            Entity.app.io.sockets.in('comments-'+modelInstance.entity_id).emit('new-comment', {data: modelInstance});

            next(err);
          });
        });
    } else {
      return next();
    }
  })

  /**
   * check if user has access to entity
   *
   * TODO: check if global guest access is allowed
   * @param userId
   * @param cb
   * @returns {*}
   */
  Entity.prototype.checkUserAccess=function(userId, cb) {
    if(this.accessPrivateYn == 0) {
      return cb(null, true);
    }
    if(!userId) {
      return cb(null, false);
    }

    if(this.ownerUserId == userId)
      return cb(null, true);

    var allowedEntities = [];

    let whereFilter = {
      auth_type:0,
      auth_id:userId,
      entity_id:this.id,
    };

    Entity.app.models.EntityAccessAssign.findOne({where:whereFilter},
      function(err,data)
      {
        if (err || !data) {
          return cb(null, false);
        }
        return cb(null, true);
      });
  }

  /**
   * example to create new newsted remote method:
   * @param entityId
   * @param cb
   * @returns {*}
   */
  Entity.entityName = function(entityId, cb) {
    return cb(null, 'r');;
    Entity.findById( entityId, function (err, instance) {
      response = "Name of entity is " + instance.name;
      cb(null, response);
      // then load comments or whatever
    });
  }

  /**
   * uncomment to expose new rest route /{$api}/entities/{$id}/getName
   *!/
  Entity.remoteMethod (
    'entityName',
    {
      http: {path: '/getName', verb: 'get'},
      accepts: [
        {arg: 'id', type: 'number', http: { source: 'query' }, required: true },
        {arg: 'page', type: 'Number', http: {source: 'query'}}
      ],
      returns: {arg: 'name', type: 'string'}
      // exmaple if we return list:
      //returns: {arg: 'data', type: 'object'},
    }
  );*/
};
