tx-tinymce
==========

An AngularJS directive for the TinyMCE editor.

Basic usage:
```html
  <textarea tx-tinymce ng-model="comment"></textarea>
```

```tx-tinymce``` requires a ```ng-model``` attribute and
as usual with ```ng-model``` we're talking a two-way binding
between model and, in this case, the editor.


With options, passed directly to TinyMCE ```init()```:
```html
  <textarea tx-tinymce="{ toolbar: 'bold | italic' }" ng-model="comment"></textarea>
```

or...
```javascript
function TinyMCECtrl($scope) {
  $scope.config = { toolbar: 'bold | italic' }
}
```
```html
  <div ng-controller="TinyMCECtrl">
    <textarea tx-tinymce="config" ng-model="comment"></textarea>
  </div>
```

Checkout the [demo](http://textalk.github.io/tx-tinymce/example.html) for more usage examples.

