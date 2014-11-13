
angular.module('schemaForm')
    .directive('infoHelpMessage', [function () {

        return {
            restrict: "AE",
            templateUrl: 'directives/decorators/stb-webmanual/info-message.html',
            scope: {
                infoMessage: '='
            },
            link: function (scope, element, attrs) {
            }
        }
    }]);
