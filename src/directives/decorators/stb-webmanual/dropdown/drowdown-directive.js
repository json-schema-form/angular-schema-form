angular.module('schemaForm').directive('stbDropdown', ['$timeout', '$parse', function($timeout, $parse) {
  return {
    restrict: 'A',
    require : 'ngModel',
    link : function (scope, element, attrs, ngModelCtrl) {
      scope.$watch(function () {
        var el = $(element);
        return el.css('display') === 'none' || el.width() === 0;
      }, function (value) {
        if (!value) {
          $(element).chosen().unbind('change').change(function (e, selected) {
            $.each(scope.form.titleMap, function (index, item) {
                if (item.name === selected.selected) {

                  ngModelCtrl.$setViewValue({name: item.name, value: item.value});
                }
            })
          });
        }
      });
    }
  };
}]);