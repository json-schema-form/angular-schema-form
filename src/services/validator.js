/*  Common code for validating a value against its form and schema definition */
/* global tv4 */
angular.module('schemaForm').factory('sfValidator', [function() {

  var validator = {};

  /**
   * Validate a value against its form definition and schema.
   * The value should either be of proper type or a string, some type
   * coercion is applied.
   *
   * @param {Object} form A merged form definition, i.e. one with a schema.
   * @param {Any} value the value to validate.
   * @return a tv4js result object.
   */
  validator.validate = function(form, value) {

    var schema = form.schema;

    if (!schema) {
      //Nothings to Validate
      return value;
    }

    //Type cast and validate against schema.
    //Basic types of json schema sans array and object
    if (schema.type === 'integer') {
      value = parseInt(value, 10);
    } else if (schema.type === 'number') {
      value = parseFloat(value, 10);
    } else if (schema.type === 'boolean' && typeof value === 'string') {
      if (value === 'true') {
        value = true;
      } else if (value === 'false') {
        value = false;
      }
    }

    // Version 4 of JSON Schema has the required property not on the
    // property itself but on the wrapping object. Since we like to test
    // only this property we wrap it in a fake object.
    var wrap = {type: 'object', 'properties': {}};
    var propName = form.key[form.key.length - 1];
    wrap.properties[propName] = schema;

    if (form.required) {
      wrap.required = [propName];
    }
    var valueWrap = {};
    if (angular.isDefined(value)) {
      valueWrap[propName] = value;
    }

    return tv4.validateResult(valueWrap, wrap);

  };

  return validator;
}]);
