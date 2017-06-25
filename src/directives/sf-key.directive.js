/**
 * I am the directive that handles keys and array indexes
 *
 * @param  {function} sfPath
 *
 * @return {[type]}            [description]
 */
export default function(sfPath) {
  return {
    scope: true,
    require: [ '?^^sfNewArray' ],
    link: {
      pre: function(scope, element, attrs, ctrl) {
        scope.parentKey = scope.parentKey || [];

        let currentKey = sfPath.parse(attrs.sfParentKey);
        let trim = currentKey.length - scope.parentKey.length;

        if(currentKey.length > 1) currentKey = currentKey.splice(-trim);

        scope.parentKey = scope.parentKey.concat(currentKey, Number(attrs.sfIndex));
        scope.arrayIndex = Number(attrs.sfIndex);
        scope.arrayIndices = scope.arrayIndices || [];
        scope.arrayIndices = scope.arrayIndices.concat(scope.arrayIndex);
        scope.$i = scope.arrayIndices;
        scope.path = function(modelPath) {
          let i = -1;
          modelPath = modelPath.replace(/\[\]/gi, function(matched) {
            i++;
            return '[' + scope.$i[i] + ']';
          });
          return scope.evalExpr(modelPath, scope);
        };
      },
    },
  };
};
