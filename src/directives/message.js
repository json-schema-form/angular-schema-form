angular.module('schemaForm').directive('sfMessage',
['sfErrorMessage', function(sfErrorMessage) {
  return {
    scope: false,
    restrict: 'EA',
    template: '<div ng-if="!error && form.description" ng-bind-html="form.description"></div><div ng-if="error" ng-bind-html="error"></div>',
    link: function(scope) {

      scope.$watchCollection('ngModel.$error', function(errors) {

        errors = Object.keys(errors);

        // We only show one error.
        // TODO: Make that optional
        var error = errors[0];

        scope.error = error ?
          sfErrorMessage.interpolate(
            error,
            scope.ngModel.$modelValue,
            scope.ngModel.$viewValue,
            scope.form,
            !!(scope.options && scope.options.validationMessage)
          )
          : null;
      });

    }
  };
}]);
