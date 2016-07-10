import angular from 'angular';

import {sfPath} from 'json-schema-form-core';

export default function() {
  // expose the methods in sfPathProvider
  this.parse = sfPath.parse;
  this.stringify = sfPath.stringify;
  this.normalize = sfPath.normalize;

  this.$get = function() {
    return sfPath;
  };
}
