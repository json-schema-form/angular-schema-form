var gulp = require('gulp'),
  jscs = require('gulp-jscs');

gulp.task('jscs', function() {
  gulp.src('./src/**/*.js')
      .pipe(jscs());
});
