Angular Schema Form Date Picker Add-on
======================================

This is an add-on for [Angular Schema Form](https://github.com/Textalk/angular-schema-form/).

[![Build Status](https://travis-ci.org/Textalk/angular-schema-form-datepicker.svg?branch=master)](https://travis-ci.org/Textalk/angular-schema-form-datepicker)
[![Bower version](https://badge.fury.io/bo/angular-schema-form-datepicker.svg)](http://badge.fury.io/bo/angular-schema-form-datepicker)


Everyone loves a nice date picker - now you can have your very own date picker in Schema Form!
The date picker add-on uses the excellent jQuery-based date picker,
[pickadate.js](http://amsul.ca/pickadate.js/).

Dates in JSON Schema are of type *"string"* and follow the *RFC 3339* date fomat, which, in turn,
follows *ISO 8601*. What does that mean for you? Basically, just stick with the format `yyyy-mm-dd`
and you'll be fine (...but you can change it if you must).

Within Schema Form, pickadate only supports dates - not times.

Installation
------------
The date picker is an add-on to the Bootstrap decorator. To use it, just include
`bootstrap-datepicker.min.js` *after* `bootstrap-decorator.min.js`.

You'll need to load a few additional files to use pickadate **in this order**:

1. jQuery (pickadate depends on it)
2. The pickadate source files (see the pickadate.js
   [GitHub page](https://github.com/amsul/pickadate.js) for documentation)
3. The pickadate CSS (you'll have to choose theme)
4. Translation files for whatever language you want to use

Easiest way is to install is with bower, this will also include dependencies:
```bash
$ bower install angular-schema-form-datepicker
```

Usage
-----
The datepicker add-on adds a new form type, `datepicker`, and a new default
mapping.

|  Form Type     |   Becomes    |
|:---------------|:------------:|
|  datepicker    |  a pickadate widget |


| Schema             |   Default Form type  |
|:-------------------|:------------:|
| "type": "string" and "format": "date"   |   datepicker   |


Form Type Options
-----------------
The `datepicker` form type takes two date range options: `minDate` and `maxDate`. `minDate` and `maxDate` both accept one of the following as values:

1. A string in the format `yyyy-mm-dd`,
2. A unix timestamp (as a Number), or
3. An instance of `Date`

It is also possible to set the date format using the `format` option, which is used to format the date stored by AngularJS, but note that in doing so you break the standard and other JSON Schema validators might complain. The view date displayed by pickadate is set by the translation files. see [Installation](#installation)

Example
-----------------
Below is an example. It's written in javascript instead of pure schema and form so the use of the date object is supported.

```javascript
scope.schema = {
  "type": "object",
  "properties": {
    "birthDate": {
      "title": "Bday",
      "type": "string",
      "format": "date"
    }
  }
}

scope.form = [
  {
    "key": "birthDate",
    "minDate": "1995-09-01",
    "maxDate": new Date(),
    "format": "yyyy-mm-dd"
  }
]
```
