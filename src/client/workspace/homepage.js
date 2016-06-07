/**
 * Dynamic route resolver for root 'workspace' page, e.g. http://brianfock.org/brainfock
 *
 * This component is moved outside of `workspace` module and route definition because this page's
 * route path has the lowest priority and is the last route to be matched against request
 *
 * @type {{path: string, getComponent}}
 */
module.exports = { // eslint-disable-line no-undef
  path: ':namespace',

  getComponent(location, cb) {
    if (process.env.IS_BROWSER) {
      require.ensure([], (require) => {
        cb(null, require('../modules/workspace/pages/Home'));
      });
    } else {
      cb(null, require('../modules/workspace/pages/Home'));
    }
  }
};
