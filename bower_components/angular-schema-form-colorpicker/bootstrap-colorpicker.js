angular.module("schemaForm").run(["$templateCache", function($templateCache) {$templateCache.put("directives/decorators/bootstrap/colorpicker/colorpicker.html","<div class=\"form-group\" ng-class=\"{\'has-error\': hasError()}\">\n  <label class=\"control-label\" ng-show=\"showTitle()\">{{form.title}}</label>\n  <div>\n    <spectrum-colorpicker\n      ng-model=\"$$value$$\"\n      format=\"form.colorFormat || \'rgb\'\"\n      style=\"background-color: white\"\n      type=\"color\"\n      schema-validate=\"form\"\n      options=\"form.spectrumOptions || {\n        showInput: true,\n        showAlpha: true,\n        allowEmpty: true,\n        showPalette: true,\n        preferredFormat: form.colorFormat || \'rgb\',\n        palette: [[\'#fce94f\', \'#fcaf3e\', \'#e9b96e\'],\n                  [\'#8ae234\', \'#729fcf\', \'#ad7fa8\'],\n                  [\'#ef2929\', \'#888a85\', \'#deface\']]\n      }\"></spectrum-colorpicker>\n</div>\n  <span class=\"help-block\">{{ (hasError() && errorMessage(schemaError())) || form.description}}</span>\n</div>\n");}]);
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
