angular.module("schemaForm").run(["$templateCache", function($templateCache) {$templateCache.put("directives/decorators/bootstrap/datepicker/datepicker.html","<div class=\"form-group\" ng-class=\"{\'has-error\': hasError()}\">\n  <label class=\"control-label\" ng-show=\"showTitle()\">{{form.title}}</label>\n\n  <input ng-show=\"form.key\"\n         style=\"background-color: white\"\n         type=\"text\"\n         class=\"form-control\"\n         schema-validate=\"form\"\n         ng-model=\"$$value$$\"\n         pick-a-date\n         min-date=\"form.minDate\"\n         max-date=\"form.maxDate\"\n         format=\"form.format\" />\n\n  <span class=\"help-block\">{{ (hasError() && errorMessage(schemaError())) || form.description}}</span>\n</div>\n");}]);
angular.module('schemaForm').directive('pickADate', function () {

  //String dates for min and max is not supported
  //https://github.com/amsul/pickadate.js/issues/439
  //So strings we create dates from
  var formatDate = function(value) {
    //Strings or timestamps we make a date of
    if (angular.isString(value) || angular.isNumber(value)) {
      return new Date(value);
    }
    return value; //We hope it's a date object
  };

  return {
    restrict: 'A',
    require: 'ngModel',
    scope: {
      ngModel: '=',
      minDate: '=',
      maxDate: '=',
      format: '='
    },
    link: function (scope, element, attrs, ngModel) {
      //Bail out gracefully if pickadate is not loaded.
      if (!element.pickadate) {
        return;
      }

      //By setting formatSubmit to null we inhibit the
      //hidden field that pickadate likes to create.
      //We use ngModel formatters instead to format the value.
      element.pickadate({
        onClose: function () {
          element.blur();
        },
        formatSubmit: null
      });

      //Defaultformat is for json schema date-time is ISO8601
      //i.e.  "yyyy-mm-dd"
      var defaultFormat = 'yyyy-mm-dd';

      //View format on the other hand we get from the pickadate translation file
      var viewFormat    = $.fn.pickadate.defaults.format;

      var picker = element.pickadate('picker');

      //The view value
      ngModel.$formatters.push(function(value) {
        if (angular.isUndefined(value) || value === null) {
          return value;
        }

        //We set 'view' and 'highlight' instead of 'select'
        //since the latter also changes the input, which we do not want.
        picker.set('view', value, {format: scope.format || defaultFormat});
        picker.set('highlight', value, {format: scope.format || defaultFormat});

        //piggy back on highlight to and let pickadate do the transformation.
        return picker.get('highlight', viewFormat);
      });

      ngModel.$parsers.push(function() {
        return picker.get('select', scope.format || defaultFormat);
      });

      //bind once.
      if (angular.isDefined(attrs.minDate)) {
        var onceMin = scope.$watch('minDate', function (value) {
          if (value) {
            picker.set('min', formatDate(value));
            onceMin();
          }
        }, true);
      }

      if (angular.isDefined(attrs.maxDate)) {
        var onceMax = scope.$watch('maxDate', function (value) {
          if (value) {
            picker.set('max', formatDate(value));
            onceMax();
          }
        }, true);
      }
    }
  };
});

angular.module('schemaForm').config(
['schemaFormProvider', 'schemaFormDecoratorsProvider', 'sfPathProvider',
  function(schemaFormProvider,  schemaFormDecoratorsProvider, sfPathProvider) {

    var datepicker = function(name, schema, options) {
      if (schema.type === 'string' && (schema.format === 'date' || schema.format === 'date-time')) {
        var f = schemaFormProvider.stdFormObj(name, schema, options);
        f.key  = options.path;
        f.type = 'datepicker';
        options.lookup[sfPathProvider.stringify(options.path)] = f;
        return f;
      }
    };

    schemaFormProvider.defaults.string.unshift(datepicker);

    //Add to the bootstrap directive
    schemaFormDecoratorsProvider.addMapping(
      'bootstrapDecorator',
      'datepicker',
      'directives/decorators/bootstrap/datepicker/datepicker.html'
    );
    schemaFormDecoratorsProvider.createDirective(
      'datepicker',
      'directives/decorators/bootstrap/datepicker/datepicker.html'
    );
  }
]);
