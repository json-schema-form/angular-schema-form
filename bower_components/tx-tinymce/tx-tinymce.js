angular.module('tx-tinymce',[])
       .directive('txTinymce',[function(){

  var count = 0;
  return {
    restrict: "AC",
    require: "ngModel",
    scope: false,
    link: function(scope,element,attrs,ngModel) {
      var tinymce;
      if (!attrs.id) {
        attrs.$set('id','tx-tinymce-'+count++);
      } else {
        //do we have real jQuery? or querySelector
        var focus = function(){
          if (tinymce) {
          }
        };
        if (window.jQuery) {
          jQuery('label[for='+attrs.id+']')
        }
      }



      var init = function(config){
        config = angular.extend(config || {},{
          selector: '#'+attrs.id,
          setup: function(ed) {
            tinymce = ed;
            window['focus'+attrs.id] = function(){
              tinymce.execCommand('mceFocus', false, attrs.id);
            };
            var update = function(){
              var content = ed.getContent();
              if (ngModel.$viewValue !== content) {
                ngModel.$setViewValue(content);

                //certain things like 'destroy' below triggers update inside a $digest cycle.
                if (!scope.$root.$$phase) {
                  scope.$apply();
                }
              }
            };
            ed.on('change',update);
            ed.on('KeyUp',update);
            ed.on('ExecCommand',update);
            ed.on('focus', function(e) {
              angular.element(e.target.contentAreaContainer).addClass('tx-tinymce-active');
            });
            ed.on('blur', function(e) {
              angular.element(e.target.contentAreaContainer).removeClass('tx-tinymce-active');
            });
          }
        });
        tinyMCE.init(config);
      };

      var destroy = function(){
          if (tinymce) {
            tinymce.save();
            tinymce.remove();
            tinymce = null;
          }
      };
      scope.destroy = destroy;

      scope.$on('$destroy',destroy);

      //If config is set watch it for changes, otherwise just init.
      if (attrs.txTinymce) {
        scope.$watch(attrs.txTinymce,function(config,old){
          destroy();
          if (config) init(config);
          else init();
        });
      } else {
        init();
      }


      //Watch scope for changes in model and update
      //tinymce when needed.
      scope.$watch(attrs.ngModel,function(value,old){
        if (tinymce && angular.isDefined(value)) {
          var content = tinymce.getContent();
          if (angular.isString(value) && content !== value) {
            tinymce.setContent(value);
          }
        }
      });
    }
  };

}]);
