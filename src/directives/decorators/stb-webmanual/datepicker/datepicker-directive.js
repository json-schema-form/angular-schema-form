angular.module('schemaForm').directive('datepicker', function() {
  return {
    restrict: 'A',
    require : 'ngModel',
    link : function (scope, element, attrs, ngModelCtrl) {
      /* Unit test*/
      if (!$.datepicker) {
        return;
      }
      $(element).datepicker({
        dateFormat:'dd/mm/yy',
        setDefaults: $.datepicker.regional.no,
        prevText: '<',
        nextText: '>',
        onSelect:function (date) {
          ngModelCtrl.$setViewValue(date);
          scope.$apply();

        }
      }).datepicker('setDate', new Date());

    }
  };
});