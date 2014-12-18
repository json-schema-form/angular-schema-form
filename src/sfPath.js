angular.module('schemaForm').provider('sfPath',
[function() {
  var sfPath = {parse: ObjectPath.parse};

  // if we're on Angular 1.2.x, we need to continue using dot notation
  if (angular.version.major === 1 && angular.version.minor < 3) {
    sfPath.stringify = function(arr) {
      return Array.isArray(arr) ? arr.join('.') : arr.toString();
    };
  } else {
    sfPath.stringify = ObjectPath.stringify;
  }

  // We want this to use whichever stringify method is defined above,
  // so we have to copy the code here.
  sfPath.normalize = function(data, quote) {
    return sfPath.stringify(Array.isArray(data) ? data : sfPath.parse(data), quote);
  };

  // expose the methods in sfPathProvider
  this.parse = sfPath.parse;
  this.stringify = sfPath.stringify;
  this.normalize = sfPath.normalize;

  this.$get = function() {
    return sfPath;
  };
}]);
