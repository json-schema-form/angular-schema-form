Angular Spectrum Colorpicker
============================

[![Build Status](https://travis-ci.org/Jimdo/angular-spectrum-colorpicker.png)](https://travis-ci.org/Jimdo/angular-spectrum-colorpicker)

Angularified [spectrum colorpicker](http://bgrins.github.io/spectrum/)

This module bases on the [spectrum colorpicker](http://bgrins.github.io/spectrum/)
and can be embedded in any angular project via dependency injection:

```javascript
var myApp = angular.module('myApp', ['angularSpectrumColorpicker']);
```

To us it, put the Angular Spectrum Colorpicker directive in your html code and bind it to your project scope:

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

		jquery.min.js
		angular.min.js
		spectrum.css
		spectrum.js
		angular-spectrum-colorpicker.min.js
2. Add angular spectrum colorpicker module to your angular app
```javascript
angular.module('yourFancyApp', ['angularSpectrumColorpicker']);
```
3. Use the directive whereever you want
```html
<spectrum-colorpicker ng-model="yourFancyModel"></spectrum-colorpicker>
```
 * (Optional) Customize colorpicker with spectrum params via the options attribute:
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
* 1.2.0 - backwards incompatible change of `format="hex"` to format="'hex'"` in order to allow changing the output format after initializing. See #12.

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
