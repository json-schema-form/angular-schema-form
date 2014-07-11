/* global tv4 */
angular.module('schemaForm').directive('schemaValidate',function(){
  return {
    restrict: 'A',
    scope: false,
    require: 'ngModel',
    link: function(scope,element,attrs,ngModel) {
      //Since we have scope false this is the same scope
      //as the decorator
      scope.ngModel = ngModel;

      var error = null;
      var schema  = scope.$eval(attrs.schemaValidate);

      ngModel.$parsers.unshift(function(viewValue) {
        if (!schema) {
          schema = scope.$eval(attrs.schemaValidate);
        }

        //Still might be undefined, especially if form has no schema...
        if (!schema) {
          return viewValue;
        }

        //required is handled by ng-required
        if (angular.isUndefined(viewValue)) {
          return undefined;
        }

        //Type cast and validate against schema.
        //Basic types of json schema sans array and object
        var value = viewValue;
        if (schema.type === 'integer') {
          value = parseInt(value,10);
        } else if (schema.type === 'number') {
          value = parseFloat(value,10);
        } else if (schema.type === 'boolean' && typeof viewValue === 'string') {
          if (viewValue === 'true') {
            value = true;
          } else if (viewValue === 'false') {
            value = false;
          }
        }

        var result = tv4.validateResult(value,schema);
        if (result.valid) {
          // it is valid
          ngModel.$setValidity('schema', true);
          error = null;
          return viewValue;
        } else {
          // it is invalid, return undefined (no model update)
          ngModel.$setValidity('schema', false);
          error = result.error;
          return undefined;
        }
      });

      //This works since we now we're inside a decorator and that this is the decorators scope.
      //If $pristine and empty don't show success (even if it's valid)
      scope.hasSuccess = function(){
        return ngModel.$valid && (!ngModel.$pristine || !ngModel.$isEmpty(ngModel.$modelValue));
      };

      scope.hasError = function(){
        return ngModel.$invalid && !ngModel.$pristine;
      };

      scope.schemaError = function() {
        return error;
      };

    }
  };
});
