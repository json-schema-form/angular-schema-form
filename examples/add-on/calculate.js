/**
 * I calculate a field value based on a provided mathematical string
 *
 * @homepage https://github.com/Anthropic/angular-schema-form-calculate
 *
 * NOTE: This version is not in sync with the source repo as it has
 * been modified to work with the new version of the framework in development
 *
 * @example
 * {
 *   "type":"calculate",
 *   "key":"area", // the key to COPY the RESULT to (doesn't need 'model' prefix)
 *   "watch":["length","width"], // The KEYS to WATCH for changes
 *   "calculate":"model.length * model.width"
 * }
 * @example
 * {
 *   "type":"calculate",
 *   "format":"number", // The format to coerce the response into, currently supports 'number' or no property defined
 *   "key":"area", // the key to COPY the RESULT to (doesn't need 'model' prefix)
 *   "watch":["length","width"], // The KEYS to WATCH for changes
 *   "calculate":"model.length * model.width",
 *   "lookup":"http://example.com/validate/{{calculated}}" // The response is copied to the key
 * }
 */
angular
  .module('schemaForm')
  .run(function($templateCache) {
    // A template to use
    $templateCache.put('calculated-fields.html', '<calculate sf-field-model model="model" form="form" />');
  })
  .directive('calculate', [ '$compile', '$http', 'sfBuilder', 'sfSelect', '$interpolate', 'schemaFormDecorators',
    function($compile, $http, sfBuilder, sfSelect, $interpolate, schemaFormDecoratorsProvider) {
      return {
        restrict: 'E',
        scope: true,
        link: {
          post: function(scope, element, attrs, ctrl) {
            let watchKeys = scope.form.watch;
            let key;
            let keyFixed;
            let i;

            scope.form.format = scope.form.format || 'number';

            for (i=0; i < watchKeys.length; i++) {
              key = watchKeys[i].split('[]');
              keyFixed = key.reduce(function(pv, cv, ci, ta) {
                return '' + pv + ((cv[0]=='.')? '['+scope.$i[ci-1]+']'+cv: cv);
              });

              scope.$watch(keyFixed,
              function (val, old) {
                let newValue = $interpolate('{{' + scope.form.calculate + '}}', false, null, true)({
                  model: scope.model,
                  $i: scope.$i,
                  $index: scope.$index,
                  path: scope.path,
                });

                if(scope.form.lookup) {
                  scope.model.calculated = encodeURIComponent(newValue);
                  let lookup = $interpolate(scope.form.lookup, false, null, true)(scope.model);

                  $http.get(lookup, { responseType: 'json' })
                    .success(function(response, status) {
                      if(response.data) update(response.data);
                    })
                    .error(function(data, status) {
                      scope.form.options = [];
                      scope.form.selectedOption = '';
                    });
                }
                else {
                  update(newValue);
                };

                /**
                 * I update the model for the key
                 *
                 * @param  {[type]} value [description]
                 */
                function update(value) {
                  if(scope.form.format == 'number') value = Number(value);
                  sfSelect(scope.form.key, scope.model, value);
                };
              });
            };
          },
        },
      };
    },
  ])
  .config([ 'schemaFormDecoratorsProvider', 'sfBuilderProvider',
    function(schemaFormDecoratorsProvider, sfBuilderProvider) {
      let sfField = sfBuilderProvider.builders.sfField;
      let ngModel = sfBuilderProvider.builders.ngModel;
      let defaults = [ sfField, ngModel ];

      schemaFormDecoratorsProvider.defineAddOn(
        'bootstrapDecorator',
        'calculate',
        'calculated-fields.html',
        defaults
      );
    },
  ]);
