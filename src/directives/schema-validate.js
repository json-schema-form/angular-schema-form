angular.module('schemaForm').directive('schemaValidate', ['sfValidator', function(sfValidator) {
  return {
    restrict: 'A',
    scope: false,
    require: 'ngModel',
    link: function(scope, element, attrs, ngModel) {
      //Since we have scope false this is the same scope
      //as the decorator
      scope.ngModel = ngModel;

      var error = null;
      var form   = scope.$eval(attrs.schemaValidate);
      // Validate against the schema.
      var validate = function(viewValue) {
        if (!form) {
          form = scope.$eval(attrs.schemaValidate);
        }

        //Still might be undefined
        if (!form) {
          return viewValue;
        }

        // Is required is handled by ng-required?
        if (angular.isDefined(attrs.ngRequired) && angular.isUndefined(viewValue)) {
          return undefined;
        }

        // An empty field gives us the an empty string, which JSON schema
        // happily accepts as a proper defined string, but an empty field
        // for the user should trigger "required". So we set it to undefined.
        if (viewValue === '') {
          viewValue = undefined;
        }

        var result = sfValidator.validate(form, viewValue);

        if (result.valid) {
          // it is valid
          ngModel.$setValidity('schema', true);
          return viewValue;
        } else {
          // it is invalid, return undefined (no model update)
          ngModel.$setValidity('schema', false);
          error = result.error;
          return undefined;
        }
      };

      // Unshift onto parsers of the ng-model.
      ngModel.$parsers.unshift(validate);

      // Listen to an event so we can validate the input on request
      scope.$on('schemaFormValidate', function() {

        if (ngModel.$commitViewValue) {
          ngModel.$commitViewValue(true);
        } else {
          ngModel.$setViewValue(ngModel.$viewValue);
        }
      });

      //This works since we now we're inside a decorator and that this is the decorators scope.
      //If $pristine and empty don't show success (even if it's valid)
      scope.hasSuccess = function() {
        return ngModel.$valid && (!ngModel.$pristine || !ngModel.$isEmpty(ngModel.$modelValue));
      };

      scope.hasError = function() {
        return ngModel.$invalid && !ngModel.$pristine;
      };

      scope.schemaError = function() {
        return error;
      };

    }
  };
}]);
