Angular Schema Form
===================

[![Build Status](https://travis-ci.org/Textalk/angular-schema-form.svg?branch=master)](https://travis-ci.org/Textalk/angular-schema-form)
[![Coverage Status](https://coveralls.io/repos/Textalk/angular-schema-form/badge.png?branch=master)](https://coveralls.io/r/Textalk/angular-schema-form?branch=development)
[![Bower version](https://badge.fury.io/bo/angular-schema-form.svg)](http://badge.fury.io/bo/angular-schema-form)

Generate forms from a JSON schema, with AngularJS!

### [Try out the example page](http://textalk.github.io/angular-schema-form/examples/bootstrap-example.html)
...where you can edit the schema or the form definition and see what comes out!


What is it?
----------

Schema Form is a set of AngularJS directives (and a couple of services..) that can create a form directly from a json schema
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

It depends on [AngularJS](https://angularjs.org/) (duh!),
[angular-sanitize](https://docs.angularjs.org/api/ngSanitize),
[bootstrap 3](http://getbootstrap.com/),
[tv4](https://github.com/geraintluff/tv4), and
if you like to use the date picker you also need jQuery and
[pickadate.js](http://amsul.ca/pickadate.js/). Also if you use the ```help```
type to inject HTML you'll want to use ngSanitize as well.

If you like to have drag and drop reordering of arrays you also need
[ui-sortable](https://github.com/angular-ui/ui-sortable) and its dependencies
[jQueryUI](http://jqueryui.com/), see *ui-sortable* documentation for details of
what parts of jQueryUI that is needed. You can safely ignore these if you don't
need the reordering.

Tabbed arrays, form type ```tabarray```, defaults to tabs on the left side. For
these to work you also need to include the css from
[bootstrap-vertical-tabs](https://github.com/dbtek/bootstrap-vertical-tabs).
It is not needed for tabs on top, the  ```tabType: "top"``` option.

The minified files also includes all templates so they are all you need.

Addons
------
Currently there is only one addon, a date picker using
the excellent [pickadate.js](http://amsul.ca/pickadate.js/).

See the [docs](docs/datepicker.md) for usage.


Building
--------
The files in the ```dist``` plus dependencies are all you need to use Schema
Form, but if you like to build it yourself we use [gulp](http://gulpjs.com/).

First off you need to have nodejs installed. Then install all dev dependencies
of the project with npm, install gulp and run the default task.

```bash
$ npm install
$ sudo npm install -g gulp
$ gulp
```

The default task uses [gulp-angular-templatecache](https://github.com/miickel/gulp-angular-templatecache)
to compile all html templates to js and then concatenates and minifies them with
the rest of the sources.

You can also run ```gulp watch``` to have it rebuild on change.

Tests
-----
Unit tests are run with [karma](http://karma-runner.github.io) and written using
[mocha](http://visionmedia.github.io/mocha/), [chai](http://chaijs.com/)
and [sinon](http://sinonjs.org/)

To run the tests first install all dependencies with npm (if you haven't done it
already) and install the karma cli to run the test.

```bash
$ npm install
$ sudo npm install -g karma-cli
$ karma start karma.conf.js
```

Contributing
------------

All contributions are welcome! We're trying to use [git flow](http://danielkummer.github.io/git-flow-cheatsheet/)
so please base any merge request on the **development** branch instead of **master**.
