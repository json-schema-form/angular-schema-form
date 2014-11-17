angular.module('schemaForm').directive('stbDropdown', ['$timeout', function($timeout) {
  return {
    restrict: 'A',
    require : 'ngModel',
    link : function (scope, element, attrs, ngModelCtrl) {
      $timeout(function () {
        $(element).chosen();})
    }
  };
}]);