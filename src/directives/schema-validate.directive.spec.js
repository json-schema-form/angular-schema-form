chai.should();

describe('directive', function() {
  beforeEach(module('schemaForm'));
  beforeEach(
    module(function($sceProvider) {
      $sceProvider.enabled(false);
    })
  );

  var exampleSchema = {
    "type": "object",
    "title": "Person",
    "properties": {
      "name": {
        "title": "Name",
        "type": "string",
        "minLength": 10
      }
    }
  };

  it('should handle buttons', function() {
    inject(function($compile,$rootScope) {
      var scope = $rootScope.$new();
      scope.obj = { "name": "Json" };

      scope.schema = exampleSchema;

      scope.form = ["*"];

      scope.validate_all = function() {
        scope.$broadcast('schemaFormValidate');
      };

      var tmpl = angular.element(
        '<div>' +
          '<form name="testform" sf-schema="schema" sf-form="form" sf-model="obj"></form>' +
          '<input class="validate" type="button" ng-click="validate_all()" />' +
        '</div>'
      );

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
