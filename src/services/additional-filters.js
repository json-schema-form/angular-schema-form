// override the default input to update on blur
angular.module('schemaForm').filter('reduceMessage', [function() {
  return function (input) {
    if (angular.isArray(input)) {
      return input.join('<br>');
    } else {
      return input;
    }
  }
}]);