angular.module('schemaForm').directive('bootstrapDecorator',
       ['$parse','$compile','$http','$templateCache',
function($parse,  $compile,  $http,  $templateCache){

  var templateUrl = function(type) {
      if (type  === 'fieldset') {
        return 'directives/decorators/bootstrap/fieldset.html';
      }
      if (type  === 'select') {
        return 'directives/decorators/bootstrap/select.html';
      }
      if (type  === 'checkbox') {
        return 'directives/decorators/bootstrap/checkbox.html';
      }
      if (type  === 'number') {
        return 'directives/decorators/bootstrap/number.html';
      }
      if (type  === 'submit') {
        return 'directives/decorators/bootstrap/submit.html';
      }
      return 'directives/decorators/bootstrap/default.html';
  };



  return {
    restrict: 'AE',
    replace: true,
    transclude: false,
    scope: true,

    link: function(scope,element,attrs) {

      //rebind our part of the form to the scope.
      var once = scope.$watch(attrs.form,function(form){
        scope.form  = form;

        //ok let's replace that template!
        //We do this manually since we need to bind ng-model properly and also
        //for fieldsets to recurse properly.
        $http.get(templateUrl(form.type),{ cache: $templateCache }).then(function(res){
          var template = res.data.replace('$$value$$','model.'+form.key);
          $compile(template)(scope,function(clone){
            element.replaceWith(clone);
          });
        });
        once();
      });
    }

  };
}]);

