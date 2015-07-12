Tinymce add-on
=================

This Tinymce add-on uses as the name implies the Tinymce plugin to provide a rich text editor that serves up HTML. [Tinymce](https://github.com/tinymce) as well as Textalk's binder [tx-tinymce](https://github.com/Textalk/tx-tinymce) is used.

Tinymce is highly customizable and this add-on takes an options object via `tinymceOptions` in the form. More info below at [Options](#Options).

Installation
------------
The editor is an add-on to the Bootstrap decorator. To use it, just include
`dist/bootstrap-tinymce.min.js` *after* `dist/bootstrap-decorator.min.js`.

Easiest way is to install is with bower, this will also include dependencies:
```bash
$ bower install angular-schema-form-tinymce
```

You'll need to load a few additional files to use the editor:

**Be sure to load this projects files after you load angular schema form**

1. Angular
2. The [Tinymce](https://github.com/tinymce) source file
3. The [tx-tinymce](https://github.com/Textalk/tx-tinymce) binder file
4. **Angular Schema Form**
5. The Angular Schema Form Tinymce files (this project)
6. Translation files for whatever language you want to use (optional) [Documentation](http://www.tinymce.com/wiki.php/Configuration:language)

Example

```HTML
<script type="text/javascript" src="/bower_components/angular/angular.min.js"></script>
<script type="text/javascript" src="/bower_components/angular-sanitize/angular-sanitize.min.js"></script>
<script type="text/javascript" src="//tinymce.cachefly.net/4.0/tinymce.min.js"></script>
<script type="text/javascript" src="/bower_components/tx-tinymce/tx-tinymce.js"></script>

<script type="text/javascript" src="/bower_components/angular-schema-form/schema-form.min.js"></script>
<script type="text/javascript" src="/bower_components/angular-schema-form-tinymce/bootstrap-tinymce.js"></script>

```

When you create your module, be sure to depend on this project's module as well.

```javascript
angular.module('yourModule', ['schemaForm', 'schemaForm-tinymce']);
```

Usage
-----
The tinymce add-on adds a new form type, `wysiwyg`, and a new default
mapping.

|  Form Type     |   Becomes    |
|:---------------|:------------:|
|  wysiwyg       |  a tinymce widget |


| Schema             |   Default Form type  |
|:-------------------|:------------:|
| "type": "string" and "format": "html"   |   tinymce   |


Options
-------
The `colorpicker` form takes one option, `tinymceOptions`. This is an object with any
and all options availible to tinymce. A full list of these can be found [here](http://www.tinymce.com/wiki.php/Configuration).

### Example
This example replaces the standard toolbar with one we choose.

```javascript
{
  "key": "invitation",
  "tinymceOptions": {
    "toolbar": [
      "undo redo | styleselect | bold italic | link image",
      "alignleft aligncenter alignright"
    ]
  }
},
```
