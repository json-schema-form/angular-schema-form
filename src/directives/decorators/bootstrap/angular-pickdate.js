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
            element.pickadate({
                onClose: function () {
                    element.blur();
                }
            });
            function updateValue(newValue) {
                if (newValue) {
                    element.pickadate('picker').set('select', scope.pickADate.getTime());
                } else {
                    element.pickadate('picker').clear();
                }
            }
            updateValue(scope.pickADate);
            element.pickadate('picker').set('min', scope.minDate ? scope.minDate : false);
            element.pickadate('picker').set('max', scope.maxDate ? scope.maxDate : false);

            scope.$watch(scope.ngModel, function (newValue, oldValue) {
                if (newValue == oldValue)
                    return;
                updateValue(newValue);
            }, true);
            scope.$watch('minDate', function (newValue, oldValue) {
                element.pickadate('picker').set('min', newValue ? newValue : false);
            }, true);
            scope.$watch('maxDate', function (newValue, oldValue) {
                element.pickadate('picker').set('max', newValue ? newValue : false);
            }, true);
        }
    };
});
