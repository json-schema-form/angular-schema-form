chai.should();

describe('directive',function() {
  beforeEach(module('schemaForm'));
  beforeEach(
    //We don't need no sanitation. We don't need no thought control.
    module(function($sceProvider){
      $sceProvider.enabled(false);
    })
  );

  it('should watch description for changes', function(done) {

    var exampleSchema = {
      "type": "object",
      "properties": {
        "name": {
          "title": "Name",
          "type": "string"
        }
      }
    };

    inject(function($compile,$rootScope) {
      var scope = $rootScope.$new();
      scope.person = {};

      scope.schema = exampleSchema;

      scope.form = [{
        key: 'name',
        description: 'foobar'
      }];

      var tmpl = angular.element('<form sf-schema="schema" sf-form="form" sf-model="person"></form>');

      $compile(tmpl)(scope);
      $rootScope.$apply();
      console.log(tmpl.children().find('div.help-block')[0]);
      tmpl.children().find('div.help-block').text().should.equal('foobar');

      setTimeout(function() {
        scope.form[0].description = 'changed';
        scope.$apply();
        tmpl.children().find('div.help-block').text().should.equal('changed');
        done();
      },0);

    });
  });
});
