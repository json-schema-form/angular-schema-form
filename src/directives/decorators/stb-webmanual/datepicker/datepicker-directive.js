angular.module('schemaForm').directive('datepicker', function() {
  return {
    restrict: 'A',
    require : 'ngModel',
    link : function (scope, element, attrs) {
      $(function() {
        /* Unit test*/
        if (!element.datepicker) {
          return;
        }
        element.datepicker({
          dateFormat:'dd/mm/yy',
          setDefaults: $.datepicker.regional.no,
          prevText: '<',
          nextText: '>'
        }).datepicker('setDate', new Date());
      });

    }
  };
});