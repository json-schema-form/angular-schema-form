/*
FIXME: real documentation
<form sf-form="form" sf-schema="schema" sf-decorator="foobar"></form>
*/

angular.module('schemaForm')
       .directive('sfSchema',
       ['$compile','schemaForm','schemaFormDecorators',
function($compile,  schemaForm,  schemaFormDecorators){

  //recurse through the entire schema.
  //FIXME: no support for arrays
  var traverse = function(schema,fn,path) {
    path = path || "";
    fn(schema,path);
    angular.forEach(schema.properties,function(prop,name){
      traverse(prop,fn,path===""?name:path+'.'+name);
    });
  };

  var SNAKE_CASE_REGEXP = /[A-Z]/g;
  function snake_case(name, separator){
    separator = separator || '_';
    return name.replace(SNAKE_CASE_REGEXP, function(letter, pos) {
      return (pos ? separator : '') + letter.toLowerCase();
    });
  }

  return {
    scope: {
      schema: '=sfSchema',
      initialForm: '=sfForm',
      model: '=sfModel'
    },
    controller: ['$scope',function($scope){
      this.evalInParentScope = function(expr,locals){
        return $scope.$parent.$eval(expr,locals);
      };
    }],
    replace: false,
    restrict: "A",
    transclude: true,
    require: '?form',
    link: function(scope,element,attrs,formCtrl,transclude) {

      //expose form controller on scope so that we don't force authors to use name on form
      scope.formCtrl = formCtrl;

      //We'd like to handle existing markup,
      //besides using it in our template we also
      //check for ng-model and add that to an ignore list
      //i.e. even if form has a definition for it or form is ["*"]
      //we don't generate it.
      var ignore = {};
      transclude(scope,function(clone){
        clone.addClass('schema-form-ignore');
        element.prepend(clone);

        if (element[0].querySelectorAll) {
          var models = element[0].querySelectorAll('[ng-model]')
          if (models){
            for (var i=0; i < models.length; i++){
              var key = models[i].getAttribute('ng-model');
              //skip first part before .
              ignore[key.substring(key.indexOf('.')+1)] = true;
            }
          }
        }
      });
      //Since we are dependant on up to three
      //attributes we'll do a common watch
      var lastDigest = {};

      scope.$watch(function(){

        var schema = scope.schema;
        var form   = scope.initialForm || ['*'];

        //The check for schema.type is to ensure that schema is not {}
        if (form && schema && schema.type && (lastDigest.form !== form || lastDigest.schema !== schema)) {
          lastDigest.schema = schema;
          lastDigest.form = form;

          //FIXME: traverse schema and model and set default values.

          var merged = schemaForm.merge(schema,form,ignore);
          var frag = document.createDocumentFragment();

          //make the form available to decorators
          scope.schemaForm  = { form:  merged, schema: schema };

          //Create directives from the form definition
          angular.forEach(merged,function(obj,i){
            var n = document.createElement(attrs.sfDecorator || snake_case(schemaFormDecorators.defaultDecorator,'-'));
            n.setAttribute('form','schemaForm.form['+i+']');
            frag.appendChild(n);
          });

          //clean all but pre existing html.
          element.children(':not(.schema-form-ignore)').remove();

          element[0].appendChild(frag);

          //compile only children
          $compile(element.children())(scope);

          //ok, now that that is done let's set any defaults
          traverse(schema,function(prop,path){
            //This is probably not so fast, but a simple solution.
            if (angular.isDefined(prop['default'])) {
              scope.$eval('model.'+path+' = model.'+path+' || defaltValue',{ defaltValue: prop['default']});
            }
          });

        }
      });
    }
  };
}]);
