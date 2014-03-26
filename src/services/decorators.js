angular.module('schemaForm').provider('schemaFormDecorators',['$compileProvider',function($compileProvider){

  var directives = {};


  var templateUrl = function(name,form) {
    var directive = directives[name];

    //rules first
    var rules = directive.rules;
    for (var i = 0; i< rules.length; i++) {
      var res = rules[i](form);
      if (res) {
        return res;
      }
    }

    //then check mapping
    if (directive.mappings[form.type]) {
      return directive.mappings[form.type];
    }

    //try default
    return directive.mappings['default'];
  };


  /**
   * Create a decorator directive
   * @param {string} name directive name (CamelCased)
   * @param {Object} mappings, an object that maps "type" => "templateUrl"
   * @param {Array}  rules (optional) a list of functions, function(form){}, that are each tried in turn,
   *                 if they return a string then that is used as the templateUrl. Rules come before
   *                 mappings.
   */
  this.create = function(name,mappings,rules){
    directives[name] = {
      mappings: mappings || {},
      rules:    rules    || []
    };

    $compileProvider.directive(name,['$parse','$compile','$http','$templateCache',
      function($parse,  $compile,  $http,  $templateCache){

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
              var url = templateUrl(name,form);
              $http.get(url,{ cache: $templateCache }).then(function(res){
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
  };

  /**
   * Getter for directive mappings
   * Can be used to override a mapping or add a rule
   * @param {string} name
   * @return {Object} rules and mappings { rules: [],mappings: {}}
   */
  this.directive = function(name) {
    return directives[name];
  };


  //Service is just a getter for directive mappings and rules
  this.$get = function(){
    return function(name) {
      return directives[name];
    };
  };

}]);