// var JSONSchemaFormCore = require('../../json-schema-form-core/dist/json-schema-form-core');
// import JSONSchemaFormCore from 'json-schema-form-core';
import { sfPath } from 'json-schema-form-core';
import angular from 'angular';

export default class sfPathProviderClass {
  constructor() {
    this.name = sfPath.name;
    this.parse = sfPath.parse;
    this.stringify = sfPath.stringify;
    this.normalize = sfPath.normalize;
  }

  $get() {
    return sfPath;
  }
}
