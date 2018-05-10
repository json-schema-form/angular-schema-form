// Karma configuration
/* eslint-disable no-var */
var fs = require('fs');
var path = require('path');
var webconf = require('./webpack.config.js');
var origin = fs.existsSync(path.resolve(__dirname, '../angular-schema-form-bootstrap/dist/angular-schema-form-bootstrap.js'));
var include = (origin)
    ? '../angular-schema-form-bootstrap/dist/angular-schema-form-bootstrap.js'
    : 'dist/angular-schema-form-bootstrap.js';

// var AssimilateDev = fs.existsSync(path.resolve(__dirname, '..', 'assimilate'));
// var Assimilate = (AssimilateDev)
//     // ? '../Assimilate/dist/package/bundles/Assimilate.js'
//     // : 'node_modules/@jsonschema/assimilate/dist/package/bundles/Assimilate.js';
//     ? path.join(__dirname, '..', 'assimilate', 'dist')
//     : path.join(__dirname, 'node_modules', '@jsonschema', 'assimilate', 'dist', 'package', 'bundles', 'Assimilate');
// console.log('Assimilate:', Assimilate);

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
      // 'node_modules/angular/index.js',
      // 'node_modules/angular-mocks/index.js',
      // 'node_modules/tv4',
//      'test/lib/loader.js',
//      Assimilate,
      'dist/angular-schema-form.js',
      include,
      'src/**/*.spec.ts',
      // 'src/**/schema-validate.directive.spec.ts',
      // 'src/**/schema-form-decorators.provider.spec.js',
      'src/**/*.spec.js',
      // {
      //   pattern: 'src/**/*.spec.js',
      //   type: 'module',
      //   included: true,
      // },
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
      'src/**/*.ts': [ 'typescript', 'babel' ],
      'src/**/*.js': [ 'babel' ],
    },

    // webpackPreprocessor: webconf,
    babelPreprocessor: {
      options: {
        presets: [ 'env' ],
        sourceMap: 'inline',
        plugins: [ 'transform-es2015-modules-umd' ],
      },
      filename: function (file) {
        return file.originalPath.replace(/\.js$/, '.module.js');
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
    // - ChromeHeadless
    // - Firefox
    // - Opera (has to be installed with `npm install karma-opera-launcher`)
    // - Safari (only Mac; has to be installed with `npm install karma-safari-launcher`)
    // - PhantomJS
    // - IE (only Windows; has to be installed with `npm install karma-ie-launcher`)
    browsers: [ 'ChromeHeadless' ],

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
