
IMPORTANT
=========

**Angular Schema Form is undergoing a refactoring and the "bootstrap decorator", i.e. the part with
all the HTML has been moved to [github.com/json-schema-form/angular-schema-form-bootstrap](https://github.com/json-schema-form/angular-schema-form-bootstrap).**

The documentation below, especially form options is therefore somewhat bootstrap decorator
specific. The docs is undergoing updating.


Documentation
=============
<!-- START doctoc generated TOC please keep comment here to allow auto update -->
<!-- DON'T EDIT THIS SECTION, INSTEAD RE-RUN doctoc TO UPDATE -->


- [Basic Usage](#basic-usage)
- [Handling Submit](#handling-submit)
- [Updating Form](#updating-form)
- [Global Options](#global-options)
- [Validation Messages](#validation-messages)
  - [Message Interpolation](#message-interpolation)
  - [Taking over: functions as validationMessages](#taking-over-functions-as-validationmessages)
- [Custom Validation](#custom-validation)
  - [Inject errors into form aka backend validation](#inject-errors-into-form-aka-backend-validation)
  - [Using ngModelController](#using-ngmodelcontroller)
    - [$validators](#validators)
    - [$asyncValidators](#asyncvalidators)
- [Form defaults in schema](#form-defaults-in-schema)
- [Form types](#form-types)
- [Default form types](#default-form-types)
- [Form definitions](#form-definitions)
- [Overriding field types and order](#overriding-field-types-and-order)
- [Standard Options](#standard-options)
  - [onChange](#onchange)
  - [Validation Messages](#validation-messages-1)
  - [Inline feedback icons](#inline-feedback-icons)
  - [ngModelOptions](#ngmodeloptions)
  - [copyValueTo](#copyvalueto)
  - [condition](#condition)
  - [destroyStrategy](#destroystrategy)
- [Specific options and types](#specific-options-and-types)
  - [input group addons](#input-group-addons)
  - [fieldset and section](#fieldset-and-section)
  - [select and checkboxes](#select-and-checkboxes)
  - [actions](#actions)
  - [button and submit](#button-and-submit)
  - [radios and radiobuttons](#radios-and-radiobuttons)
  - [help](#help)
  - [template](#template)
  - [tabs](#tabs)
  - [array](#array)
  - [tabarray](#tabarray)
    - [Deprecation Warning](#deprecation-warning)
- [Post process function](#post-process-function)
- [Events](#events)
  - [Manual field insertion](#manual-field-insertion)
- [Deprecated fields](#deprecated-fields)
  - [conditional](#conditional)

<!-- END doctoc generated TOC please keep comment here to allow auto update -->
- [Extending Schema Form](extending.md)

Basic Usage
-----------

After installing, load the `schemaForm` module in your module definition.
Then, in your controller, expose your [schema](http://json-schema.org/), form, and [model](https://docs.angularjs.org/guide/databinding) to the $scope.
Your schema defines your data structure, the form definition draws on this definition to define the user interface, and the model binds the user input to the controller.
```javascript
angular.module('myModule', ['schemaForm'])
       .controller('FormController', function($scope) {
  $scope.schema = {
    type: "object",
    properties: {
      name: { type: "string", minLength: 2, title: "Name", description: "Name or alias" },
      title: {
        type: "string",
        enum: ['dr','jr','sir','mrs','mr','NaN','dj']
      }
    }
  };

  $scope.form = [
    "*",
    {
      type: "submit",
      title: "Save"
    }
  ];

  $scope.model = {};
}
```
Then, in your template, load them into Schema Form using the
`sfSchema`, `sfForm`, and `sfModel` directives.
```html
<div ng-controller="FormController">
    <form sf-schema="schema" sf-form="form" sf-model="model"></form>
</div>
```

The `sfSchema` directive doesn't need to be on a form tag, in fact it can be quite useful
to set it on a div or some such inside the form instead. Especially if you like to prefix or suffix the
form with buttons or fields that are hard coded.

Example with custom submit buttons:
```html
<div ng-controller="FormController">
  <form>
    <p>bla bla bla</p>
    <div sf-schema="schema" sf-form="form" sf-model="model"></div>
    <input type="submit" value="Submit">
    <button type="button" ng-click="goBack()">Cancel</button>
  </form>
</div>
```

Handling Submit
---------------
Schema Form does not care what you do with your data, to handle form submit
the recomended way is to use the `ng-submit` directive. It's also recomended
to use a `name` attribute on your form so you can access the
[FormController](https://code.angularjs.org/1.3.0-beta.15/docs/api/ng/type/form.FormController)
and check if the form is valid or not.

You can force a validation by broadcasting the event `schemaFormValidate`, ex
`$scope.$broadcast('schemaFormValidate')`, this will immediately validate the
entire form and show any errors.

Example submit:
```javascript
function FormController($scope) {
  $scope.schema = {
    type: "object",
    properties: {
      name: { type: "string", minLength: 2, title: "Name", description: "Name or alias" },
      title: {
        type: "string",
        enum: ['dr','jr','sir','mrs','mr','NaN','dj']
      }
    }
  };

  $scope.form = [
    "*",
    {
      type: "submit",
      title: "Save"
    }
  ];

  $scope.model = {};

  $scope.onSubmit = function(form) {
    // First we broadcast an event so all fields validate themselves
    $scope.$broadcast('schemaFormValidate');

    // Then we check if the form is valid
    if (form.$valid) {
      // ... do whatever you need to do with your data.
    }
  }
}

```

And the HTML would be something like this:
```html
<div ng-controller="FormController">
    <form name="myForm"
          sf-schema="schema"
          sf-form="form"
          sf-model="model"
          ng-submit="onSubmit(myForm)"></form>
</div>
```


Updating Form
-------------

Schema Form watches `sf-form` and `sf-schema` and will redraw the form if one or both changes, but
only if they change completly, i.e. not the same object and/or form instance. For performance
reasons we have opted to not watch schema and form deeply. So if you have updated a part of the
schema or the form definition you can trigger a redraw by issuing the event `schemaFormRedraw`.

ex:
```javascript
function Ctrl($scope) {
  $scope.removeLastField = function() {
    $scope.form.pop()
    $scope.$broadcast('schemaFormRedraw')
  }
}
```





Global Options
--------------
Schema Form also have two options you can set globally via the `sf-options`
attribute which should be placed along side `sf-schema`.

`sf-options` takes an object with the following possible attributes.


| Attribute     |  Type |                    |
|:--------------|:------|:-------------------|
| supressPropertyTitles | boolean  |by default schema form uses the property name in the schema as a title if none is specified, set this to true to disable that behavior |
| formDefaults | object | an object that will be used as a default for all form definitions |
| validationMessage | object or function | Object or a function that will be used as default validation message for all fields. See [Validation Messages](#validation-messages) for details. |
| setSchemaDefaults | boolean | Should schema defaults be set on model. |
| destroyStrategy | string | the default strategy to use for cleaning the model when a form element is removed. see [destroyStrategy](#destroyStrategy) below |
| pristine  | Object `{errors ,success}` | Sets if errors and success states should be visible when form field are `$pristine`. Default is `{errors: true, success: true}` |
| validateOnRender | boolean | Should form be validated on initial render? Default `false` |

*formDefaults* is mostly useful for setting global [ngModelOptions](#ngmodeloptions)
i.e. changing the entire form to validate on blur.

Ex.
```html
<div ng-controller="FormController">
    <form sf-schema="schema"
          sf-form="form"
          sf-model="model"
          sf-options="{ formDefaults: { ngModelOptions: { updateOn: 'blur' } }}"></form>
</div>
```


Validation Messages
-------------------

We use [tv4](https://github.com/geraintluff/tv4) to validate the form and all of the
validation messages match up [tv4 error codes](https://github.com/geraintluff/tv4/blob/master/source/api.js).

There are several ways to change the default validation messages.

  1. Change the defaults in `sfErrorMessages` service via its provider. This will set the validation
     messages for all instances of `sf-schema`
  1. Use the global option `validationMessage`
  1. Use the form field option `validationMessage`

If a specific validation error code can't be found in the form field option, schema form looks at
the global option, if none is there it looks at it's own defaults and if all fails it will instead
use the the message under the error code `'default'`

Ex of form field option.
```javascript
var form = [
  "address.zip",
  {
    key: "address.street",
    validationMessage: {
      302: "This field is like, uh, required?"
    }
  }
];
```

And of global options
```html
<div ng-controller="FormController">
    <form sf-schema="schema"
          sf-form="form"
          sf-model="model"
          sf-options="{ validationMessage: { 302: 'Do not forget me!' }}"></form>
</div>
```


### Message Interpolation
Having a good validation message is hard, sometimes you need to reference the actual value, title,
or constraint that you hit. Schema Form supports interpolation of error messages to make this a
little bit easier.

The context variables available to you are:

| Name          |   Value                 |
|:--------------|:------------------------|
| error         | The error code          |
| title         | Title of the field      |
| value         | The model value         |
| viewValue     | The view value (probably the one you want) |
| form          | form definition object for this field |
| schema        | schema for this field |

 Ex.
 ```javascript
 var form = [
   "address.zip",
   {
     key: "address.street",
     validationMessage: {
       101: 'Seriously? Value {{value}} totally less than {{schema.minimum}}, which is NOT OK.',
     }
   }
 ];
 ```

### Taking over: functions as validationMessages
If you really need to control the validaton messages and interpolation is not enough (like say
your using [Jed](https://github.com/SlexAxton/Jed) for gettext translations) you can supply a
function instead of a particular message or the entire validationMessage object.

The should take one argument, and that is an object with the exact same properties as the context
used for interpolation, see table above.


Ex.
```javascript
var form = [
  "address.zip",
  {
    key: "address.street",
    validationMessage: {
      302: function(ctx) { return Jed.gettext('This value is required.'); },
    }
  }
];
```

Or:
```javascript
var form = [
  "address.zip",
  {
    key: "address.street",
    validationMessage: function(ctx) {
      return lookupMessage[ctx.error];
    }
  }
];
```


Custom Validation
-----------------
Sometimes the validation you want is tricky to express in a JSON Schema
or Schema Form does not support it (yet), like `anyOf` and `oneOf`.

Other times you really need to ask the backend, maybe to check that the a username is not already
taken or some other constraint that only the backend can know about.

### Inject errors into form aka backend validation
To support validation outside of the form, most commonly on the backend, schema form lets you
injecting arbitrary validationMessages to any field and setting it's validity.

This is done via an event that starts with `schemaForm.error.` and ends with the key to the field.
It also takes two mandatory and an optional arguments, the first being the error code, the second being _either_ a
validation message or a boolean that sets validity, specifying a validation message automatically
sets the field to invalid. The third and last one is optional and it represents the form name. If the form name is not specified then the event is broadcasted for all the schema forms contained in the controller that is broacasting the event. In case there are multiple forms for a specific controller it could be useful to specify the form name in order to let only the interested form capture the error event.

So lets do an example, say you have a form with a text field `name`:

Html
```html
<form
    name="myForm"
    sf-schema="schema"
    sf-form="form"
    sf-model="formData"
    ng-submit="onSubmit(myForm)">
</form>
```
Schema
```json
{
  "type": "object",
  "properties": {
    "name": { "type": "string" }
  }
}
```

Form
```json
[
  "name"
]
```

To inject an error message and set that forms validity via [ngModelController.$setValidity](https://docs.angularjs.org/api/ng/type/ngModel.NgModelController)
broadcast an event with the name `schemaForm.error.name` with name/code for the error and an
optional validation message.

```js
scope.$broadcast('schemaForm.error.name','usernameAlreadyTaken','The username is already taken');
// or with the optional form name
scope.$broadcast('schemaForm.error.name','usernameAlreadyTaken','The username is already taken', 'myForm');
```
This will invalidate the field and therefore the form and show the error message where it normally
pops up, under the field for instance.

There is a catch though, schema form can't know when this field is valid so you have to tell it by
sending an event again, this time switch out the validation message for validity of the field,
i.e. `true`.

```js
scope.$broadcast('schemaForm.error.name','usernameAlreadyTaken',true);
// or with the optional form name
scope.$broadcast('schemaForm.error.name','usernameAlreadyTaken',true, 'myForm');
```

You can also pre-populate the validation messages if you don't want to send them in the event.

Form
```json
[
  {
    "key": "name",
    "validationMessages": {
      "userNameAlreadyTaken"
    }
  }
]
```

```js
scope.$broadcast('schemaForm.error.name','usernameAlreadyTaken',false);
```


You can even trigger standard tv4 error messages, just prefix the error code with `tv4-`
```js
// Shows the "Required" error message
scope.$broadcast('schemaForm.error.name','tv4-302',false);
```


### Using ngModelController
Another way to validate your fields is to use Angulars built in support for validator functions
and async validators via the [ngModelController](https://docs.angularjs.org/api/ng/type/ngModel.NgModelController)

Schema Form can expose the `ngModelController` on a field for a function supplied with the form
definition. Or you can use a shorthand by adding `$validators` and `$asyncValidators` objects as
well as `$viewChangeListener`, `$parsers` and `$formatters` arrays to your form object and they
will be picked up.

Note that `$validators` and `$asyncValidators` are Angular 1.3+ only.

See Angular docs for details and there is also an example you can look at here
[examples/custom-validators.html](../examples/custom-validators.html)

#### $validators
Custom validator functions are added to the `$validators` object and their attribute name is the
error code, so to specify a error message you also need to use.

```js
[
  {
    key: 'name',
    validationMessage: {
      'noBob': 'Bob is not OK! You here me?'
    },
    $validators: {
      noBob: function(value) {
        if (angular.isString(value) && value.indexOf('Bob') !== -1) {
          return false;
        }
        return true
      }
    }
  }
]
```


#### $asyncValidators
Async validators are basically the same as their synchronous counterparts, but instead you return
a promise that resolves or rejects.

```js
[
  {
    key: 'name',
    validationMessage: {
      'noBob': 'Bob is not OK! You here me?'
    },
    $asyncValidators: {
      noBob: function(value) {
        var deferred = $q.defer();
        $timeout(function(){
          if (angular.isString(value) && value.indexOf('bob') !== -1) {
            deferred.reject();
          } else {
            deferred.resolve();
          }
        }, 500);
        return deferred.promise;
      }
    }
  }
]
```


Form defaults in schema
-----------------------
Its recommended to split presentation and validation into a form definition and a json schema. But
if you for some reason can't do this, but *do* have the power to change the schema, you can supply form
default values within the schema using the custom attribute `x-schema-form`. `x-schema-form` should
be a form object and acts as form definition defaults for that field.

Example schema.
```js
{
  "type": "object",
  "properties": {
    "comment": {
      "type": "string",
      "title": "Comment",
      "x-schema-form": {
        "type": "textarea",
        "placeholder": "Don't hold back"
      }
    }
  }
}
```

Form types
----------
Schema Form currently supports the following form field types out of the box:

| Form Type     |  Becomes                |
|:--------------|:------------------------|
| fieldset      |  a fieldset with legend |
| section       |  just a div             |
| actions       |  horizontal button list, can only submit and buttons as items |
| text          |  input with type text   |
| textarea      |  a textarea             |
| number        |  input type number      |
| password      |  input type password    |
| checkbox      |  a checkbox             |
| checkboxes    |  list of checkboxes     |
| select        |  a select (single value)|
| submit        |  a submit button        |
| button        |  a button               |
| radios        |  radio buttons          |
| radios-inline |  radio buttons in one line |
| radiobuttons  |  radio buttons with bootstrap buttons |
| help          |  insert arbitrary html |
| template      |  insert an angular template |
| tab           |  tabs with content     |
| array         |  a list you can add, remove and reorder |
| tabarray      |  a tabbed version of array |

More field types can be added, for instance a "datepicker" type can be added by
including the [datepicker addon](https://github.com/json-schema-form/angular-schema-form-datepicker), see
the [front page](http://schemaform.io/#/third-party-addons) for an updated
list.


Default form types
------------------
Schema Form defaults to certain types of form fields depending on the schema for
a property.


| Schema             |   Form type  |
|:-------------------|:------------:|
| "type": "string"   |   text       |
| "type": "number"   |   number     |
| "type": "integer"  |   number     |
| "type": "boolean"  |   checkbox   |
| "type": "object"   |   fieldset   |
| "type": "string" and a "enum" | select |
| "type": "array" and a "enum" in array type | checkboxes |
| "type": "array" | array |



Form definitions
----------------
If you don't supply a form definition, it will default to rendering the after the defaults taken
from the schema.

A form definition is a list where the items can be
  * A star, ```"*"```
  * A string with the dot notated name/path to a property, ```"name"```
  * An object with that defines the options for a form field., ```{ key: "name" }```

The star, ```"*"``` means "use the default for the entire schema" and is useful when you want the
defaults plus an additional button.

ex.
```javascript
[
  "*",
  { type: 'submit', title: 'Save' }
]
```

The string notation, ```"name"```,  is just a shortcut for the object notation ```{ key: "name" }```
where key denotes what part of the schema we're creating a form field for.


Overriding field types and order
--------------------------------
The order of the fields is technically undefined since the order of attributes on an javascript
object (which the schema ends up being) is undefined. In practice it kind of works though.
If you need to override the order of the forms, or just want to be sure, specify a form definition.

ex.
```javascript
var schema = {
  "type": "object",
  "properties": {
    "surname":     { "type": "string" },
    "firstname":   { "type": "string" },
  }
}

[
  "firstname",
  "surname"
]
```

You can also override fields to force the type and supply other options:
ex.

```javascript
var schema = {
  "type": "object",
  "properties": {
    "surname":     { "type": "string" },
    "firstname":   { "type": "string" },
  }
}

[
  "firstname",
  {
    key: "surname",
    type: "select",
    titleMap: [
      { value: "Andersson", name: "Andersson" },
      { value: "Johansson", name: "Johansson" },
      { value: "other", name: "Something else..."}
    ]
  }
]
```

Standard Options
----------------

General options most field types can handle:
```javascript
{
  key: "address.street",      // The dot notatin to the attribute on the model
  type: "text",               // Type of field
  title: "Street",            // Title of field, taken from schema if available
  notitle: false,             // Set to true to hide title
  description: "Street name", // A description, taken from schema if available, can be HTML
  validationMessage: "Oh noes, please write a proper address",  // A custom validation error message
  onChange: "valueChanged(form.key,modelValue)", // onChange event handler, expression or function
  feedback: false,             // Inline feedback icons
  disableSuccessState: false,  // Set true to NOT apply 'has-success' class to a field that was validated successfully
  disableErrorState: false,    // Set true to NOT apply 'has-error' class to a field that failed validation
  placeholder: "Input...",     // placeholder on inputs and textarea
  ngModelOptions: { ... },     // Passed along to ng-model-options
  readonly: true,              // Same effect as readOnly in schema. Put on a fieldset or array
                               // and their items will inherit it.
  htmlClass: "street foobar",  // CSS Class(es) to be added to the container div
  fieldHtmlClass: "street"     // CSS Class(es) to be added to field input (or similar)
  labelHtmlClass: "street"     // CSS Class(es) to be added to the label of the field (or similar)
  copyValueTo: ["address.street"],     // Copy values to these schema keys.
  condition: "person.age < 18" // Show or hide field depending on an angular expression
  destroyStrategy: "remove"    // One of "null", "empty" , "remove", or 'retain'. Changes model on $destroy event. default is "remove".
}
```

### onChange
The ```onChange``` option can be used with most fields and its value should be
either an angular expression, as a string, or a function. If its an expression
it will be evaluated in the parent scope of the ```sf-schema``` directive with
the special locals ```modelValue``` and ```form```. If its a function that will
be called with  ```modelValue``` and ```form``` as first and second arguments.

ex.
```javascript
$scope.form = [
  {
    key: "name",
    onChange: "updated(modelValue,form)"
  },
  {
    key: "password",
    onChange: function(modelValue,form) {
      console.log("Password is",modelValue);
    }
  }
];
```

### Validation Messages
The validation message can be a string, an object with error codes as key and messages as values
or a custom message function, see [Validation Messages](#validation-messages) for the details.


### Inline feedback icons
*input* and *textarea* based fields get inline status icons by default. A check
when everything is valid and a cross when there are validation errors.

This can be turned off or configured to other icons. To turn off just
set ```feedback``` to false. If set to a string that string is evaluated by
a ```ngClass``` in the decorators scope. If not set att all the default value
is ```{ 'glyphicon': true, 'glyphicon-ok': hasSuccess(), 'glyphicon-remove': hasError() }```

ex. displaying an asterisk on required fields
```javascript
  $sope.form = [
    {
      key: "name",
      feedback: "{ 'glyphicon': true, 'glyphicon-asterisk': form.required && !hasSuccess() && !hasError() ,'glyphicon-ok': hasSuccess(), 'glyphicon-remove': hasError() }"
    }
```

Useful things in the decorators scope are

| Name           | Description|
|:---------------|:----------:|
| hasSuccess()   | *true* if field is valid and not pristine |
| hasError()     | *true* if field is invalid and not pristine |
| ngModel        | The controller of the ngModel directive, ex. ngModel.$valid |
| form           | The form definition for this field |


### ngModelOptions
Angular 1.3 introduces a new directive, *ngModelOptions*, which let's you set
a couple of options that change how the directive *ng-model* works. Schema Form
uses *ng-model* to bind against fields and therefore changing theses options
might be usefule for you.

One thing you can do is to change the update behavior of *ng-model*, this is how
you get form fields that validate on blur instead of directly on change.

Ex.
```javascript
{
  key: "email",
  ngModelOptions: { updateOn: 'blur' }
}
```

See [Global Options](#global-options) for an example how you set entire form
to validate on blur.

### copyValueTo
This option has a very specific use case. Imagine you have the same option in several places, but you want them to be controlled from just one field. You specify what keys the value should be copied to, and the *viewValue* will be copied to these keys on the model. **Note: changing the model directly will not copy the value, it's intended for copying user input**. The recieving fields can be shown, but the intent for them is to be hidden.

Ex.
```javascript
{
  key: "email.main",
  copyValueTo: ["email.confirm", "other.email"]
}
```

### condition
The `condition` option lets you hide or show a field depending on an angular expression. Beneath
the surface it uses `ng-if` so the hidden field is *not* part of the form.

`condition` should be a string with an angular expression. If that expression evaluates as thruthy
the field will be rendered into the DOM otherwise not. The expression is evaluated in the parent scope of
the `sf-schema` directive (the same as onClick on buttons) but with access to the current model,
current model value and current array index under the name `model`, `modelValue` and `arrayIndex`.
This is useful for hiding/showing parts of a form depending on another form control.

ex. A checkbox that shows an input field for a code when checked

```javascript
function FormCtrl($scope) {
  $scope.person = {}

  $scope.schema = {
    "type": "object",
    "properties": {
      "name": {
        "type": "string",
        "title": "Name"
      },
      "eligible": {
        "type": "boolean",
        "title": "Eligible for awesome things"
      },
      "code": {
        "type":"string",
        "title": "The Code"
      }
    }
  }

  $scope.form = [
    "name",
    "eligible",
    {
      "key": "code",
      "condition": "person.eligible", //or "model.eligible"
    }
  ]
}
```
Note that angulars two-way binding automatically will update the conditional field, no need for
event handlers and such. The condition need not reference a model value it could be anything on
scope.

The same example, but inside an array:

```javascript
function FormCtrl($scope) {
  $scope.persons = []

  $scope.schema = {
    "type": "object",
    "properties": {
      "persons": {
        "type": "array",
        "items": {
          "type": "object",
          "properties": {
            "name": {
              "type": "string",
              "title": "Name"
            },
            "eligible": {
              "type": "boolean",
              "title": "Eligible for awesome things"
            },
            "code": {
              "type":"string",
              "title": "The Code"
            }
          }
        }
      }
    }
  }

  $scope.form = [
    {
      "key": "persons",
      "items": [
        "persons[].name",
        "persons[].eligible",
        {
          key: "persons[].code",
          condition: "persons[arrayIndex].eligible", //or "model[arrayIndex].eligable"
        }
      ]
    }
  ]
}
```

Note that arrays inside arrays won't work with conditions.


### destroyStrategy
By default, when a field is removed from the DOM and the `$destroy` event is broadcast, this happens
if you use the `condition` option, the schema-validate directive will update the model to set the
field value to `undefined`. This can be overridden by setting the destroyStrategy on a field, or as a
global option, to one of the strings `"null"`, `"empty"` , `"remove"`, or `"retain"`.

`"null"` means that model values will be set to `null` instead of being removed.

`"empty"` means empty strings, `""`, for model values that has the `string` type, `{}` for model
  values with `object` type and `[]` for `array` type. All other types will be treated as `"remove"`.

`"remove"` deletes the property. This is the default.

`"retain"` keeps the value of the property event though the field is no longer in the form or being
vaidated before submit.

If you'd like to set the destroyStrategy for
an entire form, add it to the [globalOptions](#global-options)


Specific options and types
--------------------------

### input group addons

*input* and *textarea* types can also have
[bootstrap input groups](http://getbootstrap.com/components/#input-groups).

You can add them with the option `fieldAddonLeft` and `fieldAddonRight` which both takes a snippet
of html.

```js
[
  {
    "key": "email"
    "fieldAddonLeft": "@"
  }
]
```


### fieldset and section

*fieldset* and *section* doesn't need a key. You can create generic groups with them.
They do need a list of ```items``` to have as children.
```javascript
{
  type: "fieldset",
  items: [
    "name",
    { key: "surname", notitle: true }
  ]
}
```


### select and checkboxes

*select* and *checkboxes* can take an attribute, `titleMap`, which defines a name
and a value. The value is bound to the model while the name is used for display.
In the case of *checkboxes* the names of the titleMap can be HTML.

A `titleMap` can be specified as either an object (same as in JSON Form), where
the propery is the value and the value of that property is the name, or as
a list of name-value objects. The latter is used internally and is the recomended
format to use. Note that when defining a `titleMap` as an object the value is
restricted to strings since property names of objects always is a string.

As a list:
```javascript
{
  type: "select",
  titleMap: [
    { value: "yes", name: "Yes I do" },
    { value: "no", name: "Hell no" }
  ]
}
```

As an object:
```javascript
{
  type: "select",
  titleMap: {
    "yes": "Yes I do",
    "no": "Hell no"
  }
}
```

The *select* can also take an optional `group` property in its `titleMap` that adds `<optgroup>`
element to the select.

```javascript
{
  type: "select",
  titleMap: [
    { value: "yes", name: "Yes I do", group: "Boolean" },
    { value: "no", name: "Hell no" , group: "Boolean" },
    { value: "no", name: "File Not Found", group: "Other" }
  ]
}
```



### actions

*actions* behaves the same as fieldset, but can only handle buttons and submits as children.
```javascript
{
  type: "actions",
  items: [
    { type: 'submit', title: 'Ok' },
    { type: 'button', title: 'Cancel', onClick: "cancel()" }
  ]
}
```

The submit and other buttons have btn-default as default.
We can change this with ```style``` attribute:
```javascript
{
  type: "actions",
  items: [
    { type: 'submit', style: 'btn-success', title: 'Ok' },
    { type: 'button', style: 'btn-info', title: 'Cancel', onClick: "cancel()" }
  ]
}
```

### button and submit

*button* and *submit* can have a ```onClick``` attribute that either a function *or* a
string with an angular expression, as with ng-click. The expression is evaluated in the parent scope of
the ```sf-schema``` directive.

```javascript
[
  { type: 'submit', title: 'Ok', onClick: function(){ ...  } },
  { type: 'button', title: 'Cancel', onClick: "cancel()" }
[
```

The submit and other buttons have btn-default as default.
We can change this with ```style``` attribute:
```javascript
[
  { type: 'submit', style: 'btn-warning', title: 'Ok', onClick: function(){ ...  } },
  { type: 'button', style: 'btn-danger', title: 'Cancel', onClick: "cancel()" }
[
```

A *button* can also have optional icon classes:
```javascript
[
  {
    type: 'button',
    title: 'Cancel',
    icon: 'glyphicon glyphicon-icon-exclamation-sign'
    onClick: "cancel()"
  }
[
```


### radios and radiobuttons
Both type *radios* and *radiobuttons* work the same way.
They take a `titleMap` and renders ordinary radio buttons or bootstrap 3 buttons
inline. It's a cosmetic choice.

The `titleMap` is either a list or an object, see [select and checkboxes](#select-and-checkboxes)
for details. The "name" part in the `titleMap` can be HTML.

Ex.
```javascript
function FormCtrl($scope) {
  $scope.schema = {
    type: "object",
    properties: {
      choice: {
        type: "string",
        enum: ["one","two"]
      }
    }
  };

  $scope.form = [
    {
      key: "choice",
      type: "radiobuttons",
      titleMap: [
        { value: "one", name: "One" },
        { value: "two", name: "More..." }
      ]
    }
  ];
}
```

The actual schema property it binds doesn't need to be a string with an enum.
Here is an example creating a yes no radio buttons that binds to a boolean.

Ex.
```javascript
function FormCtrl($scope) {
  $scope.schema = {
    type: "object",
    properties: {
      confirm: {
        type: "boolean",
        default: false
      }
    }
  };

  $scope.form = [
    {
      key: "confirm",
      type: "radios",
      titleMap: [
        { value: false, name: "No I don't understand these cryptic terms" },
        { value: true, , name: "Yes this makes perfect sense to me" }
      ]
    }
  ];
}
```


With *radiobuttons*, both selected and unselected buttons have btn-default as default.
We can change this with ```style``` attribute:
```javascript
function FormCtrl($scope) {
  $scope.schema = {
    type: "object",
    properties: {
      choice: {
        type: "string",
        enum: ["one","two"]
      }
    }
  };

  $scope.form = [
    {
      key: "choice",
      type: "radiobuttons",
      style: {
        selected: "btn-success",
        unselected: "btn-default"
      },
      titleMap: [
        { value: "one", name: "One" },
        { value, "two", name: "More..." }
      ]
    }
  ];
}
```

### help
Help fields is not really a field, but instead let's you insert arbitrary HTML
into a form, suitable for help texts with links etc.

The get a help field you need to specify the type ```help``` and have a html
snippet as a string in the option ```helpvalue```

Ex.
```javascript
function FormCtrl($scope) {
  $scope.schema = {
    type: "object",
    properties: {
      name: {
        title: "Name",
        type: "string"
      }
    }
  };

  $scope.form = [
    {
      type: "help",
      helpvalue: "<h1>Yo Ninja!</h1>"
    },
    "name"
  ];
}
```

### template
`template` fields are like `help` fields but instead of arbitrary html you can insert or refer to
an angular template to be inserted where the field should go. There is one catch though and that
is that the scope is that of the decorator directive and its inside the isolated scope of the
`sf-schema` directive, so anything you like to access in the template should be put on the form,
which is available in template. It's basically a simple one shot version of add-ons, so see the
see the docs on [Extending Schema Form](extending.md) for details on what is on scope and what's up
with `$$value$$`



The `template` type should either have a `template` or a `templateUrl` option.

Ex.
```javascript
function FormCtrl($scope) {

  $scope.form = [
    {
      type: "template",
      template: '<h1 ng-click="form.foo()">Yo {{form.name}}!</h1>',
      name: 'Ninja',
      foo: function() { console.log('oh noes!'); }
    },
    {
      type: "template",
      templateUrl: "templates/foo.html",
      myFavouriteVariable: 'OMG!!'
    }
  ];
}
```

### tabs
The `tabs` form type lets you split your form into tabs. It is similar to
`fieldset` in that it just changes the presentation of the form. `tabs`
takes a option, also called `tabs`, that is a list of tab objects. Each tab
object consist of a *title* and a *items* list of form objects.

Ex.
```javascript
function FormCtrl($scope) {
  $scope.schema = {
    type: "object",
    properties: {
      name: {
        title: "Name",
        type: "string"
      },
      nick: {
        title: "Nick",
        type: "string"
      }
      alias: {
        title: "Alias",
        type: "string"
      }
      tag: {
        title: "Tag",
        type: "string"
      }
    }
  };

  $scope.form = [
    "name",
    {
      type: "tabs",
      tabs: [
        {
          title: "Tab 1",
          items: [
            "nick",
            "alias"
          ]
        },
        {
          title: "Tab 2",
          items: [
            "tag"
          ]
        }
      ]
    }
  ];
}
```

### array
The `array` form type is the default for the schema type `array`.
The schema for an array has the property `"items"` which in the JSON Schema
specification can be either another schema (i.e. and object), or a list of
schemas. Only a schema is supported by Schema Form, and not the list of schemas.

The *form* definition has the option `items` that should be a list
of form objects.

The rendered list of subforms each have a *"Remove"* button and at the bottom there
is an *"Add"* button. The default *"Add"* button has class btn-default and text Add. Both
could be changed using attribute `add`, see example below.

If you like to have drag and drop reordering of arrays you also need
[ui-sortable](https://github.com/angular-ui/ui-sortable) and its dependencies
[jQueryUI](http://jqueryui.com/), see *ui-sortable* documentation for details of
what parts of jQueryUI that is needed. You can also pass options to the *ui-sortable* directive
by including a `sortOptions` key on the form object. Check the *ui-sortable* documentation
for a complete list of available options. You can safely ignore these if you don't need the reordering.

In the form definition you can refer to properties of an array item by the empty
bracket notation. In the `key` simply end the name of the array with `[]`

By default the array will start with one *undefined* value so that the user is presented with one
form element. To suppress this behaviour, set the attribute `startEmpty` to `true`.

Given the schema:
```json
{
  "type": "object",
  "properties": {
    "subforms": {
      "type": "array",
      "items": {
        "type": "object",
        "properties": {
          "name": { "type": "string" },
          "nick": { "type": "string" },
          "emails": {
            "type": "array",
            "items": {
              "type": "string"
            }
          }
        }
      }
    }
  }
}
```
Then `subforms[].name` refers to the property name of any subform item,
`subforms[].emails[]` refers to the subform of emails. See example below for
usage.


Single list of inputs example:
```javascript
function FormCtrl($scope) {
  $scope.schema = {
    type: "object",
    properties: {
      names: {
        type: "array",
        items: {
          title: "Name",
          type: "string"
        }
      }
    }
  };

  $scope.form = ['*'];
}
```


Example with sub form, note that you can get rid of the form field the object wrapping the
subform fields gives you per default by using the `items` option in the
form definition, also example of `startEmpty`.

```javascript
function FormCtrl($scope) {
  $scope.schema = {
    "type": "object",
    "properties": {
      "subforms": {
        "type": "array",
        "items": {
          "type": "object",
          "properties": {
            "name": { "type": "string" },
            "nick": { "type": "string" },
            "emails": {
              "type": "array",
              "items": {
                "type": "string"
              }
            }
          }
        }
      }
    }
  };


  $scope.form = [
    {
      key: "subforms",
      add: "Add person",
      style: {
		    add: "btn-success"
	    },
      items: [
        "subforms[].nick",
        "subforms[].name",
        "subforms[].emails",
      ],
      startEmpty: true
    }
  ];
}
```

To suppress add and remove buttons set `add` to `null` and `remove` to `null`.
```javascript
function FormCtrl($scope) {
  $scope.form = [
    {
      key: "subforms",
      add: null,
      remove: null,
      style: {
        add: "btn-success"
      },
      items: [
        "subforms[].nick",
        "subforms[].name",
        "subforms[].emails",
      ],
    }
  ];
}
```



### tabarray
The `tabarray` form type behaves the same way and has the same options as
`array` but instead of rendering a list it renders a tab per item in list.

By default the tabs are on the left side (follows the default in JSON Form),
but with the option `tabType` you can change that to eiter *"top"* or *"right"*
as well.

Every tab page has a *"Remove"* button. The default *"Remove"* button has class btn-default
and text Remove. Both could be changed using attribute `remove`, see example below.

In this case we have an *"Add"* link, not an *"Add"* button. Therefore, the attribute `add`
only changes the text of the link. See example below.

Bootstrap 3 doesn't have side tabs so to get proper styling you need to add the
dependency [bootstrap-vertical-tabs](https://github.com/dbtek/bootstrap-vertical-tabs).
It is not needed for tabs on top.

The `title` option is a bit special in `tabarray`, it defines the title
of the tab and it is interpolated so you can use expression it. Its interpolated
with two extra variables in context: **value** and **$index**, where **value**
is the value in the array (i.e. that tab) and **$index** the index.

You can include multiple expressions or mix expressions and text as needed:
Ex:
```javascript

    {
      "form": [
        {
          "type": "tabarray",
          "title": "My {{ value.name }} is:",
        }
      ]
    }

```

#### Deprecation Warning
Before version 0.8.0 the entire title was evaluated as an expression and not interpolated.
If you weren't using expressions in your form titles then no changes are needed.

However, if your tabarray titles contain implicit Angular expressions like this:
```js
    {
      "form": [
        {
          "type": "tabarray",
          "title": "value.name || 'Tab '+$index",
        }
      ]
    }
```


Then you should change this to explicit expressions by wrapping them with the Angular expression
delimiter "{{ }}":
```js
    {
      "form": [
        {
          "type": "tabarray",
          "title": "{{ value.name || 'Tab '+$index }}",
        }
      ]
    }
```


Example with tabs on the top:

```javascript
function FormCtrl($scope) {
  $scope.schema = {
    "type": "object",
    "properties": {
      "subforms": {
        "type": "array",
        "items": {
          "type": "object",
          "properties": {
            "name": { "type": "string" },
            "nick": { "type": "string" },
            "emails": {
              "type": "array",
              "items": {
                "type": "string"
              }
            }
          }
        }
      }
    }
  };


  $scope.form = [
    {
      type: "tabarray",
      tabType: "top",
      title: "{{value.nick || ('Tab '+$index)}}"
      key: "subforms",
      remove: "Delete",
      style: {
        remove: "btn-danger"
      },
      add: "Add person",
      items: [
        "subforms[].nick",
        "subforms[].name",
        "subforms[].emails"
      ]
    }
  ];
}
```





Post process function
---------------------

If you like to use `["*"]` as a form, or aren't in control of the form definitions
but really need to change or add something you can register a *post process*
function with the `schemaForm` service provider. The post process function
gets one argument, the final form merged with the defaults from the schema just
before it's rendered, and should return a form.

Ex. Reverse all forms
```javascript
angular.module('myModule', ['schemaForm']).config(function(schemaFormProvider){

  schemaFormProvider.postProcess(function(form){
    form.reverse();
    return form;
  })

});
```

Events
---------------------
Events are emitted or broadcast at various points in the process of rendering or validating the
form. Below is a list of these events and how they are propagated.

| Event                | When                   | Type  | Arguments                          |
|:--------------------:|:----------------------:|:-----:|:----------------------------------:|
| `sf-render-finished` | After form is rendered | emit  | The sf-schema directives's element |


Schema form also listens to events.

| Event                | What                   |  Docs|
|:--------------------:|:----------------------:|:---------------------------------------:|
| `schemaFormValidate` | Validates all fields   | [Handling Submit](#handling-submit)     |
| `schemaFormRedraw`   | Redraws form           | [Updating Form](#updating-form)         |



### Manual field insertion
There is a limited feature for controlling manually where a generated field should go so you can
,as an example, wrap it in custom html. Consider the feature experimental.

It has a number of drawbacks though.

1. You can only insert fields that are in the root level of your form definition, i.e. not inside fieldset, arrays etc.
1. Generated fields are always last in the form so if you don't supply slots for all of your top level fields the rest goes below.
1. To match "keys" of forms we match against the internal array format, hence the key "name" becomes "['name']" and "foo.bar" becomes "['foo']['bar']"

Define "slots" for the generated field by adding an element with the attribute `sf-insert-field`

ex.
```js
$scope.form = [
  "name",
  "email",
  "comment"
]
```

```html
<form sf-model="model"
      sf-form="form"
      sf-schema="schema">
  <em>before</em>
  <div sf-insert-field="['email']"></div>
  <em>after</em>

  <!-- the rest of the form, i.e. name and comment will be generated here -->
</form>
```



Deprecated fields
-----------------

### conditional

The *conditional* type is now deprecated since every form type now supports the form option
`condition`.

A *conditional* is exactly the same as a *section*, i.e. a `<div>` with other form elements in
it, hence they need an `items` property. They also need a `condition` which is
a string with an angular expression. If that expression evaluates as thruthy the *conditional*
will be rendered into the DOM otherwise not. The expression is evaluated in the parent scope of
the `sf-schema` directive (the same as onClick on buttons) but with access to the current model
and current array index under the name `model` and `arrayIndex`. This is useful for hiding/showing
parts of a form depending on another form control.

ex. A checkbox that shows an input field for a code when checked

```javascript
function FormCtrl($scope) {
  $scope.person = {}

  $scope.schema = {
    "type": "object",
    "properties": {
      "name": {
        "type": "string",
        "title": "Name"
      },
      "eligible": {
        "type": "boolean",
        "title": "Eligible for awesome things"
      },
      "code": {
        "type":"string",
        "title": "The Code"
      }
    }
  }

  $scope.form = [
    "name",
    "eligible",
    {
        type: "conditional",
        condition: "model.person.eligible",
        items: [
          "code"
        ]
    }
  ]
}
```
Note that angulars two-way binding automatically will update the conditional block, no need for
event handlers and such. The condition need not reference a model value it could be anything in
scope.

The same example, but inside an array:

```javascript
function FormCtrl($scope) {
  $scope.persons = []

  $scope.schema = {
    "type": "object",
    "properties": {
      "persons": {
        "type": "array",
        "items": {
          "type": "object",
          "properties": {
            "name": {
              "type": "string",
              "title": "Name"
            },
            "eligible": {
              "type": "boolean",
              "title": "Eligible for awesome things"
            },
            "code": {
              "type":"string",
              "title": "The Code"
            }
          }
        }
      }
    }
  }

  $scope.form = [
    {
      "key": "persons",
      "items": [
        "persons[].name",
        "persons[].eligible",
        {
          type: "conditional",
          condition: "persons[arrayIndex].eligible", //or "model.eligable"
          items: [
            "persons[].code"
          ]
        }
      ]
    }
  ]
}
```

Note that arrays inside arrays won't work with conditional.
