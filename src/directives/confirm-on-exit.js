angular.module('schemaForm').directive('confirmOnExit', function() {
  return {
    link: function(scope, elem, attrs) {
      var defaultMsg = 'The form has changed. To discard changes, click \'OK\''
      var msg        = attrs.confirmOnExit || defaultMsg;
      var form       = scope[attrs.name];

      window.onbeforeunload = function() {
        if (form.$dirty) {
          return msg;
        }
      };

      // function(event, next, current) but last two not used here
      scope.$on('$locationChangeStart', function(event) {
        if (form.$dirty) {
          if(!window.confirm(msg)) {
            event.preventDefault();
          }
        }
      });
    }
  };
});
