Migration Notes
===============

This document attempts to provide a guide for changes you may require between versions of Angular Schema Form.

0.8.13 -> 1.0.0
---------------
The path to version 1.0.0 is aiming to stabilise as much as possible the API that Angular Schema Form uses to interact 
with the JSON Schema Form Core. As items are moved out of the library there are many cases where more or less 
information is required by the function calls within the framework.

### Merge
The signature of the merge function has added `typeDefaults` as the defaults generated are required independantly by the 
function now. There are now defaults for all parameters so a schema is all that is required.
```js
schemaForm.merge(
  schema,
  form = [ '*' ],
  typeDefaults = service.typeDefault,
  ignore,
  options = {},
  readonly = false,
  asyncTemplates
)
```

### sfValidator
If you were using the validation API directly or in an add-on this is now no longer wrapped in an object to keep it in 
alignment with other functions imported from the core.

The factories are now loaded with:
```js
.factory('sfSelect', () => JSONSchemaFormCore.select)
.factory('sfValidator', () => JSONSchemaFormCore.validate)
```
So when using the factories you now use:
`sfValidator(form, viewValue)` instead of `sfValidator.validate(form, viewValue)`

**Warning: this will change substantially again as we move away from relying on the no longer maintained tv4 library**

### Input Field Names
To make arrays work and fields with the same names on different paths no longer clash `id` and `name` attributes are now 
handled with a one-time function call generating a path.

```json
{
  "comments": [
    { "comment": "other comment" },
    { "comment": "my comment" }
  ]
}
```
In the above example "my comment" would generate from a field with the `id` and `name` attribute 
`ngform-comments-1-comment`. The previous name and id would have been `comment`, by adding the form name and array 
indexes there is no longer issues with conflicts caused by this.

#### CSS Classes
In addition to the `id` and `name` attibutes, there are additional classes available in the field container to take 
advantage of. For the above example the following classes are added:
`comments-1-comment` for referencing a specific array position.
`comments-comment` for all attibutes the same regardless of position.
`required` for all attibutes the same regardless of position.

### Object.assign polyfill for Internet Explorer
If you must support legacy browsers then an `Object.assign` polyfill must be used to provide that function to 
non-compliant browsers. There is a polyfil provided by Mozilla [here](https://developer.mozilla.org/en/docs/Web/JavaScript/Reference/Global_Objects/Object/assign#Polyfill) or you can use 
Babel with the appropriate plugin module `babel-plugin-transform-object-assign`.

