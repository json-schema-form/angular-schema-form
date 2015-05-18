
// FIXME: type template (using custom builder)
angular.module('schemaForm').factory('sfBuilder',
['$templateCache', 'schemaFormDecorators', 'sfPath', function($templateCache, schemaFormDecorators, sfPath) {

  var SNAKE_CASE_REGEXP = /[A-Z]/g;
  var snakeCase = function(name, separator) {
    separator = separator || '_';
    return name.replace(SNAKE_CASE_REGEXP, function(letter, pos) {
      return (pos ? separator : '') + letter.toLowerCase();
    });
  };


  var checkForSlot = function(form, slots) {
    // Finally append this field to the frag.
    // Check for slots
    if (form.key) {
      var slot = slots[sfPath.stringify(form.key)];
      console.log('checking for slots!', sfPath.stringify(form.key), slot)
      if (slot) {
        console.log('clearing and appending to slot')
        while (slot.firstChild) {
          slot.removeChild(slot.firstChild);
        }
        return slot;
      }
    }
  };


  var build = function(items, decorator, templateFn, slots, path) {
    path = path || 'schemaForm.form';
    var container = document.createDocumentFragment();
    items.reduce(function(frag, f, index) {

      // Sanity check.
      if (!f.type) {
        return;
      }

      var field = decorator[f.type] || decorator['default'];
      if (!field.replace) {
        // Backwards compatability build
        var n = document.createElement(snakeCase(decorator.__name, '-'));
        n.setAttribute('form', path + '[' + index + ']');
        (checkForSlot(f, slots) || frag).appendChild(n);

      } else {
        var tmpl;

        // TODO: Create a couple fo testcases, small and large and
        //       measure optmization. A good start is probably a cache of DOM nodes for a particular
        //       template that can be cloned instead of using innerHTML
        var div = document.createElement('div');
        var template = templateFn(field.template) || templateFn([decorator['default'].template]);
        if (f.key) {
          var key = f.key ?
                    sfPath.stringify(f.key).replace(/"/g, '&quot;') : '';
          template = template.replace(
            /\$\$value\$\$/g,
            'model' + (key[0] !== '[' ? '.' : '') + key
          );
        }

        div.innerHTML = template;
        tmpl = document.createDocumentFragment();

        var len = div.childNodes.length;
        for (var i = 0; i < len; i++) {
          tmpl.appendChild(div.childNodes[i]);
        }

        tmpl.firstChild.setAttribute('sf-field',path + '[' + index + ']');

        // Possible builder, often a noop
        field.builder({
          fieldFrag: tmpl,
          form: f,
          path: path + '[' + index + ']',

          // Recursive build fn
          build: function(items, path) {
            return build(items, decorator, templateFn, slots, path);
          },

        });

        // Append
        (checkForSlot(f, slots) || frag).appendChild(tmpl);
      }
      return frag;
    }, container);

    return container;
  };


/* FIXME: make a utility function of this ordinary case
var transclusion = function() {
  // We might be able to micro optimize here with some kind of setting
  // or by checking the schema for the type (when we have those.)
  // but a quick jsperf did 55 000 querySelectorAll per second (on my laptop),
  // so I think this isn't the main performance hog.
  var transclusions = tmpl.querySelectorAll('[sf-transclude]');

  if (transclusions.length) {
    // Before we do any transclusion we need clone the cache for later use, but just the first time.
    if ([f.type] === tmpl) {
      [f.type] = [f.type].cloneNode(true);
    }

    for (var i = 0; i < transclusions.length; i++) {
      var n = transclusions[i];

      // The sf-transclude attribute is not a directive, but has the name of what we're supposed to
      // traverse. FIXME: Tabs? How do we loop over something that is not a list of forms?
      // maybe callback?
      var sub = form[n.getAttribute('sf-transclude')];
      if (sub) {
        sub = Array.isArray(sub) ? sub : [sub];

        // Build the subform recursivly
        n.appendChild( build(sub, templates, ) );

      }
    }
  }

}*/


  var builder = {
      /**
       * Builds a form from a canonical form definition
       */
      build: function(form, decorator, slots) {
console.warn(slots)
        return build(form, decorator, function(url) {
          return $templateCache.get(url) || '';
        }, slots);

      },
      internalBuild: build
  };
  return builder;

}]);
