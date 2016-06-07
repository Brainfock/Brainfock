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

module.exports = function(Term) {

  Term.prepareFormOptions = function(key, limit, cb) {
    Term.findOne({where:{
      key: key
    }}, function(err, termInstance) {

      if (err) return cb(err, []);

      if (!termInstance) return cb(null, []);

      const context = loopback.getCurrentContext();
      let filter;

      if (context.get('http').req.query && context.get('http').req.query.filter) {
        filter = mergeQuery({where:{
          termId: termInstance.id,
        }}, context.get('http').req.query.filter);
      } else {
        filter = {where:{
          termId: termInstance.id,
        }};
      }

      Term.app.models.TermValue.find(filter, (err, data) => {
        if (err) return cb(null, []);
        if (!data) return cb(null, []);

        return cb(null, data.map(({id, value}) => {
          return {
            value: id,
            label: value
          };
        }));
      });

    });
  };

  /**
   * API endpoint `api/terms/values/:key`
   *
   * @param id
   * @param cb
   * @private
   */
  Term.__findByKey__labels = function(key, cb) { // eslint-disable-line camelcase
    Term.prepareFormOptions(key, 1000, cb);
  };

  /**
   * REST API endpoint `api/terms/values/:key`
   */
  Term.remoteMethod(
    '__findByKey__labels',
    {
      accepts: [
        {arg: 'key', type: 'string', http: {source: 'path'}, required: true},
      ],
      http: {verb: 'get', path: '/values/:key'},
      returns: {arg: 'topic', type: 'Array', root: true}
    }
  );
};
