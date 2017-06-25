/* eslint-disable quotes, no-var */
/* disabling quotes makes it easier to copy tests into the example app */
chai.should();

var runSync = function(scope, tmpl) {
  var directiveScope = tmpl.isolateScope();
  sinon.stub(directiveScope, 'resolveReferences', function(schema, form) {
    directiveScope.render(schema, form);
  });
  scope.$apply();
};

describe('schema-validate.directive.js', function() {
  var tmpl;
  var exampleSchema;
  beforeEach(module('schemaForm'));
  beforeEach(
    module(function($sceProvider) {
      $sceProvider.enabled(false);
      exampleSchema = {
        "type": "object",
        "title": "Person",
        "properties": {
          "name": {
            "title": "Name",
            "type": "string",
            "minLength": 10,
          },
          "email": {
            "type": "string",
            "maxLength": 255,
            "format": "email",
            "email": true,
          },
        },
      };
    })

  );

  tv4.defineError('EMAIL', 10001, 'Invalid email address');
  tv4.defineKeyword('email', function(data, value, schema) {
    if (schema.email) {
      if (/^\S+@\S+$/.test(data)) {
        return null;
      }
      return {
        code: 10001,
      };
    }
    return null;
  });


  it('should validate the form on event [ノಠ益ಠ]ノ彡┻━┻', function() {
    tmpl = angular.element('<form name="testform" sf-schema="schema" sf-form="form" sf-model="obj"></form>');

    inject(function($compile, $rootScope) {
      var scope = $rootScope.$new();
      scope.obj = { "name": "Freddy" };

      scope.schema = exampleSchema;

      scope.form = [
        "*",
        {
          "type": "button",
          "style": "validate",
          "onClick": "validate_all()",
        },
      ];

      scope.validate_all = function() {
        scope.$broadcast('schemaFormValidate');
      };

      $compile(tmpl)(scope);
      runSync(scope, tmpl);

      var form = tmpl.eq(0).controller('form');

      form.$valid.should.be.true;
      scope.validate_all.should.not.have.beenCalled;
      tmpl.find('button.validate').click();
      scope.validate_all.should.have.beenCalledOnce;
      form.$valid.should.be.false;
    });
  });

  it('should process custom tv4 errors', function() {
    tmpl = angular.element('<form name="testform" sf-schema="schema" sf-form="form" sf-model="obj"></form>');

    inject(function($compile, $rootScope) {
      var scope = $rootScope.$new();
      scope.obj = { "email": "NULL" };

      scope.schema = exampleSchema;

      scope.form = [
        {
          "key": "email",
          "placeholder": "Enter contact email",
          "feedback": false,
        },
        {
          "type": "button",
          "style": "validate",
          "onClick": "validate_all()",
        },
      ];

      scope.validate_all = function() {
        scope.$broadcast('schemaFormValidate');
      };

      $compile(tmpl)(scope);
      runSync(scope, tmpl);

      var form = tmpl.eq(0).controller('form');

      form.$valid.should.be.true;
      scope.validate_all.should.not.have.beenCalled;
      angular.element(tmpl.find('#testform-email')).val('invalid').trigger('input');
      tmpl.find('button.validate').click();
      scope.validate_all.should.have.beenCalledOnce;
      form.$valid.should.be.false;
      form.$error['tv4-10001'].should.be.false;
    });
  });

  it('should allow custom tv4 error default message to be set', function() {
  // TODO test message rename
  // app.config(['sfErrorMessageProvider', function(sfErrorMessageProvider) {
  //     sfErrorMessageProvider.setDefaultMessage(10001, 'Whoa! Can you double check that email address for me?');
  // }]);

    tmpl = angular.element(
      '<div>' +
        '<form name="testform" sf-schema="schema" sf-form="form" sf-model="obj"></form>' +
        '{{obj}}' +
      '</div>'
    );

    inject(function($compile, $rootScope) {
      var scope = $rootScope.$new();
      scope.obj = { "email": "NULL" };

      scope.schema = exampleSchema;

      scope.form = [
        {
          "key": "email",
          "placeholder": "Enter contact email",
          "feedback": false,
        },
        {
          "type": "submit",
          "style": "btn-info",
          "title": "OK",
        },
      ];

      $compile(tmpl)(scope);
      tmpl.find('form').each(function() {
        runSync(scope, $(this));
      });

      var form = tmpl.find('form').eq(0).controller('form');

      form.$valid.should.be.true;
      tmpl.find('input.btn-info').click();
      // TODO form.$valid.should.be.false;
    });
  });
});
