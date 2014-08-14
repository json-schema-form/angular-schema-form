Date Picker Addon
=================

Everyone loves a nice date picker - now you can have your very own date picker in Schema Form! The date picker add-on uses the excellent jQuery-based date picker, [pickadate.js](http://amsul.ca/pickadate.js/).

Dates in JSON Schema are of type *"string"* and follow the *RFC 3339* date fomat, which, in turn, follows *ISO 8601*. What does that mean for you? Basically, just stick with the format `yyyy-mm-dd` and you'll be fine. 

Within Schema Form, pickadate only supports dates - not times.

Installation
------------
The date picker is an add-on to the Bootstrap decorator. To use it, just include `dist/bootstrap-datepicker.min.js` *after* `dist/bootstrap-decorator.min.js`.

You'll need to load a few additional files to use pickadate:

1. jQuery (pickadate depends on it)
2. The pickadate source files (see the pickadate.js [GitHub page](https://github.com/amsul/pickadate.js) for documentation)
3. The pickadate CSS
4. Translation files for whatever language you want to use

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
-------
The `datepicker` form type takes two options: `minDate` and `maxDate`. `minDate` and `maxDate` both accept one of the following as values:

1. A string in the format `yyyy-mm-dd`,
2. A unix timestamp (as a Number), or
3. An instance of `Date`

Here's an example:

```javascript
{
  key: "birthDate",
  minDate: "1900-01-01",
  maxDate: new Date()
}
```


