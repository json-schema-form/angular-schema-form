var gulp   = require('gulp');
var clean  = require('gulp-rimraf');
var jshint = require('gulp-jshint');
var concat = require('gulp-concat');
var uglify = require('gulp-uglify');
var ngmin  = require('gulp-ng-annotate');
var sourcemaps = require('gulp-sourcemaps');

var karma = require('karma').server;
var karmaConfPath = './test/karma.conf.js';
var karmaConf = require(karmaConfPath);

var sources = [
  'src/module.js',
  'src/helpers.js',
  'src/services/request-animation.js',
  'src/services/spy-api.js',
  'src/services/scroll-container-api.js',
  'src/directives/smooth-scroll.js',
  'src/directives/spy-context.js',
  'src/directives/scroll-container.js',
  'src/directives/scrollspy.js'
];

var targets = 'angular-scroll.{js,min.js,min.js.map}';

gulp.task('clean', function() {
  gulp.src(targets)
    .pipe(clean());
});

gulp.task('lint', function() {
  gulp.src(sources)
    .pipe(jshint())
    .pipe(jshint.reporter('default'));
});

gulp.task('karma', function(done) {
  karma.start({configFile: __dirname + '/test/karma.conf.js', singleRun: true}, done);
});

gulp.task('compress', function() {
  //Development version
  gulp.src(sources)
    .pipe(concat('angular-scroll.js', { newLine: '\n\n' }))
    .pipe(ngmin())
    .pipe(gulp.dest('./'));

  //Minified version
  gulp.src(sources)
    .pipe(sourcemaps.init())
      .pipe(concat('angular-scroll.min.js', { newLine: '\n\n' }))
      .pipe(ngmin())
      .pipe(uglify())
    .pipe(sourcemaps.write('./'))
    .pipe(gulp.dest('./'));
});

gulp.task('build', ['clean', 'compress']);
gulp.task('test', ['lint', 'karma']);
gulp.task('default', ['test', 'build']);
