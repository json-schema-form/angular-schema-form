angular.module('schemaForm').provider('schemaFormDecorators',
['$compileProvider', 'sfPathProvider', function($compileProvider, sfPathProvider) {
  var defaultDecorator = '';
  var decorators = {};

  // Map template after decorator and type.
  var templateUrl = function(name, form) {
    //schemaDecorator is alias for whatever is set as default
    if (name === 'sfDecorator') {
      name = defaultDecorator;
    }

    var decorator = decorators[name];
    if (decorator[form.type]) {
      return decorator[form.type].template;
    }

    //try default
    return decorator['default'].template;
  };

  /**************************************************
   * DEPRECATED                                     *
   * The new builder and sf-field is preferred, but *
   * we keep this in during a transitional period   *
   * so that add-ons that don't use the new builder *
   * works.                                         *
   **************************************************/
   //TODO: Move to a compatability extra script.
   var createDirective = function(name) {
     $compileProvider.directive(name,
      ['$parse', '$compile', '$http', '$templateCache', '$interpolate', '$q', 'sfErrorMessage',
       'sfPath','sfSelect',
      function($parse,  $compile,  $http,  $templateCache, $interpolate, $q, sfErrorMessage,
               sfPath, sfSelect) {

        return {
          restrict: 'AE',
          replace: false,
          transclude: false,
          scope: true,
          require: '?^sfSchema',
          link: function(scope, element, attrs, sfSchema) {

            //The ngModelController is used in some templates and
            //is needed for error messages,
            scope.$on('schemaFormPropagateNgModelController', function(event, ngModel) {
              event.stopPropagation();
              event.preventDefault();
              scope.ngModel = ngModel;
            });

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
             * Interpolate the expression.
             * Similar to `evalExpr()` and `evalInScope()`
             * but will not fail if the expression is
             * text that contains spaces.
             *
             * Use the Angular `{{ interpolation }}`
             * braces to access properties on `locals`.
             *
             * @param  {string} content The string to interpolate.
             * @param  {Object} locals (optional) Properties that may be accessed in the
             *                         `expression` string.
             * @return {Any} The result of the expression or `undefined`.
             */
            scope.interp = function(expression, locals) {
              return (expression && $interpolate(expression)(locals));
            };

            //This works since we ot the ngModel from the array or the schema-validate directive.
            scope.hasSuccess = function() {
              if (!scope.ngModel) {
                return false;
              }
              return scope.ngModel.$valid &&
                  (!scope.ngModel.$pristine || !scope.ngModel.$isEmpty(scope.ngModel.$modelValue));
            };

            scope.hasError = function() {
              if (!scope.ngModel) {
                return false;
              }
              return scope.ngModel.$invalid && !scope.ngModel.$pristine;
            };

            /**
             * DEPRECATED: use sf-messages instead.
             * Error message handler
             * An error can either be a schema validation message or a angular js validtion
             * error (i.e. required)
             */
            scope.errorMessage = function(schemaError) {
              return sfErrorMessage.interpolate(
                (schemaError && schemaError.code + '') || 'default',
                (scope.ngModel && scope.ngModel.$modelValue) || '',
                (scope.ngModel && scope.ngModel.$viewValue) || '',
                scope.form,
                scope.options && scope.options.validationMessage
              );
            };

            // Rebind our part of the form to the scope.
            var once = scope.$watch(attrs.form, function(form) {
              if (form) {
                // Workaround for 'updateOn' error from ngModelOptions
                // see https://github.com/Textalk/angular-schema-form/issues/255
                // and https://github.com/Textalk/angular-schema-form/issues/206
                form.ngModelOptions = form.ngModelOptions || {};
                scope.form  = form;

                //ok let's replace that template!
                //We do this manually since we need to bind ng-model properly and also
                //for fieldsets to recurse properly.
                var templatePromise;

                // type: "template" is a special case. It can contain a template inline or an url.
                // otherwise we find out the url to the template and load them.
                if (form.type === 'template' && form.template) {
                  templatePromise = $q.when(form.template);
                } else {
                  var url = form.type === 'template' ? form.templateUrl : templateUrl(name, form);
                  templatePromise = $http.get(url, {cache: $templateCache}).then(function(res) {
                                      return res.data;
                                    });
                }

                templatePromise.then(function(template) {
                  if (form.key) {
                    var key = form.key ?
                              sfPathProvider.stringify(form.key).replace(/"/g, '&quot;') : '';
                    template = template.replace(
                      /\$\$value\$\$/g,
                      'model' + (key[0] !== '[' ? '.' : '') + key
                    );
                  }
                  element.html(template);

                  // Do we have a condition? Then we slap on an ng-if on all children,
                  // but be nice to existing ng-if.
                  if (form.condition) {

                    var evalExpr = 'evalExpr(form.condition,{ model: model, "arrayIndex": arrayIndex})';
                    if (form.key) {
                      evalExpr = 'evalExpr(form.condition,{ model: model, "arrayIndex": arrayIndex, "modelValue": model' + sfPath.stringify(form.key) + '})';
                    }

                    angular.forEach(element.children(), function(child) {
                      var ngIf = child.getAttribute('ng-if');
                      child.setAttribute(
                        'ng-if',
                        ngIf ?
                        '(' + ngIf +
                        ') || (' + evalExpr +')'
                        : evalExpr
                      );
                    });
                  }
                  $compile(element.contents())(scope);
                });

                // Where there is a key there is probably a ngModel
                if (form.key) {
                  // It looks better with dot notation.
                  scope.$on(
                    'schemaForm.error.' + form.key.join('.'),
                    function(event, error, validationMessage, validity) {
                      if (validationMessage === true || validationMessage === false) {
                        validity = validationMessage;
                        validationMessage = undefined;
                      }

                      if (scope.ngModel && error) {
                        if (scope.ngModel.$setDirty) {
                          scope.ngModel.$setDirty();
                        } else {
                          // FIXME: Check that this actually works on 1.2
                          scope.ngModel.$dirty = true;
                          scope.ngModel.$pristine = false;
                        }

                        // Set the new validation message if one is supplied
                        // Does not work when validationMessage is just a string.
                        if (validationMessage) {
                          if (!form.validationMessage) {
                            form.validationMessage = {};
                          }
                          form.validationMessage[error] = validationMessage;
                        }

                        scope.ngModel.$setValidity(error, validity === true);

                        if (validity === true) {
                          // Re-trigger model validator, that model itself would be re-validated
                          scope.ngModel.$validate();

                          // Setting or removing a validity can change the field to believe its valid
                          // but its not. So lets trigger its validation as well.
                          scope.$broadcast('schemaFormValidate');
                        }
                      }
                  });

                  // Clean up the model when the corresponding form field is $destroy-ed.
                  // Default behavior can be supplied as a globalOption, and behavior can be overridden in the form definition.
                  scope.$on('$destroy', function() {
                    // If the entire schema form is destroyed we don't touch the model
                    if (!scope.externalDestructionInProgress) {
                      var destroyStrategy = form.destroyStrategy ||
                                            (scope.options && scope.options.destroyStrategy) || 'remove';
                      // No key no model, and we might have strategy 'retain'
                      if (form.key && destroyStrategy !== 'retain') {

                        // Get the object that has the property we wan't to clear.
                        var obj = scope.model;
                        if (form.key.length > 1) {
                          obj = sfSelect(form.key.slice(0, form.key.length - 1), obj);
                        }

                        // We can get undefined here if the form hasn't been filled out entirely
                        if (obj === undefined) {
                          return;
                        }

                        // Type can also be a list in JSON Schema
                        var type = (form.schema && form.schema.type) || '';

                        // Empty means '',{} and [] for appropriate types and undefined for the rest
                        if (destroyStrategy === 'empty' && type.indexOf('string') !== -1) {
                          obj[form.key.slice(-1)] = '';
                        } else if (destroyStrategy === 'empty' && type.indexOf('object') !== -1) {
                          obj[form.key.slice(-1)] = {};
                        } else if (destroyStrategy === 'empty' && type.indexOf('array') !== -1) {
                          obj[form.key.slice(-1)] = [];
                        } else if (destroyStrategy === 'null') {
                          obj[form.key.slice(-1)] = null;
                        } else {
                          delete obj[form.key.slice(-1)];
                        }
                      }
                    }
                  });
                }

                once();
              }
            });
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
   * DEPRECATED: use defineDecorator instead.
   * Create a decorator directive and its sibling "manual" use decorators.
   * The directive can be used to create form fields or other form entities.
   * It can be used in conjunction with <schema-form> directive in which case the decorator is
   * given it's configuration via a the "form" attribute.
   *
   * ex. Basic usage
   *   <sf-decorator form="myform"></sf-decorator>
   **
   * @param {string} name directive name (CamelCased)
   * @param {Object} templates, an object that maps "type" => "templateUrl"
   */
  this.createDecorator = function(name, templates) {
    //console.warn('schemaFormDecorators.createDecorator is DEPRECATED, use defineDecorator instead.');
    decorators[name] = {'__name': name};

    angular.forEach(templates, function(url, type) {
      decorators[name][type] = {template: url, replace: false, builder: []};
    });

    if (!decorators[defaultDecorator]) {
      defaultDecorator = name;
    }
    createDirective(name);
  };


  /**
   * Define a decorator. A decorator is a set of form types with templates and builder functions
   * that help set up the form.
   *
   * @param {string} name directive name (CamelCased)
   * @param {Object} fields, an object that maps "type" => `{ template, builder, replace}`.
                     attributes `builder` and `replace` are optional, and replace defaults to true.

                     `template` should be the key of the template to load and it should be pre-loaded
                     in `$templateCache`.

                     `builder` can be a function or an array of functions. They will be called in
                     the order they are supplied.

                     `replace` (DEPRECATED) is for backwards compatability. If false the builder
                     will use the "old" way of building that form field using a <sf-decorator>
                     directive.
   */
  this.defineDecorator = function(name, fields) {
    decorators[name] = {'__name': name}; // TODO: this feels like a hack, come up with a better way.

    angular.forEach(fields, function(field, type) {
      field.builder = field.builder || [];
      field.replace = angular.isDefined(field.replace) ? field.replace : true;
      decorators[name][type] = field;
    });

    if (!decorators[defaultDecorator]) {
      defaultDecorator = name;
    }
    createDirective(name);
  };

  /**
   * DEPRECATED
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
   * DEPRECATED
   * Same as createDirective, but takes an object where key is 'type' and value is 'templateUrl'
   * Useful for batching.
   * @param {Object} templates
   */
  this.createDirectives = function(templates) {
    angular.forEach(templates, function(url, type) {
      createManualDirective(type, url);
    });
  };

  /**
   * Getter for decorator settings
   * @param {string} name (optional) defaults to defaultDecorator
   * @return {Object} rules and templates { rules: [],templates: {}}
   */
  this.decorator = function(name) {
    name = name || defaultDecorator;
    return decorators[name];
  };


  /**
   * DEPRECATED use defineAddOn() instead.
   * Adds a mapping to an existing decorator.
   * @param {String} name Decorator name
   * @param {String} type Form type for the mapping
   * @param {String} url  The template url
   * @param {Function} builder (optional) builder function
   * @param {boolean} replace (optional) defaults to false. Replace decorator directive with template.
   */
  this.addMapping = function(name, type, url, builder, replace) {
    if (decorators[name]) {
      decorators[name][type] = {
        template: url,
        builder: builder,
        replace: !!replace
      };
    }
  };

  /**
   * Adds an add-on to an existing decorator.
   * @param {String} name Decorator name
   * @param {String} type Form type for the mapping
   * @param {String} url  The template url
   * @param {Function|Array} builder (optional) builder function(s),
   */
  this.defineAddOn = function(name, type, url, builder) {
    if (decorators[name]) {
      decorators[name][type] = {
        template: url,
        builder: builder,
        replace: true
      };
    }
  };



  //Service is just a getter for directive templates and rules
  this.$get = function() {
    return {
      decorator: function(name) {
        return decorators[name] || decorators[defaultDecorator];
      },
      defaultDecorator: defaultDecorator
    };
  };

  //Create a default directive
  createDirective('sfDecorator');

}]);
