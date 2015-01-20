var gulp = require('gulp');

gulp.task('default', [
  'minify',
  'ionic',
  'bootstrap',
  'bootstrap-datepicker',
  'non-minified-dist'
]);