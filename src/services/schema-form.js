/**
 * Schema form service.
 * This service is not that useful outside of schema form directive
 * but makes the code more testable.
 */
angular.module('schemaForm').factory('schemaForm',[function(){
  var service = {};

  service.merge = function(schema,form,ignore) {
    form  = form || ["*"];

    var stdForm = service.defaults(schema,ignore);

    //simple case, we have a "*", just put the stdForm there
    var idx = form.indexOf("*");
    if (idx !== -1) {
      form  = form.slice(0,idx)
                  .concat(stdForm.form)
                  .concat(form.slice(idx+1));
      return form;
    }

    //ok let's merge!
    //We look at the supplied form and extend it with schema standards
    var lookup = stdForm.lookup;
    return form.map(function(obj){

      //handle the shortcut with just a name
      if (typeof obj === 'string') {
        obj = { key: obj };
      }

      //if it's a type with items, merge 'em!
      if (obj.items) {
        obj.items = service.merge(schema,obj.items,ignore);
      }


      //extend with std form from schema.
      if (obj.key && lookup[obj.key]) {
        return angular.extend(lookup[obj.key],obj);
      }

      return obj;
    });
  };

  //Creates a form object with all common properties
  var stdFormObj = function(schema,options) {
    var f = {};
    if (schema.title) f.title = schema.title;
    if (schema.description) f.description = schema.description;
    if (options.required === true || schema.required === true) f.required = true;
    if (schema.default) f.default = schema.default;
    if (schema.maxLength) f.maxlength = schema.maxLength;
    if (schema.minLength) f.minlength = schema.maxLength;
    if (schema.readOnly || schema.readonly)  f.readonly  = schema.readOnly || schema.readonly;
    if (schema.minimum) f.minimum = schema.minimum + (schema.exclusiveMinimum?1:0);
    if (schema.maximum) f.maximum = schema.maximum - (schema.exclusiveMaximum?1:0);
    f.schema = schema;
    return f;
  };


  var text = function(name,schema,options) {
    if (schema.type === 'string' && !schema.enum) {
      var f = stdFormObj(schema,options);
      f.key  = options.path;
      f.type = 'text';
      options.lookup[options.path] = f;
      return f;
    }
  };

  //default in json form for number and integer is a text field
  //input type="number" would be more suitable don't ya think?
  var number = function(name,schema,options) {
    if (schema.type === 'number') {
      var f = stdFormObj(schema,options);
      f.key  = options.path;
      f.type = 'number';
      options.lookup[options.path] = f;
      return f;
    }
  };

  var integer = function(name,schema,options) {
    if (schema.type === 'integer') {
      var f = stdFormObj(schema,options);
      f.key  = options.path;
      f.type = 'number';
      options.lookup[options.path] = f;
      return f;
    }
  };

  var bool = function(name,schema,options) {
    if (schema.type === 'boolean') {
      var f = stdFormObj(schema,options);
      f.key  = options.path;
      f.type = 'checkbox';
      options.lookup[options.path] = f;
      return f;
    }
  };


  var select = function(name,schema,options) {
    if (schema.type === 'string' && schema.enum) {
      var f = stdFormObj(schema,options);
      f.key  = options.path;
      f.type = 'select';
      f.titleMap = {};
      schema.enum.forEach(function(name){
        f.titleMap[name] = name;
      });
      options.lookup[options.path] = f;
      return f;
    }
  };

  var checkboxes = function(name,schema,options) {
    if (schema.type === 'array' && schema.items && schema.items.enum) {
      var f = stdFormObj(schema,options);
      f.key  = options.path;
      f.type = 'checkboxes';
      f.titleMap = {};
      schema.items.enum.forEach(function(name){
        f.titleMap[name] = name;
      });
      options.lookup[options.path] = f;
      return f;
    }
  };

  var fieldset = function(name,schema,options){

    if (schema.type === "object") {
      var f   = stdFormObj(schema,options);
      f.type  = 'fieldset';
      f.items = [];
      options.lookup[options.path] = f;

      //recurse down into properties
      angular.forEach(schema.properties,function(v,k){
        var path = options.path+'.'+k;
        if (options.ignore[path] !== true) {
          var required = schema.required && schema.required.indexOf(k) !== -1;

          var def = defaultFormDefinition(k,v,{
            path: path,
            required: required || false,
            lookup: options.lookup,
            ignore: options.ignore
          });
          if (def) {
            f.items.push(def);
          }
        }
      });

      return f;
    }

  };

  //TODO: make it pluginable, i.e. others can register handlers
  //TODO: maybe make first selection of handlers by type to optmize
  //Order has importance. First handler returning an form snippet will be used
  var defaults = [
    text,
    select,
    fieldset,
    number,
    integer,
    bool,
    checkboxes
  ];


  var defaultFormDefinition = function(name,schema,options){
    var def;
    for (var i=0;i<defaults.length; i++) {

      def = defaults[i](name,schema,options);
      //first handler in list that actually returns something is our handler!
      if (def) {
        return def;
      }
    }
  };


  /**
   * Create form defaults from schema
   */
  service.defaults = function(schema,ignore) {
    var form   = [];
    var lookup = {}; //Map path => form obj for fast lookup in merging
    ignore = ignore || {};

    if (schema.type === "object") {
      angular.forEach(schema.properties,function(v,k){
          if (ignore[k] !== true) {
            var required = schema.required && schema.required.indexOf(k) !== -1;
            var def = defaultFormDefinition(k,v,{
              path: k,        //path to this property in dot notation. Root object has no name
              lookup: lookup,    //extra map to register with. Optimization for merger.
              ignore: ignore,    //The ignore list of paths (sans root level name)
              required: required //Is it required? (v4 json schema style)
            });
            if (def) {
              form.push(def);
            }
          }
      });

    } else {
      throw new Exception('Not implemented. Only type "object" allowed at root level of schema.');
    }

    return { form: form, lookup: lookup };
  };


  return service;
}]);
