angular.module('schemaForm').directive('stbDropdown', ['$timeout', '$parse', function($timeout, $parse) {
  return {
    restrict: 'A',
    require : 'ngModel',
    link : function (scope, element, attrs, ngModelCtrl) {
      var listener = function (e, selected) {
        $.each(scope.form.titleMap, function (index, item) {
          if (selected && item.name === selected.selected) {

            ngModelCtrl.$setViewValue({name: item.name, value: item.value});
          }
        })
      };
      scope.$watch(function () {
        var el = $(element);
        return el.css('display') === 'none' || el.width() === 0;
      }, function (value) {
        if (!value) {
          $(element).chosen().unbind('change', listener).change(listener);
        }
      });
    }
  };
}]);