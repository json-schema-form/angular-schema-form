/*!
 * angular-schema-form-bootstrap
 * @version 1.0.0-alpha.1
 * @link https://github.com/json-schema-form/angular-schema-form-bootstrap
 * @license MIT
 * Copyright (c) 2016 JSON Schema Form
 */
(function webpackUniversalModuleDefinition(root, factory) {
	if(typeof exports === 'object' && typeof module === 'object')
		module.exports = factory();
	else if(typeof define === 'function' && define.amd)
		define([], factory);
	else {
		var a = factory();
		for(var i in a) (typeof exports === 'object' ? exports : root)[i] = a[i];
	}
})(this, function() {
return /******/ (function(modules) { // webpackBootstrap
/******/ 	// The module cache
/******/ 	var installedModules = {};

/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {

/******/ 		// Check if module is in cache
/******/ 		if(installedModules[moduleId])
/******/ 			return installedModules[moduleId].exports;

/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = installedModules[moduleId] = {
/******/ 			exports: {},
/******/ 			id: moduleId,
/******/ 			loaded: false
/******/ 		};

/******/ 		// Execute the module function
/******/ 		modules[moduleId].call(module.exports, module, module.exports, __webpack_require__);

/******/ 		// Flag the module as loaded
/******/ 		module.loaded = true;

/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}


/******/ 	// expose the modules object (__webpack_modules__)
/******/ 	__webpack_require__.m = modules;

/******/ 	// expose the module cache
/******/ 	__webpack_require__.c = installedModules;

/******/ 	// __webpack_public_path__
/******/ 	__webpack_require__.p = "";

/******/ 	// Load entry module and return exports
/******/ 	return __webpack_require__(0);
/******/ })
/************************************************************************/
/******/ ([
/* 0 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';

	__webpack_require__(1);

/***/ },
/* 1 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';

	// angular-templatecache-loader
	var textareaTemplate = __webpack_require__(17);
	var fieldsetTemplate = __webpack_require__(7);
	var arrayTemplate = __webpack_require__(3);
	var tabarrayTemplate = __webpack_require__(15);
	var tabsTemplate = __webpack_require__(16);
	var sectionTemplate = __webpack_require__(12);
	var actionsTemplate = __webpack_require__(2);
	var selectTemplate = __webpack_require__(13);
	var checkboxTemplate = __webpack_require__(4);
	var checkboxesTemplate = __webpack_require__(5);
	var submitTemplate = __webpack_require__(14);
	var radiosTemplate = __webpack_require__(11);
	var radiosInlineTemplate = __webpack_require__(10);
	var radiobuttonsTemplate = __webpack_require__(9);
	var helpTemplate = __webpack_require__(8);
	var defaultTemplate = __webpack_require__(6);

	angular.module('schemaForm').config(bootstrapDecoratorConfig).filter('sfCamelKey', sfCamelKeyFilter);

	bootstrapDecoratorConfig.$inject = ['schemaFormProvider', 'schemaFormDecoratorsProvider', 'sfBuilderProvider', 'sfPathProvider', '$injector'];

	function bootstrapDecoratorConfig(schemaFormProvider, decoratorsProvider, sfBuilderProvider, sfPathProvider, $injector) {
	  var base = 'decorators/bootstrap/';

	  var simpleTransclusion = sfBuilderProvider.builders.simpleTransclusion;
	  var ngModelOptions = sfBuilderProvider.builders.ngModelOptions;
	  var ngModel = sfBuilderProvider.builders.ngModel;
	  var sfField = sfBuilderProvider.builders.sfField;
	  var condition = sfBuilderProvider.builders.condition;
	  var array = sfBuilderProvider.builders.array;
	  var numeric = sfBuilderProvider.builders.numeric;

	  // Tabs is so bootstrap specific that it stays here.
	  var tabs = function tabs(args) {
	    if (args.form.tabs && args.form.tabs.length > 0) {
	      var tabContent = args.fieldFrag.querySelector('.tab-content');

	      args.form.tabs.forEach(function (tab, index) {
	        var evalExpr = '(evalExpr(' + args.path + '.tabs[' + index + ']' + '.condition, { model: model, "arrayIndex": $index}))';
	        var div = document.createElement('div');
	        div.className = 'tab-pane';
	        div.setAttribute('ng-disabled', 'form.readonly');
	        div.setAttribute('ng-show', 'selected.tab === ' + index);
	        div.setAttribute('ng-class', '{active: selected.tab === ' + index + '}');
	        if (!!tab.condition) {
	          div.setAttribute('ng-if', evalExpr);
	        };

	        var childFrag = args.build(tab.items, args.path + '.tabs[' + index + '].items', args.state);
	        div.appendChild(childFrag);
	        tabContent.appendChild(div);
	      });
	    }
	  };

	  var selectPlaceholder = function selectPlaceholder(args) {
	    if (args.form.placeholder) {
	      var selectBox = args.fieldFrag.querySelector('select');
	      var option = document.createElement('option');
	      option.setAttribute('value', '');

	      /* We only want the placeholder to show when we do not have a value on the model.
	       * We make ngModel builder replace all so we can use $$value$$.
	       */
	      option.setAttribute('sf-field-model', 'replaceAll');

	      /* https://github.com/angular/angular.js/issues/12190#issuecomment-115277040
	       * angular > 1.4 does a emptyOption.attr('selected', true)
	       * which does not like the ng-if comment.
	       */
	      if (angular.version.major === 1 && angular.version.minor < 4) {
	        option.setAttribute('ng-if', '$$value$$ === undefined');
	      } else {
	        option.setAttribute('ng-show', '$$value$$ === undefined');
	      }

	      option.textContent = args.form.placeholder;

	      selectBox.appendChild(option);
	    }
	  };

	  var defaults = [sfField, ngModel, ngModelOptions, condition];
	  decoratorsProvider.defineDecorator('bootstrapDecorator', {
	    actions: { template: actionsTemplate, builder: defaults },
	    array: { template: arrayTemplate, builder: [sfField, ngModelOptions, ngModel, array, condition] },
	    button: { template: submitTemplate, builder: defaults },
	    checkbox: { template: checkboxTemplate, builder: defaults },
	    checkboxes: { template: checkboxesTemplate, builder: [sfField, ngModelOptions, ngModel, array, condition] },
	    conditional: { template: sectionTemplate, builder: [sfField, simpleTransclusion, condition] },
	    'default': { template: defaultTemplate, builder: defaults },
	    fieldset: { template: fieldsetTemplate, builder: [sfField, simpleTransclusion, condition] },
	    help: { template: helpTemplate, builder: defaults },
	    number: { template: defaultTemplate, builder: defaults.concat(numeric) },
	    password: { template: defaultTemplate, builder: defaults },
	    radios: { template: radiosTemplate, builder: defaults },
	    'radios-inline': { template: radiosInlineTemplate, builder: defaults },
	    radiobuttons: { template: radiobuttonsTemplate, builder: defaults },
	    section: { template: sectionTemplate, builder: [sfField, simpleTransclusion, condition] },
	    select: { template: selectTemplate, builder: defaults.concat(selectPlaceholder) },
	    submit: { template: submitTemplate, builder: defaults },
	    tabarray: { template: tabarrayTemplate, builder: [sfField, ngModelOptions, ngModel, array, condition] },
	    tabs: { template: tabsTemplate, builder: [sfField, ngModelOptions, tabs, condition] },
	    textarea: { template: textareaTemplate, builder: defaults }
	  }, []);
	};

	/**
	 * sfCamelKey Filter
	 */
	function sfCamelKeyFilter() {
	  return function (formKey) {
	    if (!formKey) {
	      return '';
	    };
	    var part, i, key;
	    key = formKey.slice();
	    for (i = 0; i < key.length; i++) {
	      part = key[i].toLowerCase().split('');
	      if (i && part.length) {
	        part[0] = part[0].toUpperCase();
	      };
	      key[i] = part.join('');
	    };
	    return key.join('');
	  };
	};

/***/ },
/* 2 */
/***/ function(module, exports) {

	var path = 'bootstrap/actions.html';
	var html = "<div class=\"btn-group schema-form-actions {{::form.htmlClass}}\">\r\n  <input ng-repeat-start=\"item in form.items\"\r\n         type=\"submit\"\r\n         class=\"btn {{ item.style || 'btn-default' }} {{::form.fieldHtmlClass}}\"\r\n         value=\"{{item.title}}\"\r\n         ng-if=\"item.type === 'submit'\">\r\n  <button ng-repeat-end\r\n          class=\"btn {{ item.style || 'btn-default' }} {{::form.fieldHtmlClass}}\"\r\n          type=\"button\"\r\n          ng-disabled=\"form.readonly\"\r\n          ng-if=\"item.type !== 'submit'\"\r\n          ng-click=\"buttonClick($event,item)\"><span ng-if=\"item.icon\" class=\"{{item.icon}}\"></span>{{item.title}}</button>\r\n</div>\r\n";
	window.angular.module('ng').run(['$templateCache', function(c) { c.put(path, html) }]);
	module.exports = path;

/***/ },
/* 3 */
/***/ function(module, exports) {

	var path = 'bootstrap/array.html';
	var html = "<div  class=\"schema-form-array {{::form.htmlClass}}\"\r\n      sf-field-model=\"sf-new-array\"\r\n      sf-new-array>\r\n  <label class=\"control-label\" ng-show=\"showTitle()\">{{ form.title }}</label>\r\n  <ol class=\"list-group\" sf-field-model ui-sortable=\"form.sortOptions\">\r\n    <li class=\"list-group-item {{::form.fieldHtmlClass}}\"\r\n        sf-field-model=\"ng-repeat\"\r\n        ng-repeat=\"item in $$value$$ track by $index\">\r\n      <button ng-hide=\"form.readonly || form.remove === null\"\r\n              ng-click=\"deleteFromArray($index)\"\r\n              ng-disabled=\"form.schema.minItems >= modelArray.length\"\r\n              style=\"position: relative; z-index: 20;\"\r\n              type=\"button\" class=\"close pull-right\">\r\n              <span aria-hidden=\"true\">&times;</span><span class=\"sr-only\">Close</span>\r\n      </button>\r\n      <div schema-form-array-items sf-key-controller sf-parent-key=\"[{{form.key.join('][')}}]\" sf-index=\"{{$index}}\"></div>\r\n    </li>\r\n  </ol>\r\n  <div class=\"clearfix\" style=\"padding: 15px;\" ng-model=\"modelArray\" schema-validate=\"form\">\r\n    <div class=\"help-block\"\r\n         ng-show=\"(hasError() && errorMessage(schemaError())) || form.description\"\r\n         ng-bind-html=\"(hasError() && errorMessage(schemaError())) || form.description\"></div>\r\n\r\n    <button ng-hide=\"form.readonly || form.add === null\"\r\n            ng-click=\"appendToArray()\"\r\n            ng-disabled=\"form.schema.maxItems <= modelArray.length\"\r\n            type=\"button\"\r\n            class=\"btn {{ form.style.add || 'btn-default' }} pull-right\">\r\n      <i class=\"glyphicon glyphicon-plus\"></i>\r\n      {{ form.add || 'Add'}}\r\n    </button>\r\n  </div>\r\n</div>\r\n";
	window.angular.module('ng').run(['$templateCache', function(c) { c.put(path, html) }]);
	module.exports = path;

/***/ },
/* 4 */
/***/ function(module, exports) {

	var path = 'bootstrap/checkbox.html';
	var html = "<div class=\"checkbox schema-form-checkbox {{::form.htmlClass}}\"\r\n     ng-class=\"{'has-error': form.disableErrorState !== true &&  hasError(), 'has-success': form.disableSuccessState !== true &&  hasSuccess()}\">\r\n  <label class=\"{{::form.labelHtmlClass}}\">\r\n    <input type=\"checkbox\"\r\n           sf-changed=\"form\"\r\n           ng-disabled=\"form.readonly\"\r\n           sf-field-model\r\n           schema-validate=\"form\"\r\n           class=\"{{::form.fieldHtmlClass}}\"\r\n           name=\"{{form.key.slice(-1)[0]}}\">\r\n    <span ng-bind-html=\"form.title\"></span>\r\n  </label>\r\n  <div class=\"help-block\" sf-message=\"form.description\"></div>\r\n</div>\r\n";
	window.angular.module('ng').run(['$templateCache', function(c) { c.put(path, html) }]);
	module.exports = path;

/***/ },
/* 5 */
/***/ function(module, exports) {

	var path = 'bootstrap/checkboxes.html';
	var html = "<div sf-field-model=\"sf-new-array\"\r\n     sf-new-array\r\n     class=\"form-group schema-form-checkboxes {{::form.htmlClass}}\"\r\n     ng-class=\"{'has-error': form.disableErrorState !== true &&  hasError(), 'has-success': form.disableSuccessState !== true &&  hasSuccess()}\">\r\n  <label class=\"control-label {{::form.labelHtmlClass}}\"\r\n         sf-field-model\r\n         schema-validate=\"form\"\r\n         ng-show=\"showTitle()\">{{form.title}}</label>\r\n\r\n  <div class=\"checkbox\" ng-repeat=\"val in titleMapValues track by $index\" >\r\n    <label>\r\n      <input type=\"checkbox\"\r\n             ng-disabled=\"form.readonly\"\r\n             sf-changed=\"form\"\r\n             class=\"{{::form.fieldHtmlClass}}\"\r\n             ng-model=\"titleMapValues[$index]\"\r\n             name=\"{{form.key.slice(-1)[0]}}\">\r\n      <span ng-bind-html=\"form.titleMap[$index].name\"></span>\r\n    </label>\r\n\r\n  </div>\r\n  <div class=\"help-block\" sf-message=\"form.description\"></div>\r\n</div>\r\n";
	window.angular.module('ng').run(['$templateCache', function(c) { c.put(path, html) }]);
	module.exports = path;

/***/ },
/* 6 */
/***/ function(module, exports) {

	var path = 'bootstrap/default.html';
	var html = "<div class=\"form-group {{::form.htmlClass}}\"\r\n     ng-class=\"{ '{{'schema-form-' + form.type}}': true, 'has-error': form.disableErrorState !== true && hasError(), 'has-success': form.disableSuccessState !== true && hasSuccess(), 'has-feedback': form.feedback !== false }\">\r\n  <label class=\"control-label {{::form.labelHtmlClass}}\" ng-class=\"{'sr-only': !showTitle()}\" for=\"{{form.key.slice(-1)[0]}}\">{{form.title}}</label>\r\n\r\n  <input ng-if=\"!form.fieldAddonLeft && !form.fieldAddonRight\"\r\n         ng-show=\"::form.key\"\r\n         type=\"{{::form.type}}\"\r\n         step=\"any\"\r\n         sf-changed=\"form\"\r\n         placeholder=\"{{::form.placeholder}}\"\r\n         class=\"form-control {{::form.fieldHtmlClass}}\"\r\n         id=\"{{form.key.slice(-1)[0]}}\"\r\n         sf-field-model\r\n         ng-disabled=\"form.readonly\"\r\n         schema-validate=\"form\"\r\n         name=\"{{form.key.slice(-1)[0]}}\"\r\n         aria-describedby=\"{{form.key.slice(-1)[0] + 'Status'}}\">\r\n\r\n  <div ng-if=\"form.fieldAddonLeft || form.fieldAddonRight\"\r\n       ng-class=\"{'input-group': (form.fieldAddonLeft || form.fieldAddonRight)}\">\r\n    <span ng-if=\"form.fieldAddonLeft\"\r\n          class=\"input-group-addon\"\r\n          ng-bind-html=\"form.fieldAddonLeft\"></span>\r\n    <input ng-show=\"::form.key\"\r\n           type=\"{{::form.type}}\"\r\n           step=\"any\"\r\n           sf-changed=\"form\"\r\n           placeholder=\"{{::form.placeholder}}\"\r\n           class=\"form-control {{::form.fieldHtmlClass}}\"\r\n           id=\"{{form.key.slice(-1)[0]}}\"\r\n           sf-field-model\r\n           ng-disabled=\"form.readonly\"\r\n           schema-validate=\"form\"\r\n           name=\"{{form.key.slice(-1)[0]}}\"\r\n           aria-describedby=\"{{form.key.slice(-1)[0] + 'Status'}}\">\r\n\r\n    <span ng-if=\"form.fieldAddonRight\"\r\n          class=\"input-group-addon\"\r\n          ng-bind-html=\"form.fieldAddonRight\"></span>\r\n  </div>\r\n\r\n  <span ng-if=\"form.feedback !== false\"\r\n        class=\"form-control-feedback\"\r\n        ng-class=\"evalInScope(form.feedback) || {'glyphicon': true, 'glyphicon-ok': form.disableSuccessState !== true && hasSuccess(), 'glyphicon-remove': form.disableErrorState !== true && hasError() }\"\r\n        aria-hidden=\"true\"></span>\r\n\r\n  <span ng-if=\"hasError() || hasSuccess()\"\r\n        id=\"{{form.key.slice(-1)[0] + 'Status'}}\"\r\n        class=\"sr-only\">{{ hasSuccess() ? '(success)' : '(error)' }}</span>\r\n\r\n  <div class=\"help-block\" sf-message=\"form.description\"></div>\r\n</div>\r\n";
	window.angular.module('ng').run(['$templateCache', function(c) { c.put(path, html) }]);
	module.exports = path;

/***/ },
/* 7 */
/***/ function(module, exports) {

	var path = 'bootstrap/fieldset.html';
	var html = "<fieldset ng-disabled=\"form.readonly\" class=\"schema-form-fieldset {{::form.htmlClass}}\">\r\n  <legend ng-class=\"{'sr-only': !showTitle() }\">{{ form.title }}</legend>\r\n  <div class=\"help-block\" ng-show=\"form.description\" ng-bind-html=\"form.description\"></div>\r\n</fieldset>\r\n";
	window.angular.module('ng').run(['$templateCache', function(c) { c.put(path, html) }]);
	module.exports = path;

/***/ },
/* 8 */
/***/ function(module, exports) {

	var path = 'bootstrap/help.html';
	var html = "<div class=\"helpvalue schema-form-helpvalue {{::form.htmlClass}}\" ng-bind-html=\"form.helpvalue\"></div>\r\n";
	window.angular.module('ng').run(['$templateCache', function(c) { c.put(path, html) }]);
	module.exports = path;

/***/ },
/* 9 */
/***/ function(module, exports) {

	var path = 'bootstrap/radio-buttons.html';
	var html = "<div class=\"form-group schema-form-radiobuttons {{::form.htmlClass}}\"\r\n     ng-class=\"{'has-error': form.disableErrorState !== true &&  hasError(), 'has-success': form.disableSuccessState !== true &&  hasSuccess()}\">\r\n  <div>\r\n    <label class=\"control-label {{::form.labelHtmlClass}}\" ng-show=\"showTitle()\">{{form.title}}</label>\r\n  </div>\r\n  <div class=\"btn-group\">\r\n    <label sf-field-model=\"replaceAll\" class=\"btn {{ (item.value === $$value$$) ? form.style.selected || 'btn-default' : form.style.unselected || 'btn-default'; }}\"\r\n           ng-class=\"{ active: item.value === $$value$$ }\"\r\n           ng-repeat=\"item in form.titleMap\">\r\n      <input type=\"radio\"\r\n             class=\"{{::form.fieldHtmlClass}}\"\r\n             sf-changed=\"form\"\r\n             style=\"display: none;\"\r\n             ng-disabled=\"form.readonly\"\r\n             sf-field-model\r\n             schema-validate=\"form\"\r\n             ng-value=\"item.value\"\r\n             name=\"{{form.key.join('.')}}\">\r\n      <span ng-bind-html=\"item.name\"></span>\r\n    </label>\r\n  </div>\r\n  <div class=\"help-block\" sf-message=\"form.description\"></div>\r\n</div>\r\n";
	window.angular.module('ng').run(['$templateCache', function(c) { c.put(path, html) }]);
	module.exports = path;

/***/ },
/* 10 */
/***/ function(module, exports) {

	var path = 'bootstrap/radios-inline.html';
	var html = "<div class=\"form-group schema-form-radios-inline {{::form.htmlClass}}\"\r\n     ng-class=\"{'has-error': form.disableErrorState !== true &&  hasError(), 'has-success': form.disableSuccessState !== true && hasSuccess()}\">\r\n  <label class=\"control-label {{::form.labelHtmlClass}}\"\r\n        ng-show=\"showTitle()\" sf-field-model\r\n        schema-validate=\"form\" >{{form.title}}</label>\r\n  <div>\r\n      <label class=\"radio-inline\" ng-repeat=\"item in form.titleMap\" >\r\n      <input type=\"radio\"\r\n             class=\"{{::form.fieldHtmlClass}}\"\r\n             sf-changed=\"form\"\r\n             ng-disabled=\"form.readonly\"\r\n             sf-field-model\r\n             ng-value=\"item.value\"\r\n             name=\"{{form.key.join('.')}}\">\r\n      <span ng-bind-html=\"item.name\"></span>\r\n    </label>\r\n  </div>\r\n  <div class=\"help-block\" sf-message=\"form.description\"></div>\r\n</div>\r\n";
	window.angular.module('ng').run(['$templateCache', function(c) { c.put(path, html) }]);
	module.exports = path;

/***/ },
/* 11 */
/***/ function(module, exports) {

	var path = 'bootstrap/radios.html';
	var html = "<div class=\"form-group schema-form-radios {{::form.htmlClass}}\" ng-class=\"{'has-error': form.disableErrorState !== true &&  hasError(), 'has-success': form.disableSuccessState !== true && hasSuccess()}\">\r\n  <label class=\"control-label {{::form.labelHtmlClass}}\"\r\n         sf-field-model schema-validate=\"form\"\r\n         ng-show=\"showTitle()\">{{form.title}}</label>\r\n  <div class=\"radio\" ng-repeat=\"item in form.titleMap\">\r\n    <label>\r\n      <input type=\"radio\"\r\n             class=\"{{::form.fieldHtmlClass}}\"\r\n             sf-changed=\"form\"\r\n             ng-disabled=\"form.readonly\"\r\n             sf-field-model\r\n             ng-value=\"item.value\"\r\n             name=\"{{form.key.join('.')}}\">\r\n      <span ng-bind-html=\"item.name\"></span>\r\n    </label>\r\n  </div>\r\n  <div class=\"help-block\" sf-message=\"form.description\"></div>\r\n</div>\r\n";
	window.angular.module('ng').run(['$templateCache', function(c) { c.put(path, html) }]);
	module.exports = path;

/***/ },
/* 12 */
/***/ function(module, exports) {

	var path = 'bootstrap/section.html';
	var html = "<div class=\"schema-form-section {{::form.htmlClass}}\"></div>\r\n";
	window.angular.module('ng').run(['$templateCache', function(c) { c.put(path, html) }]);
	module.exports = path;

/***/ },
/* 13 */
/***/ function(module, exports) {

	var path = 'bootstrap/select.html';
	var html = "<div class=\"form-group {{::form.htmlClass}} schema-form-select\"\r\n     ng-class=\"{'has-error': form.disableErrorState !== true && hasError(), 'has-success': form.disableSuccessState !== true && hasSuccess(), 'has-feedback': form.feedback !== false}\">\r\n  <label class=\"control-label {{::form.labelHtmlClass}}\" ng-show=\"showTitle()\">\r\n    {{form.title}}\r\n  </label>\r\n  <select sf-field-model\r\n          ng-disabled=\"form.readonly\"\r\n          sf-changed=\"form\"\r\n          class=\"form-control {{::form.fieldHtmlClass}}\"\r\n          schema-validate=\"form\"\r\n          ng-options=\"item.value as item.name group by item.group for item in form.titleMap\"\r\n          name=\"{{form.key.slice(-1)[0]}}\">\r\n  </select>\r\n  <div class=\"help-block\" sf-message=\"form.description\"></div>\r\n</div>\r\n";
	window.angular.module('ng').run(['$templateCache', function(c) { c.put(path, html) }]);
	module.exports = path;

/***/ },
/* 14 */
/***/ function(module, exports) {

	var path = 'bootstrap/submit.html';
	var html = "<div class=\"form-group schema-form-submit {{::form.htmlClass}}\">\r\n  <input type=\"submit\"\r\n         class=\"btn {{ form.style || 'btn-primary' }} {{::form.fieldHtmlClass}}\"\r\n         value=\"{{form.title}}\"\r\n         ng-disabled=\"form.readonly\"\r\n         ng-if=\"form.type === 'submit'\">\r\n  <button class=\"btn {{ form.style || 'btn-default' }}\"\r\n          type=\"button\"\r\n          ng-click=\"buttonClick($event,form)\"\r\n          ng-disabled=\"form.readonly\"\r\n          ng-if=\"form.type !== 'submit'\">\r\n      <span ng-if=\"form.icon\" class=\"{{form.icon}}\"></span>\r\n      {{form.title}}\r\n  </button>\r\n</div>\r\n";
	window.angular.module('ng').run(['$templateCache', function(c) { c.put(path, html) }]);
	module.exports = path;

/***/ },
/* 15 */
/***/ function(module, exports) {

	var path = 'bootstrap/tabarray.html';
	var html = "<div ng-init=\"selected = { tab: 0 }\"\r\n     ng-model=\"modelArray\" schema-validate=\"form\"\r\n     sf-field-model=\"sf-new-array\"\r\n     sf-new-array\r\n     class=\"clearfix schema-form-tabarray schema-form-tabarray-{{form.tabType || 'left'}} {{::form.htmlClass}}\">\r\n  <div ng-if=\"!form.tabType || form.tabType !== 'right'\"\r\n       ng-class=\"{'col-xs-3': !form.tabType || form.tabType === 'left'}\">\r\n    <ol class=\"nav nav-tabs\"\r\n        ng-class=\"{ 'tabs-left': !form.tabType || form.tabType === 'left'}\"\r\n        sf-field-model ui-sortable=\"form.sortOptions\">\r\n      <li sf-field-model=\"ng-repeat\"\r\n          ng-repeat=\"item in $$value$$ track by $index\"\r\n          ng-click=\"$event.preventDefault() || (selected.tab = $index)\"\r\n          ng-class=\"{active: selected.tab === $index}\">\r\n          <a href=\"#\">{{interp(form.title,{'$index':$index, value: item}) || $index}}</a>\r\n      </li>\r\n      <li ng-hide=\"form.readonly || form.add === null\"\r\n          ng-disabled=\"form.schema.maxItems <= modelArray.length\"\r\n          ng-click=\"$event.preventDefault() || (selected.tab = appendToArray().length - 1)\">\r\n        <a href=\"#\">\r\n          <i class=\"glyphicon glyphicon-plus\"></i>\r\n          {{ form.add || 'Add'}}\r\n          </a>\r\n      </li>\r\n    </ol>\r\n  </div>\r\n\r\n  <div ng-class=\"{'col-xs-9': !form.tabType || form.tabType === 'left' || form.tabType === 'right'}\">\r\n    <div class=\"tab-content {{::form.fieldHtmlClass}}\">\r\n      <div class=\"tab-pane clearfix tab{{selected.tab}} index{{$index}}\"\r\n           sf-field-model=\"ng-repeat\"\r\n           ng-repeat=\"item in $$value$$ track by $index\"\r\n           ng-show=\"selected.tab === $index\"\r\n           ng-class=\"{active: selected.tab === $index}\">\r\n\r\n           <div schema-form-array-items sf-key-controller sf-parent-key=\"[{{form.key.join('][')}}]\" sf-index=\"{{$index}}\"></div>\r\n\r\n           <button ng-hide=\"form.readonly || form.remove === null\"\r\n                   ng-click=\"selected.tab = deleteFromArray($index).length - 1\"\r\n                   ng-disabled=\"form.schema.minItems >= modelArray.length\"\r\n                   type=\"button\"\r\n                   class=\"btn {{ form.style.remove || 'btn-default' }} pull-right\">\r\n             <i class=\"glyphicon glyphicon-trash\"></i>\r\n             {{ form.remove || 'Remove'}}\r\n           </button>\r\n      </div>\r\n      <div class=\"help-block\"\r\n           ng-show=\"(hasError() && errorMessage(schemaError())) || form.description\"\r\n           ng-bind-html=\"(hasError() && errorMessage(schemaError())) || form.description\"></div>\r\n      </div>\r\n    </div>\r\n  </div>\r\n\r\n  <div ng-if=\"form.tabType === 'right'\" class=\"col-xs-3\">\r\n    <ul class=\"nav nav-tabs tabs-right\">\r\n      <li  sf-field-model=\"ng-repeat\"\r\n          ng-repeat=\"item in $$value$$ track by $index\"\r\n          ng-click=\"$event.preventDefault() || (selected.tab = $index)\"\r\n          ng-class=\"{active: selected.tab === $index}\">\r\n          <a href=\"#\">{{interp(form.title,{'$index':$index, value: item}) || $index}}</a>\r\n      </li>\r\n      <li ng-hide=\"form.readonly || form.add === null\"\r\n          ng-disabled=\"form.schema.maxItems <= modelArray.length\"\r\n          ng-click=\"$event.preventDefault() || (selected.tab = appendToArray().length - 1)\">\r\n        <a href=\"#\">\r\n          <i class=\"glyphicon glyphicon-plus\"></i>\r\n          {{ form.add || 'Add'}}\r\n          </a>\r\n      </li>\r\n    </ul>\r\n  </div>\r\n\r\n</div>\r\n";
	window.angular.module('ng').run(['$templateCache', function(c) { c.put(path, html) }]);
	module.exports = path;

/***/ },
/* 16 */
/***/ function(module, exports) {

	var path = 'bootstrap/tabs.html';
	var html = "<div ng-init=\"selected = { tab: 0 }\" class=\"schema-form-tabs {{::form.htmlClass}}\">\r\n  <ul class=\"nav nav-tabs\">\r\n    <li ng-repeat=\"tab in form.tabs\"\r\n        ng-disabled=\"form.readonly\"\r\n        ng-click=\"$event.preventDefault() || (selected.tab = $index)\"\r\n        ng-class=\"{active: selected.tab === $index}\">\r\n        <a href=\"#\">{{ tab.title }}</a>\r\n    </li>\r\n  </ul>\r\n\r\n  <div class=\"tab-content {{::form.fieldHtmlClass}}\">\r\n  </div>\r\n</div>\r\n";
	window.angular.module('ng').run(['$templateCache', function(c) { c.put(path, html) }]);
	module.exports = path;

/***/ },
/* 17 */
/***/ function(module, exports) {

	var path = 'bootstrap/textarea.html';
	var html = "<div class=\"form-group has-feedback {{::form.htmlClass}} schema-form-textarea\" ng-class=\"{'has-error': form.disableErrorState !== true && hasError(), 'has-success': form.disableSuccessState !== true &&  hasSuccess()}\">\r\n  <label class=\"control-label {{::form.labelHtmlClass}}\" ng-class=\"{'sr-only': !showTitle()}\" for=\"{{form.key.slice(-1)[0]}}\">{{form.title}}</label>\r\n\r\n  <textarea ng-if=\"!form.fieldAddonLeft && !form.fieldAddonRight\"\r\n            class=\"form-control {{::form.fieldHtmlClass}}\"\r\n            id=\"{{form.key.slice(-1)[0]}}\"\r\n            sf-changed=\"form\"\r\n            ng-attr-placeholder=\"{{::form.placeholder}}\"\r\n            ng-disabled=\"form.readonly\"\r\n            sf-field-model\r\n            schema-validate=\"form\"\r\n            name=\"{{form.key.slice(-1)[0]}}\"></textarea>\r\n\r\n  <div ng-if=\"form.fieldAddonLeft || form.fieldAddonRight\"\r\n       ng-class=\"{'input-group': (form.fieldAddonLeft || form.fieldAddonRight)}\">\r\n    <span ng-if=\"form.fieldAddonLeft\"\r\n          class=\"input-group-addon\"\r\n          ng-bind-html=\"form.fieldAddonLeft\"></span>\r\n    <textarea class=\"form-control {{::form.fieldHtmlClass}}\"\r\n              id=\"{{form.key.slice(-1)[0]}}\"\r\n              sf-changed=\"form\"\r\n              ng-attr-placeholder=\"{{::form.placeholder}}\"\r\n              ng-disabled=\"form.readonly\"\r\n              sf-field-model\r\n              schema-validate=\"form\"\r\n              name=\"{{form.key.slice(-1)[0]}}\"></textarea>\r\n    <span ng-if=\"form.fieldAddonRight\"\r\n          class=\"input-group-addon\"\r\n          ng-bind-html=\"form.fieldAddonRight\"></span>\r\n  </div>\r\n\r\n  <span class=\"help-block\" sf-message=\"form.description\"></span>\r\n</div>\r\n";
	window.angular.module('ng').run(['$templateCache', function(c) { c.put(path, html) }]);
	module.exports = path;

/***/ }
/******/ ])
});
;