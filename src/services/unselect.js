
angular.module('schemaForm').factory('sfUnselect', ['sfPath', function(sfPath) {
  var numRe = /^\d+$/;

  /**
   * @description
   * Utility method to clear deep properties without
   * throwing errors when things are not defined.
   * DOES NOT create objects when they are missing.
   *
   * Based on sfSelect.
   *
   * ex.
   * var foo = Unselect('address.contact.name',obj, null)
   * var bar = Unselect('address.contact.name',obj, undefined)
   * Unselect('address.contact.name',obj,'')
   *
   * @param {string} projection A dot path to the property you want to set
   * @param {object} obj   (optional) The object to project on, defaults to 'this'
   * @param {Any}    unselectValue   The value to set; if parts of the path of
   *                 the projection is missing empty objects will NOT be created.
   * @returns {Any|undefined} returns the value at the end of the projection path
   *                          or undefined if there is none.
   */
  return function(projection, obj, unselectValue) {
    if (!obj) {
      obj = this;
    }
    //Support [] array syntax
    var parts = typeof projection === 'string' ? sfPath.parse(projection) : projection;
    //console.log(parts);

    if (parts.length === 1) {
      //Special case, just setting one variable

      //console.log('Only 1 variable in parts');
      obj[parts[0]] = unselectValue;
      return obj;
    }

    if (typeof obj[parts[0]] === 'undefined') {
      // If top-level part isn't defined.
      var isArray = numRe.test(parts[1]);
      if (isArray) {
        //console.info('Expected array as top-level part, but is already undefined. Returning.');
        return undefined;
      }
      else if (parts.length > 2) {
        obj[parts[0]] = {};
      }
    }

    var value = obj[parts[0]];
    for (var i = 1; i < parts.length; i++) {
      // Special case: We allow JSON Form syntax for arrays using empty brackets
      // These will of course not work here so we exit if they are found.
      if (parts[i] === '') {
        return undefined;
      }

      var tmp = value[parts[i]];
      if (i === parts.length - 1 ) {
        //End of projection; setting the value

        //console.log('Value set using destroyStrategy.');
        value[parts[i]] = unselectValue;
        return unselectValue;
      } else {
        // Make sure to NOT create new objects on the way if they are not there.
        // We need to look ahead to check if array is appropriate.
        // Believe that if an array/object isn't present/defined, we can return.

        //console.log('Processing part %s', parts[i]);
        if (typeof tmp === 'undefined' || tmp === null) {
          //console.log('Part is undefined; returning.');
          return undefined;
        }
        value = tmp;
      }
    }
    return value;
  };
}]);
