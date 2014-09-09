/* global require */

var gulp = require('gulp');

var templateCache = require('gulp-angular-templatecache');
var minifyHtml = require('gulp-minify-html');
var concat = require('gulp-concat');
var uglify = require('gulp-uglify');
var streamqueue = require('streamqueue');
var jscs = require('gulp-jscs');


require('./gulp');

gulp.task('minify', function() {
  gulp.src([
    './src/module.js',
    './src/sfPath.js',
    './src/services/*.js',
    './src/directives/*.js'
  ])
  .pipe(concat('schema-form.min.js'))
  .pipe(uglify())
  .pipe(gulp.dest('./dist/'));
});

gulp.task('non-minified-dist', function() {
  gulp.src([
    './src/module.js',
    './src/sfPath.js',
    './src/services/*.js',
    './src/directives/*.js'
  ])
  .pipe(concat('schema-form.js'))
  .pipe(gulp.dest('./dist/'));
});

gulp.task('jscs', function() {
  gulp.src('./src/**/*.js')
      .pipe(jscs());
});

gulp.task('default', [
  'minify',
  'bootstrap',
  'bootstrap-datepicker',
  'non-minified-dist'
]);

gulp.task('watch', function() {
  gulp.watch('./src/**/*', ['default']);
});
