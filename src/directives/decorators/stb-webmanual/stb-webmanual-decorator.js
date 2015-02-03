angular.module('schemaForm').config(['schemaFormDecoratorsProvider', function(decoratorsProvider) {
  var base = 'directives/decorators/stb-webmanual/';

  decoratorsProvider.createDecorator('stbWebmanualDecorator', {
    textarea: base + 'textarea.html',
    fieldset: base + 'fieldset.html',
    array: base + 'array.html',
    tabarray: base + 'tabarray.html',
    tabs: base + 'tabs.html',
    steps: base + 'steps.html',
    section: base + 'section.html',
    actions: base + 'actions.html',
    select: base + 'select.html',
    checkbox: base + 'checkbox.html',
    checkboxes: base + 'checkboxes.html',
    password: base + 'default.html',
    submit: base + 'submit.html',
    radios: base + 'radios.html',
    'radios-inline': base + 'radios-inline.html',
    radiobuttons: base + 'radio-buttons.html',
    help: base + 'help.html',
    'default': base + 'default.html',
    file: base + 'file.html',
    datepicker: base + 'datepicker.html',
    dropdown: base + 'dropdown.html',
    hidden: base + 'hidden.html',
    infobox: base + 'infobox.html',
    successbox: base + 'successbox.html',
    errorbox: base + 'errorbox.html',
    infodate: base + 'date-info.html',
    button: base + 'button.html',
    table: base + 'table.html',
    'command-panel': base + 'command-panel.html',
    whitebox: base + 'white-box.html',
    number: base + 'number.html',
    search: base + 'default.html'
  }, [
    function(form) {
      if (form.readonly && form.key && form.type !== 'fieldset') {
        return base + 'readonly.html';
      }
    }
  ]);

  //manual use directives
  decoratorsProvider.createDirectives({
    textarea: base + 'textarea.html',
    select: base + 'select.html',
    checkbox: base + 'checkbox.html',
    checkboxes: base + 'checkboxes.html',
    condition: base + 'condition.html',
    submit: base + 'submit.html',
    text: base + 'default.html',
    date: base + 'default.html',
    password: base + 'default.html',
    datepicker: base + 'datepicker.html',
    dropdown: base + 'dropdown.html',
    input: base + 'default.html',
    radios: base + 'radios.html',
    'radios-inline': base + 'radios-inline.html',
    radiobuttons: base + 'radio-buttons.html',
    button: base + 'button.html',
    table: base + 'table.html',
    'command-panel': base + 'command-panel.html',
    whitebox: base + 'white-box.html',
    number: base + 'number.html',
    steps: base + 'steps.html',
    file: base + 'file.html',
    search: base + 'default.html'
  });

}]).directive('sfFieldset', function() {
  return {
    transclude: true,
    scope: true,
    templateUrl: 'directives/decorators/stb-webmanual/fieldset-trcl.html',
    link: function(scope, element, attrs) {
      scope.title = scope.$eval(attrs.title);
    }
  };
});
