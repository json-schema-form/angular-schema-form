import angular from 'angular';

import sfBuilder from './services/builder';
import decorators from './services/decorators';
import errors from './services/errors';
import schemaForm from './services/schemaForm';
import select from './services/select';
import sfPath from './services/sfPath';
import validator from './services/validator';

import array from './directives/array';
import changed from './directives/changed';
import field from './directives/field';
import message from './directives/message';
import newArray from './directives/newArray';
import schemaFormDirective from './directives/schemaForm';
import schemaValidate from './directives/schemaValidate';

// Deps is sort of a problem for us, maybe in the future we will ask the user to depend
// on modules for add-ons

const deps = [];
try {
  //This throws an expection if module does not exist.
  angular.module('ngSanitize');
  deps.push('ngSanitize');
} catch (e) {}

try {
  //This throws an expection if module does not exist.
  angular.module('ui.sortable');
  deps.push('ui.sortable');
} catch (e) {}

try {
  //This throws an expection if module does not exist.
  angular.module('angularSpectrumColorpicker');
  deps.push('angularSpectrumColorpicker');
} catch (e) {}

angular.module('schemaForm', deps)
// Providers and services
.provider('sfPath', sfPath)
.provider('sfBuilder', ['sfPathProvider', builder])
.provider('schemaFormDecorators', ['$compileProvider', 'sfPathProvider', decorators])
.provider('sfErrorMessage', errors)
.provider('schemaForm', ['sfPathProvider', schemaForm])
.factory('sfSelect', ['sfPath', select])
.factory('sfValidator', validator)

// Directives
.directive('sfArray', ['sfSelect', 'schemaForm', 'sfValidator', 'sfPath', array])
.directive('sfChanged', changed)
.directive('sfField', ['$parse', '$compile', '$http', '$templateCache', '$interpolate', '$q',
                       'sfErrorMessage','sfPath','sfSelect', field])
.directive('sfMessage', ['$injector', 'sfErrorMessage', message])
.directive('sfNewArray', ['sfSelect', 'sfPath', 'schemaForm', newArray])
.directive('sfSchema', ['$compile', '$http', '$templateCache', '$q', 'schemaForm',
                        'schemaFormDecorators', 'sfSelect', 'sfPath', 'sfBuilder',
                        schemaFormDirective])
.directive('schemaValidate', ['sfValidator', '$parse', 'sfSelect', schemaValidate]);
