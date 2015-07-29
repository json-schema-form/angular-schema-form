var gulp = require('gulp'),
  streamqueue = require('streamqueue'),
  concat = require('gulp-concat'),
  rename = require('gulp-rename'),
  umd    = require('gulp-umd'),
  uglify = require('gulp-uglify');

gulp.task('minify', function() {
  var stream = streamqueue({objectMode: true});
  stream.queue(gulp.src('./src/module.js'));
  stream.queue(
    gulp.src([
      './src/sfPath.js',
      './src/services/*.js',
      './src/directives/*.js'
      ])
    .pipe(concat('schema-form.js'))
    .pipe(umd({
      dependencies: function() {
        return [
          {name: 'angular'},
          {name: 'objectpath'},
          {name: 'tv4'},
        ];
      },
      exports: function() {return 'schemaForm';},
      namespace: function() {return 'schemaForm';}
      }))
  );

  stream.done()
  .pipe(concat('schema-form.js'))
  .pipe(gulp.dest('./dist/'))
  .pipe(uglify())
  .pipe(rename('schema-form.min.js'))
  .pipe(gulp.dest('./dist/'));
});
