angular.module('schemaForm').config(
       ['schemaFormProvider','schemaFormDecoratorsProvider',
function(schemaFormProvider,  schemaFormDecoratorsProvider){

  var datepicker = function(name,schema,options) {
    if (schema.type === 'string' && schema.format == "date") {
      var f = schemaFormProvider.stdFormObj(schema,options);
      f.key  = options.path;
      f.type = 'datepicker';
      options.lookup[ObjectPath.stringify(options.path)] = f;
      return f;
    }
  };

  schemaFormProvider.defaults.string.unshift(datepicker);

  //Add to the bootstrap directive
  schemaFormDecoratorsProvider.addMapping('bootstrapDecorator','datepicker','directives/decorators/bootstrap/datepicker/datepicker.html');
  schemaFormDecoratorsProvider.createDirective('datepicker','directives/decorators/bootstrap/datepicker/datepicker.html');

}]);
