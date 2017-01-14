/* global __dirname */
/**
* NOTE in order to build with json-schema-form-core you must
* have it cloned as a sibling directory to this one or npm
* installed with the version you wish to build with.
*/
const webpack = require('webpack');
const path = require('path');
const package = require('./package.json');
const buildDate = new Date();
console.log('Angular Schema Form v' + package.version);
const plugins = [
  new webpack.BannerPlugin(
    'angular-schema-form\n' +
    '@version ' + package.version + '\n' +
    '@date ' + buildDate.toUTCString() + '\n' +
    '@link https://github.com/json-schema-form/angular-schema-form\n' +
    '@license MIT\n' +
    'Copyright (c) 2014-' + buildDate.getFullYear() + ' JSON Schema Form'),
  /* Minification only occurs if the output is named .min */
  new webpack.optimize.UglifyJsPlugin(
    {
      include: /\.min\.js$/,
      minimize: true
    })
];

module.exports = {
  entry: {
    "angular-schema-form": [ 'json-schema-form-core', path.join(__dirname, 'src', 'schema-form.module') ]
  },
  output: {
    path: path.join(__dirname, 'dist'),
    filename: '[name].js'
  },
  resolve: {
    modules: [
      path.join(__dirname, "..", "json-schema-form-core", "dist"),
      path.join(__dirname, "..", "angular-schema-form-bootstrap", "dist"),
      path.join(__dirname, "src"),
      path.join(__dirname, "src", "directives"),
      path.join(__dirname, "src", "services"),
      "node_modules"
    ],
    extensions: [ '.ts', '.js' ]
  },
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
        exclude: /(node_modules|json-schema-form-core)/
      },
      {
        test: /\.ts/,
        use: [ 'babel-loader', 'ts-loader' ],
        exclude: /node_modules/
      }
    ]
  },
  externals: {
    'angular': 'var angular',
    'tv4': 'var tv4',
    'bundle!json-schema-form-core': 'commonjs json-schema-form-core',
  },
  plugins: plugins
};
