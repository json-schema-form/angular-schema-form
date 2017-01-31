chai.should();

describe('directive', function() {
  beforeEach(module('schemaForm'));
  beforeEach(
    module(function($sceProvider) {
      $sceProvider.enabled(false);
    })
  );

  exampleSchema = {
    "type": "object",
    "title": "Person",
    "properties": {
      "name": {
        "title": "Name",
        "type": "string",
        "minLength": 10
      },
      "email": {
        "type": "string",
        "maxLength": 255,
        "format": "email",
        "email": true
      }
    }
  };

  it('should validate the form on event [ノಠ益ಠ]ノ彡┻━┻', function() {

    tmpl = angular.element(
      '<div>' +
        '<form name="testform" sf-schema="schema" sf-form="form" sf-model="obj"></form>' +
        '<input class="validate" type="button" ng-click="validate_all()" />' +
      '</div>'
    );

    inject(function($compile,$rootScope) {
      var scope = $rootScope.$new();
      scope.obj = { "name": "Json" };

      scope.schema = exampleSchema;

      scope.form = ["*"];

      scope.validate_all = function() {
        scope.$broadcast('schemaFormValidate');
      };

      $compile(tmpl)(scope);
      $rootScope.$apply();

      var form = tmpl.find('form').eq(0).controller('form');

      form.$valid.should.be.true;
      scope.validate_all.should.not.have.beenCalled;
      tmpl.find('input.validate').click();
      scope.validate_all.should.have.beenCalledOnce;
      form.$valid.should.be.false;

    });
  });

  it('should process custom tv4 errors', function() {

    tmpl = angular.element(
      '<div>' +
        '<form name="testform" sf-schema="schema" sf-form="form" sf-model="obj"></form>' +
        '<input class="validate" type="button" ng-click="validate_all()" />{{obj}}' +
      '</div>'
    );

    inject(function($compile,$rootScope) {
      tv4.defineError('EMAIL', 10001, 'Invalid email address');
      tv4.defineKeyword('email', function(data, value, schema) {
        if (schema.email) {
          if (/^\S+@\S+$/.test(data)) {
            return null;
          }
          return {
            code: 10001
          };
        }
        return null;
      });

      var scope = $rootScope.$new();
      scope.obj = { "email": "NULL" };

      scope.schema = exampleSchema;

      scope.form = [{
        "key": "email",
        "placeholder": "Enter contact email",
        "feedback": false
      }];

      scope.validate_all = function() {
        scope.$broadcast('schemaFormValidate');
      };

      $compile(tmpl)(scope);
      $rootScope.$apply();

      var form = tmpl.find('form').eq(0).controller('form');

      form.$valid.should.be.true;
      scope.validate_all.should.not.have.beenCalled;
      tmpl.find('input.validate').click();
      scope.validate_all.should.have.beenCalledOnce;
      form.$valid.should.be.false;
    });
  });
});
