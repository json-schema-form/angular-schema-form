Known Limitations
=================

### Angular Version
Schema Form works with AngularJS version 1.2.x or above, but version 1.3.x is recommended.

This is because a bug in AngularJS 1.2 [#8039](https://github.com/angular/angular.js/issues/8039),
which means that the ```ng-model``` directive has problem with values that uses a bracket notation instead of dot notation.
```html
<!-- dot notation -->
<input ng-model="foo.bar.baz">

<!-- bracket notation -->
<input ng-model="foo['bar']['baz']">
```

So what does that mean for you as a user of Schema Form? Basically it boils down to that if you use AngularJS 1.2.x
Schema Form uses dot notation, which means your property names in the JSON schema *must not contain any hyphens or other
characters dot notation cannot handle*.

Example schema that only works in 1.3
```javascript
{
  "type": "object",
  "properties": {
    "key-with-hyphen": { "type": "string" },
  }
}
```

The "complex keys" example schema illustrates this as well.
For more background check out issue [#41](https://github.com/Textalk/angular-schema-form/issues/41) and the PR that fixed
it, [PR 43](https://github.com/Textalk/angular-schema-form/pull/43). Thanks to @mike-marcacci for his excellent work!
