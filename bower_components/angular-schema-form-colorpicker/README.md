Colorpicker addon
=================

Colorpickers for everyone! This colorpicker addon uses the widely used jQuery-based plugin, [Spectrum](https://github.com/bgrins/spectrum) as well as Jimdo's excellent angular binder [angular-spectrum-colorpicker](https://github.com/Jimdo/angular-spectrum-colorpicker).

Spectrum support a wide variety of formats, such as hex, rgb(a), hsv(a), names and so forth, default is rgb. You can specify this as `colorFormat` in the form. More info below at [Form Type options](#form-type-options).

Installation
------------
The date picker is an add-on to the Bootstrap decorator. To use it, just include
`dist/bootstrap-colorpicker.min.js` *after* `dist/bootstrap-decorator.min.js`.

Easiest way is to install is with bower, this will also include dependencies:
```bash
$ bower install angular-schema-form-colorpicker
```

You'll need to load a few additional files to use colorpicker:

*Before loading angular schema form*

1. jQuery
2. Angular

*After loading angular schema form*

1. The Spectrum source files (see the
   [GitHub page](https://github.com/amsul/pickadate.js) for documentation)
2. The Spectrum-angular source files (see the
   [GitHub page](https://github.com/Jimdo/angular-spectrum-colorpicker) for documentation)
3. The Angular Schema Form Colorpicker files (this project)
3. The spectrum CSS
4. Translation files for whatever language you want to use

Example

```HTML
<script type="text/javascript" src="http://code.jquery.com/jquery-2.1.1.min.js"></script>
<script type="text/javascript" src="/bower_components/angular/angular.min.js"></script>
<script type="text/javascript" src="/bower_components/angular-sanitize/angular-sanitize.min.js"></script>
<script type="text/javascript" src="/bower_components/angular-schema-form/schema-form.min.js"></script>
<script type="text/javascript" src="/bower_components/angular-schema-form/bootstrap-decorator.min.js"></script>

<script type="text/javascript" src="/bower_components/spectrum/spectrum.js"></script>
<script type="text/javascript" src="/bower_components/spectrum/i18n/jquery.spectrum-sv.js"></script>
<script type="text/javascript" src="/bower_components/angular-spectrum-colorpicker/dist/angular-spectrum-colorpicker.min.js"></script>
<script type="text/javascript" src="/bower_components/angular-schema-form-colorpicker/bootstrap-colorpicker.min.js"></script>

<link rel="stylesheet" href="/bower_components/spectrum/spectrum.css">
```



Usage
-----
The colorpicker add-on adds a new form type, `colorpicker`, and a new default
mapping.

|  Form Type     |   Becomes    |
|:---------------|:------------:|
|  colorpicker    |  a colorpicker widget |


| Schema             |   Default Form type  |
|:-------------------|:------------:|
| "type": "string" and "format": "color"   |   colorpicker   |


Form Type Options
-------
The `colorpicker` form type takes two options: `colorFormat` and `spectrumOptions`.

### `colorFormat`
and `preferredFormat` in `spectrumOptions` supports the following values at this time:

- hex
- hex3 (3 characters if possible)
- hsl
- rgb
- name (Falls back to hex)
- none (Depends on input)

More info at http://bgrins.github.io/spectrum/#options-preferredFormat

### `spectrumOptions`
Spectrum supports a large amount of options that tweak a lot of the interface and behaviour. This addon uses a few standard options but these can be overwritten via the form key by the same name.
There are too many options to list here but they can all be found in the [spectrum documentation](http://bgrins.github.io/spectrum/#options).

### Examples

Here's an example:

```javascript
{
  key: "color",
  colorFormat: 'hsv',
  spectrumOptions: {
    preferredFormat: 'hex3',
    flat: true,
    showAlpha: false,
    palette: [['black', 'white'], ['red', 'green']]
  }
}
```
