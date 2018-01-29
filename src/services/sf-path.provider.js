import { sfPath } from 'json-schema-form-core';

/**
 * @class SFPathProviderClass
 */
class SFPathProviderClass {
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

export default () => {
  return new SFPathProviderClass();
};
