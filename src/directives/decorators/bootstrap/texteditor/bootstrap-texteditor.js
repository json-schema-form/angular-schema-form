angular.module('schemaForm').config(
       ['schemaFormProvider','schemaFormDecoratorsProvider','sfPathProvider',
function(schemaFormProvider,  schemaFormDecoratorsProvider, sfPathProvider){

  var texteditor = function(name,schema,options) {
    if (schema.type === 'string' && schema.format == "editor") {
      var f = schemaFormProvider.stdFormObj(name,schema,options);
      f.key  = options.path;
      f.type = 'texteditor';
      options.lookup[sfPathProvider.stringify(options.path)] = f;
      return f;
    }
  };

  schemaFormProvider.defaults.string.unshift(texteditor);

  //Add to the bootstrap directive
  schemaFormDecoratorsProvider.addMapping('bootstrapDecorator','texteditor','directives/decorators/bootstrap/texteditor/texteditor.html');
  schemaFormDecoratorsProvider.createDirective('texteditor','directives/decorators/bootstrap/texteditor/texteditor.html');

}]);
