/**
 * Directive that handles keys and array indexes
 */
export default function(schemaForm, sfPath) {
  return {
    scope: true,
    require: ['^^sfNewArray'],
    controller: ['$scope', function SFKeyController($scope) {
      this.key = ($scope.form && $scope.form.key) ? $scope.form.key.splice(0, -2) : [];
    }],
    link: {
      pre: function(scope, element, attrs, ctrl) {
        var currentKey = sfPath.parse(attrs.sfParentKey);
        if(currentKey.length > 1) currentKey = currentKey.splice(-1);

        scope.parentKey = scope.parentKey || [];
        scope.parentKey = scope.parentKey.concat(currentKey, Number(attrs.sfIndex));

        scope.arrayIndex = Number(attrs.sfIndex);
        scope.arrayIndices = scope.arrayIndices || [];
        scope.arrayIndices = scope.arrayIndices.concat(scope.arrayIndex);
        scope.$i = scope.arrayIndices;
        scope.path = function(modelPath) {
          var i = -1;
          modelPath = modelPath.replace(/\[\]/gi, function(matched){
            i++;
            return '[' + scope.$i[i] + ']';
          });
          return scope.evalExpr(modelPath, scope);
        }
      }
    }
  };
};
