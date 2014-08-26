/**
 * @ngdoc service
 * @name focusOnError
 * @kind object
 *
 */
angular.module('schemaForm').factory('scrollingTop', ['$timeout', function ($timeout) {

  var scrollToTheFirstError = function (element, index) {
    $timeout(function () {
      jQuery('html, body').animate({
        scrollTop: jQuery(element[0]).find('[index=' + index + '] .has-error:first').offset().top
      }, 1000);
    }, 0);
  };

  var scrollTop = function () {
    $timeout(function () {
      jQuery('html, body').animate({
        scrollTop: 0
      }, 1000);
    }, 0);
  };

  return {
    scrollToTheFirstError: scrollToTheFirstError,
    scrollTop: scrollTop
  };

}]);
