
// FIXME: type template (using custom builder)
angular.module('schemaForm').provider('sfBuilder', ['sfPathProvider', function(sfPathProvider) {

  var SNAKE_CASE_REGEXP = /[A-Z]/g;
  var snakeCase = function(name, separator) {
    separator = separator || '_';
    return name.replace(SNAKE_CASE_REGEXP, function(letter, pos) {
      return (pos ? separator : '') + letter.toLowerCase();
    });
  };

  var builders = {
    ngModel: function(args) {
      if (!args.form.key) {
        return;
      }
      var key  = args.form.key;

      // Redact part of the key, used in arrays
      // KISS keyRedaction is a number.
      if (args.state.keyRedaction) {
        key = key.slice(args.state.keyRedaction);
      }

      // Stringify key.
      var modelValue;
      if (!args.state.modelValue) {
        var strKey = sfPathProvider.stringify(key).replace(/"/g, '&quot;');
        modelValue = (args.state.modelName || 'model');

        if (strKey) { // Sometimes, like with arrays directly in arrays strKey is nothing.
          modelValue += (strKey[0] !== '[' ? '.' : '') + strKey;
        }
      } else {
        // Another builder, i.e. array has overriden the modelValue
        modelValue = args.state.modelValue;
      }

      // Find all sf-field-value attributes.
      // No value means a add a ng-model.
      // sf-field-value="replaceAll", loop over attributes and replace $$value$$ in each.
      // sf-field-value="attrName", replace or set value of that attribute.
      var nodes = args.fieldFrag.querySelectorAll('[sf-field-model]');
      for (var i = 0; i < nodes.length; i++) {
        var n = nodes[i];
        var conf = n.getAttribute('sf-field-model');
        if (!conf || conf === '') {
          n.setAttribute('ng-model', modelValue);
        } else if (conf === 'replaceAll') {
          var attributes = n.attributes;
          for (var j = 0; attributes.length; j++) {
            if (attributes[j].value && attributes[j].value.indexOf('$$value') !== -1) {
              attributes[j].value = attributes[j].value.replace(/\$\$value\$\$/g, modelValue);
            }
          }
        } else {
          var  val = n.getAttribute(conf);
          if (val && val.indexOf('$$value$$')) {
            n.setAttribute(conf, val.replace(/\$\$value\$\$/g, modelValue));
          } else {
            n.setAttribute(conf, modelValue);
          }
        }
      }
    },
    simpleTransclusion: function(args) {
      var children = args.build(args.form.items, args.path + '.items', args.state);
      args.fieldFrag.firstChild.appendChild(children);
    },

    // Patch on ngModelOptions, since it doesn't like waiting for its value.
    ngModelOptions: function(args) {
      if (args.form.ngModelOptions && Object.keys(args.form.ngModelOptions).length > 0) {
        args.fieldFrag.firstChild.setAttribute('ng-model-options', JSON.stringify(args.form.ngModelOptions));
      }
    },
    transclusion: function(args) {
      var transclusions = args.fieldFrag.querySelectorAll('[sf-field-transclude]');

      if (transclusions.length) {
        for (var i = 0; i < transclusions.length; i++) {
          var n = transclusions[i];

          // The sf-transclude attribute is not a directive, but has the name of what we're supposed to
          // traverse.
          var sub = args.form[n.getAttribute('sf-field-transclude')];
          if (sub) {
            sub = Array.isArray(sub) ? sub : [sub];
            var childFrag = args.build(sub, args.path + '.' + sub, args.state);
            n.appendChild(childFrag);
          }
        }
      }
    }
  };
  this.builders = builders;

  this.$get = ['$templateCache', 'schemaFormDecorators', 'sfPath', function($templateCache, schemaFormDecorators, sfPath) {


    var checkForSlot = function(form, slots) {
      // Finally append this field to the frag.
      // Check for slots
      if (form.key) {
        var slot = slots[sfPath.stringify(form.key)];
        if (slot) {
          while (slot.firstChild) {
            slot.removeChild(slot.firstChild);
          }
          return slot;
        }
      }
    };

    var build = function(items, decorator, templateFn, slots, path, state) {
      state = state || {};
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
          div.innerHTML = template;

          // Move node to a document fragment, we don't want the div.
          tmpl = document.createDocumentFragment();
          while (div.childNodes.length > 0) {
            tmpl.appendChild(div.childNodes[0]);
          }


          tmpl.firstChild.setAttribute('sf-field',path + '[' + index + ']');

          // Possible builder, often a noop
          var args = {
            fieldFrag: tmpl,
            form: f,
            state: state,
            path: path + '[' + index + ']',

            // Recursive build fn
            build: function(items, path, state) {
              return build(items, decorator, templateFn, slots, path, state);
            },

          };

          // Builders are either a function or a list of functions.
          if (typeof field.builder === 'function') {
            field.builder(args);
          } else {
            field.builder.forEach(function(fn) { fn(args); });
          }

          // Append
          (checkForSlot(f, slots) || frag).appendChild(tmpl);
        }
        return frag;
      }, container);

      return container;
    };

    return {
        /**
         * Builds a form from a canonical form definition
         */
        build: function(form, decorator, slots) {
          return build(form, decorator, function(url) {
            return $templateCache.get(url);
          }, slots);

        },
        builder: builders,
        internalBuild: build
    };
  }];

}]);
