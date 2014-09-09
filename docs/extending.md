Extending Schema Form
=====================
Schema Form is designed to be easily extended and there are two basic ways to do it:

1. Add a new type of field
2. Add a new decorator

Adding a Field
--------------
To add a new field to Schema Form you need to create a new form type and match that form type with
a template snippet. To do this you use the `schemaFormDecoratorsProvider.addMapping()` function.

Ex. from the [datepicker add-on](https://github.com/Textalk/angular-schema-form-datepicker/blob/master/src/bootstrap-datepicker.js#L18)
```javascript
 schemaFormDecoratorsProvider.addMapping(
  'bootstrapDecorator',
  'datepicker',
  'directives/decorators/bootstrap/datepicker/datepicker.html'
);
```

The second argument is the name of your new form type, in this case `datepicker`, and the third is
the template we bind to it (the first is the decorator, use `bootstrapDecorator` unless you know
what you are doing).

What this means is that a form definition like this:
```javascript
$scope.form = [
  {
    key: "birthday",
    type: "datepicker"
  }
];
```
...will result in the `datepicker.html` template to be used to render that field in the form.

But wait, where is all the code? Basically it's then up to the template to use directives to
implement whatever it likes to do. It does have some help though, lets look at template example and
go through the basics.

This is the template for the datepicker:
```html
<div class="form-group" ng-class="{'has-error': hasError()}">
  <label class="control-label" ng-show="showTitle()">{{form.title}}</label>

  <input ng-show="form.key"
         style="background-color: white"
         type="text"
         class="form-control"
         schema-validate="form"
         ng-model="$$value$$"
         pick-a-date
         min-date="form.minDate"
         max-date="form.maxDate"
         format="form.format" />

  <span class="help-block">{{ (hasError() && errorMessage(schemaError())) || form.description}}</span>
</div>
```

### What's on the scope?
Each form field will be rendered inside a decorator directive, created by the
`schemaFormDecorators` factory service, *do*
[check the source](https://github.com/Textalk/angular-schema-form/blob/master/src/services/decorators.js#L33).

This means you have several helper functions and values on scope, most important of this `form`. The
`form` variable contains the merged form definition for that field, i.e. your supplied form object +
the defaults from the schema (it also has its part of the schema under *form.schema*).
This is how you define and use new form field options, whatever is set on the form object is
available here for you to act on.

| Name     |  What it does  |
|----------|----------------|
| form      | Form definition object |
| showTitle() | Shorthand for `form && form.notitle !== true && form.title` |
| errorMessage(msg) | Error message formatting, makes validationMessage option work. |
| evalInScope(expr, locals) | Eval supplied expression, ie scope.$eval |
| evalExpr(expr, locals) | Eval an expression in the parent scope of the main `sf-schema` directive. |
| buttonClick($event, form)  | Use this with ng-click to execute form.onClick |

### The magic $$value$$
Schema Form wants to play nice with the built in Angular directives for form. Especially `ng-model`
which we want to handle the two way binding against our model value. Also by using `ng-model` we
get all the nice validation states from the `ngModelController` and `FormController` that we all
know and love.

To get that working properly we had to resort to a bit of trickery, right before we let Angular
compile the field template we do a simple string replacement of `$$value$$` and replace that
with the path to the current form field on the model, i.e. `form.key`.

So `ng-model="$$value$$"` becomes something like `ng-model="model['person']['address']['street']"`,
you can see this if you inspect the final form in the browser.

So basically always have a `ng-model="$$value$$"` (Pro tip: ng-model is fine on any element, put
  it on the same div as your custom directive and require the ngModelController for full control).

### schema-validate directive
`schema-validate` is a directive that you should put on the same element as your `ng-model`. It is
responsible for validating the value against the schema using [tv4js](https://github.com/geraintluff/tv4)
It takes the form definition as an argument.

`schema-validate` also exports some things on the scope:

| Name     | What it does |
|----------|--------------|
| ngModel  | the ngModelController |
| hasSuccess() | Shorthand for `ngModel.$valid && (!ngModel.$pristine || !ngModel.$isEmpty(ngModel.$modelValue))` |
| hasError() | Shorthand for `ngModel.$invalid && !ngModel.$pristine` |
| schemaError() | The current error object from tv4js |


### Setting up schema defualts
So you got this shiny new add-on that adds a fancy field type, but feel a bit bummed out that you
need to specify it in the form definition all the time? Fear not because you can also add a "rule"
to map certain types and conditions in the schema to default to your type.

You do this by adding to the `schemaFormProvider.defaults` object. The `schemaFormProvider.defaults`
is an object with a key for each type *in JSON Schema* with a array of functions as its value.

```javscript
var defaults = {
  string: [],
  object: [],
  number: [],
  integer: [],
  boolean: [],
  array: []
};
```

When schema form traverses the JSON Schema to create default form definitions it first checks the
*JSON Schema type* and then calls on each function in the corresponding list *in order* until a
function actually returns something. That is then used as a defualt.

This is the function that makes it a datepicker if its a string and has format "date" or "date-time":

```javascript
var datepicker = function(name, schema, options) {
  if (schema.type === 'string' && (schema.format === 'date' || schema.format === 'date-time')) {
    var f = schemaFormProvider.stdFormObj(name, schema, options);
    f.key = options.path;
    f.type = 'datepicker';
    options.lookup[sfPathProvider.stringify(options.path)] = f;
    return f;
  }
};

// Put it first in the list of functions
schemaFormProvider.defaults.string.unshift(datepicker);
```

Decorators
----------
Decorators are a second way to extend Schema Form, the thought being that you should easily be able
to change *every* field. Maybe you like it old school and want to use bootstrap 2. Or maybe you like
to generate a table with the data instead? Right now there are no other decorators than bootstrap 3.

Basically a *decorator* sets up all the mappings between form types and their respective templates
using the `decoratorsProvider.createDecorator()` function.

```javascript
var base = 'directives/decorators/bootstrap/';

decoratorsProvider.createDecorator('bootstrapDecorator', {
  textarea: base + 'textarea.html',
  fieldset: base + 'fieldset.html',
  array: base + 'array.html',
  tabarray: base + 'tabarray.html',
  tabs: base + 'tabs.html',
  section: base + 'section.html',
  conditional: base + 'section.html',
  actions: base + 'actions.html',
  select: base + 'select.html',
  checkbox: base + 'checkbox.html',
  checkboxes: base + 'checkboxes.html',
  number: base + 'default.html',
  password: base + 'default.html',
  submit: base + 'submit.html',
  button: base + 'submit.html',
  radios: base + 'radios.html',
  'radios-inline': base + 'radios-inline.html',
  radiobuttons: base + 'radio-buttons.html',
  help: base + 'help.html',
  'default': base + 'default.html'
}, [
  function(form) {
    if (form.readonly && form.key && form.type !== 'fieldset') {
      return base + 'readonly.html';
    }
  }
]);
```
`decoratorsProvider.createDecorator(name, mapping, rules)` takes a name argument, a mapping object
(type -> template) and an optional list of rule functions.

When the decorator is trying to match a form type against a tempate it first executes all the rules
in order. If one returns that is used as template, otherwise it checks the mappings.
