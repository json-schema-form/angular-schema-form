Angular Spectrum Colorpicker
============================

[![Build Status](https://travis-ci.org/Jimdo/angular-spectrum-colorpicker.png)](https://travis-ci.org/Jimdo/angular-spectrum-colorpicker)
[![Coverage Status](https://coveralls.io/repos/Jimdo/angular-spectrum-colorpicker/badge.png?branch=master)](https://coveralls.io/r/Jimdo/angular-spectrum-colorpicker?branch=master)
[![devDependency Status](https://david-dm.org/Jimdo/angular-spectrum-colorpicker/dev-status.svg)](https://david-dm.org/Jimdo/angular-spectrum-colorpicker#info=devDependencies)

Angularified [spectrum color picker](http://bgrins.github.io/spectrum/)

This module bases on the [spectrum color picker](http://bgrins.github.io/spectrum/)
and can be embedded in any angular project via dependency injection:

```javascript
var myApp = angular.module('myApp', ['angularSpectrumColorpicker']);
```

To use it, put the Angular Spectrum color picker directive in your html code and bind it to your project scope:

```html
<spectrum-colorpicker ng-model="someModel"></spectrum-colorpicker>
```


Dependencies
------------

 * [JQuery](http://jquery.com/)
 * [AngularJs](http://angularjs.org/)
 * [Spectrum](http://bgrins.github.io/spectrum/)


Usage
-----

1. Include dependencies

		jquery.js
		angular.js
		spectrum.css
		spectrum.js
		angular-spectrum-colorpicker.js
2. Add angular spectrum color picker module to your angular app
```javascript
angular.module('yourFancyApp', ['angularSpectrumColorpicker']);
```
3. Use the directive wherever you want
```html
<spectrum-colorpicker ng-model="yourFancyModel"></spectrum-colorpicker>
```
 * (Optional) Customize color picker with spectrum params via the options attribute:
```html
<spectrum-colorpicker
  ng-model="yourFancyModel"
  options="{showInput: true, showAlpha: true}">
</spectrum-colorpicker>
```
All valid options: [http://bgrins.github.io/spectrum/#options](http://bgrins.github.io/spectrum/#options)
 * (Optional) Choose a output format
```html
<spectrum-colorpicker format="'hex'"></spectrum-colorpicker>
```
Changes the format of the final value. A list of formats can be found in the [spectrum documentation](http://bgrins.github.io/spectrum/#details-acceptedColorInputs).
* (Optional) use events
```html
<spectrum-colorpicker
  on-change="myOnChange(color)"
  on-show="myOnShow(color)"
  on-hide="myOnHide(color)"
  on-move="myOnMove(color)"
  on-before-show="myOnBeforeShow(color)"
  >
</spectrum-colorpicker>
```
* (Optional) bind palette
```html
<spectrum-colorpicker
  palette="colors">
</spectrum-colorpicker>
```
* (Optional) stop eventing
```html
<spectrum-colorpicker
  on-change-options="{ update : false }"
  on-show-options="{ update : false }"
  on-hide-options="{ update : false }"
  on-move-options="{ update : false }"
  >
</spectrum-colorpicker>
```
A description of the events can be found in the [spectrum documentation](https://bgrins.github.io/spectrum/#events).

Initialize the source project
-----------------------------

```shell
npm install
```


Run demo
--------

```shell
grunt demo
```

[http://localhost:8000/demo/index.html](http://localhost:8000/demo/index.html)


Grunt Tasks
-----------

 * `grunt`: Execute tests
 * `grunt coverage`: Serve coverage report on port 7000
 * `grunt test`: Just test
 * `grunt test:e2e`: Just test end to end
 * `grunt test:unit`: Just test unit
 * `grunt tdd`: Watch source and test files and run tests
 * `grunt tdd:e2e`: Watch and test just end to end
 * `grunt tdd:unit`: Watch and test just unit
 * `grunt build`: Just build
 * `grunt release`: Test, build, bump patch version, commit, add version tag and push

 `test` tasks have a `--browsers` option to specify the browsers you want to use

 Browsers can also be set by the following environment-variables
 ```
   PROTRACTOR_BROWSERS=Firefox,Chrome
   KARMA_BROWSERS=Firefox,PhantomJS
 ```

_See Gruntfile.js and tasks/options for all task details._

Version history
---------------
* 1.4.0
 * demo fixes (thanks @mprinc)
 * destroy event fixes (thanks @tomaszkrym)
 * palette attribute option (thanks @dmnn)
 * possibility to disable eventing (thanks @dmnn)
 * Update to spectrum 1.7.0
* 1.3.4
 * re-adds `$scope.$apply` around model value change, because it caused problems
* 1.3.3
 * refactor triggers to work with delayed DOM
* 1.3.2
 * not released (grunt release fup)
* 1.3.1
 * Add handling of disabled attribute. See #15.
* 1.3.0
 * reintegrate with [Jimdo/angular-directive-seed](https://github.com/Jimdo/angular-directive-seed).
 * Add eventing (partially backwards-incompatible due to how the triggering of `onChange` is handled). See #21.
* 1.2.0
 * backwards incompatible change of `format="hex"` to `format="'hex'"` in order to allow changing the output format after initializing. See #12.

LICENSE
-------

> The MIT License
>
> Copyright (c) 2014 Jimdo GmbH http://jimdo.com
>
> Permission is hereby granted, free of charge, to any person obtaining a copy
> of this software and associated documentation files (the "Software"), to deal
> in the Software without restriction, including without limitation the rights
> to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
> copies of the Software, and to permit persons to whom the Software is
> furnished to do so, subject to the following conditions:
>
> The above copyright notice and this permission notice shall be included in
> all copies or substantial portions of the Software.
>
> THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
> IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
> FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
> AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
> LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
> OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN
> THE SOFTWARE.
