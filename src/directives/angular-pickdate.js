angular.module('ng').directive('pickADate', function () {
  return {
    restrict: "A",
    require: 'ngModel',
    scope: {
        ngModel: '=',
        minDate: '=',
        maxDate: '='
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
      var defaultFormat = "yyyy-mm-dd";

      //View format on the other hand we get from the pickadate translation file
      var viewFormat    = $.fn.pickadate.defaults.format;

      var picker = element.pickadate('picker');

      //The view value
      ngModel.$formatters.push(function(value){
        if (angular.isUndefined(value) || value === null) {
          return value;
        }

        //We set 'view' and 'highlight' instead of 'select'
        //since the latter also changes the input, which we do not want.
        picker.set('view',value,{ format: attrs.format || defaultFormat });
        picker.set('highlight',value,{ format: attrs.format || defaultFormat });

        //piggy back on highlight to and let pickadate do the transformation.
        return picker.get('highlight',viewFormat);
      });

      ngModel.$parsers.push(function(){
        return picker.get('select',attrs.format || defaultFormat);
      });

      picker.set('min', scope.minDate ? scope.minDate : false);
      picker.set('max', scope.maxDate ? scope.maxDate : false);

      //bind once.
      if (angular.isDefined(attrs.minDate)) {
        var onceMin = scope.$watch('minDate', function (value) {
          if (value) {
            picker.set('min', value);
            onceMin();
          }
        }, true);
      }

      if (angular.isDefined(attrs.maxDate)) {
        var onceMax = scope.$watch('maxDate', function (value) {
          if (value) {
            picker.set('max', value);
            onceMax();
          }
        }, true);
      }
    }
  };
});
