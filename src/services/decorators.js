angular.module('schemaForm').provider('schemaFormDecorators',['$compileProvider',function($compileProvider){
  var defaultDecorator = '';
  var directives = {};

  var templateUrl = function(name,form) {
    //schemaDecorator is alias for whatever is set as default
    if (name === 'sfDecorator') {
      name = defaultDecorator;
    }

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


  var createDirective = function(name){
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


              if (form) {
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
              }
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

            scope.clickButton = function($event,form) {
              if (angular.isFunction(form.onClick)) {
                form.onClick($event,form);
              } else if (angular.isString(form.onClick)) {
                scope.$eval(form.onClick,{'$event':$event,form:form});
              }
            };
          }
        };
      }]);
  };

  /**
   * Create a decorator directive
   * The directive can be used to create form fields or other form entities.
   * It can be used in conjunction with <schema-form> directive in which case the decorator is
   * given it's configuration via a the "form" attribute.
   *
   * ex. Basic usage with form and schema
   *   <sf-decorator form="myform" schema="myschema"></sf-decorator>
   *
   * ex. "Manual" usage
   *   <sf-decorator sf-type="" sf-title=""
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

    if (!directives[defaultDecorator]) {
      defaultDecorator = name;
    }
    createDirective(name);
  };


  /**
   * Getter for directive mappings
   * Can be used to override a mapping or add a rule
   * @param {string} name (optional) defaults to defaultDecorator
   * @return {Object} rules and mappings { rules: [],mappings: {}}
   */
  this.directive = function(name) {
    name = name || defaultDecorator;
    return directives[name];
  };


  //Service is just a getter for directive mappings and rules
  this.$get = function(){
    return {
      directive: function(name) {
        return directives[name];
      },
      defaultDecorator: defaultDecorator
    };
  };


  //Create a default directive
  createDirective('sfDecorator');

}]);