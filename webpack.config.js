/* global __dirname */
/**
* NOTE in order to build with json-schema-form-core you must
* have it cloned as a sibling directory to this one or npm
* installed with the version you wish to build with.
*/
const fs = require('fs');
const webpack = require('webpack');
const path = require('path');
const package = require('./package.json');
const buildDate = new Date();

var AssimilateDev = fs.existsSync(path.resolve(__dirname, '..', 'assimilate'));
var Assimilate = (AssimilateDev)
    // ? '../Assimilate/dist/package/bundles/Assimilate.js'
    // : 'node_modules/@jsonschema/assimilate/dist/package/bundles/Assimilate.js';
    ? path.join(__dirname, '..', 'Assimilate', 'dist', 'package')
    : '@jsonschema/assimilate';
console.log('Webpack Assimilate:', Assimilate);

var CoreDev = fs.existsSync(path.resolve(__dirname, '..', 'json-schema-form-core'));
var ExtRefs = (CoreDev)
    // ? '../Assimilate/dist/package/bundles/Assimilate.js'
    // : 'node_modules/@jsonschema/assimilate/dist/package/bundles/Assimilate.js';
    ? path.join(__dirname, '..', 'json-schema-form-core', 'dist', 'package', 'src', 'ext')
    : 'json-refs';
console.log('Webpack ExtRefs:', ExtRefs);

console.log('Angular Schema Form v' + package.version);
const plugins = [
  new webpack.BannerPlugin(
    'angular-schema-form\n' +
    '@version ' + package.version + '\n' +
    '@date ' + buildDate.toUTCString() + '\n' +
    '@link https://github.com/json-schema-form/angular-schema-form\n' +
    '@license MIT\n' +
    'Copyright (c) 2014-' + buildDate.getFullYear() + ' JSON Schema Form'),
];

module.exports = {
  context: path.join(__dirname, '.'),
  mode: 'development',
  devtool: 'source-map',
  entry: {
    'angular-schema-form': [
      '@jsonschema/core',
      path.join(__dirname, 'src', 'schema-form.module')
    ]
  },
  output: {
    path: path.join(__dirname, 'dist'),
    filename: '[name].js'
  },
  resolve: {
    alias: {
      '@jsonschema/assimilate': Assimilate,
      '@jsonschema/core': 'json-schema-form-core',
      '@ext': ExtRefs,
    },
    modules: [
      path.join(__dirname, ".."),
      path.join(__dirname, '..', 'assimilate'),
      path.join(__dirname, '..', 'assimilate', 'dist', 'package'),
      path.join(__dirname, "..", "angular-schema-form-bootstrap", "dist"),
      path.join(__dirname, "src"),
      path.join(__dirname, "src", "directives"),
      path.join(__dirname, "src", "services"),
      "node_modules"
    ],
    extensions: [ '.ts', '.js' ]
  },
  target: 'web',
  module: {
    rules: [
      {
        test: /\.js$/,
        use: [{
          loader: 'babel-loader',
          options: {
            presets: [
              [ "es2015", { "modules": false }]
            ]
          }
        }],
        exclude: /(node_modules|json-schema-form-core|assimilate|ajv|djv|tv4|json-refs|..\/*)/
      },
      {
        test: /\.ts/,
        use: [ 'babel-loader', 'ts-loader' ],
        exclude: /(node_modules|json-schema-form-core|assimilate|ajv|djv|tv4|json-refs|..\/*)/
      }
    ]
  },
  externals: {
    'angular': 'var angular',
    // 'json-refs': 'var jsonRefs',
    // 'tv4': 'var tv4',
    // 'ajv': 'var ajv',
    // 'djv': 'var djv',
    'bundle!Assimilate': 'commonjs Assimilate',
    // 'json-refs': { 'commonjs': 'json-refs', 'amd': 'json-refs', 'root': 'json-refs' },
    'bundle!json-schema-form-core': 'commonjs json-schema-form-core',
    'ajv': { 'commonjs': 'ajv', 'amd': 'ajv', 'root': 'ajv' },
    'djv': { 'commonjs': 'djv', 'amd': 'djv', 'root': 'djv' },
    'tv4': { 'commonjs': 'tv4', 'amd': 'tv4', 'root': 'tv4' }
  },
  plugins: plugins
};
