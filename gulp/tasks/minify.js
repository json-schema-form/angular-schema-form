var gulp = require('gulp'),
  concat = require('gulp-concat'),
  rename = require('gulp-rename'),
  uglify = require('gulp-uglify');

gulp.task('minify', function() {
  gulp.src([
    './src/module.js',
    './src/sfPath.js',
    './src/services/*.js',
    './src/directives/*.js'
    ])
  .pipe(concat('schema-form.js'))
  .pipe(gulp.dest('./dist/'))
  .pipe(uglify())
  .pipe(rename('schema-form.min.js'))
  .pipe(gulp.dest('./dist/'));
});
