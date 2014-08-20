angular.module('schemaForm').config(
['schemaFormProvider', 'schemaFormDecoratorsProvider', 'sfPathProvider',
  function(schemaFormProvider,  schemaFormDecoratorsProvider, sfPathProvider) {

    var colorpicker = function(name, schema, options) {
    if (schema.type === 'string' && schema.format == 'color') {
      var f = schemaFormProvider.stdFormObj(name, schema, options);
      f.key  = options.path;
      f.type = 'colorpicker';
      options.lookup[sfPathProvider.stringify(options.path)] = f;
      return f;
    }
  };

    schemaFormProvider.defaults.string.unshift(colorpicker);

  //Add to the bootstrap directive
    schemaFormDecoratorsProvider.addMapping('bootstrapDecorator', 'colorpicker',
    'directives/decorators/bootstrap/colorpicker/colorpicker.html');
    schemaFormDecoratorsProvider.createDirective('colorpicker',
    'directives/decorators/bootstrap/colorpicker/colorpicker.html');
  }]);
