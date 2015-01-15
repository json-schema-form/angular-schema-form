angular.module('schemaForm').directive('stbDropdown', ['$timeout', '$parse', function($timeout, $parse) {
  return {
    restrict: 'A',
    require : 'ngModel',
    link : function (scope, element, attrs, ngModelCtrl) {
      var listener = function (e, selected) {
        $.each(scope.form.titleMap, function (index, item) {
          if (selected && item.name === selected.selected) {

            ngModelCtrl.$setViewValue({name: item.name, value: item.value});
            scope.$apply();
          }
        })
      };
      scope.$watch(function () {
        var el = $(element);
        return el.css('display') === 'none';
      }, function (value) {
        if (!value) {
          $(element).chosen({placeholder_text: scope.form.placeholder}).unbind('change', listener).change(listener);
        }
      });
    }
  };
}]);