angular.module('schemaForm').provider('sfErrorMessage', function() {

  // The codes are tv4 error codes.
  // Not all of these can actually happen in a field, but for
  // we never know when one might pop up so it's best to cover them all.

  // TODO: Humanize these.
  var defaultMessages = {
    'default': 'Field does not validate',
    0: 'Invalid type, expected {{schema.type}})',
    1: 'No enum match for: {{value}}',
    10: 'Data does not match any schemas from "anyOf"',
    11: 'Data does not match any schemas from "oneOf"',
    12: 'Data is valid against more than one schema from "oneOf"',
    13: 'Data matches schema from "not"',
    // Numeric errors
    100: 'Value {{value}} is not a multiple of {{schema.multipleOf}}',
    101: 'Value {{value}} is less than minimum {{schema.minimum}}',
    102: 'Value {{value}} is equal to exclusive minimum {{schema.minimum}}',
    103: 'Value {{value}} is greater than maximum {{schema.maximum}}',
    104: 'Value {{value}} is equal to exclusive maximum {{schema.maximum}}',
    105: 'Value {{value}} is not a valid number',
    // String errors
    200: 'String is too short ({{value.length}} chars), minimum {{schema.minimum}}',
    201: 'String is too long ({{value.length}} chars), maximum {{schema.maximum}}',
    202: 'String does not match pattern: {{schema.pattern}}',
    // Object errors
    300: 'Too few properties defined, minimum {{schema.minimum}}',
    301: 'Too many properties defined, maximum {{schema.maximum}}',
    302: 'Required',
    303: 'Additional properties not allowed',
    304: 'Dependency failed - key must exist',
    // Array errors
    400: 'Array is too short ({{value.length}}), minimum {{schema.minimum}}',
    401: 'Array is too long ({{value.length}}), maximum {{schema.maximum}}',
    402: 'Array items are not unique',
    403: 'Additional items not allowed',
    // Format errors
    500: 'Format validation failed',
    501: 'Keyword failed: "{{title}}"',
    // Schema structure
    600: 'Circular $refs',
    // Non-standard validation options
    1000: 'Unknown property (not in schema)'
  };

  this.setDefaultMessages = function(messages) {
    defaultMessages = messages;
  };

  this.getDefaultMessages = function() {
    return defaultMessages;
  };

  this.setDefaultMessage = function(error, msg) {
    defaultMessages[error] = msg;
  };

  this.$get = ['$interpolate', function($interpolate) {

    var service = {};
    service.defaultMessages = defaultMessages;

    /**
     * Interpolate and return proper error for an eror code.
     * Validation message on form trumps global error messages.
     * and if the message is a function instead of a string that function will be called instead.
     * @param {string} error the error code, i.e. tv4-xxx for tv4 errors, otherwise it's whats on
     *                       ngModel.$error for custom errors.
     * @param {Any} value the actual model value.
     * @param {Object} form a form definition object for this field
     * @param  {Object} global the global validation messages object (even though its called global
     *                         its actually just shared in one instance of sf-schema)
     * @return {string} The error message.
     */
    service.interpolate = function(error, value, form, global) {
      global = global || {};
      var validationMessage = form.validationMessage || {};

      // Drop tv4 prefix so only the code is left.
      if (error.indexOf('tv4-') === 0) {
        error = error.substring(4);
      }

      // First find apropriate message or function
      var message = validationMessage['default'] || global['default'] || '';

      [validationMessage, global, defaultMessages].some(function(val) {
        if (angular.isString(val) || angular.isFunction(val)) {
          message = val;
          return true;
        }
        if (val && val[error]) {
          message = val[error];
          return true;
        }
      });

      var context = {
        error: error,
        value: value,
        form: form,
        schema: form.schema,
        title: form.title || (form.schema && form.schema.title)
      };
      if (angular.isFunction(message)) {
        return message(context);
      } else {
        return $interpolate(message)(context);
      }
    };

    return service;
  }];

});
