angular.module('schemaForm').directive('datepicker', function() {
  return {
    restrict: 'A',
    require : 'ngModel',
    link : function (scope, element, attrs, ngModelCtrl) {
      /* Unit test*/
      if (!$.fn.datetimepicker) {
        return;
      }
      $(element).parent().datetimepicker({
        pickTime: false,
        language: 'no',
        minDate: scope.$eval(attrs.minDate),
        maxDate: scope.$eval(attrs.maxDate)
    }).on('dp.change', function (e) {
        scope.$apply(function () {
          ngModelCtrl.$setViewValue(e.date.toISOString())
        });
      });
    }
  };
});