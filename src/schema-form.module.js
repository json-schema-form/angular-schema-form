import * as JSONSchemaFormCore from 'json-schema-form-core';
import angular from 'angular';

// ./services/
import sfBuilderProvider from './services/sf-builder.provider';
import schemaFormDecoratorsProvider from './services/schema-form-decorators.provider';
import schemaFormProvider from './services/schema-form.provider';
import sfErrorMessageProvider from './services/sf-error-message.provider';
import sfPathProvider from './services/sf-path.provider';
// ./directives/
import sfChangedDirective from './directives/sf-changed.directive';
import sfFieldDirective from './directives/sf-field.directive';
import sfMessageDirective from './directives/sf-message.directive';
import sfArrayDirective from './directives/sf-array.directive';
import sfKeyDirective from './directives/sf-key.directive';
import sfSchemaDirective from './directives/sf-schema.directive';
import schemaValidateDirective from './directives/schema-validate.directive';

// Deps is sort of a problem for us, maybe in the future we will ask the user to depend
// on modules for add-ons
const deps = [];

try {
  // This throws an expection if module does not exist.
  angular.module('ngSanitize');
  deps.push('ngSanitize');
}
catch (e) {}

try {
  // This throws an expection if module does not exist.
  angular.module('ui.sortable');
  deps.push('ui.sortable');
}
catch (e) {}

try {
  // This throws an expection if module does not exist.
  angular.module('angularSpectrumColorpicker');
  deps.push('angularSpectrumColorpicker');
}
catch (e) {}

angular
.module('schemaForm', deps)

// Providers and services
.provider('sfPath', sfPathProvider)
.provider('sfBuilder', [ 'sfPathProvider', sfBuilderProvider ])
.provider('schemaFormDecorators', [ '$compileProvider', 'sfPathProvider', schemaFormDecoratorsProvider ])
.provider('sfErrorMessage', sfErrorMessageProvider)
.provider('schemaForm', [ 'sfPathProvider', schemaFormProvider ])
.factory('sfSelect', () => JSONSchemaFormCore.select)
.factory('sfValidator', () => JSONSchemaFormCore.validate)

// Directives
.directive('sfChanged', sfChangedDirective)
.directive('sfField', [ '$parse', '$compile', '$interpolate', 'sfErrorMessage', 'sfPath', 'sfSelect', sfFieldDirective ])
.directive('sfMessage', [ '$injector', 'sfErrorMessage', sfMessageDirective ])
.directive('sfNewArray', [ 'sfSelect', 'sfPath', 'schemaForm', sfArrayDirective ])
.directive('sfSchema', [ '$compile', '$http', '$templateCache', '$q',
                         'schemaForm', 'schemaFormDecorators', 'sfSelect', 'sfBuilder', sfSchemaDirective ])
.directive('schemaValidate', [ 'sfValidator', '$parse', 'sfSelect', '$interpolate', schemaValidateDirective ])
.directive('sfKeyController', [ 'sfPath', sfKeyDirective ]);
