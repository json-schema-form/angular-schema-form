Extending Schema Form
=====================
<!-- START doctoc generated TOC please keep comment here to allow auto update -->
<!-- DON'T EDIT THIS SECTION, INSTEAD RE-RUN doctoc TO UPDATE -->


- [Overview](#overview)
- [How the form is built](#how-the-form-is-built)
    - [The actual building](#the-actual-building)
- [Creating an add-on](#creating-an-add-on)
    - [The Template](#the-template)
    - [Compile template](#compile-template)
    - [Builder functions](#builder-functions)
    - [Application of builder functions](#application-of-builder-functions)
- [Defining a decorator](#defining-a-decorator)
  - [Setting up schema defaults](#setting-up-schema-defaults)
  - [Sharing your add-on with the world](#sharing-your-add-on-with-the-world)
- [The builders](#the-builders)
  - [builders.sfField](#builderssffield)
  - [builders.condition](#builderscondition)
  - [builder.ngModel](#builderngmodel)
    - [sf-field-model](#sf-field-model)
    - [sf-field-model="attribute name"](#sf-field-modelattribute-name)
    - [sf-field-model="replaceAll"](#sf-field-modelreplaceall)
  - [builders.ngModelOptions](#buildersngmodeloptions)
  - [builder.simpleTransclusion](#buildersimpletransclusion)
- [Useful directives](#useful-directives)
  - [sf-field](#sf-field)
    - [What's on the scope?](#whats-on-the-scope)
    - [Deprecation warning](#deprecation-warning)

<!-- END doctoc generated TOC please keep comment here to allow auto update -->

Overview
--------

Schema Form is designed to be easily extended. You can add your own custom fields or completely
change the how the entire form is rendered.

A custom field is called an **add-on** and you can find community add-ons listed over at
[schemaform.io](http://schemaform.io).

To completely change how the entire field is rendered you need to create what we call a **decorator**.
A decorator is actually a collection of add-ons that at least cover the basic field types
that a schema can default to, but usually a lot more.

But before we get into the details of how you define a decorator or an add-on, let's take a look at how schema form builds forms.

How the form is built
----------------------
Schema Form uses the [sfBuilder](https://github.com/json-schema-form/angular-schema-form/blob/development/src/services/builder.js)
service to recursively build the DOM elements of the form from a *canonical form definition*, that
is our fancy word for an internal representation of a merge between the schema and the form.

It's always an array of object and each object at least have the property `type`. If a `type` was
not set in the form definition given to `sf-form` the schema is used to get a default.

Example canonical form def.
```js
[
  {
    type: 'text'
    key: 'name'
  },
  {
    type: 'fieldset',
    item: [
      {
        type: 'textarea',
        key: 'comment'
      }
    ]
  }
]
```

#### The actual building
So to build a form from a canonical form definition as in the example above the builder service loops
over and for each type asks the decorator for a template, it adds it to a document fragment.

After adding the template it also asks the decorator if that type has a *builder*
function (actually it's usually a list of functions). If so it calls it with the DOM of its template,
the form definition for that field and other useful stuff. This way the builder can modify and
prepare the template depending on options in that fields form object.

Nested fields, as with the fieldset above in the example above, builds it's children with such a
*builder* function.

This all happens in one large swoop and the finished document fragment is popped inside the form
and then `$compile` is used to kick start it's directives.


Creating an add-on
------------------

So to create an add-on you need two things, a template and some *builder functions*. Fortunately
schema form got you covered with a couple of standard builders so most of the time you will only
need a template.

To register your template to be used when the form definition has a specific type you use the
`schemaFormDecoratorsProvider.defineAddOn`.

Ex.
```js  
angular.module('myAddOnModule', ['schemaForm']).config(function(schemaFormDecoratorsProvider, sfBuilderProvider) {

  schemaFormDecoratorsProvider.defineAddOn(
    'bootstrapDecorator',         // Name of the decorator you want to add to.
    'awesome',                    // Form type that should render this add-on
    'templates/my/addon.html',    // Template name in $templateCache
    sfBuilderProvider.stdBuilders // List of builder functions to apply.
  );

});
```

The standards builders are `[sfField, ngModel, ngModelOptions, condition]`, see usage details below.

#### The Template
So whats in a template? You usually need a couple of things:

  1. Usually a top level element that surrounds your template is a good idea. The `sfField` builder
     slaps on a `sfField` directive that exposes the current form object on scope as `form`.
  1. A `sf-field-model` somewhere so that the `ngModel` builder can add a proper `ngModel` to bind
      your model value to.
  1. A `schema-validate="form"` directive on the same element to enable schema validation.
  1. A `<div sf-message="form.description"></div>` to display description or error messages.

Basic template example:
```html
<div> <!-- Surrounding DIV for sfField builder to add a sfField directive to. -->
  <label>{{form.title}}</label>
  <input sf-field-model schema-validate="form" type="text">
  <div sf-message="form.description"></div>
</div>
```

#### Compile template
Currently there is something of a nuisance here. The bootstrap (and material) decorator use
a build step (gulp-angular-templatecache) to "compile" the template into a javascript file that
adds the template into `$templateCache`. Currently schema form does *not* support
loading the templates any other way. **They need to be in `$templateCache` when rendering**.

We strongly recommend using the yeoman generator for creating add-ons https://github.com/json-schema-form/generator-angular-schema-form-add-on

#### Builder functions
A more detailed description of the built in builders can be found below, however this section
describes how you can add your own builder to process your template as it is inserted into the
schema-form output.

A builder function takes an `args` object containing
- fieldFrag - a document fragment for manipulating prior to its insertion into the form
- form - The currently processing form definition
- lookup - A reference list for items added already
- state - Any behaviour or defaults being passed from parents
- path - The path to the form definition
- build - A build function used for building child elements from a form definition

The below builder looks up a `textarea` element and sets a md-maxlength attribute
```javascript
function textareaBuilder(args) {
  var textareaFrag = args.fieldFrag.querySelector('textarea');
  var maxLength = args.form.maxlength || false;
  if (textareaFrag && maxLength) {
    textareaFrag.setAttribute('md-maxlength', maxLength);
  };
};
```

#### Application of builder functions
To make your add-on use the builder it must be in the array of builders in the decorator definition.

To update the previous example to add my builder, since `sfBuilderProvider.stdBuilders` is an
array I can simply add `.concat(textarea)` as below:
```js  
angular.module('myAddOnModule', ['schemaForm']).config(function(schemaFormDecoratorsProvider, sfBuilderProvider) {

  schemaFormDecoratorsProvider.defineAddOn(
    'bootstrapDecorator',         // Name of the decorator you want to add to.
    'awesome',                    // Form type that should render this add-on
    'templates/my/addon.html',    // Template name in $templateCache
    sfBuilderProvider.stdBuilders.concat(textarea) // List of builder functions to apply.
  );

});
```

Defining a decorator
--------------------
Defining a decorator is basically the same as defining a lot of add-ons. As with add-ons you use
the `schemaFormDecoratorsProvider` again. This time its
`schemaFormDecoratorsProvider.defineDecorator`.

Ex.
```js
angular.module('myDecoratorModule', ['schemaForm']).config(function(schemaFormDecoratorsProvider, sfBuilderProvider) {

  schemaFormDecoratorsProvider.defineDecorator('awesomeDecorator', {
    textarea: {template: base + 'textarea.html', builder: sfBuilderProvider.stdBuilders},
    button: {template: base + 'submit.html', builder: sfBuilderProvider.stdBuilders},
    text: {template: base + 'text.html', builder: sfBuilderProvider.stdBuilders},

    // The default is special, if the builder can't find a match it uses the default template.
    'default': {template: base + 'default.html', builder: sfBuilderProvider.stdBuilders}
  }, []);
});
```

### Setting up schema defaults
So you got this shiny new add-on or decorator that adds a fancy field type, but feel a bit bummed out that you
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

### Sharing your add-on with the world
So you made an add-on, why not share it with us? On the front page,
[http://schemaform.io/#/third-party-addons](http://schemaform.io/#/third-party-addons), we
maintain a list of add ons based on a query of the bower register, and we love to see your add-on
there.

Any [bower](http://bower.io) package with a name starting with `angular-schema-form-` or that has
the `keyword` `angular-schema-form-add-on` in its `bower.json` will be picked up. It's cached so
there can be a delay of a day or so.

So [make a bower package](http://bower.io/docs/creating-packages/), add the keyword
`angular-schema-form-add-on` and [register it](http://bower.io/docs/creating-packages/#register)!




The builders
------------
A collection of useful builders that cover most cases are in the `sfBuilder` service and is accessable
both from the provider and the service on the property `builders`. There is also a list of "standard"
builders, when in doubt use those.

```js
angular.module('myMod').config(function(sfBuildersProvider) {

  // Standard builders
  sfBuildersProvider.stdBuilders;

  // All builders
  sfBuildersProvider.builders.sfField;
  sfBuildersProvider.builders.condition;
  sfBuildersProvider.builders.ngModel;
  sfBuildersProvider.builders.ngModelOptions;
  sfBuildersProvider.builders.simpleTransclusion;
  sfBuildersProvider.builders.transclusion;
  sfBuildersProvider.builders.array;

});
```

Currently the standard builders are:
```js
var stdBuilders = [
  builders.sfField,
  builders.ngModel,
  builders.ngModelOptions,
  builders.condition
];
```


### builders.sfField
The `sfField` builder adds the `sf-field="..."` directive to *the first child element* in the template,
giving it a correct value. The value is an id number that identifies that specific form object.

The `sf-field` directive exports the form definition object as `form` on scope and as a lot of useful functions.

As a rule of thumb you always want this builder.

### builders.condition
The `condition` builder checks the form definition for the option `condition`. If it's present it adds a
`ng-if` to all top level elements in the template.

You usually want this as well.

### builder.ngModel
The `ngModel` builder is maybe the most important builder. It makes sure you get a proper binding to
your model value.

The `ngModel` builder queries the DOM of the template for all elements that have the attribute `sf-field-model`. Your template may have several of them. `sf-field-model` is *not* a directive,
but depending on it's value the `ngModel` builder will take three different actions.

#### sf-field-model
Just `sf-field-model` or `sf-field-model=""` tells the builder to add a `ng-model` directive to this element.
This is a common use case.

Ex:
DOM before `ngModel` builder:
```html
<div>
  <input sf-field-model type="text">
</div>
```
DOM after `ngModel` builder:
```html
<div>
  <input sf-field-model ng-model="model['name']" type="text">
</div>
```

#### sf-field-model="attribute name"
Given a value the `ngModel` builder will treat that value as a *attribute name* and instead of slapping
on a `ng-model` set the specified attributes value. It sets it to the same value as the `ng-model` would have gotten.

Ex:
DOM before `ngModel` builder:
```html
<div sf-field-model="my-directive">
  <input sf-field-model type="text">
</div>
```
DOM after `ngModel` builder:
```html
<div my-directive="model['name']">
  <input sf-field-model ng-model="model['name']" type="text">
</div>
```

#### sf-field-model="replaceAll"
With the special value *replaceAll* the `ngModel` builder will instead loop over every attribute on the
element and do a string replacement of `"$$value$$"` with the proper model value.

Ex:
DOM before `ngModel` builder:
```html
<div>
  <input sf-field-model="replaceAll"
         ng-model="$$value$$"
         ng-class="{'large': $$value$$.length > 10}"
         type="text">
</div>
```
DOM after `ngModel` builder:
```html
<div>
  <input sf-field-model="replaceAll"
         ng-model="model['name']"
         ng-class="{'large': model[name].length > 10}"
         type="text">
</div>
```

### builders.ngModelOptions
If the form definition has a `ngModelOptions` option specified this builder will slap on a `ng-model-options`
attribute to *the first child element* in the template.


### builder.simpleTransclusion
The `simpleTransclusion` builder will recurse and build form items, useful for fieldsets etc. This builder
is simple because it only appends children to the first child element and only checks `form.items`.


Useful directives
-----------------

### sf-field
sfField is the directive that adds scope to the template

#### What's on the scope?
You have several helper functions and values on the scope, most important of this `form`. The
`form` variable contains the merged form definition for that field, i.e. your supplied form object +
the defaults from the schema (it also has its part of the schema under *form.schema*).
This is how you define and use new form field options, whatever is set on the form object is
available here for you to act on.

| Name     |  What it does  |
|----------|----------------|
| form      | Form definition object |
| showTitle() | Shorthand for `form && form.notitle !== true && form.title` |
| ngModel   | The ngModel controller, this will be on scope if you use either the directive `schema-validate` or `sf-array` |
| evalInScope(expr, locals) | Eval supplied expression, ie scope.$eval |
| evalExpr(expr, locals) | Eval an expression in the parent scope of the main `sf-schema` directive. |
| interp(expr, locals) | Interpolate an expression which may or may not contain expression `{{ }}` sequences |
| buttonClick($event, form)  | Use this with ng-click to execute form.onClick |
| hasSuccess() | Shorthand for is valid and either not pristine or the model value is not empty |
| hasError() | Shorthand for is invalid and not pristine |

#### Deprecation warning
There is still a `errorMessage` function on scope but it's been deprecated. Please use the
`sf-message` directive instead.

TODO: more in depth about schema-validate and sf-messages
