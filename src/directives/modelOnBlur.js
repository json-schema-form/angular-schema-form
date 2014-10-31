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
    }
  };
});