// Karma configuration
/* eslint-disable no-var */
var fs = require('fs');
var path = require('path');
var origin = fs.existsSync(path.resolve(__dirname, '../angular-schema-form-bootstrap/dist/angular-schema-form-bootstrap.js'));
var include = (origin)
    ? '../angular-schema-form-bootstrap/dist/angular-schema-form-bootstrap.js'
    : 'dist/angular-schema-form-bootstrap.js';
console.log('Karma bootstrap:' + origin);

module.exports = function(config) {
  config.set({
    // base path, that will be used to resolve files and exclude
    basePath: '.',

    // frameworks to use
    frameworks: [ 'mocha', 'chai-sinon' ],

    // list of files / patterns to load in the browser
    files: [
      'node_modules/babel-polyfill/dist/polyfill.js',
      'bower_components/jquery/dist/jquery.min.js',
      'test/lib/angular.js',
      'test/lib/angular-mocks.js',
      'bower_components/tv4/tv4.js',
      'dist/angular-schema-form.js',
      include,
      'src/**/*.spec.js',
//      'src/**/sf-schema.directive.spec.js'
    ],

    // list of files to exclude
    exclude: [],

    // test results reporter to use
    // possible values: 'dots', 'progress', 'junit', 'growl', 'coverage'
    reporters: [ 'mocha', 'coverage', 'growler' ],

    mochaReporter: {
      showDiff: true,
    },

    preprocessors: {
      'src/**/*.js': [ 'coverage' ],
    },
    babelPreprocessor: {
      options: {
        presets: [ 'es2015' ],
        sourceMap: 'inline',
      },
      filename: function (file) {
        return file.originalPath.replace(/\.js$/, '.es5.js');
      },
      sourceFileName: function (file) {
        return file.originalPath;
      },
    },

    // optionally, configure the reporter
    coverageReporter: {
      type: 'lcov',
      dir: 'coverage/',
    },

    // web server port
    port: 9876,

    // enable / disable colors in the output (reporters and logs)
    colors: true,

    // level of logging
    // possible values:
    // config.LOG_DISABLE || config.LOG_ERROR || config.LOG_WARN ||
    // config.LOG_INFO || config.LOG_DEBUG
    logLevel: config.LOG_DEBUG,

    loggers: [{ type: 'console' }],

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
    browsers: [ 'PhantomJS' ],

    // If browser does not capture in given timeout [ms], kill it
    captureTimeout: 60000,

    client: {
      captureConsole: true,
    },
    // Continuous Integration mode
    // if true, it capture browsers, run tests and exit
    singleRun: false,
  });
};
