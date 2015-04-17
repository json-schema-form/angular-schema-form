describe('Schema Form custom validators', function() {
  it('should have a form with content', function() {
    browser.get('http://localhost:8080/examples/custom-validators.html');

    expect(element(by.css('form')).getInnerHtml()).not.toEqual('');
  });

  describe('#name', function() {
    it('should not complain if it gets a normal name', function() {
      browser.get('http://localhost:8080/examples/custom-validators.html');
      var input = element.all(by.css('form input')).first();
      input.sendKeys('Joe Schmoe');

      expect(input.getAttribute('value')).toEqual('Joe Schmoe');
      expect(input.evaluate('ngModel.$valid')).toEqual(true);

    });

    it('should complain if it gets a "Bob" as a name', function() {
      browser.get('http://localhost:8080/examples/custom-validators.html');
      var input = element.all(by.css('form input')).first();
      input.sendKeys('Bob');

      expect(input.getAttribute('value')).toEqual('Bob');
      expect(input.evaluate('ngModel.$valid')).toEqual(false);
    });
  });

  describe('#email', function() {
    it('should not complain if it gets a normal email', function() {
      browser.get('http://localhost:8080/examples/custom-validators.html');
      var input = element.all(by.css('form input')).get(1);
      input.sendKeys('foo@mailinator.com');

      expect(input.getAttribute('value')).toEqual('foo@mailinator.com');
      expect(input.evaluate('ngModel.$valid')).toEqual(true);

    });

    it('should complain if it gets a my email', function() {
      browser.get('http://localhost:8080/examples/custom-validators.html');
      var input = element.all(by.css('form input')).get(1);
      input.sendKeys('david.lgj@gmail.com');

      expect(input.getAttribute('value')).toEqual('david.lgj@gmail.com');
      expect(input.evaluate('ngModel.$valid')).toEqual(false);
    });
  });

  describe('#comment', function() {
    it('should not complain if it gets a normal email', function() {
      browser.get('http://localhost:8080/examples/custom-validators.html');
      var input = element.all(by.css('form input')).get(1);
      input.sendKeys('foo@mailinator.com');

      expect(input.getAttribute('value')).toEqual('foo@mailinator.com');
      expect(input.evaluate('ngModel.$valid')).toEqual(true);

    });

    it('should complain if it gets a my email', function() {
      browser.get('http://localhost:8080/examples/custom-validators.html');
      var input = element.all(by.css('form input')).get(1);
      input.sendKeys('david.lgj@gmail.com');

      expect(input.getAttribute('value')).toEqual('david.lgj@gmail.com');
      expect(input.evaluate('ngModel.$valid')).toEqual(false);
    });
  });




});
