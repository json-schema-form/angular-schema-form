angular.module('schemaForm').factory('sfRetainModel', function() {

  var data = {retainModelFlag: false };

  return {
    /**
     * @description
     * Utility service to indicate if the sfSchema model should be retained.
     * Set to true to prevent an operation that would have destroyed the model
     * from doing so (such as wrapping the form in an ng-if).
     *
     * ex.
     * var foo = sfRetainModel.getFlag();
     *
     * @returns {boolean} returns the current value of the retainModelFlag.
     */
    getFlag: function () {
      return data.retainModelFlag;
    },

    /**
     * @description
     * Set the value of the retainModelFlag.
     * True prevents cleaning the data in the model, while false follows the configured destroyStrategy.
     *
     * ex.
     * var bar = sfRetainModel.setFlag(true);
     *
     * @param {boolean} value  The boolean value to set as the retainModelFlag
     * @returns {boolean} returns the value of the retainModelFlag after toggling.
     */
    setFlag: function(value) {
      data.retainModelFlag = value;
      return data.retainModelFlag;
    }
  }
});