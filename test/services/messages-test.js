chai.should();

describe('schemaFormServices', function() {
  beforeEach(module('schemaForm'));

  describe('#sfErrorMessage', function() {
    it('should fall back to global default message if no other is supplied', function() {
      inject(function(sfErrorMessage) {

        var result = sfErrorMessage.interpolate(
          'foobar-error',              //error
          'foobar',                    //value
          {schema: {title: 'Foo'}},   //form
          {'default': 'Oh noes!'}
        );

        result.should.be.eq('Oh noes!');

      });
    });

    it('should use form definition default message if no other is supplied', function() {
      inject(function(sfErrorMessage) {

        var result = sfErrorMessage.interpolate(
          'foobar-error',              //error
          'foobar',                    //value
          {validationMessage: {'default': 'Oh yes!'}, schema: {title: 'Foo'}},   //form
          {'default': 'Oh noes!'}
        );

        result.should.be.eq('Oh yes!');

      });
    });

    it('should use the matching error from global validationMessage', function() {
      inject(function(sfErrorMessage) {

        var result = sfErrorMessage.interpolate(
          'foobar-error',              //error
          'foobar',                    //value
          {schema: {title: 'Foo'}},   //form
          {'default': 'Oh noes!', 'foobar-error': 'Aw chucks!'}
        );

        result.should.be.eq('Aw chucks!');
      });
    });

    it('should use the matching error from form validationMessage', function() {
      inject(function(sfErrorMessage) {

        var result = sfErrorMessage.interpolate(
          'foobar-error',              //error
          'foobar',                    //value
          {schema: {title: 'Foo'}, validationMessage: {'foobar-error': 'Noooooo!'}},   //form
          {'default': 'Oh noes!', 'foobar-error': 'Aw chucks!'}
        );

        result.should.be.eq('Noooooo!');
      });
    });

    it('should interpolate messages', function() {
      inject(function(sfErrorMessage) {

        var result = sfErrorMessage.interpolate(
          'foobar-error',              //error
          'foobar',                    //value
          {
            schema: {title: 'Foo'},
            validationMessage: {
              'foobar-error': 'Noooooo! "{{title}}" should not be "{{value}}"'
            }
          },   //form
          {'default': 'Oh noes!'}
        );

        result.should.be.eq('Noooooo! "Foo" should not be "foobar"');
      });
    });

    it('should interpolate title in messages to either form or schema title', function() {
      inject(function(sfErrorMessage) {

        var result = sfErrorMessage.interpolate(
          'foobar-error',              //error
          'foobar',                    //value
          {
            schema: {title: 'Foo'},
            validationMessage: {
              'foobar-error': '{{title}}'
            }
          },   //form
          {'default': 'Oh noes!'}
        );

        result.should.be.eq('Foo');

        result = sfErrorMessage.interpolate(
          'foobar-error',              //error
          'foobar',                    //value
          {
            title: 'Bar',
            schema: {title: 'Foo'},
            validationMessage: {
              'foobar-error': '{{title}}'
            }
          },   //form
          {'default': 'Oh noes!'}
        );

        result.should.be.eq('Bar');
      });
    });

    it('should handle valdationMessage set to just a string', function() {
      inject(function(sfErrorMessage) {

        var result = sfErrorMessage.interpolate(
          'foobar-error',              //error
          'foobar',                    //value
          {
            schema: {title: 'Foo'},
            validationMessage: 'Huh?'
          },   //form
          {'default': 'Oh noes!'}
        );

        result.should.be.eq('Huh?');
      });
    });

    it('should handle valdationMessages being functions', function() {
      inject(function(sfErrorMessage) {

        var msgFn = sinon.stub().returns('Yes!');

        var result = sfErrorMessage.interpolate(
          'foobar-error',              //error
          'foobar',                    //value
          {
            schema: {title: 'Foo'},
            validationMessage: {
              'foobar-error': msgFn
            }
          },   //form
          {'default': 'Oh noes!'}
        );

        result.should.be.eq('Yes!');
        msgFn.should.have.been.calledOnce;
        msgFn.should.have.been.calledWith({
          error: 'foobar-error',
          value: 'foobar',
          form: {
            schema: {title: 'Foo'},
            validationMessage: {
              'foobar-error': msgFn
            }
          },
          schema: {title: 'Foo'},
          title: 'Foo'
        });
      });
    });

    it('should handle valdationMessage being a single function', function() {
      inject(function(sfErrorMessage) {

        var msgFn = sinon.stub().returns('Yes!');

        var result = sfErrorMessage.interpolate(
          'foobar-error',              //error
          'foobar',                    //value
          {
            schema: {title: 'Foo'},
            validationMessage: msgFn
          },   //form
          {'default': 'Oh noes!'}
        );

        result.should.be.eq('Yes!');
        msgFn.should.have.been.calledOnce;
        msgFn.should.have.been.calledWith({
          error: 'foobar-error',
          value: 'foobar',
          form: {
            schema: {title: 'Foo'},
            validationMessage: msgFn
          },
          schema: {title: 'Foo'},
          title: 'Foo'
        });
      });
    });

    it('should strip "tv4-" prefix from error code', function() {
      inject(function(sfErrorMessage) {

        var result = sfErrorMessage.interpolate(
          'tv4-302',              //error
          'foobar',                    //value
          {
            schema: {title: 'Foo'},
            validationMessage: {302: 'tv4 error!'}
          },   //form
          {'default': 'Oh noes!'}
        );

        result.should.be.eq('tv4 error!');
      });
    });

  });
});
