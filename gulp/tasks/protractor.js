var gulp = require('gulp');

// The protractor task
var protractor = require('gulp-protractor');

// Start a standalone server
var webdriver_standalone = protractor.webdriver_standalone;

// Download and update the selenium driver
var webdriver_update = protractor.webdriver_update;

// Downloads the selenium webdriver
gulp.task('webdriver-update', webdriver_update);

// Start the standalone selenium server
// NOTE: This is not needed if you reference the
// seleniumServerJar in your protractor.conf.js
gulp.task('webdriver-standalone', webdriver_standalone);


// Setting up the test task
gulp.task('protractor', ['webdriver-update'], function(cb) {
  gulp.src(['test/protractor/specs/**/*.js']).pipe(protractor.protractor({
    configFile: 'test/protractor/conf.js',
  })).on('error', function(e) {
    console.log(e);
  }).on('end', cb);
});

['validation-messages', 'custom-validation'].forEach(function(name) {
  gulp.task('protractor:' + name, ['webdriver-update'], function(cb) {
    gulp.src(['test/protractor/specs/' + name + '.js']).pipe(protractor.protractor({
      configFile: 'test/protractor/conf.js',
    })).on('error', function(e) {
      console.log(e);
    }).on('end', cb);
  });
});
