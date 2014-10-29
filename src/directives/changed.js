/**
 * A version of ng-changed that only listens if
 * there is actually a onChange defined on the form
 *
 * Takes the form definition as argument.
 * If the form definition has a "onChange" defined as either a function or
 */
angular.module('schemaForm').directive('sfChanged', ['sfPath', function(sfPath) {
  return {
    require: 'ngModel',
    restrict: 'AC',
    scope: false,
    link: function(scope, element, attrs, ctrl) {
      var form = scope.$eval(attrs.sfChanged);
      //"form" is really guaranteed to be here since the decorator directive
      //waits for it. But best be sure.
      if (form && form.onChange) {
        scope.$watch('model'+sfPath.normalize(form.key), function(newValue) {
          if (angular.isFunction(form.onChange)) {
            form.onChange(newValue, form);
          } else {
            scope.evalExpr(form.onChange, {'modelValue': newValue, form: form});
          }
        })
      }
    }
  };
}]);
