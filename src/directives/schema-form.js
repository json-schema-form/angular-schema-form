/*
FIXME: real documentation
<form sf-form="form"  sf-schema="schema" sf-decorator="foobar"></form>
*/

angular.module('schemaForm')
       .directive('sfSchema',
['$compile', '$http', '$templateCache', '$q','schemaForm', 'schemaFormDecorators', 'sfSelect', 'sfPath', 'sfBuilder',
  function($compile, $http, $templateCache, $q, schemaForm,  schemaFormDecorators, sfSelect, sfPath, sfBuilder) {

    return {
      scope: {
        schema: '=sfSchema',
        initialForm: '=sfForm',
        model: '=sfModel',
        options: '=sfOptions'
      },
      controller: ['$scope', function($scope) {
        this.evalInParentScope = function(expr, locals) {
          return $scope.$parent.$eval(expr, locals);
        };

        // Set up form lookup map
        var that  = this;
        $scope.lookup = function(lookup) {
          if (lookup) {
            that.lookup = lookup;
          }
          return that.lookup;
        };
      }],
      replace: false,
      restrict: 'A',
      transclude: true,
      require: '?form',
      link: function(scope, element, attrs, formCtrl, transclude) {

        //expose form controller on scope so that we don't force authors to use name on form
        scope.formCtrl = formCtrl;

        //We'd like to handle existing markup,
        //besides using it in our template we also
        //check for ng-model and add that to an ignore list
        //i.e. even if form has a definition for it or form is ["*"]
        //we don't generate it.
        var ignore = {};
        transclude(scope, function(clone) {
          clone.addClass('schema-form-ignore');
          element.prepend(clone);

          if (element[0].querySelectorAll) {
            var models = element[0].querySelectorAll('[ng-model]');
            if (models) {
              for (var i = 0; i < models.length; i++) {
                var key = models[i].getAttribute('ng-model');
                //skip first part before .
                ignore[key.substring(key.indexOf('.') + 1)] = true;
              }
            }
          }
        });

        var lastDigest = {};
        var childScope;

        // Common renderer function, can either be triggered by a watch or by an event.
        var render = function(schema, form) {
          var asyncTemplates = [];
          var merged = schemaForm.merge(schema, form, ignore, scope.options, undefined, asyncTemplates);

          if (asyncTemplates.length > 0) {
            // Pre load all async templates and put them on the form for the builder to use.
            $q.all(asyncTemplates.map(function(form) {
              return $http.get(form.templateUrl, {cache: $templateCache}).then(function(res) {
                                  form.template = res.data;
                                });
            })).then(function() {
              internalRender(schema, form, merged);
            });

          } else {
            internalRender(schema, form, merged);
          }


        };

        var internalRender = function(schema, form, merged) {
          // Create a new form and destroy the old one.
          // Not doing keeps old form elements hanging around after
          // they have been removed from the DOM
          // https://github.com/Textalk/angular-schema-form/issues/200
          if (childScope) {
            // Destroy strategy should not be acted upon
            scope.externalDestructionInProgress = true;
            childScope.$destroy();
            scope.externalDestructionInProgress = false;
          }
          childScope = scope.$new();

          //make the form available to decorators
          childScope.schemaForm  = {form:  merged, schema: schema};

          //clean all but pre existing html.
          element.children(':not(.schema-form-ignore)').remove();

          // Find all slots.
          var slots = {};
          var slotsFound = element[0].querySelectorAll('*[sf-insert-field]');

          for (var i = 0; i < slotsFound.length; i++) {
            slots[slotsFound[i].getAttribute('sf-insert-field')] = slotsFound[i];
          }

          // if sfUseDecorator is undefined the default decorator is used.
          var decorator = schemaFormDecorators.decorator(attrs.sfUseDecorator);
          // Use the builder to build it and append the result
          var lookup = Object.create(null);
          scope.lookup(lookup); // give the new lookup to the controller.
          element[0].appendChild(sfBuilder.build(merged, decorator, slots, lookup));

          // We need to know if we're in the first digest looping
          // I.e. just rendered the form so we know not to validate
          // empty fields.
          childScope.firstDigest = true;
          // We use a ordinary timeout since we don't need a digest after this.
          setTimeout(function() {
            childScope.firstDigest = false;
          }, 0);

          //compile only children
          $compile(element.children())(childScope);

          //ok, now that that is done let's set any defaults
          if (!scope.options || scope.options.setSchemaDefaults !== false) {
            schemaForm.traverseSchema(schema, function(prop, path) {
              if (angular.isDefined(prop['default'])) {
                var val = sfSelect(path, scope.model);
                if (angular.isUndefined(val)) {
                  sfSelect(path, scope.model, prop['default']);
                }
              }
            });
          }

          scope.$emit('sf-render-finished', element);
        };

        var defaultForm = ['*'];

        //Since we are dependant on up to three
        //attributes we'll do a common watch
        scope.$watch(function() {

          var schema = scope.schema;
          var form   = scope.initialForm || defaultForm;

          //The check for schema.type is to ensure that schema is not {}
          if (form && schema && schema.type &&
              (lastDigest.form !== form || lastDigest.schema !== schema) &&
              Object.keys(schema.properties).length > 0) {
            lastDigest.schema = schema;
            lastDigest.form = form;

            render(schema, form);
          }
        });

        // We also listen to the event schemaFormRedraw so you can manually trigger a change if
        // part of the form or schema is chnaged without it being a new instance.
        scope.$on('schemaFormRedraw', function() {
          var schema = scope.schema;
          var form   = scope.initialForm ? angular.copy(scope.initialForm) : ['*'];
          if (schema) {
            render(schema, form);
          }
        });

        scope.$on('$destroy', function() {
          // Each field listens to the $destroy event so that it can remove any value
          // from the model if that field is removed from the form. This is the default
          // destroy strategy. But if the entire form (or at least the part we're on)
          // gets removed, like when routing away to another page, then we definetly want to
          // keep the model intact. So therefore we set a flag to tell the others it's time to just
          // let it be.
          scope.externalDestructionInProgress = true;
        });

        /**
         * Evaluate an expression, i.e. scope.$eval
         * but do it in parent scope
         *
         * @param {String} expression
         * @param {Object} locals (optional)
         * @return {Any} the result of the expression
         */
        scope.evalExpr = function(expression, locals) {
          return scope.$parent.$eval(expression, locals);
        };
      }
    };
  }
]);
