Angular Schema Form
===================

[![Build Status](https://travis-ci.org/Textalk/angular-schema-form.svg?branch=master)](https://travis-ci.org/Textalk/angular-schema-form)
[![Coverage Status](https://coveralls.io/repos/Textalk/angular-schema-form/badge.png?branch=master)](https://coveralls.io/r/Textalk/angular-schema-form?branch=development)
[![Bower version](https://badge.fury.io/bo/angular-schema-form.svg)](http://badge.fury.io/bo/angular-schema-form)

Generate forms from JSON schemas using AngularJS!

### [Try out the example page](http://textalk.github.io/angular-schema-form/examples/bootstrap-example.html)
Try editing the schema or form definition and see what comes out!

What is it?
----------

Schema Form is a set of AngularJS directives (and a couple of services). It can do two things to make life easier:

1. Create a form directly from a JSON schema.
2. Validate form fields against that same JSON schema.

Schema Form uses convention over configuration, so it comes packaged with some sensible defaults. But you can always customize it by changing the order and types of form fields.

JSON Form
---------
Schema Form is inspired by the nice [JSON Form](https://github.com/joshfire/jsonform) library and aims to be roughly compatible with it, especially its form definition. So what sets Schema Form apart from JSON Form?

1. Schema Form integrates deeply with AngularJS and uses AngularJS conventions to handle forms.
2. Schema Form uses [tv4](https://github.com/geraintluff/tv4) for validation, making it compatible with version 4 of the JSON schema standard.
3. By default, Schema Form generates Bootstrap 3-friendly HTML.


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



Documentation
-------------
Documentation covering defaults and form types [can be found here.](docs/index.md)


Installation
------------

### Bower

It's simplest to install Schema Form using [Bower](http://bower.io/).

```bash
bower install angular-schema-form
```

This will install the latest release and basic dependencies. See
[dependecies section below](#dependencies).

### Manual

You can also just download the contents of the `dist/` folder and add dependencies manually.

### Dependencies

Schema form has a lot of dependencies, most of which are optional. Schema Form depends on:

1. [AngularJS](https://angularjs.org/) version 1.3.x is recomended. Version 1.2.x
   has some limitation. See [known limitations](docs/knownlimitations.md).
2. [angular-sanitize](https://docs.angularjs.org/api/ngSanitize)
3. [tv4](https://github.com/geraintluff/tv4)
4. [objectpath](https://github.com/mike-marcacci/objectpath)
5. [bootstrap 3](http://getbootstrap.com/)

If you install via bower you get all of the above except bootstrap since we
don't want to push a certain version or flavor on you. Also make
sure you got the angular version you actually want.


#### Additional dependecies

1. If you'd like to use drag-and-drop reordering of arrays, you'll also need [ui-sortable](https://github.com/angular-ui/ui-sortable) and its [jQueryUI](http://jqueryui.com/) dependencies. See the *ui-sortable* documentation for details about which parts of jQueryUI are needed. You can safely ignore these if you don't need reordering.
2. Schema Form provides tabbed arrays through the form type `tabarray`. Tab arrays default to tabs on the left side. For these to work, you'll need to include the CSS from [bootstrap-vertical-tabs](https://github.com/dbtek/bootstrap-vertical-tabs). However, you won't need Bootstrap Vertical Tabs for horizontal tabs (the `tabType: "top"` option).

The minified files include templates - no need to load additional HTML files.


### Script Loading

Schema form is split into two main files, `dist/schema-form.min.js` and
`dist/boostrap-decorator.min.js` and they need be loaded in that order. AngularJ,
[tv4](https://github.com/geraintluff/tv4) and [objectpath](https://github.com/mike-marcacci/objectpath)
also needs to be loaded *before* Schema Form.


```html
<script type="text/javascript" src="../bower_components/angular/angular.min.js"></script>
<script type="text/javascript" src="../bower_components/angular-sanitize/angular-sanitize.min.js"></script>
<script type="text/javascript" src="bower_components/tv4/tv4.js"></script>
<script type="text/javascript" src="bower_components/objectpath/lib/ObjectPath.js"></script>
<script type="text/javascript" src="bower_components/angular-schema-form/dist/schema-form.min.js"></script>
<script type="text/javascript" src="bower_components/angular-schema-form/dist/bootstrap-decorator.min.js"></script>
```


Add-ons
------
There is currently two add-ons, a date picker and a colorpicker. They have their own repos and you
can find them here with usage instructions:

  * [https://github.com/Textalk/angular-schema-form-datepicker](https://github.com/Textalk/angular-schema-form-datepicker)
  * [https://github.com/Textalk/angular-schema-form-colorpicker](https://github.com/Textalk/angular-schema-form-colorpicker)

Building
--------
The files in the `dist/` folder, plus dependencies, are all you need to use Schema Form. But if you'd like to build it yourself, we use [gulp](http://gulpjs.com/).

First off, you need to have nodejs installed. Then install all dev dependencies of the project with npm, install gulp and run the default task.

```bash
$ npm install
$ sudo npm install -g gulp
$ bower install
$ gulp
```

The default task uses [gulp-angular-templatecache](https://github.com/miickel/gulp-angular-templatecache) to compile all html templates to js and then concatenates and minifies them with the rest of the sources.

You can also run `gulp watch` to have it rebuild on change.

Tests
-----
Unit tests are run with [karma](http://karma-runner.github.io) and written using [mocha](http://visionmedia.github.io/mocha/), [chai](http://chaijs.com/) and [sinon](http://sinonjs.org/)

To run the tests:

1. Install all dependencies via NPM
2. Install dev dependencies with bower.
3. Install the Karma CLI
4. Run the tests

```bash
$ npm install
$ bower install
$ sudo npm install -g karma-cli
$ karma start karma.conf.js
```

Contributing
------------

All contributions are welcome! We're trying to use
[git flow](http://danielkummer.github.io/git-flow-cheatsheet/), so please base any merge request
on the **development** branch instead of **master**.

Also run any code through the code style checker [jscs](https://github.com/mdevils/node-jscs)
(or even better use it in your editor) with preset set to `google`. You can also us `gulp jscs` to
check your code.
