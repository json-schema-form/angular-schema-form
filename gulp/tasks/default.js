var gulp = require('gulp');

gulp.task('default', [
  'minify',
  'bootstrap',
  'bootstrap-datepicker',
  'non-minified-dist'
]);