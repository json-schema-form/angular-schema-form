/**
 * Directive that handles the model arrays
 */
angular.module('schemaForm').directive('sfArray', ['sfSelect', 'schemaForm', 'sfValidator', 'sfPath',
  function(sfSelect, schemaForm, sfValidator, sfPath) {

    var setIndex = function(index) {
      return function(form) {
        if (form.key) {
          form.key[form.key.indexOf('')] = index;
        }
      };
    };

    return {
      restrict: 'A',
      scope: true,
      require: '?ngModel',
      link: function(scope, element, attrs, ngModel) {
        var formDefCache = {};

        scope.validateArray = angular.noop;

        if (ngModel) {
          // We need the ngModelController on several places,
          // most notably for errors.
          // So we emit it up to the decorator directive so it can put it on scope.
          scope.$emit('schemaFormPropagateNgModelController', ngModel);
        }


        // Watch for the form definition and then rewrite it.
        // It's the (first) array part of the key, '[]' that needs a number
        // corresponding to an index of the form.
        var once = scope.$watch(attrs.sfArray, function(form) {

          // An array model always needs a key so we know what part of the model
          // to look at. This makes us a bit incompatible with JSON Form, on the
          // other hand it enables two way binding.
          var list = sfSelect(form.key, scope.model);

          // We only modify the same array instance but someone might change the array from
          // the outside so let's watch for that. We use an ordinary watch since the only case
          // we're really interested in is if its a new instance.
          scope.$watch('model' + sfPath.normalize(form.key), function(value) {
            list = scope.modelArray = value;
          });

          // Since ng-model happily creates objects in a deep path when setting a
          // a value but not arrays we need to create the array.
          if (angular.isUndefined(list)) {
            list = [];
            sfSelect(form.key, scope.model, list);
          }
          scope.modelArray = list;

          // Arrays with titleMaps, i.e. checkboxes doesn't have items.
          if (form.items) {

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

          }

          // We ceate copies of the form on demand, caching them for
          // later requests
          scope.copyWithIndex = function(index) {
            if (!formDefCache[index]) {
              if (subForm) {
                var copy = angular.copy(subForm);
                copy.arrayIndex = index;
                schemaForm.traverseForm(copy, setIndex(index));
                formDefCache[index] = copy;
              }
            }
            return formDefCache[index];
          };

          scope.appendToArray = function() {
            var len = list.length;
            var copy = scope.copyWithIndex(len);
            schemaForm.traverseForm(copy, function(part) {

              if (part.key) {
                var def;
                if (angular.isDefined(part['default'])) {
                  def = part['default'];
                }
                if (angular.isDefined(part.schema) &&
                    angular.isDefined(part.schema['default'])) {
                  def = part.schema['default'];
                }

                if (angular.isDefined(def)) {
                  sfSelect(part.key, scope.model, def);
                }
              }
            });

            // If there are no defaults nothing is added so we need to initialize
            // the array. undefined for basic values, {} or [] for the others.
            if (len === list.length) {
              var type = sfSelect('schema.items.type', form);
              var dflt;
              if (type === 'object') {
                dflt = {};
              } else if (type === 'array') {
                dflt = [];
              }
              list.push(dflt);
            }

            // Trigger validation.
            scope.validateArray();
            return list;
          };

          scope.deleteFromArray = function(index) {
            list.splice(index, 1);

            // Trigger validation.
            scope.validateArray();

            // Angular 1.2 lacks setDirty
            if (ngModel && ngModel.$setDirty) {
              ngModel.$setDirty();
            }
            return list;
          };

          // Always start with one empty form unless configured otherwise.
          // Special case: don't do it if form has a titleMap
          if (!form.titleMap && form.startEmpty !== true && list.length === 0) {
            scope.appendToArray();
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
            scope.$watchCollection('modelArray', updateTitleMapValues);

            //To get two way binding we also watch our titleMapValues
            scope.$watchCollection('titleMapValues', function(vals, old) {
              if (vals && vals !== old) {
                var arr = scope.modelArray;

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
                scope.validateArray();
              }
            });
          }

          // If there is a ngModel present we need to validate when asked.
          if (ngModel) {
            var error;

            scope.validateArray = function() {
              // The actual content of the array is validated by each field
              // so we settle for checking validations specific to arrays

              // Since we prefill with empty arrays we can get the funny situation
              // where the array is required but empty in the gui but still validates.
              // Thats why we check the length.
              var result = sfValidator.validate(
                form,
                scope.modelArray.length > 0 ? scope.modelArray : undefined
              );

              // TODO: DRY this up, it has a lot of similarities with schema-validate
              // Since we might have different tv4 errors we must clear all
              // errors that start with tv4-
              Object.keys(ngModel.$error)
                    .filter(function(k) { return k.indexOf('tv4-') === 0; })
                    .forEach(function(k) { ngModel.$setValidity(k, true); });

              if (result.valid === false &&
                  result.error &&
                  (result.error.dataPath === '' ||
                  result.error.dataPath === '/' + form.key[form.key.length - 1])) {

                // Set viewValue to trigger $dirty on field. If someone knows a
                // a better way to do it please tell.
                ngModel.$setViewValue(scope.modelArray);
                error = result.error;
                ngModel.$setValidity('tv4-' + result.error.code, false);
              }
            };

            scope.$on('schemaFormValidate', scope.validateArray);

            scope.hasSuccess = function() {
              return ngModel.$valid && !ngModel.$pristine;
            };

            scope.hasError = function() {
              return ngModel.$invalid;
            };

            scope.schemaError = function() {
              return error;
            };

          }

          once();
        });
      }
    };
  }
]);
