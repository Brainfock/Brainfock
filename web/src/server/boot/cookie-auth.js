var loopback;

loopback = require("loopback");

module.exports = function(app) {
  // need to enable context right here, see https://github.com/strongloop/loopback/issues/1651
  app.use(loopback.context({ enableHttpContext: true }));

  // this will tell loopback to look for authorization data in cookies and restore it from there
  app.use(loopback.token({
    model: app.models.accessToken,
    cookies: ['authorization'],
  }));

    app.use(function(req, res, next) {
        if (!req.accessToken) {
            return next();
        }

        app.models.User.findById(req.accessToken.userId, function(err, user) {
            var loopbackContext;
            if (err) {
                return next(err);
            }
            if (!user) {
                return next(new Error('No user with this access token was found.'));
            }
            loopbackContext = loopback.getCurrentContext();
            if (loopbackContext) {
              // providing `loopbackContext.set('currentUser', user);` will not work correctly
              // for server rendering - only defaults will be set, juggle __date
              const {__data} = user;
              let userData = {...__data};
              loopbackContext.set('currentUser', userData);
            }
            next();
        });
    });

  app.use(function(req, res, next) {
    if (!req.accessToken && req.signedCookies && req.signedCookies.authorization) {
      res.clearCookie("authorization");
    }
    return next();
  });
  app.models.User.afterRemote("login", function(context, result, next) {
    var req, res;
    req = context.req, res = context.res;
    if (result != null) {
      if (result.id != null) {
        res.cookie("authorization", result.id, {
          httpOnly: true,
          signed: true
        });
      }
    }
    return next();
  });
  return app.models.User.afterRemote("logout", function(context, result, next) {
    var req, res;
    req = context.req, res = context.res;
    return res.clearCookie("authorization");
  });
};