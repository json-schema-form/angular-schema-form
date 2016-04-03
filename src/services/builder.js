
// FIXME: type template (using custom builder)
angular.module('schemaForm').provider('sfBuilder', ['sfPathProvider', function(sfPathProvider) {

  var SNAKE_CASE_REGEXP = /[A-Z]/g;
  var snakeCase = function(name, separator) {
    separator = separator || '_';
    return name.replace(SNAKE_CASE_REGEXP, function(letter, pos) {
      return (pos ? separator : '') + letter.toLowerCase();
    });
  };
  var formId = 0;

  var builders = {
    sfField: function(args) {
      args.fieldFrag.firstChild.setAttribute('sf-field', formId);

      // We use a lookup table for easy access to our form.
      args.lookup['f' + formId] = args.form;
      formId++;
    },
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
          for (var j = 0; j < attributes.length; j++) {
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

          // The sf-transclude attribute is not a directive,
          // but has the name of what we're supposed to
          // traverse. Default to `items`
          var sub = n.getAttribute('sf-field-transclude') || 'items';
          var items = args.form[sub];

          if (items) {
            var childFrag = args.build(items, args.path + '.' + sub, args.state);
            n.appendChild(childFrag);
          }
        }
      }
    },
    condition: function(args) {
      // Do we have a condition? Then we slap on an ng-if on all children,
      // but be nice to existing ng-if.
      if (args.form.condition) {
        var evalExpr = 'evalExpr(' + args.path +
                       '.condition, { model: model, "arrayIndex": $index})';
        if (args.form.key) {
          var strKey = sfPathProvider.stringify(args.form.key);
          evalExpr = 'evalExpr(' + args.path + '.condition,{ model: model, "arrayIndex": $index, ' +
                     '"modelValue": model' + (strKey[0] === '[' ? '' : '.') + strKey + '})';
        }

        var children = args.fieldFrag.children || args.fieldFrag.childNodes;
        for (var i = 0; i < children.length; i++) {
          var child = children[i];
          var ngIf = child.getAttribute('ng-if');
          child.setAttribute(
            'ng-if',
            ngIf ?
            '(' + ngIf +
            ') || (' + evalExpr + ')'
            : evalExpr
          );
        }
      }
    },
    array: function(args) {
      var items = args.fieldFrag.querySelector('[schema-form-array-items]');
      if (items) {
        state = angular.copy(args.state);
        state.keyRedaction = state.keyRedaction || 0;
        state.keyRedaction += args.form.key.length + 1;

        // Special case, an array with just one item in it that is not an object.
        // So then we just override the modelValue
        if (args.form.schema && args.form.schema.items &&
            args.form.schema.items.type &&
            args.form.schema.items.type.indexOf('object') === -1 &&
            args.form.schema.items.type.indexOf('array') === -1) {
          var strKey = sfPathProvider.stringify(args.form.key).replace(/"/g, '&quot;') + '[$index]';
          state.modelValue = 'modelArray[$index]';
        } else {
          state.modelName = 'item';
        }

        // Flag to the builder that where in an array.
        // This is needed for compatabiliy if a "old" add-on is used that
        // hasn't been transitioned to the new builder.
        state.arrayCompatFlag = true;

        var childFrag = args.build(args.form.items, args.path + '.items', state);
        items.appendChild(childFrag);
      }
    }
  };
  this.builders = builders;
  var stdBuilders = [
    builders.sfField,
    builders.ngModel,
    builders.ngModelOptions,
    builders.condition
  ];
  this.stdBuilders = stdBuilders;

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

    var build = function(items, decorator, templateFn, slots, path, state, lookup) {
      state = state || {};
      lookup = lookup || Object.create(null);
      path = path || 'schemaForm.form';
      var container = document.createDocumentFragment();
      items.reduce(function(frag, f, index) {

        // Sanity check.
        if (!f.type) {
          return frag;
        }

        var field = decorator[f.type] || decorator['default'];
        if (!field.replace) {
          // Backwards compatability build
          var n = document.createElement(snakeCase(decorator.__name, '-'));
          if (state.arrayCompatFlag) {
            n.setAttribute('form','copyWithIndex($index)');
          } else {
            n.setAttribute('form', path + '[' + index + ']');
          }

          (checkForSlot(f, slots) || frag).appendChild(n);

        } else {
          var tmpl;

          // Reset arrayCompatFlag, it's only valid for direct children of the array.
          state.arrayCompatFlag = false;

          // TODO: Create a couple fo testcases, small and large and
          //       measure optmization. A good start is probably a cache of DOM nodes for a particular
          //       template that can be cloned instead of using innerHTML
          var div = document.createElement('div');
          var template = templateFn(f, field) || templateFn(f, decorator['default']);
          div.innerHTML = template;

          // Move node to a document fragment, we don't want the div.
          tmpl = document.createDocumentFragment();
          while (div.childNodes.length > 0) {
            tmpl.appendChild(div.childNodes[0]);
          }

          // Possible builder, often a noop
          var args = {
            fieldFrag: tmpl,
            form: f,
            lookup: lookup,
            state: state,
            path: path + '[' + index + ']',

            // Recursive build fn
            build: function(items, path, state) {
              return build(items, decorator, templateFn, slots, path, state, lookup);
            },

          };

          // Let the form definiton override builders if it wants to.
          var builderFn = f.builder || field.builder;

          // Builders are either a function or a list of functions.
          if (typeof builderFn === 'function') {
            builderFn(args);
          } else {
            builderFn.forEach(function(fn) { fn(args); });
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
      build: function(form, decorator, slots, lookup) {
        return build(form, decorator, function(form, field) {
          if (form.type === 'template') {
            return form.template;
          }
          return $templateCache.get(field.template);
        }, slots, undefined, undefined, lookup);

      },
      builder: builders,
      stdBuilders: stdBuilders,
      internalBuild: build
    };
  }];

}]);
