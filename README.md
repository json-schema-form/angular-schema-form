Angular Schema Form
===================

Generate forms from a JSON schema, with AngularJS!

### [Try out the example page](http://textalk.github.io/angular-schema-form/src/bootstrap-example.html) 
...where you can edit the schema or the form definition and see what comes out!


What is it?
----------

Schema Form is a set of AngularJS directives (and a service..) that can create a form directly from a json schema
definition and also validate against that schema. The defaults may be fine for a lot cases, but you can also
customize it, changing order and type of fields.


Schema Form is inspired by the nice [JSON Form](https://github.com/joshfire/jsonform) library and aims to be roughly
compatible with it, especially it's form defintion. What sets Schema Form apart from JSON Form is that Schema Form
aims to be deeply integrated with AngularJS, i.e. to use the standard AngularJS way of handling forms. It also uses
[tv4](https://github.com/geraintluff/tv4) for validation which means its compatible with version 4 of the json schema
standard. Schema Form, as a default, generates bootstrap 3 friendly HTML.

Another thing that sets Schema Form apart is that it, at the moment, doesn't implement half of what JSON Form
does, nor have any documentation! Which of course we hope to remedy soon.


Basic Usage
-----------

```html
<form sf-schema="schema" sf-form="form" sf-model="data"></form>
```

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

  $scope.data = {};
}
```

Form types
----------
Schema Form currently supports the following form field types:

| Type          |  Becomes                |
|:--------------|:------------------------|
| fieldset      |  a fieldset with legend |
| section       |  just a div             |
| actions       |  horizontal button list, can only submit and buttons as items |
| text          |  input with type text   |
| textarea      |  a textarea             |
| number        |  input type number      |
| checkbox      |  a checkbox             |
| checkboxes    |  list of checkboxes     |
| select        |  a select (single value)|
| submit        |  a submit button        |
| button        |  a button               |



Default form types
------------------

| Schema             |   Form type  |
|:-------------------|:------------:|
| "type": "string"   |   text       |
| "type": "number"   |   number     |
| "type": "integer"  |   number     |
| "type": "boolean"  |   checkbox   |
| "type": "object"   |   fieldset   |
| "type": "string" and a "enum" | select |
| "type": "array" and a "enum" in array type | checkboxes |



Form definition and "*"
----------------------
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
    titleMap: {
      "Andersson": "Andersson",
      "Johansson": "Johansson",
      "other": "Something else..."
    }
  }
]
```

Options
-------

General options most field types can handle:
```javascript
{
  key: "address.street",      //The dot notatin to the attribute on the model
  type: "text",               //Type of field
  title: "Street",            //Title of field, taken from schema if available
  notitle: false,             //Set to true to hide title
  description: "Street name", //A description, taken from schema if available
  validationMessage: "Oh noes, please write a proper address"  //A custom validation error message
}
```

Validation Messages
-------------------
Per default all error messages but "Required" comes from the schema validator
[tv4](https://github.com/geraintluff/tv4), this might or might not work for you.
If you supply a ´´´validationMessage´´´ proṕerty in the form definition, and if its value is a
string that will be used instead on any validation error.

If you need more fine grained control you can supply an object instead with keys matching the error
codes of [tv4](https://github.com/geraintluff/tv4). See ```tv4.errorCodes```

Ex.
```javascript
{
  key: "address.street",
  validationMessage: {
    tv4.errorCodes.STRING_LENGTH_SHORT: "Address is too short, man.",
    "default": "Just write a proper address, will you?",   //Special catch all error message
    "required": "I needz an address plz"                   //Used for required if specified
  }
}
```


Specific options per type
-------------------------

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


*select* and *checkboxes* can take an object, ```titleMap```, where key is the value to be saved on the model
and the value is the title of the option.
```javascript
{
  type: "select",
  titleMap: {
    "yes": "Yes I do",
    "no": "Hell no"
  }
}
```

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

*button* can have a ```onClick``` attribute that either, as in JSON Form, is a function *or* a
string with an angular expression, as with ng-click.
```javascript
[
  { type: 'button', title: 'Ok', onClick: function(){ ...  } }
  { type: 'button', title: 'Cancel', onClick: "cancel()" }
[
```

