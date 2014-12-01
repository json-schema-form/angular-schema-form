// override the default input to update on blur
angular.module('schemaForm').directive('ngModelOnblur', ['formFormatters', function(formFormatters) {
  return {
    restrict: 'A',
    require: 'ngModel',
    scope: {
      formatterName: "="
    },
    priority: 1, // needed for angular 1.2.x
    link: function(scope, elm, attr, ngModelCtrl) {
      if (attr.type === 'radio' || attr.type === 'checkbox') return;

      var formatter = formFormatters.getFormatter(scope.formatterName) || function (input) {
          return input;
      };

      elm.unbind('input').unbind('keydown').unbind('change');
      elm.bind('blur', function() {
        scope.$apply(function() {
          if (elm.val() === '' && ngModelCtrl.$pristine) {
          } else {
            ngModelCtrl.$setViewValue(formatter(elm.val()));
            ngModelCtrl.$render();
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
            e.preventDefault();
          }
        });

      }
    }
  };
}]);