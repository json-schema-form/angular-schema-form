angular.module('schemaForm').factory('formFormatters', [function () {
  var formatters = {
    'carNumber': function (input) {
      if (/^[a-zA-Z]{2}\s?\d{5}$/.test(input)) {
        input = input.replace(/^([a-zA-Z]{2})\s?(\d{5})$/, function (text, letters, numbers) {
          return letters.toUpperCase() + numbers;
        });
      }

      return input;
    },
    'number': function (input) {
      var parsed = parseInt(input, 10);
      if (isNaN(parsed)) {
        return undefined;
      } else {
        return parsed;
      }
    },
    'phoneNumber': function(input){
      input = input.replace(/\s+/g, '');
      input = input.replace(/\-+/g, '');

      if (/^\\d{8}$/.test(input)) {
        return input;
      }
    }
  };

  return {
    getFormatter: function (type) {
      return formatters[type];
    }
  };

}]);
