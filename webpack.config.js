/* global __dirname */
var webpack = require('webpack');
var path = require('path');
var pjson = require('./package.json');
console.log('Angular Schema Form v' + pjson.version);

module.exports = {
  entry: [ './src/module.js' ],
  output: {
    path: path.join(__dirname, 'dist'),
    filename: 'schema-form.js',
    libraryTarget: 'umd'
  },
  resolve: { extensions: [ '', '.js' ] },
  module: {
    loaders: [
      {
        test: /\.js$/,
        include: [ path.join(__dirname, 'src') ],
        loader: 'babel',
      }
    ]
  },
  externals: {
    'angular': 'var angular',
    'tv4': 'var tv4',
  },
  plugins: [
    new webpack.BannerPlugin('angular-schema-form\n@version ' + pjson.version + '\nCopyright (c) 2016 JSON Schema Form')
  ]
};
