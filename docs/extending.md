Extending Schema Form
=====================

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
Schema Form uses the [sfBuilder](https://github.com/Textalk/angular-schema-form/blob/development/src/services/builder.js)
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
  <label>{{form.title}}</div>
  <input sf-field-model schema-validate="form" type="text">
  <div sf-message="form.description"></div>
</div>
```

**BIG FAT CAVEAT**
Ok, so currently there is something really ugly here. The bootstrap (and material) decorator uses
a build step (gulp-angular-templatecache) to "compile" the template into a javascript file that
basically chucks the template into `$templateCache`. Currently schema form does *not* support
loading the templates any other way. They need to be in `$templateCache` when rendering.

This is really ugly and will be fixed. But you have been warned!


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
[http://textalk.github.io/angular-schema-form/](http://textalk.github.io/angular-schema-form/#third-party-addons), we
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

#### sf-field-model="<attribute name>"
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
TODO: more in depth about schema-validate, sf-messages and sf-field
