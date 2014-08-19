// Karma configuration
// Generated on Fri Feb 07 2014 08:31:06 GMT+0100 (CET)

module.exports = function(config) {
  config.set({

    // base path, that will be used to resolve files and exclude
    basePath: '.',


    // frameworks to use
    frameworks: ['mocha', 'chai-sinon'],


    // list of files / patterns to load in the browser
    files: [
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
      'test/schema-form-test.js'
    ],

    // list of files to exclude
    exclude: [

    ],


    // test results reporter to use
    // possible values: 'dots', 'progress', 'junit', 'growl', 'coverage'
    reporters: ['progress','coverage','growler'],

    preprocessors: {
      'src/**/*.js': ['coverage'],
      'src/**/*.html': ['ng-html2js']
    },

    // optionally, configure the reporter
    coverageReporter: {
      type : 'lcov',
      dir : 'coverage/'
    },


    ngHtml2JsPreprocessor: {
      cacheIdFromPath: function(filepath) {
        return filepath.substr(4);
      },
      moduleName: 'templates'
    },


    // web server port
    port: 9876,


    // enable / disable colors in the output (reporters and logs)
    colors: true,


    // level of logging
    // possible values: config.LOG_DISABLE || config.LOG_ERROR || config.LOG_WARN || config.LOG_INFO || config.LOG_DEBUG
    logLevel: config.LOG_INFO,


    // enable / disable watching file and executing tests whenever any file changes
    autoWatch: true,


    // Start these browsers, currently available:
    // - Chrome
    // - ChromeCanary
    // - Firefox
    // - Opera (has to be installed with `npm install karma-opera-launcher`)
    // - Safari (only Mac; has to be installed with `npm install karma-safari-launcher`)
    // - PhantomJS
    // - IE (only Windows; has to be installed with `npm install karma-ie-launcher`)
    browsers: ['PhantomJS'],


    // If browser does not capture in given timeout [ms], kill it
    captureTimeout: 60000,


    // Continuous Integration mode
    // if true, it capture browsers, run tests and exit
    singleRun: false
  });
};
