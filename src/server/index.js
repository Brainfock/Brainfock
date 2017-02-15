const areIntlLocalesSupported = require('intl-locales-supported');
const config = require('./config');
const pkg = require('../../package.json');

VERSION = JSON.stringify(pkg.version); // eslint-disable-line no-undef
VERSION_FULL = JSON.stringify(pkg.name + ' ' + pkg.version);  // eslint-disable-line no-undef

if (!process.env.NODE_ENV)
  throw new Error('Environment variable NODE_ENV isn\'t set. Remember it\'s up your production enviroment to set NODE_ENV and maybe other variables.');

if (global.Intl) {
  // Determine if the built-in `Intl` has the locale data we need.
  if (!areIntlLocalesSupported(config.appLocales)) {
    // `Intl` exists, but it doesn't have the data we need, so load the
    // polyfill and replace the constructors we need with the polyfill's.
    require('intl');
    global.Intl.NumberFormat = global.IntlPolyfill.NumberFormat;
    global.Intl.DateTimeFormat = global.IntlPolyfill.DateTimeFormat;
  }
} else {
  // No `Intl`, so use and load the polyfill.
  global.Intl = require('intl');
}

// require('babel/register')({stage: 0});
require("babel-core/register"); // require('babel/register')({optional: ['es7']});

// To ignore webpack custom loaders on server.
config.webpackStylesExtensions.forEach(function(ext) {
  require.extensions['.' + ext] = function() {};
});

require('./main').start();
