import angular from 'angular';

/**
FIXME: real documentation
<form sf-form="form"  sf-schema="schema" sf-decorator="foobar"></form>
*/
/**
 * [description]
 *
 * @param  {[type]} $compile             [description]
 * @param  {[type]} $http                [description]
 * @param  {[type]} $templateCache       [description]
 * @param  {[type]} $q                   [description]
 * @param  {[type]} schemaForm           [description]
 * @param  {[type]} schemaFormDecorators [description]
 * @param  {[type]} sfSelect             [description]
 * @param  {[type]} sfBuilder            [description]
 *
 * @return {[type]}                      [description]
 */
export default function($compile, $http, $templateCache, $q, schemaForm, schemaFormDecorators,
sfSelect, sfBuilder) {
  return {
    scope: {
      schema: '=sfSchema',
      initialForm: '=sfForm',
      model: '=sfModel',
      options: '=sfOptions',
    },
    controller: [ '$scope', function($scope) {
      this.$onInit = function() {
        this.evalInParentScope = function(expr, locals) {
          return $scope.$parent.$eval(expr, locals);
        };

        // Set up form lookup map
        let that = this;
        $scope.lookup = function(lookup) {
          if (lookup) {
            that.lookup = lookup;
          }
          return that.lookup;
        };
      };

      // Prior to v1.5, we need to call `$onInit()` manually.
      // (Bindings will always be pre-assigned in these versions.)
      if (angular.version.major === 1 && angular.version.minor < 5) {
        this.$onInit();
      }
    } ],
    replace: false,
    restrict: 'A',
    transclude: true,
    require: '?form',
    link: function(scope, element, attrs, formCtrl, transclude) {
      // expose form controller on scope so that we don't force authors to use name on form
      scope.formCtrl = formCtrl;

      // We'd like to handle existing markup,
      // besides using it in our template we also
      // check for ng-model and add that to an ignore list
      // i.e. even if form has a definition for it or form is ["*"]
      // we don't generate it.
      let ignore = {};
      transclude(scope, function(clone) {
        clone.addClass('schema-form-ignore');
        element.prepend(clone);

        if (element[0].querySelectorAll) {
          let models = element[0].querySelectorAll('[ng-model]');
          if (models) {
            for (let i = 0; i < models.length; i++) {
              let key = models[i].getAttribute('ng-model');
              // skip first part before .
              ignore[key.substring(key.indexOf('.') + 1)] = true;
            }
          }
        }
      });

      let lastDigest = {};
      let childScope;

      // Common renderer function, can either be triggered by a watch or by an event.
      scope.resolveReferences = function (schema, form) {
        schemaForm
          .jsonref(schema)
          .then((resolved) => {
            scope.render(resolved, form);
          })
          .catch((err) => {
            new Error(err);
          });
      };

      scope.render = function(schema, form) {
        let asyncTemplates = [];
        let merged = schemaForm.merge(schema, form, undefined, ignore, scope.options, undefined, asyncTemplates);

        if (asyncTemplates.length > 0) {
          // Pre load all async templates and put them on the form for the builder to use.
          $q.all(
            asyncTemplates
              .map(function(form) {
                return $http.get(form.templateUrl, { cache: $templateCache })
                  .then(function(res) {
                    form.template = res.data;
                  });
              })
          )
          .then(function() {
            scope.internalRender(schema, form, merged);
          });
        }
        else {
          scope.internalRender(schema, form, merged);
        };
      };

      scope.internalRender = function(schema, form, merged) {
        // Create a new form and destroy the old one.
        // Not doing keeps old form elements hanging around after
        // they have been removed from the DOM
        // https:// github.com/Textalk/angular-schema-form/issues/200
        if (childScope) {
          // Destroy strategy should not be acted upon
          scope.externalDestructionInProgress = true;
          childScope.$destroy();
          scope.externalDestructionInProgress = false;
        };
        childScope = scope.$new();

        // make the form available to decorators
        childScope.schemaForm = { form: merged, schema: schema };

        // clean all but pre existing html.
        Array.prototype.forEach.call(element.children(), function(child) {
          let jchild = angular.element(child);
          if (false === jchild.hasClass('schema-form-ignore')) {
            jchild.remove();
          };
        });

        // Find all slots.
        let slots = {};
        let slotsFound = element[0].querySelectorAll('*[sf-insert-field]');

        for (let i = 0; i < slotsFound.length; i++) {
          slots[slotsFound[i].getAttribute('sf-insert-field')] = slotsFound[i];
        }

        // if sfUseDecorator is undefined the default decorator is used.
        let decorator = schemaFormDecorators.decorator(attrs.sfUseDecorator);
        // Use the builder to build it and append the result
        let lookup = Object.create(null);
        scope.lookup(lookup); // give the new lookup to the controller.
        element[0].appendChild(sfBuilder.build(merged, decorator, slots, lookup));

        // We need to know if we're in the first digest looping
        // I.e. just rendered the form so we know not to validate
        // empty fields.
        childScope.firstDigest = true;
        // We use a ordinary timeout since we don't need a digest after this.
        setTimeout(function() {
          childScope.firstDigest = false;
          scope.$apply();
        }, 0);

        // compile only children
        $compile(element.children())(childScope);

        // ok, now that that is done let's set any defaults
        if (!scope.options || scope.options.setSchemaDefaults !== false) {
          schemaForm.traverseSchema(schema, function(prop, path) {
            if (angular.isDefined(prop['default'])) {
              let val = sfSelect(path, scope.model);
              if (angular.isUndefined(val)) {
                let defVal = prop['default'];
                if (angular.isObject(defVal)) defVal = angular.copy(defVal);
                sfSelect(path, scope.model, defVal);
              }
            }
          });
        }

        scope.$emit('sf-render-finished', element);
      };

      let defaultForm = [ '*' ];

      // Since we are dependant on up to three
      // attributes we'll do a common watch
      scope.$watch(function() {
        let schema = scope.schema;
        let form = scope.initialForm || defaultForm;

        // The check for schema.type is to ensure that schema is not {}
        if (form && schema && schema.type && // schema.properties &&
            (lastDigest.form !== form || lastDigest.schema !== schema)) {
          if((!schema.properties || Object.keys(schema.properties).length === 0) &&
              (form.indexOf('*') || form.indexOf('...'))) {
            // form.unshift({"key":"submit", "type": "hidden"});
          };

          lastDigest.schema = schema;
          lastDigest.form = form;

          scope.resolveReferences(schema, form);
        }
      });

      // We also listen to the event schemaFormRedraw so you can manually trigger a change if
      // part of the form or schema is chnaged without it being a new instance.
      scope.$on('schemaFormRedraw', function() {
        let schema = scope.schema;
        let form = scope.initialForm ? angular.copy(scope.initialForm) : [ '*' ];
        if (schema) {
          scope.resolveReferences(schema, form);
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
    },
  };
}
