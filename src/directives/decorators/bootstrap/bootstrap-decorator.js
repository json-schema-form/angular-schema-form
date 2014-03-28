angular.module('schemaForm').config(['schemaFormDecoratorsProvider',function(decoratorsProvider){

  decoratorsProvider.create('bootstrapDecorator',{
    textarea: 'directives/decorators/bootstrap/textarea.html',
    fieldset: 'directives/decorators/bootstrap/fieldset.html',
    section: 'directives/decorators/bootstrap/section.html',
    actions: 'directives/decorators/bootstrap/actions.html',
    select: 'directives/decorators/bootstrap/select.html',
    checkbox: 'directives/decorators/bootstrap/checkbox.html',
    checkboxes: 'directives/decorators/bootstrap/checkboxes.html',
    number: 'directives/decorators/bootstrap/default.html',
    submit: 'directives/decorators/bootstrap/submit.html',
    'default': 'directives/decorators/bootstrap/default.html'
  },[
    function(form){
      if (form.readonly && form.key && form.type !== 'fieldset') {
        return 'directives/decorators/bootstrap/readonly.html';
      }
    }
  ]);

}]);



