import {mergeQuery} from 'loopback-datasource-juggler/lib/utils';

module.exports = function(Workspace) {
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
};
