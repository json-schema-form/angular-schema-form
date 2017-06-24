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

describe('sf-array.directive.js', function() {
  var exampleSchema;
  beforeEach(module('schemaForm'));
  beforeEach(
    module(function($sceProvider) {
      $sceProvider.enabled(false);

      exampleSchema = {
        "type": "object",
        "properties": {
          "names": {
            "type": "array",
            "description": "foobar",
            "items": {
              "title": "Name",
              "type": "string",
              "default": 6,
            },
          },
        },
      };
    })
  );

  it('should not throw needless errors on validate [ノಠ益ಠ]ノ彡┻━┻', function(done) {
    tmpl = angular.element(
      '<form name="testform" sf-schema="schema" sf-form="form" sf-model="model" json="{{model | json}}"></form>'
    );

    inject(function($compile, $rootScope) {
      var scope = $rootScope.$new();
      scope.model = {};

      scope.schema = exampleSchema;

      scope.form = [ "*" ];

      $compile(tmpl)(scope);
      runSync(scope, tmpl);

      tmpl.find('div.help-block').text().should.equal('foobar');

      var add = tmpl.find('button').eq(1);
      add.click();

      $rootScope.$apply();

      setTimeout(function() {
        var errors = tmpl.find('.help-block');
        errors.text().should.equal('foobar');
        done();
      }, 0);
      // tmpl.$valid.should.be.true;
    });
  });
});
