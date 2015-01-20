var gulp = require('gulp'),
  streamqueue = require('streamqueue'),
  minifyHtml = require('gulp-minify-html'),
  templateCache = require('gulp-angular-templatecache'),
  concat = require('gulp-concat'),
  uglify = require('gulp-uglify');

gulp.task('ionic', function() {
  var stream = streamqueue({objectMode: true});
  stream.queue(
    gulp.src('./src/directives/decorators/ionic/*.html')
    .pipe(minifyHtml({
      empty: true,
      spare: true,
      quotes: true
    }))
    .pipe(templateCache({
      module: 'schemaForm',
      root: 'directives/decorators/ionic/'
    }))
    );
  stream.queue(gulp.src('./src/directives/decorators/ionic/*.js'));

  stream.done()
  .pipe(concat('ionic-decorator.js'))
  .pipe(gulp.dest('./dist/'))
  .pipe(concat('ionic-decorator.min.js'))
  .pipe(uglify())
  .pipe(gulp.dest('./dist/'));

});