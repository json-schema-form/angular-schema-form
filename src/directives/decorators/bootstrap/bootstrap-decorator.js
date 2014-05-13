angular.module('schemaForm').config(['schemaFormDecoratorsProvider',function(decoratorsProvider){
  var base = 'directives/decorators/bootstrap/';

  decoratorsProvider.createDecorator('bootstrapDecorator',{
    textarea: base+'textarea.html',
    fieldset: base+'fieldset.html',
    section: base+'section.html',
    conditional: base+'section.html',
    actions: base+'actions.html',
    select: base+'select.html',
    checkbox: base+'checkbox.html',
    checkboxes: base+'checkboxes.html',
    number: base+'default.html',
    passord: base+'default.html',
    submit: base+'submit.html',
    button: base+'submit.html',
    radios: base+'radios.html',
    radiobuttons: base+'radio-buttons.html',
    'default': base+'default.html'
  },[
    function(form){
      if (form.readonly && form.key && form.type !== 'fieldset') {
        return base+'readonly.html';
      }
    }
  ]);

  //manual use directives
  decoratorsProvider.createDirectives({
    textarea: base+'textarea.html',
    select: base+'select.html',
    checkbox: base+'checkbox.html',
    checkboxes: base+'checkboxes.html',
    number: base+'default.html',
    submit: base+'submit.html',
    button: base+'submit.html',
    text: base+'default.html',
    date: base+'default.html',
    password: base+'default.html',
    input: base+'default.html',
    radios: base+'radios.html',
    radiobuttons: base+'radio-buttons.html',
  });

}]).directive('sfFieldset',function(){
  return {
    transclude: true,
    scope: true,
    templateUrl: 'directives/decorators/bootstrap/fieldset-trcl.html',
    link: function(scope,element,attrs) {
      scope.title = scope.$eval(attrs.title);
    }
  };
});
