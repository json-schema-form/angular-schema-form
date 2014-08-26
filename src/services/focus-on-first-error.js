/**
 * @ngdoc service
 * @name sfSelect
 * @kind function
 *
 */
angular.module('schemaForm').factory('focusOnError', ['$timeout', function ($timeout) {

  var focusOnFirstError = function (element) {
    $timeout(function () {
      jQuery('html, body').animate({
        scrollTop: jQuery(element[0]).find('.has-error:first').offset().top-100
      }, 1000);
    }, 0);
  };

  return {
    focusOnError: focusOnFirstError
  };

}]);
