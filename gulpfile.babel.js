/* eslint-disable no-undef, no-console */
import bg from 'gulp-bg';
import eslint from 'gulp-eslint';
import fs from 'fs';
import gulp from 'gulp';
import mochaRunCreator from './test/mochaRunCreator';
import os from 'os';
import path from 'path';
import runSequence from 'run-sequence';
import shell from 'gulp-shell';
import webpackBuild from './webpack/build';
import yargs from 'yargs';

const args = yargs
  .alias('p', 'production')
  .argv;

const runEslint = () => {
  return gulp.src([
    'gulpfile.babel.js',
    'src/**/*.js',
    'webpack/*.js'
    // '!**/__tests__/*.*'
  ])
  .pipe(eslint())
  .pipe(eslint.format());
};

gulp.task('env', () => {
  process.env.NODE_ENV = args.production ? 'production' : 'development';
});

gulp.task('build-webpack', ['env'], webpackBuild);
gulp.task('build', ['build-webpack']);

gulp.task('eslint', () => {
  return runEslint();
});

gulp.task('eslint-ci', () => {
  // Exit process with an error code (1) on lint error for CI build.
  return runEslint().pipe(eslint.failAfterError());
});

gulp.task('mocha', () => {
  mochaRunCreator('process')();
});

// Continuous test running
gulp.task('mocha-watch', () => {
  gulp.watch(
    ['test/**/**', 'src/client/**', 'src/common/**'],
    mochaRunCreator('log')
  );
});

gulp.task('test', done => {
  runSequence('eslint-ci', 'mocha', 'build-webpack', done);
});

gulp.task('server-node', bg('node', './src/server'));
gulp.task('server-hot', bg('node', './webpack/server'));
// Shell fixes Windows este/issues/522, bg is still needed for server-hot.
gulp.task('server-nodemon', shell.task(
  // Normalize makes path cross platform.
  path.normalize('node_modules/.bin/nodemon src/server')
));

gulp.task('server', ['env'], done => {
  if (args.production)
    runSequence('build', 'server-node', done);
  else
    runSequence('server-hot', 'server-nodemon', done);
});

gulp.task('default', ['server']);
