/**
 * Directive that handles the model arrays
 */
angular.module('schemaForm').directive('sfArray', ['sfSelect','schemaForm',
function(sfSelect, schemaForm) {

  var setIndex = function(index) {
    return function(form) {
      if (form.key) {
        form.key = form.key.replace('[]','['+index+']');
      }
    };
  };

  return {
    restrict: 'A',
    scope: true,
    link: function(scope, element, attrs) {
      var formDefCache = {};

      // Watch for the form definition and then rewrite it.
      // It's the (first) array part of the key, '[]' that needs a number
      // corresponding to an index of the form.
      var once = scope.$watch(attrs.sfArray, function(form) {

        // An array model always needs a key so we know what part of the model
        // to look at. This makes us a bit incompatible with JSON Form, on the
        // other hand it enables two way binding.
        var list = sfSelect(form.key,scope.model);

        // Since ng-model happily creates objects in a deep path when setting a
        // a value but not arrays we need to create the array.
        if (angular.isUndefined(list)) {
          list = [];
          sfSelect(form.key, scope.model, list);
        }
        scope.modelArray = list;

        // To be more compatible with JSON Form we support an array of items
        // in the form definition of "array" (the schema just a value).
        // for the subforms code to work this means we wrap everything in a
        // section. Unless there is just one.
        var subForm = form.items[0];
        if (form.items.length > 1) {
          subForm = { type: 'section', items: form.items };
        }

        // We ceate copies of the form on demand, caching them for
        // later requests
        scope.copyWithIndex = function(index) {
          if (!formDefCache[index]) {
            if (subForm) {
              var copy = angular.copy(subForm);
              copy.arrayIndex= index;
              schemaForm.traverseForm(copy, setIndex(index));
              formDefCache[index] = copy;
            }
          }
          return formDefCache[index];
        };


        scope.appendToArray = function() {
          var len = list.length;
          var copy = scope.copyWithIndex(len);
          schemaForm.traverseForm(copy, function(part){
            if (part.key && angular.isDefined(part.default)) {
              sfSelect(part.key, scope.model, part.default);
            }
          });

          // If there are no defaults nothing is added so we need to initialize
          // the array. null for basic values, {} or [] for the others.
          if (len === list.length) {
            var type = sfSelect('schema.items.type',form);
            var dflt = null;
            if (type === 'object') {
              dflt = {};
            } else if (type === 'array') {
              dflt = [];
            }
            list.push(dflt);
          }
        };

        scope.deleteFromArray = function(index) {
          list.splice(index,1);
        };

        // Always start with one empty form unless configured otherwise.
        if (form.startEmpty !== true && list.length === 0) {
          scope.appendToArray();
        }

        once();
      });
    }
  };
}]);
