// override the default input to update on blur
angular.module('schemaForm').directive('ngModelOnblur', function() {
  return {
    restrict: 'A',
    require: 'ngModel',
    priority: 1, // needed for angular 1.2.x
    link: function(scope, elm, attr, ngModelCtrl) {
      if (attr.type === 'radio' || attr.type === 'checkbox') return;

      elm.unbind('input').unbind('keydown').unbind('change');
      elm.bind('blur', function() {
        scope.$apply(function() {
          if (elm.val() === '' && ngModelCtrl.$pristine) {
          } else {
            ngModelCtrl.$setViewValue(elm.val());
          }
        });
      });

      var maxLength = scope.$eval(attr.modelMaxLength);

      if (angular.isDefined(maxLength)) {

        elm.bind('keydown', function (e) {
          var charCode = e.which;
          var nonPrintableAllowed =
              charCode < 32
              || (charCode > 34 && charCode < 41) // home, end, arrows
              || charCode === 46; // delete

          if (nonPrintableAllowed) {
            return true;
          }

          if (elm.val().length >= maxLength) {
            return false;
          }
        });

      }
    }
  };
});