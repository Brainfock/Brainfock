var Promise = require('bluebird')
var marked = require('marked');
var app = require("../../server/main");

marked.setOptions({
  renderer: new marked.Renderer(),
  gfm: true,
  tables: true,
  breaks: false,
  pedantic: false,
  sanitize: true,
  smartLists: true,
  smartypants: false
});


var promiseWhile = function(condition, action) {
  return new Promise(function(resolve, reject) {
    var loop = function() {
      if (!condition()) return resolve();
      return Promise.cast(action())
        .then(loop)
        .catch(function(e) {
          reject(e);
        });
    };
    process.nextTick(loop);
  });
};

module.exports = function(WikiPage)
{
  WikiPage.observe('before save', function updateTimestamp(ctx, next) {

    if(ctx.data && ctx.data.pageUid)
    {
      let pageUid = ctx.data.pageUid.split(':');
      if(pageUid.length>1) {
        ctx.data.namespace = pageUid.shift();
        ctx.data.pageUid = pageUid.join('');
      }
    }
    else if(ctx.instance && ctx.instance.pageUid)
    {
      let pageUid = ctx.instance.pageUid.split(':');
      if(pageUid.length>1) {
        ctx.instance.namespace = pageUid.shift();
        ctx.instance.pageUid = pageUid.join('');
      }
    }

    if (ctx.isNewInstance)
    {
      WikiPage.app.models.Entity.create({
        name: ctx.instance.pageUid,
        accessPrivateYn: ctx.instance.accessPrivateYn,
        owerUserId: ctx.instance.owerUserId,
        modelClassName: 'WikiPage',
        modelPk: null,
      }, function (err, entityInstance) {
        if(err) {
          throw err;
        }
        ctx.instance.entityId =  entityInstance.id;
        ctx.instance.entity_id =  entityInstance.id;
        next();
      });
    } else {
      next();
    }
  });

  WikiPage.observe('after save', function updateTimestamp(ctx, next)
  {
    // after model has been saved, we have to pass model's ID back to entity registry:
    if (ctx.isNewInstance && ctx.instance.entityId) {
      WikiPage.app.models.Entity.findById(ctx.instance.entityId, function (err, entityInstance) {
        entityInstance.updateAttributes({modelPk:ctx.instance.id}, function(errE,instance){
          if(errE) {
            throw errE;
          }
          next();
        });
      });
    } else {
      next();
    }
  });

  //WikiPage.observe('before save', function updateTimestamp(ctx, next) {
  //
  //  if (ctx.isNewInstance) {
  //    console.loh('Create new entity for page');
  //    WikiPage.app.models.Entity.create({
  //      name: ctx.instance.pageUid,
  //      modelClassName: 'WikiPage',
  //    }, function (err, pageInstance) {
  //      next();
  //    });
  //  } else {
  //    next();
  //  }
  //});

  /**
   * this callback is only active if model was successfully found
   *
   * apply some pre-processing of a `content` before output
   * @todo review and maybe move to `before save` and store processed text in DB. Issue with that is processed content
   *       may change based on existing/non-existing of other data (e.g. new wiki page create that had been linked from
   *       this page as link to non-existing page)
   */
  WikiPage.afterRemote( 'findOne', function( ctx, modelInstance, next) {
    if (modelInstance) {

      const cleanUid = modelInstance.pageUid;

      // TODO: append special content: CATEGORY and INDEX
      let parsers = []

      if (modelInstance.namespace === 'Special') {
        if (cleanUid === 'Index') {
          parsers.push(modelInstance.appendPagesIndex())
        }
        // TODO: `Category` special page
      }

      Promise.all(parsers)
        .then(function() {
          modelInstance.applyContentParsers(() => {
            next();
          })
        })

    } else {
      //console.log('remotingContext:',ctx.remotingContext);
      ctx.instance = new WikiPage();
      //ctx.instance.pageUid
      return next();
    }
  });

  WikiPage.afterRemote( '*.updateAttributes', function( ctx, modelInstance, next) {
    if(modelInstance) {
      modelInstance.applyContentParsers(next)
    } else {
      next();
    }
  });

  /*WikiPage.observe('loaded', function (ctx, next)
  {
      ctx.instance.contentRendered = 'TEST';
      return next();
    }
  });*/

  WikiPage.on('attached', function() {
    var override = WikiPage.findOne;
    WikiPage.findOneCore = override;
    WikiPage.findOne = function(filter, options, callback) {

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


      if(filter.where.pageUid && filter.where.pageUid.indexOf( ':' ) !== -1) {
        let findBy = filter.where.pageUid.split(':');

        filter.where.namespace = findBy[0];
        filter.where.pageUid = findBy[1];
      }

      override.apply(this, [filter, function(err, modelInstance) {
        if(modelInstance) {
          callback(null, modelInstance)
        } else {
          if(filter.where.namespace == 'Special' || filter.where.namespace == 'Category') {
            callback(null, new WikiPage({
              namespace: filter.where.namespace,
              pageUid: filter.where.pageUid,
              content: ''
            }));
          } else {
            // for wiki, we gotta return pseudo-instance to allow user to edit it
            callback(null, new WikiPage({
              namespace: filter.where.namespace,
              pageUid: filter.where.pageUid,
              content: '*This page does not exist yet. Click "Edit" to create it*'
            }));
          }
        }
      }]);

      return callback.promise;
    }
  });


  /**
   * append list of all pages that have same `contextEntityId` value
   * @returns {bluebird|exports|module.exports}
   */
  WikiPage.prototype.appendPagesIndex = function() {

    const modelInstance = this;
    const where = {
      contextEntityId: this.contextEntityId > 0 ? this.contextEntityId : 0
    };

    if (!modelInstance.contentRendered) {
      modelInstance.contentRendered = modelInstance.content;
    }

    return new Promise(
      function(resolve, reject) {
        WikiPage.find({
          where: where,
          order: 'namespace ASC, pageUid ASC'
        }, function(err, foundPages) {

          if(err || !foundPages) return resolve(null);

          if (foundPages.length > 0) {

            let namespace = '';
            let links = foundPages.map(item => {
              if (item && item.pageUid) {

                const link = item.namespace
                  ? `* [[${item.namespace}:${item.pageUid}|${item.pageUid}]]`
                  : `* [[${item.pageUid}]]`;

                if (namespace !== item.namespace) {
                  namespace = item.namespace;

                  return (item.namespace ? `\n\n## ${item.namespace}\n\n` : '')
                    + link;
                } else {
                  return link;
                }
              }
            });

            if (links.length > 0) {
              modelInstance.contentRendered += "\n" + links.join("\n");
            }
          }

          return resolve();
        });
      });
  }

  WikiPage.prototype.applyContentParsers = function (next)
  {
    const modelInstance = this;

    if(modelInstance.namespace)
      modelInstance.pageUid = modelInstance.namespace+':'+modelInstance.pageUid;

    if (!modelInstance.contentRendered) // content may be already prepended with some data, e.g. for `Special:Index` page
      modelInstance.contentRendered = modelInstance.content;

    // This does work:
    marked(modelInstance.contentRendered, {
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

      // get links
      modelInstance.getWikiLinks(content, function(links) {
        modelInstance.replaceWikiLinks(content, links, function(processedContent) {
          modelInstance.contentRendered =  processedContent;
          return next();
        });

      });
    });
  }

  /**
   * Gets info about all wiki-links found in text
   *
   * basic idea originates from Yeeki module by SamDark (@link https://github.com/samdark/Yeeki)
   * @param string $content
   * @param object $originalCallback
   * @return object
   */
  WikiPage.prototype.getWikiLinks = function (content, originalCallback) {
    var links = {};
    //var matches = this.content.match(/\[\[(.*?)\]\]/g);
    //let _regex = new RegExp(/\[\[(.*?)\]\]/, 'g');
    let _regex = new RegExp(/\[\[(.*?)\]\]/gi);

    var matches = content.match(_regex);
    //var matches = this.content.match(_regex);

    if(matches) {

      function async($fullMatch, callback) {
//
        var $contentMatch = $fullMatch.match(/\[\[(.*?)\]\]/i);
        var $parts = $contentMatch[1].split('|');
        var $first = $parts.shift();
        if($parts.length>0)
        {
          links[$fullMatch] = {
            title: $parts.join ( '' ),
            wiki_uid: $first,
          };
        }
        else
        {
          links[$fullMatch] = {
            title: $first,
            wiki_uid: $first,
          };
        }

        callback()
      }
      function final() {
        originalCallback(links)
      }

      var results = [];

      matches.forEach(function(item) {
        async(item, function(result){
          results.push(result);
          if(results.length == matches.length) {
            final();
          }
        })
      });


    } else {
      return originalCallback();
    }
  };

  /**
   * Replaces wiki-links in a text provided
   *
   * @param string $text
   * @return string
   */
  WikiPage.prototype.replaceWikiLinks = function (text, links, originalCallback) {

    var self = this;

    if(links)
    {
      function asyncReplace($fullMath, $pageData, callback) {
        let filter = {
          where: {
            context_entity_id: (self.context_entity_id ? self.context_entity_id : 0),
            pageUid: $pageData. wiki_uid
          }
          , limit: 1
        };

        if(filter.where.pageUid && filter.where.pageUid.indexOf( ':' ) !== -1) {
          let findBy = filter.where.pageUid.split(':');
          filter.where.namespace = findBy[0];
          filter.where.pageUid = findBy[1];
        }

        var escapeReg = function(s) {
          return s.replace(/[-\/\\^$*+?.()|[\]{}]/g, '\\$&');
        };

        app.models.WikiPage.find(filter, {}, function(err, foundPage) {
          if (err) {
            return callback();
            //return callback(err);
          }
          if (!foundPage || foundPage === []) {
            // page is not found, but it's not a fatal error
            text = text.replace($fullMath, '<a class="non-existing WkikLink" href="/wiki/'+$pageData. wiki_uid+'">'+$pageData. title+'</a>');
            return callback();
          }
          else {
            //let matcher = escapeReg($fullMath);
            text = text.replace($fullMath, '<a class="WkikLink" href="/wiki/'+$pageData. wiki_uid+'">'+$pageData. title+'</a>');
            return callback();
          }
        });
      }
      function final() {
        originalCallback(text)
      }

      var results = [];
      let _keys = Object.keys(links);
      Object.keys(links).forEach(function (linkData, index) {

        asyncReplace(linkData, links[linkData], function(result){
          results.push(1);
          if(results.length == (_keys.length)) {
            final();
          }
        });
      });
    }
    else {
      originalCallback(text)
    }
  }
};
