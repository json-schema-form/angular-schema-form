Angular Schema Form
===================
[![bower version](https://img.shields.io/bower/v/angular-schema-form.svg?style=flat-square)](#bower)
[![npm version](https://img.shields.io/npm/v/angular-schema-form.svg?style=flat-square)](https://www.npmjs.org/package/angular-schema-form)
[![npm downloads](https://img.shields.io/npm/dm/angular-schema-form.svg?style=flat-square)](http://npm-stat.com/charts.html?package=angular-schema-form&from=2015-01-01)
[![Gitter](https://img.shields.io/badge/GITTER-JOIN%20CHAT%20%E2%86%92-ff69b4.svg?style=flat-square)](https://gitter.im/Textalk/angular-schema-form?utm_source=badge&utm_medium=badge&utm_campaign=pr-badge&utm_content=badge)
[![Build Status](https://img.shields.io/travis/Textalk/angular-schema-form.svg?style=flat-square)](https://travis-ci.org/Textalk/angular-schema-form)
[![Build Status](https://img.shields.io/coveralls/jekyll/jekyll.svg?style=flat-square)](https://coveralls.io/r/Textalk/angular-schema-form?branch=development)

Generate forms from JSON schemas using AngularJS!

Recent developments
===================
First, as there has been a rather intensive period of planning and change for this project, there have been important new developments for the project.
Lets get into those first(the normal front page continues below):

The json-schema-form standard
-----------------------------
A standard, json-schema-form, is being created.

The concept of combining data, JSON Schema and a form definition, is something that isn't just usable in a JavaScript Angular web application, but in any framework, on any platform.
Current ports are [angular-schema-form](https://github.com/json-schema-form/angular-schema-form) and [react-schema-form](https://github.com/networknt/react-schema-form), but delphi-schema-form and laravel-schema-form are planned as well.
To make these ports easier to do, and for everything to work in harmony, a common ground has to be established, a [standard](https://github.com/json-schema-form/json-schema-form).

Organisational
--------------
1. ASF has changed into using a more open governance model. This basically means that ASF is now governed by more people.
2. An umbrella organisaton, json-schema-form, has been formed. As you can see, this repo is now a part of that Github organisation, not Textalk.

Projects
--------
After a phase of planning, the following list of projects has been decided upon:
https://github.com/json-schema-form/json-schema-form/wiki/Current-projects

Release 1.0
-----------
The next major release of ASF will be 1.0.

The goal for that version is to include the breaking changes that is needed for future developments, like *Of and local $refs:

* Break out the non-framework specific parts of ASF into a vanilla ES6 module
* Remove the built-in bootstrap decorator, and in doing that require that users wanting to use that load that separately. The reason obviously being the material decorator.

The reason for the core break out is for all javascript-based ports of the json-schema-form concept to be able to share the same central code base.
Work in that direction is being done in the [json-schema-form-core](https://github.com/json-schema-form/json-schema-form-core) repository.

Schema builder UI
-----------------
There is now a UI for building schemas and forms being developed at [json-schema-builder repository](https://github.com/json-schema-form/json-schema-builder).

Ralphael Owino (main author), has a [demo up already](http://ralphowino.github.io/schema-form-builder/#/builder).

Schema and form repository
--------------------------
This is now a [repository with template schemas and forms](https://github.com/json-schema-form/json-schema-form-repository).
So far all the [schema.org types](http://schema.org/docs/full.html) has been converted to JSON schema approximations, and also some has been further resolved and had (huge) forms generated. Schema.org is *big*.

Documentation
-------------
The documentation is evolving, and it is happening mostly on the wiki:
* [The ASF wiki](https://github.com/json-schema-form/angular-schema-form/wiki)
* [The wiki of the json-schema-form organisation](https://github.com/json-schema-form/json-schema-form/wiki)

New Gitter rooms
----------------
These are just started.
* Discussions on the [general json-schema-form projects being carried out](https://gitter.im/json-schema-form/json-schema-form-projects)
* Discussions on the [angular-specific ASF projects](https://gitter.im/json-schema-form/angular-schema-form-projects)


The Blog / The Web Site / The Twitter / The Movie
=================================================
[medium.com/@SchemaFormIO](https://medium.com/@SchemaFormIO) / [schemaform.io](http://schemaform.io) / [@SchemaFormIO](http://twitter.com/SchemaFormIO) / [Movie](https://www.youtube.com/watch?v=duBFMipRq2o)

If you use ASF in your project/company please let us know! We'd love to feature you on the site.

Demo Time!
==========
[Try out the example page](http://schemaform.io/examples/bootstrap-example.html). Try editing the schema or form definition and see what comes out!

Hint: By pressing the 'Save to gist' button (top left), you can save your example into a shareable link.

What is it?
===========

Schema Form is a set of AngularJS directives (and a couple of services). It can do two things to
make life easier:

1. Create a form directly from a JSON schema.
2. Validate form fields against that same JSON schema.

Schema Form uses convention over configuration, so it comes packaged with some sensible defaults.
But you can always customize it by changing the order and types of form fields.

#### JSON Form
Schema Form is inspired by the nice [JSON Form](https://github.com/joshfire/jsonform) library and
aims to be roughly compatible with it, especially its form definition. So what sets Schema Form
apart from JSON Form?

1. Schema Form integrates deeply with AngularJS and uses AngularJS conventions to handle forms.
2. Schema Form uses [tv4](https://github.com/geraintluff/tv4) for validation, making it compatible
   with version 4 of the JSON schema standard.
3. By default, Schema Form generates Bootstrap 3-friendly HTML.

Documentation
-------------
You can find [all documentation here](docs/index.md), it covers all the different field types
and their options.

It also covers how to [extend angular schema form with your own field types](https://github.com/Textalk/angular-schema-form/blob/master/docs/extending.md).

Basic Usage
-----------

First, expose your schema, form, and model to the $scope.

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
});
```

Then load them into Schema Form using the `sfSchema`, `sfForm`, and `sfModel` directives.

```html
<div ng-controller="FormController">
    <form sf-schema="schema" sf-form="form" sf-model="model"></form>
</div>
```

Installation
------------

### Bower

It's simplest to install Schema Form using [Bower](http://bower.io/).

```bash
bower install angular-schema-form
```

This will install the latest release and basic dependencies. See
[dependecies section below](#dependencies).

You can also load the files via [cdnjs.com](https://cdnjs.com/libraries/angular-schema-form).

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
`dist/boostrap-decorator.min.js` and they need be loaded in that order. AngularJS,
[tv4](https://github.com/geraintluff/tv4) and [objectpath](https://github.com/mike-marcacci/objectpath)
also needs to be loaded *before* Schema Form.


```html
<script type="text/javascript" src="bower_components/angular/angular.min.js"></script>
<script type="text/javascript" src="bower_components/angular-sanitize/angular-sanitize.min.js"></script>
<script type="text/javascript" src="bower_components/tv4/tv4.js"></script>
<script type="text/javascript" src="bower_components/objectpath/lib/ObjectPath.js"></script>
<script type="text/javascript" src="bower_components/angular-schema-form/dist/schema-form.min.js"></script>
<script type="text/javascript" src="bower_components/angular-schema-form/dist/bootstrap-decorator.min.js"></script>
```

### Module loading
Don't forget to load the `schemaForm` module or nothing will happen.

```javascript
angular.module('myModule', ['schemaForm']);
```

Add-ons
------
There are several add-ons available, for a full list see the [web page](http://textalk.github.io/angular-schema-form/#third-party-addons).
Your can also [create your own add-ons!](docs/extending.md)

Contributing
------------
Contributions are welcome! Please see [Contributing.md](CONTRIBUTING.md) for more info.

Building
--------
The files in the `dist/` folder, plus dependencies, are all you need to use Schema Form. But if
you'd like to build it yourself, we use [gulp](http://gulpjs.com/).

First off, you need to have nodejs installed. Then install all dev dependencies of the
project with npm, install gulp and run the default task.

```bash
$ npm install
$ sudo npm install -g gulp
$ bower install
$ gulp
```

The default task uses
[gulp-angular-templatecache](https://github.com/miickel/gulp-angular-templatecache) to compile all
html templates to js and then concatenates and minifies them with the rest of the sources.

You can also run `gulp watch` to have it rebuild on change.

Tests
-----
Unit tests are run with [karma](http://karma-runner.github.io) and written using
[mocha](http://visionmedia.github.io/mocha/), [chai](http://chaijs.com/) and
[sinon](http://sinonjs.org/)

To run the tests:

1. Install all dependencies via NPM.
2. Install dev dependencies with bower.
3. Install the Karma CLI.
4. Run the tests.

```bash
$ npm install
$ bower install
$ sudo npm install -g karma-cli
$ karma start karma.conf.js
```
