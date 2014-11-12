angular.module('schemaForm').directive('stbDatepicker', ['$timeout', function($timeout) {
  return {
    restrict: 'A',
    require : 'ngModel',
    priority: 1, // needed for angular 1.2.x
    link : function (scope, element, attrs, ngModelCtrl) {
      element.unbind('input').unbind('keydown').unbind('change');

      if (!$.fn.datetimepicker) {
        return;
      }
      var today = moment();
      var difference =  scope.$eval(attrs.monthlyDifference);


      $(element).parent().datetimepicker({
        pickTime: false,
        language: 'nb',
        format: "DD.MM.YYYY",
        minDate: scope.$eval(attrs.minDate) || scope.$eval(attrs.disableUntilToday) && today.toDate(),
        maxDate: scope.$eval(attrs.maxDate) || difference && moment(today).add(difference, 'Month').toDate()
    }).on('dp.change', function (e) {
        scope.$apply(function () {
          ngModelCtrl.$setViewValue(e.date.toISOString())
        });
      }).on('dp.error', function (e) {
        scope.$apply(function () {
          ngModelCtrl.$setViewValue(undefined);
        });
      });

      $timeout(function () {
        $(element).parent().data("DateTimePicker").setDate(moment(ngModelCtrl.$viewValue).format("DD.MM.YYYY"));
      }, 0);

    }
  };
}]);