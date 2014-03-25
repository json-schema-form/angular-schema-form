angular.module('schemaForm').directive('bootstrapDecorator',
       ['$parse','$compile','$http','$templateCache',
function($parse,  $compile,  $http,  $templateCache){

  var templateUrl = function(form) {
      //readonly is a special case
      if (form.readonly && form.key && form.type !== 'fieldset') {
        return 'directives/decorators/bootstrap/readonly.html';
      }
      if (form.type  === 'textarea') {
        return 'directives/decorators/bootstrap/textarea.html';
      }
      if (form.type  === 'fieldset') {
        return 'directives/decorators/bootstrap/fieldset.html';
      }
      if (form.type  === 'section') {
        return 'directives/decorators/bootstrap/section.html';
      }
      if (form.type  === 'select') {
        return 'directives/decorators/bootstrap/select.html';
      }
      if (form.type  === 'checkbox') {
        return 'directives/decorators/bootstrap/checkbox.html';
      }
      if (form.type  === 'checkboxes') {
        return 'directives/decorators/bootstrap/checkboxes.html';
      }
      if (form.type  === 'number') {
        return 'directives/decorators/bootstrap/default.html';
      }
      if (form.type  === 'submit') {
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
        $http.get(templateUrl(form),{ cache: $templateCache }).then(function(res){
          var template = res.data.replace(/\$\$value\$\$/g,'model.'+form.key);
          $compile(template)(scope,function(clone){
            element.replaceWith(clone);
          });
        });
        once();
      });

      //Keep error prone logic from the template
      scope.showTitle = function() {
        return scope.form && scope.form.notitle !== true && scope.form.title;
      };

      scope.checkboxValuesToList = function(values){
        var lst = [];
        angular.forEach(values,function(v,k){
          if (v) {
            lst.push(k);
          }
        });
        return lst;
      };
    }
  };
}]);

