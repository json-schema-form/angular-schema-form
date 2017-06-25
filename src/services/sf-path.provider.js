import { sfPath } from 'json-schema-form-core';

/**
 * @class sfPathProviderClass
 */
export default class sfPathProviderClass {
  /**
   * @method constructor
   */
  constructor() {
    this.name = sfPath.name;
    this.parse = sfPath.parse;
    this.stringify = sfPath.stringify;
    this.normalize = sfPath.normalize;
  }

  /**
   * @method $get
   */
  $get() {
    return sfPath;
  }
}
