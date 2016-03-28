/* global __dirname */
// var webpack = require('webpack');
var path = require('path');

module.exports = {
  entry: ['./src/module.js'],
  output: {
    path: path.join(__dirname, 'dist'),
    filename: 'schema-form.js',
    libraryTarget: 'umd'
  },
  resolve: {extensions: ['', '.js']},
  module: {
    loaders: [
      {
        test: /\.js$/,
        include: [path.join(__dirname, 'src')],
        loader: 'babel',
      }
    ]
  },
  externals: {
    'angular': 'var angular',
    'tv4': 'var tv4',
  }
};
