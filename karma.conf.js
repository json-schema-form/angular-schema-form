// Karma configuration
// Generated on Fri Feb 07 2014 08:31:06 GMT+0100 (CET)

module.exports = function(config) {
  config.set({

    // base path, that will be used to resolve files and exclude
    basePath: '.',


    // frameworks to use
    frameworks: ['mocha','chai-sinon'],


    // list of files / patterns to load in the browser
    files: [
      'http://code.jquery.com/jquery-2.1.0.min.js',
      'https://ajax.googleapis.com/ajax/libs/angularjs/1.2.16/angular.min.js',
      'https://code.angularjs.org/1.2.16/angular-mocks.js',
      'bower_components/tv4/tv4.js',
      'src/module.js',
      'src/services/*.js',
      'src/directives/**/*.js',
      'src/**/*.html',
      'test/*.js'
    ],


    // list of files to exclude
    exclude: [

    ],


    // test results reporter to use
    // possible values: 'dots', 'progress', 'junit', 'growl', 'coverage'
    reporters: ['progress','coverage','growler'],

    preprocessors: {
      'src/*.js': 'coverage',
      'src/**/*.html': 'ng-html2js'
    },

    // optionally, configure the reporter
    coverageReporter: {
      type : 'html',
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
    browsers: [],


    // If browser does not capture in given timeout [ms], kill it
    captureTimeout: 60000,


    // Continuous Integration mode
    // if true, it capture browsers, run tests and exit
    singleRun: false
  });
};
