import angular from 'angular';

/**
 * Directive that handles the model arrays
 */
export default function(sfSelect, sfPath, schemaForm) {
  return {
    scope: true,
    controller: [ '$scope', function SFArrayController($scope) {
      this.key = ($scope.form && $scope.form.key) ? $scope.form.key.splice(0, -2) : [];
    } ],
    link: function(scope, element, attrs) {
      scope.min = 0;

      scope.trackBy = function (item, index) {
        if(item && typeof item === 'object') return item;
        return index;
      };

      scope.modelArray = scope.$eval(attrs.sfNewArray);

      // We need to have a ngModel to hook into validation. It doesn't really play well with
      // arrays though so we both need to trigger validation and onChange.
      // So we watch the value as well. But watching an array can be tricky. We wan't to know
      // when it changes so we can validate,
      let watchFn = function() {
        // scope.modelArray = modelArray;
        scope.modelArray = scope.$eval(attrs.sfNewArray);
        // validateField method is exported by schema-validate
        if (scope.ngModel && scope.ngModel.$pristine && scope.firstDigest &&
            (!scope.options || scope.options.validateOnRender !== true)) {
          return;
        }
        else if (scope.validateField) {
          scope.validateField();
        }
      };

      let onChangeFn = function() {
        if (scope.form && scope.form.onChange) {
          if (angular.isFunction(scope.form.onChange)) {
            scope.form.onChange(scope.modelArray, scope.form);
          }
          else {
            scope.evalExpr(scope.form.onChange, { 'modelValue': scope.modelArray, 'form': scope.form });
          }
        }
      };

      // If model is undefined make sure it gets set.
      let getOrCreateModel = function() {
        let model = scope.modelArray;
        if (!model) {
          let selection = sfPath.parse(attrs.sfNewArray);
          model = [];
          sfSelect(selection, scope, model);
          scope.modelArray = model;
        }
        return model;
      };

      // We need the form definition to make a decision on how we should listen.
      let once = scope.$watch('form', function(form) {
        if (!form) {
          return;
        }

        // Always start with one empty form unless configured otherwise.
        // Special case: don't do it if form has a titleMap
        if (!form.titleMap && form.startEmpty !== true && (!scope.modelArray || scope.modelArray.length === 0)) {
          scope.appendToArray();
        }

        scope.$watch(
          ($scope) => { return JSON.stringify($scope.modelArray); },
          () => { watchFn(); onChangeFn(); }
        );

        // Title Map handling
        // If form has a titleMap configured we'd like to enable looping over
        // titleMap instead of modelArray, this is used for intance in
        // checkboxes. So instead of letiable number of things we like to create
        // a array value from a subset of values in the titleMap.
        // The problem here is that ng-model on a checkbox doesn't really map to
        // a list of values. This is here to fix that.
        if (form.titleMap && form.titleMap.length > 0) {
          scope.titleMapValues = [];

          // We watch the model for changes and the titleMapValues to reflect
          // the modelArray
          let updateTitleMapValues = function(arr) {
            scope.titleMapValues = [];
            arr = arr || [];

            form.titleMap.forEach(function(item) {
              scope.titleMapValues.push(arr.indexOf(item.value) !== -1);
            });
          };

          // Catch default values
          updateTitleMapValues(scope.modelArray);

          // TODO: Refactor and see if we can get rid of this watch by piggy backing on the
          // validation watch.
          scope.$watchCollection('modelArray', updateTitleMapValues);

          // To get two way binding we also watch our titleMapValues
          scope.$watchCollection('titleMapValues', function(vals, old) {
            if (vals && vals !== old) {
              let arr = getOrCreateModel();

              form.titleMap.forEach(function(item, index) {
                let arrIndex = arr.indexOf(item.value);
                if (arrIndex === -1 && vals[index]) {
                  arr.push(item.value);
                };

                if (arrIndex !== -1 && !vals[index]) {
                  arr.splice(arrIndex, 1);
                };
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
        let empty;

        // Create and set an array if needed.
        let model = getOrCreateModel();

        // Same old add empty things to the array hack :(
        if (scope.form && scope.form.schema && scope.form.schema.items) {
          let items = scope.form.schema.items;
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
                    sfSelect(path, empty, prop['default']);
                  }
                });
              }
            }
          }
          else {
            if (items.type) {
              if(items.type.indexOf('array') !== -1) {
                empty = [];
              }
              else if(items.type.indexOf('string') !== -1 || items.type.indexOf('number') !== -1) {
                empty = '';
              }
            }
            // No type? could still have defaults.
            if (!scope.options || scope.options.setSchemaDefaults !== false) {
              empty = items['default'] || empty;
            }
          }
        }
        model.push(empty);

        return model;
      };

      scope.deleteFromArray = function(item) {
        let index = scope.modelArray.indexOf(item);
        let model = scope.modelArray;
        if (model) {
          model.splice(index, 1);
        }

        return model;
      };

      // For backwards compatability, i.e. when a bootstrap-decorator tag is used
      // as child to the array.
      let setIndex = function(index) {
        return function(form) {
          if (form.key) {
            form.key[form.key.indexOf('')] = index;
          }
        };
      };

      let formDefCache = {};
      scope.copyWithIndex = function(index) {
        let form = scope.form;
        if (!formDefCache[index]) {
          // To be more compatible with JSON Form we support an array of items
          // in the form definition of "array" (the schema just a value).
          // for the subforms code to work this means we wrap everything in a
          // section. Unless there is just one.
          let subForm = form.items[0];
          if (form.items.length > 1) {
            subForm = {
              type: 'section',
              items: form.items.map(function(item) {
                item.ngModelOptions = form.ngModelOptions;
                if (angular.isUndefined(item.readonly)) {
                  item.readonly = form.readonly;
                }
                return item;
              }),
            };
          }

          if (subForm) {
            let copy = angular.copy(subForm);
            copy.arrayIndex = index;
            schemaForm.traverseForm(copy, setIndex(index));
            formDefCache[index] = copy;
          }
        }
        return formDefCache[index];
      };
    },
  };
}
