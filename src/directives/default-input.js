/**
 *  Sets attributes 'type' and 'placeholder' to input elements
 */
angular.module('schemaForm').directive('sfDefaultInput', [function () {

    return {
        restrict: 'A',
        scope: {
            sfType: '=',
            sfPlaceholder: '='
        },
        link: function (scope, element) {

            element.attr('type', scope.sfType);
            element.attr('placeholder', scope.sfPlaceholder);

        }

    };

}]);