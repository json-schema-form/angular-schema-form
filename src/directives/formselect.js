/**
 * Directive that handles the model arrays
 */
angular.module('schemaForm').directive('sfFormSelect', ['sfSelect', 'schemaForm', 'sfValidator', 'sfPath',
  function(sfSelect, schemaForm, sfValidator, sfPath) {

    return {
      restrict: 'A',
      scope: true,
      require: '?ngModel',
      link: function(scope, element, attrs, ngModel) {
        scope.selectedForm = 0;
        // TODO: Watch the model value and pick a form to match it
      }
    };
  }
]);
