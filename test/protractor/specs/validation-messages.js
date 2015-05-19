/* global browser, it, describe, element, by */

describe('Schema Form validation messages', function() {

  describe('#string', function() {
    var URL = 'http://localhost:8080/examples/bootstrap-example.html#/86fb7505a8ab6a43bc70';

    it('should not complain if it gets a normal string', function() {
      browser.get(URL);
      var input = element.all(by.css('form[name=ngform] input')).first();
      input.sendKeys('string');

      expect(input.getAttribute('value')).toEqual('string');
      expect(input.evaluate('ngModel.$valid')).toEqual(true);

    });


    var validationMessageTestBuider = function(nr, value, validationMessage) {
      it('should say "' + validationMessage + '" when input is ' + value, function() {
        browser.get(URL);
        var input = element.all(by.css('form[name=ngform] input')).get(nr);
        input.sendKeys(value);

        var message = element.all(by.css('form[name=ngform] div[sf-message]')).get(nr);
        expect(input.evaluate('ngModel.$valid')).toEqual(false);
        expect(message.getText()).toEqual(validationMessage);

      });
    };

    var stringTests = {
      's': 'String is too short (1 chars), minimum 3',
      'tooo long string': 'String is too long (11 chars), maximum 10',
      'foo 66': 'String does not match pattern: ^[a-zA-Z ]+$'
    };

    Object.keys(stringTests).forEach(function(value) {
      validationMessageTestBuider(0, value, stringTests[value]);
    });


    var integerTests = {
      '3': '3 is less than the allowed minimum of 6',
      '66': '66 is greater than the allowed maximum of 50',
      '11': 'Value is not a multiple of 3',
      'aaa': 'Value is not a valid number'
    };

    Object.keys(integerTests).forEach(function(value) {
      validationMessageTestBuider(1, value, integerTests[value]);
    });


    it('should say "Required" when fields are required', function() {
      browser.get(URL);
      element.all(by.css('form[name=ngform]')).submit();
      var input = element.all(by.css('form[name=ngform] input')).get(1);

      var message = element.all(by.css('form[name=ngform] div[sf-message]')).get(1);
      expect(input.evaluate('ngModel.$valid')).toEqual(false);
      expect(message.getText()).toEqual('Required');

    });
  });
});
