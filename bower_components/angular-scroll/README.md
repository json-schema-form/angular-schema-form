angular-scroll
==============

Angular is only dependency (no jQuery). 8K minified or 2K gzipped.

Example
-------
Check out [the live demo](http://oblador.github.io/angular-scroll/) or the [source code](https://github.com/oblador/angular-scroll/blob/master/example/index.html).

Install
-------

#### With bower:

    $ bower install angular-scroll

#### With npm (for use with browserify):

    $ npm install angular-scroll

You can also download the [production version](https://raw.github.com/oblador/angular-scroll/master/angular-scroll.min.js)or the [development version](https://raw.github.com/oblador/angular-scroll/master/angular-scroll.js).

If you prefer a CDN hosted version (which might speed up your load times), check out [cdnjs.com/libraries/angular-scroll](https://cdnjs.com/libraries/angular-scroll).


Don't forget to add `duScroll` to your module dependencies. 

`angular.element` Scroll API
----------------------------

This module extends the `angular.element` object with a few jQuery like functions. Note that `$document` is an `angular.element`, for usage example see below. In case of name collisions existing jQuery or jqlite functions will be preserved, just use the prefixed version: ie `.duScrollTo()` instead of `.scrollTo()`.

#### `.scrollTo( left, top [, duration [, easing ] ] )`
Scrolls the element/window to the specified left/top position. If `duration` is specified the scrolling is animated for n milliseconds. If `easing` is ommited the animation will default to the `duScrollEasing` function.

#### `.scrollTo( element [, offset, [, duration [, easing ] ] ] )`
Alias of `.scrollToElement`.

#### `.scrollToElement( element [, offset, [, duration [, easing ] ] ] )`
Scrolls to the specified element, if `offset` is passed it will be subtracted from the elements position which is good if one uses floating menus. 

#### `.scrollToElementAnimated( element [, offset, [, duration [, easing ] ] ] )`
Convenience function. Works exactly the same as `scrollToElement` but uses the default values from `duScrollOffset`, `duScrollDuration` and `duScrollEasing` unless otherwise specified. 

#### `.scrollTop|scrollLeft( )`
Returns current scroll position. 

#### `.scrollTop|scrollLeft( top [, duration [, easing ] ] )` 
Scrolls to specified position in either axis, with optional animation. 

#### `.scrollTopAnimated|scrollLeftAnimated( top [, duration [, easing ] ] )` 
Convenience function like `scrollToElementAnimated` but for `scrollTop`/`scrollLeft`. 

#### Promises
Animated scrolling returns a `$q` promise, it will resolve when the scrolling has finished or be rejected if cancelled (by starting another scroll animation before it finished).

#### Example
```js
angular.module('myApp', ['duScroll']).
  controller('myCtrl', function($scope, $document) {
    var top = 400;
    var duration = 2000; //milliseconds

    //Scroll to the exact position
    $document.scrollTop(top, duration).then(function() {
      console && console.log('You just scrolled to the top!');
    });

    var offset = 30; //pixels; adjust for floating menu, context etc
    //Scroll to #some-id with 30 px "padding"
    //Note: Use this in a directive, not with document.getElementById 
    var someElement = angular.element(document.getElementById('some-id'));
    $document.scrollToElement(someElement, offset, duration);
  }
);
```

The above example can be achieved by configuration instead of arguments:

```js
angular.module('myApp', ['duScroll'])
  .value('duScrollDuration', 2000)
  .value('duScrollOffset', 30)
  .controller('myCtrl', function($scope, $document) {
    $document.scrollTopAnimated(400).then(function() {
      console && console.log('You just scrolled to the top!');
    });

    var someElement = angular.element(document.getElementById('some-id'));
    $document.scrollToElementAnimated(someElement);
  }
);
```


Directives
----------

### `du-smooth-scroll`
Provides smooth anchor scrolling. 
```html
<a href="#anchor" du-smooth-scroll>Scroll it!</a>
```

### `du-scrollspy`
Observes whether the target element is at the top of the viewport (or container) and adds an `active` class if so. Takes optional `offset` and `duration` attributes which is passed on to `.scrollTo`,

```html
<a href="#anchor" du-scrollspy>Am i active?</a>
```

or together with Bootstrap

```html
<ul class="nav navbar-nav">
  <li du-scrollspy="anchor"><a href="#anchor">Link</a></li>
</ul>
```

### `du-spy-context`
Enables multiple sets of spies on the same target element. Takes optional `offset` attribute to 

```html
<ul du-spy-context class="nav navbar-nav">
  <li du-scrollspy="anchor"><a href="#anchor">Link</a></li>
</ul>
<ul du-spy-context class="nav navbar-nav">
  <li du-scrollspy="anchor"><a href="#anchor">Link</a></li>
</ul>
```
### `du-scroll-container`
Modifies behavior of `du-scrollspy` and `du-smooth-scroll` to observe/scroll within and element instead of the window/document. Good for modals/elements with `overflow: auto/scroll`.

```html
<div du-scroll-container>
  <p id="top">This is the top</p>
  <p id="anchor">Scroll to me, or <a href="#top" du-smooth-scroll>the top</a></p>
</div>
```

If your links lie outside of the scrollable element, wrap them with the `du-scroll-container` directive and send the element id as argument:

```html
<ul du-scroll-container="scroll-container">
  <li><a href="#anchor" du-smooth-scroll>Link</a></li>
</ul>
<div id="scroll-container">
  [...]
</div>
```

### [All in together now](http://www.youtube.com/watch?v=cx4KtTezEFg&feature=kp)
The directives play well together, try [the demo](http://oblador.github.io/angular-scroll/container.html) or inspect its [source code](https://github.com/oblador/angular-scroll/blob/master/example/container.html).

```html
<ul du-spy-context du-scroll-container="scroll-container">
  <li><a href="#anchor" offset="30" du-smooth-scroll du-scrollspy>Link</a></li>
</ul>
<ul du-spy-context du-scroll-container="scroll-container">
  <li><a href="#anchor" offset="30" du-smooth-scroll du-scrollspy>Link</a></li>
</ul>
<div id="scroll-container">
  [...]
</div>
```

Observing Scroll Position
-------------------------

**NOTE:** the `$duScrollChanged` event and the `scrollPosition` service are deprecated. Use `angular.element().on()` together with `.scrollTop()` instead. 

```js
angular.module('myApp', ['duScroll']).
  controller('MyCtrl', function($scope, $document){
    $document.on('scroll', function() {
      console.log('Document scrolled to ', $document.scrollLeft(), $document.scrollTop());
    });
    var container = angular.element(document.getElementById('container'));
    container.on('scroll', function() {
      console.log('Container scrolled to ', container.scrollLeft(), container.scrollTop());
    });
  }
);
```

Configuration
-------------

### Scroll speed
Duration is defined in milliseconds.

To set a scroll duration on a single anchor:
```html
<a href="#anchor" du-smooth-scroll duration="5000">Scroll it!</a>
```

To change the default duration:
```js
angular.module('myApp', ['duScroll']).value('duScrollDuration', 5000);
```

### Scroll easing
Set the `duScrollEasing` value to a function that takes and returns a value between 0 to 1. Here's [a few examples](https://gist.github.com/gre/1650294) to choose from.

```js
function invertedEasingFunction(x) {
  return 1-x;
}
angular.module('myApp', ['duScroll']).value('duScrollEasing', invertedEasingFunction);
```

You can also pass a custom easing function as the fourth argument in `scrollTo`.

### Greedy option
Set the `duScrollGreedy` value to `true` if the elements you are observing are not wrapping the whole section you want to observe, but merely the first one in the section (such as headlines).

```js
angular.module('myApp', ['duScroll']).value('duScrollGreedy', true);
```

### Offset
To change default offset (in pixels) for the `du-smooth-scroll` directive:

```js
angular.module('myApp', ['duScroll']).value('duScrollOffset', 30);
```

### Bottom spy
To make the last `du-scrollspy` link active when scroll reaches page/container bottom:

```js
angular.module('myApp', ['duScroll']).value('duScrollBottomSpy', true);
```

Events
------

The `duScrollspy` directive fires the global events `duScrollspy:becameActive` and `duScrollspy:becameInactive` with an angular.element wrapped element as first argument. This is nice to have if you want the URL bar to reflect where on the page the visitor are, like this: 

```js
angular.module('myApp', ['duScroll']).
  config(function($locationProvider) {
    $locationProvider.html5Mode(true);
  }).
  run(function($rootScope, $location){
    $rootScope.$on('duScrollspy:becameActive', function($event, $element){
      //Automaticly update location
      var hash = $element.prop('hash');
      if(hash) {
        $location.hash(hash.substr(1)).replace();
        $rootScope.$apply();
      }
    });
  });
```


Building
--------

    $ gulp

Tests
-----

### Unit tests

    $ npm test

### End to end tests

    $ npm run update-webdriver
    $ npm run protractor
