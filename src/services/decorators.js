angular.module('schemaForm').provider('schemaFormDecorators',
['$compileProvider', 'sfPathProvider', function($compileProvider, sfPathProvider) {
  var defaultDecorator = '';
  var directives = {};

  var templateUrl = function(name, form) {
    //schemaDecorator is alias for whatever is set as default
    if (name === 'sfDecorator') {
      name = defaultDecorator;
    }

    var directive = directives[name];

    //rules first
    var rules = directive.rules;
    for (var i = 0; i < rules.length; i++) {
      var res = rules[i](form);
      if (res) {
        return res;
      }
    }

    //then check mapping
    if (directive.mappings[form.type]) {
      return directive.mappings[form.type];
    }

    //try default
    return directive.mappings['default'];
  };


  var addDotOrHashNotaion = function (name) {
    if (/^#/.test(name)) {
      return '[\'' + name + '\']';
    } else {
      return '.' + name;
    }
  };

  var createModelName = function (form, defGlobals, key) {
    var res = '';
    if (angular.isDefined(form.schema)) {
      var visibility = form.schema.visibility || defGlobals.visibility;
      var prefix = defGlobals.prefix || '';

      if (visibility) {
        res += addDotOrHashNotaion(prefix + visibility);
      }

      var category = form.schema.category || defGlobals.category;

      if (category) {
        res += addDotOrHashNotaion(prefix + category);
      }
    }

    res += (key[0] !== '[' ? '.' : '') + key;

    return 'model' + res;

  };

  var createDirective = function(name) {
    $compileProvider.directive(name, ['$parse', '$compile', '$http', '$templateCache', 'scrollingTop', '$timeout', '$filter',
      function($parse,  $compile,  $http,  $templateCache, scrollingTop, $timeout, $filter) {

        return {
          restrict: 'AE',
          replace: false,
          transclude: false,
          scope: true,
          require: '?^sfSchema',
          link: function(scope, element, attrs, sfSchema) {
            //rebind our part of the form to the scope.
            var defaultGlobals = scope.defaultGlobals || scope.$eval(attrs.defaultGlobals);

            var once = scope.$watch(attrs.form, function(form) {

              if (form) {
                scope.form  = form;
                scope.defaultGlobals = defaultGlobals;

                //ok let's replace that template!
                //We do this manually since we need to bind ng-model properly and also
                //for fieldsets to recurse properly.
                var url = templateUrl(name, form);
                $http.get(url, {cache: $templateCache}).then(function(res) {
                  var key = form.key ?
                            sfPathProvider.stringify(form.key).replace(/"/g, '&quot;') : '';


                  scope.keyModelName = createModelName(form, scope.defaultGlobals, key);

                  var template = res.data.replace(/\$\$value\$\$/g, scope.keyModelName);
                  element.html(template);
                  $compile(element.contents())(scope);
                });
                once();
              }
            });

            scope.globalSchema = sfSchema.evalInMainScope('schema');

            //Keep error prone logic from the template
            scope.showTitle = function() {
              return scope.form && scope.form.notitle !== true && scope.form.title;
            };

            scope.listToCheckboxValues = function(list) {
              var values = {};
              angular.forEach(list, function(v) {
                values[v] = true;
              });
              return values;
            };

            scope.checkboxValuesToList = function(values) {
              var lst = [];
              angular.forEach(values, function(v, k) {
                if (v) {
                  lst.push(k);
                }
              });
              return lst;
            };

            scope.buttonClick = function($event, form) {
              if (angular.isFunction(form.onClick)) {
                form.onClick($event, form);
              } else if (angular.isString(form.onClick)) {
                if (sfSchema) {
                  //evaluating in scope outside of sfSchemas isolated scope
                  sfSchema.evalInParentScope(form.onClick, {'$event': $event, form: form});
                } else {
                  scope.$eval(form.onClick, {'$event': $event, form: form});
                }
              }
            };

            var lookupForKey = function (key) {
              var res = '';

              var schema = scope.globalSchema.properties[key];

              if (angular.isDefined(schema)) {
                var visibility = schema.visibility || scope.defaultGlobals.visibility;
                var prefix = scope.defaultGlobals.prefix || '';

                if (visibility) {
                  res += addDotOrHashNotaion(prefix + visibility);
                }

                var category = schema.category || scope.defaultGlobals.category;

                if (category) {
                  res += addDotOrHashNotaion(prefix + category);
                }
              }


              res += (key[0] !== '[' ? '.' : '') + key;

              return 'model' + res;
            };

            var evalExpression = function (expression) {
              angular.forEach(scope.form.dependencies, function (key) {
                expression = expression.replace(key, lookupForKey(key));
              });

              return scope.$eval(expression)
            };

            var getConditionalValue = function () {
              var value;
              angular.forEach(scope.form.conditionalValues, function (conditionalObject) {
                if (evalExpression(conditionalObject.expression)) {
                  value = conditionalObject.value;
                }
              });

              return value;
            };

            scope.showCondition = function () {
              var expressionString = scope.form.expression;
              if (angular.isUndefined(expressionString)) {
                return true;
              }

              var show = evalExpression(expressionString);
              var model = $parse(scope.keyModelName);

              if (angular.isDefined(scope.form.required)) {
                scope.form.required = show;
                scope.form.schema.required = show;
              }


              if (angular.isArray(scope.form.conditionalValues)) {
                var conditionalValue = getConditionalValue();
                if (angular.isDefined(conditionalValue)) {
                  model.assign(scope, conditionalValue);
                }

              } else if (scope.form.key && !show) {

                model.assign(scope, undefined);
                if (scope.ngModelHolder) {
                  scope.ngModelHolder.$render();
                  scope.ngModelHolder.$setPristine();
                }

              }

              return show;

            };

            scope.clickCheckbox = function () {
              var inputEl = element.find('input');
              var checked = !!inputEl.attr('checked');
              inputEl.attr('checked', !checked);
              scope.ngModelHolder.$setViewValue(!checked);
              scope.ngModelHolder.$render();
            };

            scope.changeCheckbox = function () {
              var input = element.find('input');
              input.attr('checked', scope.ngModelHolder.$modelValue);
            };

            scope.disabledElement = function () {
              var expressionString = scope.form.disableExpression;

              if (angular.isUndefined(expressionString) && angular.isUndefined(scope.form.disabled)) {
                return false;
              }

              var disabled = evalExpression(expressionString);

              if (angular.isDefined(scope.form.required)) {
                scope.form.required = !disabled;
                scope.form.schema.required = !disabled;
              }

              if (disabled) {
                scope.ngModelHolder.$setViewValue(undefined);
                element.find('input').val('');
              }
              return disabled || scope.form.disabled;
            };


            var updateInfoDate = function (date, alwaysAddMonlthlyDifferent) {
              var today = moment();
              var minMonthlyDifference = scope.form.minMonthlyDifference || 0;
              var maxMonthlyDifference = scope.form.maxMonthlyDifference;
              var additionalMonthlyDifference = scope.form.additionalMonthlyDifference;
              var additionalDailyDifference = scope.form.additionalDailyDifference;
              var selectedDate = moment(date);

              today.milliseconds(0);
              today.second(0);
              today.minute(0);
              today.hours(0);

              if (maxMonthlyDifference && additionalMonthlyDifference) {

                if (alwaysAddMonlthlyDifferent
                    || (selectedDate.toDate().getTime() < moment(today).add(minMonthlyDifference, 'Month').toDate().getTime())
                    || (selectedDate.toDate().getTime() > moment(today).add(maxMonthlyDifference, 'Month').toDate().getTime())) {
                  selectedDate = today.add(additionalMonthlyDifference, 'Month').add(additionalDailyDifference, 'Day');
                }
              }

              return selectedDate;
            };

            scope.setDateWatcher = function () {
              if (scope.form.modelKey) {
                var value = function () {
                  return scope.$eval(lookupForKey(scope.form.dateKey));
                };
                scope.$watch(value, function (newDate) {
                  if (newDate) {
                    var model = $parse(lookupForKey(scope.form.modelKey));
                    var selectedDate = updateInfoDate(newDate);
                    model.assign(scope, selectedDate.format('YYYY-MM-DD'));
                  }
                });
              }
            };

            scope.getInfoDate = function () {
              var date = scope.$eval(lookupForKey(scope.form.dateKey));
              var selectedDate;

              if (date) {
                selectedDate = updateInfoDate(date);
              } else if (scope.form.hasDefaultDateValue) {

                selectedDate = updateInfoDate(null, true);
                var model = $parse(lookupForKey(scope.form.modelKey));
                model.assign(scope, selectedDate.format('YYYY-MM-DD'));

              }

              moment.locale(scope.form.encoding);
              return moment(selectedDate).format(scope.form.format);

            };

            scope.conditionalValidationSuccess = function () {
              var expressionString = scope.form.validationExpression;

              if (angular.isUndefined(expressionString)) {
                return true;
              }
              return evalExpression(expressionString);
            };

            /**
             * Evaluate an expression, i.e. scope.$eval
             * but do it in sfSchemas parent scope sf-schema directive is used
             * @param {string} expression
             * @param {Object} locals (optional)
             * @return {Any} the result of the expression
             */
            scope.evalExpr = function(expression, locals) {
              if (sfSchema) {
                //evaluating in scope outside of sfSchemas isolated scope
                return sfSchema.evalInParentScope(expression, locals);
              }

              return scope.$eval(expression, locals);
            };

            /**
             * Evaluate an expression, i.e. scope.$eval
             * in this decorators scope
             * @param {string} expression
             * @param {Object} locals (optional)
             * @return {Any} the result of the expression
             */
            scope.evalInScope = function(expression, locals) {
              if (expression) {
                return scope.$eval(expression, locals);
              }
            };

            /**
             * Error message handler
             * An error can either be a schema validation message or a angular js validtion
             * error (i.e. required)
             */
            scope.errorMessage = function(schemaError) {
              //User has supplied validation messages
              if (scope.form.validationMessage) {
                if (schemaError) {
                  if (angular.isString(scope.form.validationMessage)) {
                    return scope.form.validationMessage;
                  }

                  return scope.form.validationMessage[schemaError.code] ||
                         scope.form.validationMessage['default'];
                } else {
                  return scope.form.validationMessage.required ||
                         scope.form.validationMessage['default'] ||
                         scope.form.validationMessage;
                }
              }

              //No user supplied validation message.
              if (schemaError) {
                return schemaError.message; //use tv4.js validation message
              }

              //Otherwise we only use required so it must be it.
              return 'Required';

            };
          }
        };
      }
    ]);
  };

  var createManualDirective = function(type, templateUrl, transclude) {
    transclude = angular.isDefined(transclude) ? transclude : false;
    $compileProvider.directive('sf' + angular.uppercase(type[0]) + type.substr(1), function() {
      return {
        restrict: 'EAC',
        scope: true,
        replace: true,
        transclude: transclude,
        template: '<sf-decorator form="form"></sf-decorator>',
        link: function(scope, element, attrs) {
          var watchThis = {
            'items': 'c',
            'titleMap': 'c',
            'schema': 'c'
          };
          var form = {type: type};
          var once = true;
          angular.forEach(attrs, function(value, name) {
            if (name[0] !== '$' && name.indexOf('ng') !== 0 && name !== 'sfField') {

              var updateForm = function(val) {
                if (angular.isDefined(val) && val !== form[name]) {
                  form[name] = val;

                  //when we have type, and if specified key we apply it on scope.
                  if (once && form.type && (form.key || angular.isUndefined(attrs.key))) {
                    scope.form = form;
                    once = false;
                  }
                }
              };

              if (name === 'model') {
                //"model" is bound to scope under the name "model" since this is what the decorators
                //know and love.
                scope.$watch(value, function(val) {
                  if (val && scope.model !== val) {
                    scope.model = val;
                  }
                });
              } else if (watchThis[name] === 'c') {
                //watch collection
                scope.$watchCollection(value, updateForm);
              } else {
                //$observe
                attrs.$observe(name, updateForm);
              }
            }
          });
        }
      };
    });
  };

  /**
   * Create a decorator directive and its sibling "manual" use directives.
   * The directive can be used to create form fields or other form entities.
   * It can be used in conjunction with <schema-form> directive in which case the decorator is
   * given it's configuration via a the "form" attribute.
   *
   * ex. Basic usage
   *   <sf-decorator form="myform"></sf-decorator>
   **
   * @param {string} name directive name (CamelCased)
   * @param {Object} mappings, an object that maps "type" => "templateUrl"
   * @param {Array}  rules (optional) a list of functions, function(form) {}, that are each tried in
   *                 turn,
   *                 if they return a string then that is used as the templateUrl. Rules come before
   *                 mappings.
   */
  this.createDecorator = function(name, mappings, rules) {
    directives[name] = {
      mappings: mappings || {},
      rules:    rules    || []
    };

    if (!directives[defaultDecorator]) {
      defaultDecorator = name;
    }
    createDirective(name);
  };

  /**
   * Creates a directive of a decorator
   * Usable when you want to use the decorators without using <schema-form> directive.
   * Specifically when you need to reuse styling.
   *
   * ex. createDirective('text','...')
   *  <sf-text title="foobar" model="person" key="name" schema="schema"></sf-text>
   *
   * @param {string}  type The type of the directive, resulting directive will have sf- prefixed
   * @param {string}  templateUrl
   * @param {boolean} transclude (optional) sets transclude option of directive, defaults to false.
   */
  this.createDirective = createManualDirective;

  /**
   * Same as createDirective, but takes an object where key is 'type' and value is 'templateUrl'
   * Useful for batching.
   * @param {Object} mappings
   */
  this.createDirectives = function(mappings) {
    angular.forEach(mappings, function(url, type) {
      createManualDirective(type, url);
    });
  };

  /**
   * Getter for directive mappings
   * Can be used to override a mapping or add a rule
   * @param {string} name (optional) defaults to defaultDecorator
   * @return {Object} rules and mappings { rules: [],mappings: {}}
   */
  this.directive = function(name) {
    name = name || defaultDecorator;
    return directives[name];
  };

  /**
   * Adds a mapping to an existing decorator.
   * @param {String} name Decorator name
   * @param {String} type Form type for the mapping
   * @param {String} url  The template url
   */
  this.addMapping = function(name, type, url) {
    if (directives[name]) {
      directives[name].mappings[type] = url;
    }
  };

  //Service is just a getter for directive mappings and rules
  this.$get = function() {
    return {
      directive: function(name) {
        return directives[name];
      },
      defaultDecorator: defaultDecorator
    };
  };

  //Create a default directive
  createDirective('sfDecorator');

}]);
