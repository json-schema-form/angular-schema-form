import angular from 'angular';

/**
 * A version of ng-changed that only listens if
 * there is actually a onChange defined on the form
 *
 * Takes the form definition as argument.
 * If the form definition has a "onChange" defined as either a function or
 */
export default function() {
  return {
    require: 'ngModel',
    restrict: 'AC',
    scope: false,
    link: function(scope, element, attrs, ctrl) {
      let form = scope.$eval(attrs.sfChanged);
      // "form" is really guaranteed to be here since the decorator directive
      // waits for it. But best be sure.
      if (form && form.onChange) {
        ctrl.$viewChangeListeners.push(function() {
          if (angular.isFunction(form.onChange)) {
            form.onChange(ctrl.$modelValue, form);
          }
          else {
            scope.evalExpr(form.onChange, {
              'modelValue': ctrl.$modelValue,
              'form': form,
              'arrayIndex': scope.$index,
              'arrayIndices': scope.arrayIndices,
              'path': scope.path,
              '$i': scope.$i,
              '$index': scope.$index,
            });
          }
        });
      }
    },
  };
}
