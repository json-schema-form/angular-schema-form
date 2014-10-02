/* global require */

var gulp = require('gulp');

var templateCache = require('gulp-angular-templatecache');
var minifyHtml = require('gulp-minify-html');
var concat = require('gulp-concat');
var uglify = require('gulp-uglify');
var streamqueue = require('streamqueue');
var jscs = require('gulp-jscs');
var karma = require('gulp-karma');



gulp.task('bootstrap', function() {
  var stream = streamqueue({objectMode: true});
  stream.queue(
              gulp.src('./src/directives/decorators/bootstrap/*.html')
                  .pipe(minifyHtml({
                    empty: true,
                    spare: true,
                    quotes: true
                  }))
                  .pipe(templateCache({
                    module: 'schemaForm',
                    root: 'directives/decorators/bootstrap/'
                  }))
    );
  stream.queue(gulp.src('./src/directives/decorators/bootstrap/*.js'));

  stream.done()
        .pipe(concat('bootstrap-decorator.min.js'))
        .pipe(uglify())
        .pipe(gulp.dest('./dist/'));

});

gulp.task('stb-webmanual', function() {
  var stream = streamqueue({ objectMode: true });
  stream.queue(
              gulp.src("./src/directives/decorators/stb-webmanual/*.html")
                  .pipe(minifyHtml({
                      empty: true,
                      spare: true,
                      quotes: true
                  }))
                  .pipe(templateCache({
                      module: "schemaForm",
                      root: "directives/decorators/stb-webmanual/"
                  }))
    );
    stream.queue(gulp.src('./src/directives/decorators/stb-webmanual/*.js'));

    stream.done()
          .pipe(concat('stb-webmanual-decorator.min.js'))
          .pipe(uglify())
          .pipe(gulp.dest("./dist/"));

});

gulp.task('bootstrap-datepicker', function() {
  var stream = streamqueue({objectMode: true});
  stream.queue(gulp.src('./src/directives/decorators/stb-webmanual/datepicker/*.js'));

  stream.done()
        .pipe(concat('bootstrap-datepicker.min.js'))
        .pipe(uglify())
        .pipe(gulp.dest('./dist/'));


});

gulp.task('test', function() {
  return gulp.src([
    'bower_components/jquery/dist/jquery.min.js',
    'test/lib/angular.js',
    'test/lib/angular-mocks.js',
    'bower_components/tv4/tv4.js',
    'bower_components/objectpath/lib/ObjectPath.js',
    'src/module.js',
    'src/sfPath.js',
    'src/services/*.js',
    'src/directives/*.js',
    'src/directives/decorators/stb-webmanual/*.js',
    'src/**/*.html',
    'test/schema-form-test.js'])
    .pipe(karma({
      configFile: 'karma.conf.js',
      action: 'run'
    }))
    .on('error', function(err) {
      throw err;
    });
});

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
  'test',
  'minify',
  'bootstrap-datepicker',
  'stb-webmanual',
  'non-minified-dist'
]);

gulp.task('watch', function() {
  gulp.watch('./src/**/*', ['default']);
});
