angular.module('schemaForm').directive('stbDropdown', ['$timeout', function($timeout) {
  return {
    restrict: 'A',
    require : 'ngModel',
    link : function (scope, element, attrs, ngModelCtrl) {
      scope.$watch(function () {
        var el = $(element);
        return el.css('display') === 'none' || el.width() === 0;
      }, function (value) {
        if (!value) {
          $(element).chosen();
        }
      });
    }
  };
}]);