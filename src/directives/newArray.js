/**
 * Directive that handles the model arrays
 */
angular.module('schemaForm').directive('sfNewArray', ['sfSelect', 'sfPath', 'schemaForm',
function(sel, sfPath, schemaForm) {
  return {
    scope: false,
    link: function(scope, element, attrs) {
      scope.min = 0;

      scope.modelArray = scope.$eval(attrs.sfNewArray);

      // We need to have a ngModel to hook into validation. It doesn't really play well with
      // arrays though so we both need to trigger validation and onChange.
      // So we watch the value as well. But watching an array can be tricky. We wan't to know
      // when it changes so we can validate,
      var watchFn =  function() {
        //scope.modelArray = modelArray;
        scope.modelArray = scope.$eval(attrs.sfNewArray);
        // validateField method is exported by schema-validate
        if (scope.ngModel && scope.ngModel.$pristine && scope.firstDigest &&
            (!scope.options || scope.options.validateOnRender !== true)) {
          return;
        } else if (scope.validateField) {
          scope.validateField();
        }
      };

      var onChangeFn =  function() {
        if (scope.form && scope.form.onChange) {
          if (angular.isFunction(scope.form.onChange)) {
            scope.form.onChange(scope.modelArray, scope.form);
          } else {
            scope.evalExpr(scope.form.onChange, {'modelValue': scope.modelArray, form: scope.form});
          }
        }
      };

      // If model is undefined make sure it gets set.
      var getOrCreateModel = function() {
        var model = scope.modelArray;
        if (!model) {
          var selection = sfPath.parse(attrs.sfNewArray);
          model = [];
          sel(selection, scope, model);
          scope.modelArray = model;
        }
        return model;
      };

      // We need the form definition to make a decision on how we should listen.
      var once = scope.$watch('form', function(form) {
        if (!form) {
          return;
        }

        // Always start with one empty form unless configured otherwise.
        // Special case: don't do it if form has a titleMap
        if (!form.titleMap && form.startEmpty !== true && (!scope.modelArray || scope.modelArray.length === 0)) {
          scope.appendToArray();
        }

        // If we have "uniqueItems" set to true, we must deep watch for changes.
        if (scope.form && scope.form.schema && scope.form.schema.uniqueItems === true) {
          scope.$watch(attrs.sfNewArray, watchFn, true);

          // We still need to trigger onChange though.
          scope.$watch([attrs.sfNewArray, attrs.sfNewArray + '.length'], onChangeFn);

        } else {
          // Otherwise we like to check if the instance of the array has changed, or if something
          // has been added/removed.
          if (scope.$watchGroup) {
            scope.$watchGroup([attrs.sfNewArray, attrs.sfNewArray + '.length'], function() {
              watchFn();
              onChangeFn();
            });
          } else {
            // Angular 1.2 support
            scope.$watch(attrs.sfNewArray, function() {
              watchFn();
              onChangeFn();
            });
            scope.$watch(attrs.sfNewArray + '.length', function() {
              watchFn();
              onChangeFn();
            });
          }
        }

        // Title Map handling
        // If form has a titleMap configured we'd like to enable looping over
        // titleMap instead of modelArray, this is used for intance in
        // checkboxes. So instead of variable number of things we like to create
        // a array value from a subset of values in the titleMap.
        // The problem here is that ng-model on a checkbox doesn't really map to
        // a list of values. This is here to fix that.
        if (form.titleMap && form.titleMap.length > 0) {
          scope.titleMapValues = [];

          // We watch the model for changes and the titleMapValues to reflect
          // the modelArray
          var updateTitleMapValues = function(arr) {
            scope.titleMapValues = [];
            arr = arr || [];

            form.titleMap.forEach(function(item) {
              scope.titleMapValues.push(arr.indexOf(item.value) !== -1);
            });
          };
          //Catch default values
          updateTitleMapValues(scope.modelArray);

          // TODO: Refactor and see if we can get rid of this watch by piggy backing on the
          // validation watch.
          scope.$watchCollection('modelArray', updateTitleMapValues);

          //To get two way binding we also watch our titleMapValues
          scope.$watchCollection('titleMapValues', function(vals, old) {
            if (vals && vals !== old) {
              var arr = getOrCreateModel();

              // Apparently the fastest way to clear an array, readable too.
              // http://jsperf.com/array-destroy/32
              while (arr.length > 0) {
                arr.pop();
              }
              form.titleMap.forEach(function(item, index) {
                if (vals[index]) {
                  arr.push(item.value);
                }
              });

              // Time to validate the rebuilt array.
              // validateField method is exported by schema-validate
              if (scope.validateField) {
                scope.validateField();
              }
            }
          });
        }

        once();
      });

      scope.appendToArray = function() {
        var empty;

        // Create and set an array if needed.
        var model = getOrCreateModel();

        // Same old add empty things to the array hack :(
        if (scope.form && scope.form.schema && scope.form.schema.items) {

          var items = scope.form.schema.items;
          if (items.type && items.type.indexOf('object') !== -1) {
            empty = {};

            // Check for possible defaults
            if (!scope.options || scope.options.setSchemaDefaults !== false) {
              empty = angular.isDefined(items['default']) ? items['default'] : empty;

              // Check for defaults further down in the schema.
              // If the default instance sets the new array item to something falsy, i.e. null
              // then there is no need to go further down.
              if (empty) {
                schemaForm.traverseSchema(items, function(prop, path) {
                  if (angular.isDefined(prop['default'])) {
                    sel(path, empty, prop['default']);
                  }
                });
              }
            }

          } else if (items.type && items.type.indexOf('array') !== -1) {
            empty = [];
            if (!scope.options || scope.options.setSchemaDefaults !== false) {
              empty = items['default'] || empty;
            }
          } else {
            // No type? could still have defaults.
            if (!scope.options || scope.options.setSchemaDefaults !== false) {
              empty = items['default'] || empty;
            }
          }
        }
        model.push(empty);

        return model;
      };

      scope.deleteFromArray = function(index) {
        var model = scope.modelArray;
        if (model) {
          model.splice(index, 1);
        }
        return model;
      };

      // For backwards compatability, i.e. when a bootstrap-decorator tag is used
      // as child to the array.
      var setIndex = function(index) {
        return function(form) {
          if (form.key) {
            form.key[form.key.indexOf('')] = index;
          }
        };
      };
      var formDefCache = {};
      scope.copyWithIndex = function(index) {
        var form = scope.form;
        if (!formDefCache[index]) {

          // To be more compatible with JSON Form we support an array of items
          // in the form definition of "array" (the schema just a value).
          // for the subforms code to work this means we wrap everything in a
          // section. Unless there is just one.
          var subForm = form.items[0];
          if (form.items.length > 1) {
            subForm = {
              type: 'section',
              items: form.items.map(function(item) {
                item.ngModelOptions = form.ngModelOptions;
                if (angular.isUndefined(item.readonly)) {
                  item.readonly = form.readonly;
                }
                return item;
              })
            };
          }

          if (subForm) {
            var copy = angular.copy(subForm);
            copy.arrayIndex = index;
            schemaForm.traverseForm(copy, setIndex(index));
            formDefCache[index] = copy;
          }
        }
        return formDefCache[index];
      };

    }
  };
}]);
