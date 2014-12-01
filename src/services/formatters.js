angular.module('schemaForm').factory('formFormatters', [function () {
  var formatters = {
    'carNumber': function (input) {
      if (/^[a-zA-Z]{2}\s?\d{5}$/.test(input)) {
        input = input.replace(/^([a-zA-Z]{2})\s?(\d{5})$/, function (text, letters, numbers) {
          return letters.toUpperCase() + numbers;
        });
      }

      return input;
    }
  };

  return {
    getFormatter: function (type) {
      return formatters[type];
    }
  };

}]);
