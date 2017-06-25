/* eslint-disable quotes, no-var */
/* disabling quotes makes it easier to copy tests into the example app */
chai.should();

var runSync = function (scope, tmpl) {
  var directiveScope = tmpl.isolateScope();
  sinon.stub(directiveScope, 'resolveReferences', function(schema, form) {
    directiveScope.render(schema, form);
  });
  scope.$apply();
};

describe('sf-field.directive.js', function() {
  beforeEach(module('schemaForm'));
  beforeEach(
    module(function($sceProvider) {
      $sceProvider.enabled(false);
    })
  );

  var keyTests = [
    {
      "name": "array of objects",
      "targetKey": [ "arrayOfObjects", 0, "stringVal" ],

      "schema": {
        "type": "object",
        "properties": {
          "arrayOfObjects": {
            "type": "array",
            "items": {
              "type": "object",
              "properties": {
                "stringVal": {
                  "type": "string",
                  "x-schema-form": {
                    "htmlClass": "targetKey",
                  },
                },
              },
            },
          },
        },
      },

      "form": [
        {
          "key": "arrayOfObjects",
          "items": [
            {
              "key": "arrayOfObjects[].stringVal",
            },
          ],
        },
      ],
    },

    {
      "name": "array of strings",
      "targetKey": [ "arrayOfStrings", 0 ],

      "schema": {
        "type": "object",
        "properties": {
          "arrayOfStrings": {
            "type": "array",
            "items": {
              "type": "string",
              "x-schema-form": {
                htmlClass: "targetKey",
              },
            },
          },
        },
      },
    },
  ];

  keyTests.forEach(function(keyTest) {
    it('should generate correct form keys for ' + keyTest.name, function(done) {
      inject(function($compile, $rootScope) {
        var scope = $rootScope.$new();
        scope.model = {};
        scope.schema = keyTest.schema;

        var tmpl = angular.element('<form sf-schema="schema" sf-model="model"></form>');

        $compile(tmpl)(scope);
        runSync(scope, tmpl);

        tmpl.children().find('.targetKey').scope().form.key.should.deep.equal(keyTest.targetKey);
        done();
      });
    });

    if (keyTest.form) {
      it('should generate correct form keys for ' + keyTest.name + ' with user specified form', function(done) {
        inject(function($compile, $rootScope) {
          var scope = $rootScope.$new();
          scope.model = {};
          scope.schema = keyTest.schema;
          scope.form = keyTest.form;

          var tmpl = angular.element('<form sf-schema="schema" sf-form="form" sf-model="model"></form>');

          $compile(tmpl)(scope);
          runSync(scope, tmpl);

          tmpl.children().find('.targetKey').scope().form.key.should.deep.equal(keyTest.targetKey);
          done();
        });
      });
    }
  });
});
