
/**
 * Default schema form decorator
 */
angular.module('schemaForm').directive('schemaFormDecorator',[function(){

  return {
    restrict: 'AE',
    replace: true,
    transclude: true,
    scope: {
      title: '@',
      description: '@'
    },
    template: '<div class="decorator"><span class="title" ng-show="title">{{title}}</span><span ng-transclude></span><span ng-show="description" class="description">{{description}}</span></div>'
  };
}]);

