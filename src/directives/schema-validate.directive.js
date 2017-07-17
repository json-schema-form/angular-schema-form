import angular from 'angular';

/**
 * I am the schema-validate directive
 *
 * @param  {function} sfValidator
 * @param  {function} $parse
 * @param  {function} sfSelect
 * @param  {function} $interpolate
 *
 * @return {object}   I am the directive properties made available to Angular
 */
export default function(sfValidator, $parse, sfSelect, $interpolate) {
  return {
    restrict: 'A',
    scope: false,
    // We want the link function to be *after* the input directives link function so we get access
    // the parsed value, ex. a number instead of a string
    priority: 500,
    require: 'ngModel',
    link: function(scope, element, attrs, ngModel) {
      // We need the ngModelController on several places,
      // most notably for errors.
      // So we emit it up to the decorator directive so it can put it on scope.
      scope.$emit('schemaFormPropagateNgModelController', ngModel);

      let error = null;
      let form = scope.$eval(attrs.schemaValidate);

      // TODO move this out of validate
      let copyTo = (typeof form.copyValueTo === 'string')? [ form.copyValueTo ]: form.copyValueTo;
      if (copyTo && copyTo.length) {
        ngModel.$viewChangeListeners.push(function() {
          let context = {
            'model': scope.model,
            'form': form,
            'arrayIndex': scope.$index,
            'arrayIndices': scope.arrayIndices,
            'path': scope.path,
            '$i': scope.$i,
            '$index': scope.$index,
          };
          angular.forEach(copyTo, function(copyToPath) {
            let path = copyToPath.replace(/\[/g, '[{{ ').replace(/\]/g, ' }}]').replace(/^model\./, '');
            path = $interpolate(path)(context);
            sfSelect(path, scope.model, ngModel.$modelValue);
          });
        });
      };
      // Validate against the schema.

      let validate = function(viewValue, triggered) {
        // Still might be undefined
        if (!form) {
          return viewValue;
        }

        // Omit TV4 validation
        if (scope.options && scope.options.tv4Validation === false) {
          return viewValue;
        }

        let result = sfValidator(form, viewValue);
        // console.log('result is', result)
        // Since we might have different tv4 errors we must clear all
        // errors that start with tv4-
        Object.keys(ngModel.$error)
            .filter(function(k) { return k.indexOf('tv4-') === 0; })
            .forEach(function(k) { ngModel.$setValidity(k, true); });

        if (!result.valid && (!ngModel.$pristine || triggered || scope.options.validateOnRender === true)) {
          // it is invalid, return undefined (no model update)
          ngModel.$setValidity('tv4-' + result.error.code, false);
          error = result.error;

          // In Angular 1.3+ return the viewValue, otherwise we inadvertenly
          // will trigger a 'parse' error.
          // we will stop the model value from updating with our own $validator
          // later.
          if (ngModel.$validators) {
            return viewValue;
          };

          // Angular 1.2 on the other hand lacks $validators and don't add a 'parse' error.
          return undefined;
        };

        return viewValue;
      };

      // Custom validators, parsers, formatters etc
      if (typeof form.ngModel === 'function') {
        form.ngModel(ngModel);
      }

      [ '$parsers', '$viewChangeListeners', '$formatters' ].forEach(function(attr) {
        if (form[attr] && ngModel[attr]) {
          form[attr].forEach(function(fn) {
            ngModel[attr].push(fn);
          });
        }
      });

      [ '$validators', '$asyncValidators' ].forEach(function(attr) {
        // Check if our version of angular has validators, i.e. 1.3+
        if (form[attr] && ngModel[attr]) {
          angular.forEach(form[attr], function(fn, name) {
            ngModel[attr][name] = function(modelValue, viewValue) {
              return fn(modelValue, viewValue, scope.model, form);
            };
          });
        }
      });

      // Get in last of the parses so the parsed value has the correct type.
      // We don't use $validators since we like to set different errors depending tv4 error codes
      ngModel.$parsers.push(validate);

      // But we do use one custom validator in the case of Angular 1.3 to stop the model from
      // updating if we've found an error.
      if (ngModel.$validators) {
        ngModel.$validators.schemaForm = function() {
          // console.log('validators called.')
          // Any error and we're out of here!
          return !Object.keys(ngModel.$error).some(function(e) { return e !== 'schemaForm';});
        };
      }

      let schema = form.schema;

      // A bit ugly but useful.
      scope.validateField = function(formName, triggered) {
        let noField = (formName === undefined);
        // If we have specified a form name, and this model is not within
        // that form, then leave things be.
        if (!noField && ngModel.$$parentForm.$name !== formName) {
          return;
        };

        // Special case: arrays
        // TODO: Can this be generalized in a way that works consistently?
        // Just setting the viewValue isn't enough to trigger validation
        // since it's the same value. This will be better when we drop
        // 1.2 support.
        if (noField || schema && schema.type.indexOf('array') !== -1) {
          validate(ngModel.$modelValue, triggered);
        };

        // We set the viewValue to trigger parsers,
        // since modelValue might be empty and validating just that
        // might change an existing error to a "required" error message.
        if (ngModel.$setDirty) {
          // Angular 1.3+
          ngModel.$setDirty();
          ngModel.$setViewValue(ngModel.$viewValue);
          ngModel.$commitViewValue();

          // In Angular 1.3 setting undefined as a viewValue does not trigger parsers
          // so we need to do a special required check.

          // angulars checkbox directive isEmpty does not do the check we want.
          if (form.type === 'checkbox') {
            if (form.required && ngModel.$modelValue === undefined) {
              ngModel.$setValidity('tv4-302', false);
            };
          }
          else if (form.required && ngModel.$isEmpty(ngModel.$modelValue)) {
            ngModel.$setValidity('tv4-302', false);
          };
        }
        else {
          // Angular 1.2
          // In angular 1.2 setting a viewValue of undefined will trigger the parser.
          // hence required works.
          ngModel.$setViewValue(ngModel.$viewValue);
        }
      };

      let first = true;
      ngModel.$formatters.push(function(val) {
        // When a form first loads this will be called for each field.
        // we usually don't want that.
        if (ngModel.$pristine && first &&
            (!scope.options || scope.options.validateOnRender !== true)) {
          first = false;
          return val;
        }
        validate(ngModel.$modelValue);
        return val;
      });

      // Listen to an event so we can validate the input on request
      scope.$on('schemaFormValidate', function(event, formName) {
        scope.validateField(formName, true);
      });

      scope.schemaError = function() {
        return error;
      };
    },
  };
}
