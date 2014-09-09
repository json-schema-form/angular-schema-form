chai.should();

describe('schemaFormDecorators', function() {
  beforeEach(module('schemaForm'));

  describe('#createDecorator', function() {
    it('should enable you to create new decorator directives',function(){
      module(function(schemaFormDecoratorsProvider){
        schemaFormDecoratorsProvider.createDecorator('foobar',{ 'foo':'/bar.html' },[angular.noop]);
      });

      inject(function($rootScope,$compile,$templateCache){
        $templateCache.put('/bar.html','<div class="yes">YES</div>');

        //Since our directive does a replace we need a wrapper to actually check the content.
        var templateWithWrap = angular.element('<div id="wrap"><foobar form="{ type: \'foo\'}"></foobar></div>');
        var template         = templateWithWrap.children().eq(0);

        $compile(template)($rootScope);
        $rootScope.$apply();
        templateWithWrap.children().length.should.equal(1);
        templateWithWrap.children().is('foobar').should.be.true;
        templateWithWrap.children().eq(0).children().length.should.equal(1);
        templateWithWrap.children().eq(0).children().is('div').should.be.true;
        templateWithWrap.children().eq(0).children().hasClass('yes').should.be.true;
      });
    });
  });
});
