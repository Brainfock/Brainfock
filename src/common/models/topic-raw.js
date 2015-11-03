module.exports = function(RawTopic) {

  RawTopic.observe('before delete', function(ctx, next) {

    RawTopic.find({where:ctx.where}, (err, topics) => {

      if (err) next(err);

      let resCount = topics.length;
      let lopRes = [];
      if (resCount > 0) {
        topics.forEach(function(item) {

          RawTopic.destroyAll({contextTopicId: item.id}, () => {
            lopRes.push(1);
            if (lopRes.length === (resCount)) {
              next();
            }
          });
        });
      } else {
        next();
      }
    });
  });
};
