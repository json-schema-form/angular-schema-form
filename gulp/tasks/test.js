var gulp = require('gulp'),
  karma = require('gulp-karma');

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
    'src/directives/decorators/bootstrap/*.js',
    'src/**/*.html',
    'test/services/schema-form-test.js',
    'test/services/decorators-test.js',
    'test/directives/schema-form-test.js'])
    .pipe(karma({
      configFile: 'karma.conf.js',
      action: 'run'
    }))
    .on('error', function(err) {
      throw err;
    });
});
