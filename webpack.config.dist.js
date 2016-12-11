const config = require('./webpack.config.js');
const path = require('path');
const includes = [
  'json-schema-form-core',
  path.join(__dirname, 'src', 'schema-form.module')
];

config.entry = {
  "angular-schema-form": includes,
  "angular-schema-form.min": includes
}

module.exports = config;
