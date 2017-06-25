// FIXME: type template (using custom builder)
/**
 * I build the canonical schema
 *
 * @param  {[type]} sfPathProvider [description]
 *
 * @return {[type]}                [description]
 */
export default function(sfPathProvider) {
  let SNAKE_CASE_REGEXP = /[A-Z]/g;
  let snakeCase = function(name, separator) {
    separator = separator || '_';
    return name.replace(SNAKE_CASE_REGEXP, function(letter, pos) {
      return (pos ? separator : '') + letter.toLowerCase();
    });
  };
  let formId = 0;

  if (!('firstElementChild' in document.createDocumentFragment())) {
    Object.defineProperty(DocumentFragment.prototype, 'firstElementChild', {
      get: function () {
        for (let nodes = this.childNodes, n, i = 0, l = nodes.length; i < l; ++i)
          if (n = nodes[i], 1 === n.nodeType) return n;
        return null;
      },
    });
  }

  let builders = {
    sfField: function(args) {
      args.fieldFrag.firstElementChild.setAttribute('sf-field', formId);

      // We use a lookup table for easy access to our form.
      args.lookup['f' + formId] = args.form;
      formId++;
    },
    ngModel: function(args) {
      if (!args.form.key) {
        return;
      };

      let key = args.form.key;

      // Redact part of the key, used in arrays
      // KISS keyRedaction is a number.
      if (args.state.keyRedaction) {
        key = key.slice(args.state.keyRedaction);
      }

      // Stringify key.
      let modelValue;
      if (!args.state.modelValue) {
        let strKey = sfPathProvider.stringify(key).replace(/"/g, '&quot;');
        modelValue = (args.state.modelName || 'model');

        if (strKey) { // Sometimes, like with arrays directly in arrays strKey is nothing.
          modelValue += (strKey[0] !== '[' ? '.' : '') + strKey;
        }
      }
      else {
        // Another builder, i.e. array has overriden the modelValue
        modelValue = args.state.modelValue;
      }

      // Find all sf-field-value attributes.
      // No value means a add a ng-model.
      // sf-field-value="replaceAll", loop over attributes and replace $$value$$ in each.
      // sf-field-value="attrName", replace or set value of that attribute.
      let nodes = args.fieldFrag.querySelectorAll('[sf-field-model]');
      for (let i = 0; i < nodes.length; i++) {
        let n = nodes[i];
        let conf = n.getAttribute('sf-field-model');
        if (!conf || conf === '') {
          n.setAttribute('ng-model', modelValue);
        }
        else if (conf === 'replaceAll') {
          let attributes = n.attributes;
          for (let j = 0; j < attributes.length; j++) {
            if (attributes[j].value && attributes[j].value.indexOf('$$value') !== -1) {
              attributes[j].value = attributes[j].value.replace(/\$\$value\$\$/g, modelValue);
            }
          }
        }
        else {
          let val = n.getAttribute(conf);
          if (val && val.indexOf('$$value$$')) {
            n.setAttribute(conf, val.replace(/\$\$value\$\$/g, modelValue));
          }
          else {
            n.setAttribute(conf, modelValue);
          }
        }
      }
    },
    simpleTransclusion: function(args) {
      let children = args.build(args.form.items, args.path + '.items', args.state);
      args.fieldFrag.firstChild.appendChild(children);
    },

    // Patch on ngModelOptions, since it doesn't like waiting for its value.
    ngModelOptions: function(args) {
      if (args.form.ngModelOptions && Object.keys(args.form.ngModelOptions).length > 0) {
        args.fieldFrag
          .firstChild
          .setAttribute('ng-model-options', JSON.stringify(args.form.ngModelOptions));
      }
    },
    transclusion: function(args) {
      let transclusions = args.fieldFrag.querySelectorAll('[sf-field-transclude]');

      if (transclusions.length) {
        for (let i = 0; i < transclusions.length; i++) {
          let n = transclusions[i];

          // The sf-transclude attribute is not a directive,
          // but has the name of what we're supposed to
          // traverse. Default to `items`
          let sub = n.getAttribute('sf-field-transclude') || 'items';
          let items = args.form[sub];

          if (items) {
            let childFrag = args.build(items, args.path + '.' + sub, args.state);
            n.appendChild(childFrag);
          }
        }
      }
    },
    condition: function(args) {
      let strKey = '';
      let strModel = 'undefined';
      let ngIf = '';
      // Do we have a condition? Then we slap on an ng-if on all children,
      // but be nice to existing ng-if.
      if (args.form.condition) {
        if (args.form.key) {
          strKey = sfPathProvider.stringify(args.form.key);
          strModel = 'model' + (strKey[0] === '[' ? '' : '.') + strKey;
        }

        let evalExpr = 'evalExpr(' + args.path + '.condition, { model: model, ' +
                       '"arrayIndex": $index, ' +
                       '"arrayIndices": arrayIndices, ' +
                       '"path": path, ' +
                       '"$i": $i, ' +
                       '"$index": $index, ' +
                       '"modelValue": ' + strModel + '})';

        let children = args.fieldFrag.children || args.fieldFrag.childNodes;

        for (let i = 0; i < children.length; i++) {
          let child = children[i];

          if(child.hasAttribute && child.hasAttribute('ng-if')) {
            ngIf = child.getAttribute('ng-if');
          };

          if(child.setAttribute) {
            child.setAttribute('ng-if',
              ngIf
              ? '(' + ngIf + ') || (' + evalExpr + ')'
              : evalExpr
            );
          };
        }
      }
    },
    array: function(args) {
      let items = args.fieldFrag.querySelector('[schema-form-array-items]');

      if (items) {
        let state = angular.copy(args.state);
        state.keyRedaction = 0;
        state.keyRedaction += args.form.key.length + 1;

        // Special case, an array with just one item in it that is not an object.
        // So then we just override the modelValue
        if (args.form.schema && args.form.schema.items &&
            args.form.schema.items.type &&
            args.form.schema.items.type.indexOf('object') === -1 &&
            args.form.schema.items.type.indexOf('array') === -1) {
          state.modelValue = 'modelArray[$index]';
        }
        else {
          state.modelName = 'item';
        }

        // Flag to the builder that we're in an array.
        // This is needed for compatabiliy if a "old" add-on is used that
        // hasn't been transitioned to the new builder.
        state.arrayCompatFlag = true;

        let childFrag = args.build(args.form.items, args.path + '.items', state);
        items.appendChild(childFrag);
      }
    },
    numeric: function(args) {
      let inputFrag = args.fieldFrag.querySelector('input');
      let maximum = args.form.maximum || false;
      let exclusiveMaximum = args.form.exclusiveMaximum || false;
      let minimum = args.form.minimum || false;
      let exclusiveMinimum = args.form.exclusiveMinimum || false;
      let multipleOf = args.form.multipleOf || false;
      if (inputFrag) {
        if (multipleOf !== false) {
          inputFrag.setAttribute('step', multipleOf);
        };

        if (maximum !== false) {
          if (exclusiveMaximum !== false && multipleOf !== false) {
            maximum = maximum - multipleOf;
          };
          inputFrag.setAttribute('max', maximum);
        };

        if (minimum !== false) {
          if (exclusiveMinimum !== false && multipleOf !== false) {
            minimum = minimum + multipleOf;
          };
          inputFrag.setAttribute('min', minimum);
        };
      };
    },
  };
  this.builders = builders;
  let stdBuilders = [
    builders.sfField,
    builders.ngModel,
    builders.ngModelOptions,
    builders.condition,
  ];
  this.stdBuilders = stdBuilders;

  this.$get = [ '$templateCache', 'schemaFormDecorators', 'sfPath',
      function($templateCache, schemaFormDecorators, sfPath) {
    let checkForSlot = function(form, slots) {
      // Finally append this field to the frag.
      // Check for slots
      if (form.key) {
        let slot = slots[sfPath.stringify(form.key)];
        if (slot) {
          while (slot.firstChild) {
            slot.removeChild(slot.firstChild);
          }
          return slot;
        }
      }
    };

    let build = function(items, decorator, templateFn, slots, path, state, lookup) {
      state = state || {};
      state = state || {};
      lookup = lookup || Object.create(null);
      path = path || 'schemaForm.form';
      let container = document.createDocumentFragment();
      items.reduce(function(frag, f, index) {
        // Sanity check.
        if (!f.type) {
          return frag;
        }

        let field = decorator[f.type] || decorator['default'];
        if (!field.replace) {
          // Backwards compatability build
          let n = document.createElement(snakeCase(decorator.__name, '-'));
          if (state.arrayCompatFlag) {
            n.setAttribute('form', 'copyWithIndex($index)');
          }
          else {
            n.setAttribute('form', path + '[' + index + ']');
          }

          (checkForSlot(f, slots) || frag).appendChild(n);
        }
        else {
          let tmpl;

          // Reset arrayCompatFlag, it's only valid for direct children of the array.
          state.arrayCompatFlag = false;

          // TODO: Create a couple of testcases, small and large and
          //       measure optmization. A good start is probably a
          //       cache of DOM nodes for a particular template
          //       that can be cloned instead of using innerHTML
          let div = document.createElement('div');
          let template = templateFn(f, field) || templateFn(f, decorator['default']);
          div.innerHTML = template;

          // Move node to a document fragment, we don't want the div.
          tmpl = document.createDocumentFragment();
          while (div.childNodes.length > 0) {
            tmpl.appendChild(div.childNodes[0]);
          }

          // Possible builder, often a noop
          let args = {
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
          let builderFn = f.builder || field.builder;

          // Builders are either a function or a list of functions.
          if (typeof builderFn === 'function') {
            builderFn(args);
          }
          else {
            builderFn.forEach(function(fn) { fn(args); });
          }

          // Append
          (checkForSlot(f, slots) || frag).appendChild(tmpl);
        }
        return frag;
      },
      container);

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
      internalBuild: build,
    };
  } ];
}
