/*  Common code for validating a value against its form and schema definition */
/* global tv4 */
angular.module('schemaForm').factory('sfValidator', [function() {

  var validator = {};


  tv4.addFormat({
    'ssn': function (data, schema) {
      var pn;
      var v1 = [3,7,6,1,8,9,4,5,2,1,0];
      var v2 = [5,4,3,2,7,6,5,4,3,2,1];
      var sum1=0;
      var sum2=0;
      var i=0;

      if (typeof data === 'string') {
        pn = data.split('');
      } else {
        return 'ssn should be a string!';
      }

      for(; i<v1.length; i+=1) {
        sum1 += pn[i]*v1[i];
        sum2 += pn[i]*v2[i];
      }
      if (sum1%11==0 && sum2%11==0 ) {
        return null;
      } else {
        return "incorrect ssn";
      }
    },
    'email': function(data, schema) {
      if (typeof data === 'string') {
       if (/^[_a-z0-9-]+(\.[_a-z0-9-]+)*@[a-z0-9-]+(\.[a-z0-9-]+)*(\.[a-z]{2,4})$/.test(data)) {
         return null;
       } else {
         return 'invalid email';
       }
      } else {
        return 'email should be a string!';
      }
    },

    'date-format': function(data, schema) {
      if (typeof data === 'string') {
        if (Date.parse(data)) {
          return null;
        } else {
          return 'invalid email';
        }
      } else {
        return 'date should be ISO string!';
      }
    }

  });

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

    if (schema.required) {
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
