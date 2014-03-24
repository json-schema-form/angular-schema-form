/*
FIXME: real documentation
<form sf-form="form" sf-schema="schema" sf-decorator="foobar"></form>
*/

angular.module('schemaForm')
       .directive('sfSchema',
       ['$compile','schemaForm',
function($compile,  schemaForm){


  return {
    scope: {
      schema: '=sfSchema',
      initialForm: '=sfForm',
      model: '=sfModel'
    },
    replace: false,
    restrict: "A",
    transclude: true,
    link: function(scope,element,attrs,_,transclude) {

      //We'd like to handle existing markup,
      //besides using it in our template we also
      //check for ng-model and add that to an ignore list
      //i.e. even if form has a definition for it or form is ["*"]
      //we don't generate it.
      var ignore = {};
      transclude(scope,function(clone){
        clone.addClass('schema-form-ignore');
        element.prepend(clone);
        element.find('[ng-model]').each(function(){
          var key = this.getAttribute('ng-model');
          //skip first part before .
          ignore[key.substring(key.indexOf('.')+1)] = true;
        });

      });
      //Since we are dependant on up to three
      //attributes we'll do a common watch
      var lastDigest = {};

      scope.$watch(function(){
        var schema = scope.schema;
        var form   = scope.initialForm || ['*'];

        if (form && schema && (lastDigest.form !== form || lastDigest.schema !== schema)) {
          lastDigest.schema = schema;
          lastDigest.form = form;

          //FIXME: traverse schema and model and set default values.

          var merged = schemaForm.merge(schema,form,ignore);
          var frag = document.createDocumentFragment();

          //make the form available to decorators
          scope.schemaForm  = { form:  merged, schema: schema };

          //Create directives from the form definition
          angular.forEach(merged,function(obj,i){
            var n = document.createElement(attrs.sfDecorator || 'bootstrap-decorator');
            n.setAttribute('type',obj.type);
            n.setAttribute('form','schemaForm.form['+i+']');
            //n.setAttribute('schema','schemaForm.schema');
            //if (obj.key) {
            //  n.setAttribute('value','model.'+obj.key);
            //}
            frag.appendChild(n);

          });

          //clean all but pre existing html.
          element.children(':not(.schema-form-ignore)').remove();

          element[0].appendChild(frag);

          //compile only children
          $compile(element.children())(scope);
        }
      });
    }
  };
}]);







