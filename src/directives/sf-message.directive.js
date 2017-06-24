import angular from 'angular';

/**
 * I am the messages directive for description and error message handling
 *
 * @param  {object} $injector I am the Angular injector for optional dependencies
 * @param  {object} sfErrorMessage I contain the interpolation function for messages
 *
 * @return {object} I am the message directive API
 */
export default function($injector, sfErrorMessage) {
  // Inject sanitizer if it exists
  let $sanitize = $injector.has('$sanitize') ?
                  $injector.get('$sanitize') : function(html) { return html; };

  return {
    scope: false,
    restrict: 'EA',
    link: function(scope, element, attrs) {
      let message = '';
      if (attrs.sfMessage) {
        scope.$watch(attrs.sfMessage, function(msg) {
          if (msg) {
            message = $sanitize(msg);
            update(!!scope.ngModel);
          }
        });
      }

      let currentMessage;
      // Only call html() if needed.
      let setMessage = function(msg) {
        if (msg !== currentMessage) {
          element.html(msg);
          currentMessage = msg;
        }
      };

      let update = function(checkForErrors) {
        if (checkForErrors) {
          if (!scope.hasError()) {
            setMessage(message);
          }
          else {
            let errors = [];
            angular.forEach(scope.ngModel && scope.ngModel.$error, function(status, code) {
              if (status) {
                // if true then there is an error
                // Angular 1.3 removes properties, so we will always just have errors.
                // Angular 1.2 sets them to false.
                errors.push(code);
              }
            });

            // In Angular 1.3 we use one $validator to stop the model value from getting updated.
            // this means that we always end up with a 'schemaForm' error.
            errors = errors.filter(function(e) { return e !== 'schemaForm'; });

            // We only show one error.
            // TODO: Make that optional
            let error = errors[0];

            if (error) {
              setMessage(sfErrorMessage.interpolate(
                error,
                scope.ngModel.$modelValue,
                scope.ngModel.$viewValue,
                scope.form,
                scope.options && scope.options.validationMessage
              ));
            }
            else {
              setMessage(message);
            }
          }
        }
        else {
          setMessage(message);
        }
      };

      // Update once.
      update();

      let once = scope.$watch('ngModel', function(ngModel) {
        if (ngModel) {
          // We also listen to changes of the model via parsers and formatters.
          // This is since both the error message can change and given a pristine
          // option to not show errors the ngModel.$error might not have changed
          // but we're not pristine any more so we should change!
          ngModel.$parsers.push(function(val) { update(true); return val; });
          ngModel.$formatters.push(function(val) { update(true); return val; });
          once();
        }
      });

      // We watch for changes in $error
      scope.$watchCollection('ngModel.$error', function() {
        update(!!scope.ngModel);
      });
    },
  };
}
