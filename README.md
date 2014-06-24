Angular Schema Form
===================

Generate forms from a JSON schema, with AngularJS!

### [Try out the example page](http://textalk.github.io/angular-schema-form/examples/bootstrap-example.html)
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

Documentation
-------------
Documentation covering defaults and form types [can be found here.](docs/index.md)


Installation
------------
Simplest way is by using [bower](http://bower.io/) since it will also download
any dependencies.

```bash
bower install angular-schema-form
```

(or just download the contents of the ```dist/``` folder and add dependencies
manually)

It depends on AngularJS (duh!), [tv4](https://github.com/geraintluff/tv4), and
if you like to use the date picker you also need jQuery and
[pickadate.js](http://amsul.ca/pickadate.js/)

The minified files also includes all templates so they are all you need.

Addons
------
Currently there is only one addon, a date picker using
the excellent [pickadate.js](http://amsul.ca/pickadate.js/).

See the [docs](docs/datepicker.md) for usage.


Contributing
------------

All contributions are welcome! We're trying to use [git flow](http://danielkummer.github.io/git-flow-cheatsheet/)
so please base any merge request on the **development** branch instead of **master**.
