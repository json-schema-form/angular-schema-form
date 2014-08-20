Documentation
=============

1. [Basic Usage](#basic-usage)
1. [Handling Submit](#handling-submit)
1. [Global Options](#global-options)
1. [Form types](#form-types)
1. [Default form types](#default-form-types)
1. [Form definitions](#form-definitions)
1. [Overriding field types and order](#overriding-field-types-and-order)
1. [Standard Options](#standard-options)
    1. [onChange](#onchange)
    1. [Validation Messages](#validation-messages)
    1. [Inline feedback icons](#inline-feedback-icons)
    1. [ngModelOptions](#ngmodeloptions)
1. [Specific options and types](#specific-options-and-types)
    1. [fieldset and section](#fieldset-and-section)
    1. [conditional](#conditional)
    1. [select and checkboxes](#select-and-checkboxes)
    1. [actions](#actions)
    1. [button](#button)
    1. [radios and radiobuttons](#radios-and-radiobuttons)
    1. [help](#help)
    1. [tabs](#tabs)
    1. [array](#array)
    1. [tabarray](#tabarray)
1. [Post process function](#post-process-function)

Basic Usage
-----------

First, expose your schema, form, and model to the $scope.

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
}
```

Then load them into Schema Form using the `sfSchema`, `sfForm`, and `sfModel` directives.

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


Global Options
--------------
Schema Form also have two options you can set globally via the `sf-options`
attribute which should be placed along side `sf-schema`.

`sf-options` takes an object with the following possible attributes.


| Attribute     |                         |
|:--------------|:------------------------|
| supressPropertyTitles | by default schema form uses the property name in the schema as a title if none is specified, set this to true to disable that behavior |
| formDefaults | an object that will be used as a default for all form definitions |

*formDefaults* is mostly useful for setting global [ngModelOptions](#ngmodeloptions)
i.e. changing the entire form to validate on blur. But can also be used to set
[Validation Messages](#validation-messages) for all fields if you like a bit more
friendlier messages.

Ex.
```html
<div ng-controller="FormController">
    <form sf-schema="schema"
          sf-form="form"
          sf-model="model"
          sf-options="{ formDefaults: { ngModelOptions: { updateOn: 'blur' } }}"></form>
</div>
```



Form types
----------
Schema Form currently supports the following form field types out of the box:

| Form Type     |  Becomes                |
|:--------------|:------------------------|
| fieldset      |  a fieldset with legend |
| section       |  just a div             |
| conditional   |  a section with a ```ng-if``` |
| actions       |  horizontal button list, can only submit and buttons as items |
| text          |  input with type text   |
| textarea      |  a textarea             |
| number        |  input type number      |
| checkbox      |  a checkbox             |
| checkboxes    |  list of checkboxes     |
| select        |  a select (single value)|
| submit        |  a submit button        |
| button        |  a button               |
| radios        |  radio buttons          |
| radios-inline |  radio buttons in one line |
| radiobuttons  |  radio buttons with bootstrap buttons |
| help          |  insert arbitrary html |
| tab           |  tabs with content     |
| array         |  a list you can add, remove and reorder |
| tabarray      |  a tabbed version of array |

More field types can be added, for instance a "datepicker" type can be added by
including the [datepicker addon](datepicker.md)


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
  ngModelOptions: { ... }      // Passed along to ng-model-options
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

Per default all error messages comes from the schema validator
[tv4](https://github.com/geraintluff/tv4), this might or might not work for you.
If you supply a `validationMessage` property in the form definition, and if its value is a
string that will be used instead on any validation error.

If you need more fine grained control you can supply an object instead with keys matching the error
codes of [tv4](https://github.com/geraintluff/tv4). See `tv4.errorCodes`

Ex.
```javascript
{
  key: "address.street",
  validationMessage: {
    tv4.errorCodes.STRING_LENGTH_SHORT: "Address is too short, man.",
    "default": "Just write a proper address, will you?"   //Special catch all error message
  }
}
```

You can also set a global `validationMessage` in *formDefaults* see
[Global Options](#global-options).


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
      feedback: "{ 'glyphicon': true, 'glyphicon-asterisk': form.requires && !hasSuccess && !hassError() ,'glyphicon-ok': hasSuccess(), 'glyphicon-remove': hasError() }"
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


Specific options and types
--------------------------

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

### conditional

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
        "type":"string"
        "title": "The Code"
      }
    }
  }

  $scope.form = [
    "name",
    "eligible",
    {
        type: "conditional",
        condition: "person.eligible", //or "model.eligable"
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
              "type":"string"
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

### select and checkboxes

*select* and *checkboxes* can take an attribute, `titleMap`, wich defines a name
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

### actions

*actions* behaves the same as fieldset, but can only handle buttons as chidren.
```javascript
{
  type: "actions",
  items: [
    { type: 'submit', title: 'Ok' }
    { type: 'button', title: 'Cancel', onClick: "cancel()" }
  ]
}
```

The submit button has btn-primary as default. The button has btn-default as default.
We can change this with ```style``` attribute:
```javascript
{
  type: "actions",
  items: [
    { type: 'submit', style: 'btn-success', title: 'Ok' }
    { type: 'button', style: 'btn-info', title: 'Cancel', onClick: "cancel()" }
  ]
}
```

### button

*button* can have a ```onClick``` attribute that either, as in JSON Form, is a function *or* a
string with an angular expression, as with ng-click. The expression is evaluated in the parent scope of
the ```sf-schema``` directive.

```javascript
[
  { type: 'button', title: 'Ok', onClick: function(){ ...  } }
  { type: 'button', title: 'Cancel', onClick: "cancel()" }
[
```

The submit button has btn-primary as default. The button has btn-default as default.
We can change this with ```style``` attribute:
```javascript
[
  { type: 'button', style: 'btn-warning', title: 'Ok', onClick: function(){ ...  } }
  { type: 'button', style: 'btn-danger', title: 'Cancel', onClick: "cancel()" }
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
        { value, "two", name: "More..." }
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
      key: "choice",
      type: "radios",
      titleMap: [
        { value: false, name: "No I don't understand these cryptic terms" },
        { value: true, , name: "Yes this makes perfect sense to me" }
      ]
    }
  ];
}
```


With *radiobuttons*, both selected and unselected buttons have btn-primary as default.
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
what parts of jQueryUI that is needed. You can safely ignore these if you don't
need the reordering.

In the form definition you can refer to properties of an array item by the empty
bracket notation. In the `key` simply end the name of the array with `[]`

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
form definition.

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
      ]
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
of the tab and is considered a angular expression. The expression is evaluated
with two extra variables in context: **value** and **$index**, where **value**
is the value in the array (i.e. that tab) and **$index** the index.

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
      title: "value.nick || ('Tab '+$index)"
      key: "subforms",
      remove: "Delete",
      style: {
		remove: "btn-danger"
	  },
	  add: "Add person",
      items: [
        "subforms[].nick",
        "subforms[].name",
        "subforms[].emails",
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
