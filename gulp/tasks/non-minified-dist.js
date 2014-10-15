var gulp = require('gulp'),
  concat = require('gulp-concat');

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