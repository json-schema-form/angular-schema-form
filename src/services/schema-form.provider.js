import {
  schemaDefaults,
  jsonref,
  merge,
  traverseSchema,
  traverseForm,
} from 'json-schema-form-core';

/**
 * Schema form service.
 */
export default function() {
  let postProcessFn = (form) => form;
  const defaults = schemaDefaults.createDefaults();

  /**
   * Provider API
   */
  this.defaults = defaults;
  this.stdFormObj = schemaDefaults.stdFormObj;
  this.defaultFormDefinition = schemaDefaults.defaultFormDefinition;

  /**
   * Register a post process function.
   * This function is called with the fully merged
   * form definition (i.e. after merging with schema)
   * and whatever it returns is used as form.
   */
  this.postProcess = function(fn) {
    postProcessFn = fn;
  };

  /**
   * Append default form rule
   *
   * @param {string}   type json schema type
   * @param {Function} rule a function(propertyName,propertySchema,options) that returns a form
   *                        definition or undefined
   */
  this.appendRule = function(type, rule) {
    if (!this.defaults[type]) {
      this.defaults[type] = [];
    }
    this.defaults[type].push(rule);
  };

  /**
   * Prepend default form rule
   *
   * @param {string}   type json schema type
   * @param {Function} rule a function(propertyName,propertySchema,options) that returns a form
   *                        definition or undefined
   */
  this.prependRule = function(type, rule) {
    if (!this.defaults[type]) {
      this.defaults[type] = [];
    }
    this.defaults[type].unshift(rule);
  };

  /**
   * Utility function to create a standard form object.
   * This does *not* set the type of the form but rather all shared attributes.
   * You probably want to start your rule with creating the form with this method
   * then setting type and any other values you need.
   * @param {Object} schema
   * @param {Object} options
   * @return {Object} a form field defintion
   */
  this.createStandardForm = schemaDefaults.stdFormObj;
  /* End Provider API */

  this.$get = function() {
    let service = {};
    let typeDefault = this.defaults;

    service.jsonref = jsonref;

    /**
    * Create form defaults from schema
    */
    service.defaults = function(schema, types, ignore, options) {
      let defaultTypes = types || typeDefault;
      return schemaDefaults.defaultForm(schema, defaultTypes, ignore, options);
    };

    /**
     * merge
     *
     * @param  {Object}  schema                             [description]
     * @param  {Array}   [form=['*']]                       [description]
     * @param  {Object}  [typeDefaults=service.typeDefault] [description]
     * @param  {boolean} ignore                             [description]
     * @param  {Object}  [options={}]                       [description]
     * @param  {Boolean} [readonly=false]                   [description]
     * @param  {[type]}  asyncTemplates                     [description]
     *
     * @return {array}   I am the canonical schema with the combined schema and ui-schema
     */
    service.merge = function(schema, form = [ '*' ], typeDefaults=service.typeDefault, ignore, options = {}, readonly = false, asyncTemplates) {
      // We look at the supplied form and extend it with schema standards
      const canonical = merge(schema, form, typeDefaults, ignore, options, readonly, asyncTemplates);
      return postProcessFn(canonical);
    };

    // Utility functions
    /**
     * Form defaults for schema by type
     * As a form is generated from a schema these are the definitions of each json-schema type
     */
    service.typeDefault = typeDefault;

    /**
     * Traverse a schema, applying a function(schema,path) on every sub schema
     * i.e. every property of an object.
     */
    service.traverseSchema = traverseSchema;

    service.traverseForm = traverseForm;

    return service;
  };
}
