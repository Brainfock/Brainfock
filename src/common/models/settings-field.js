/**
 * Brainfock, <http://www.brainfock.org>
 *
 * Copyright (C) 2015-present Sergii Gamaiunov <hello@webkadabra.com>
 * All rights reserved.
 *
 * This source code is licensed under the GPL-style license found in the
 * LICENSE file in the root directory of this source tree.
 */
module.exports = function(SettingsField) {
  /**
   * apply some pre-processing of a `content` before output
   * @todo review and maybe move to `before save` and store processed text in DB. Issue with that is processed content
   *       may change based on existing/non-existing of other data (e.g. new wiki page create that had been linked from
   *       this page as link to non-existing page)
   */
  SettingsField.afterRemote('find', function(ctx, data, next) {

    function populateValue($modelInstance, callback) {
      let filter = {
        where: {
          category: $modelInstance.category_key,
          key: $modelInstance.id
        },
        limit: 1
      };
      SettingsField.app.models.Settings.findOne(filter, {}, function(err, /*Settings model instance*/ foundPage) {
        if (err) {
          return callback();
          //return callback(err);
        }
        if (!foundPage) {
          // page is not found, but it's not a fatal error
          return callback();
        } else {
          console.log('foundPage:'); // eslint-disable-line no-console, no-undef
          $modelInstance.value = foundPage.getPreparedValue();
          return callback();
        }
      });
    }

    if (ctx.result) {
      let resCount = data.length;
      let lopRes = [];
      ctx.result.forEach(function(/*SettingsField model instance*/ item) {
        populateValue(item, function(result) {
          lopRes.push(1);
          if (lopRes.length === (resCount)) {
            next();
          }
        });
      });

      //var result = ctx.result;
      //ctx.result = {
      //  objects: result,
      //  meta: {
      //    limit: 20,
      //    next: ctx.req.baseUrl,
      //    offset: 0,
      //    previous: '',
      //  }
      //};
      //if(Array.isArray(ctx.result.objects)) {
      //  ctx.result.meta.count = ctx.result.objects.length;
      //}
    } else {
      return next();
    }
  });
};
