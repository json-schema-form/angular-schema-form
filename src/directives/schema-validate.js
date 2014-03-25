/* global tv4 */
angular.module('schemaForm').directive('schemaValidate',function(){
  return {
    restrict: 'A',
    scope: false,
    require: 'ngModel',
    link: function(scope,element,attrs,ngModel) {
      scope.ngModel = ngModel;
      var schema  = scope.$eval(attrs.schemaValidate);

      ngModel.$parsers.unshift(function(viewValue) {
        if (!schema) {
          schema = scope.$eval(attrs.schemaValidate);
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
          return viewValue;
        } else {
          // it is invalid, return undefined (no model update)
          ngModel.$setValidity('schema', false);
          scope.schemaError = result.error.message;
          return undefined;
        }
      });

      //This works since we now we're inside a decorator and that this is the decorators scope.
      scope.hasError = function(){
        return scope.ngModel.$invalid && !scope.ngModel.$pristine;
      };

    }
  };
});