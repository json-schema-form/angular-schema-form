Date Picker Addon
=================

Everyone loves a nice date picker, and now you can have your very own date picker
in Schema Form! The date picker addon uses the excellent jQuery based date
picker [pickadate.js](http://amsul.ca/pickadate.js/).

Note that dates in JSON Schema has the type *"string"* and follow the *RFC 3339*
date fomat which in turn follows *ISO 8601*. So what does that really mean? Stick
with the format ```yyyy-mm-dd``` and you'll be fine. The date picker only
supports date, not time.

Installation
------------
The date picker is an addon to the bootstrap decorator. To use it you just
include ```dist/bootstrap-datepicker.min.js``` *after*  
```dist/bootstrap-decorator.min.js```

You'll also need the files neccessary for pickadate, see the pickadate.js  
[github page](https://github.com/amsul/pickadate.js) or documentation.

Note that it depends on jQuery and that you also need CSS and translation files
for the language you like to use. 



Usage
-----
The datepicker addon adds a new form type ```datepicker``` and a new default
mapping.

|  Form Type     |   Becomes    |
|:---------------|:------------:|
|  datepicker    |  a pick a date widget |


| Schema             |   Form type  |
|:-------------------|:------------:|
| "type": "string" and "format": "date"   |   datepicker   |


Options
-------
```javascript
{
  key: "birthDate",
  minDate: "1900-01-01",
  maxDate: new Date()
}
```

The ```datepicker``` takes two options, a max and min date. Both take either
a string in the format ```yyyy-mm-dd```, a unix timestamp (as a Number) or a
```Date``` instance.
