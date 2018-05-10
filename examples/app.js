// @license magnet:?xt=urn:btih:d3d9a9a6595521f9666a5e94cc830dab83b65699&dn=expat.txt Expat
//
// To test the tinymce addon, uncomment the files above and inject 'tx-tinymce' below.
/* global alert */
var app = angular.module('test', ['schemaForm','ui.ace','tx-tinymce']);
app.config(['sfErrorMessageProvider', function(sfErrorMessageProvider) {
    sfErrorMessageProvider.setDefaultMessage(10001, 'Whoa! Can you double check that email address for me?');
}]);
app.controller('TestCtrl', function($scope, $http, $location) {
  // tv4.defineError('EMAIL', 10001, 'Invalid email address');
  // tv4.defineKeyword('email', function(data, value, schema) {
  //   if (schema.email) {
  //     if (/^\S+@\S+$/.test(data)) {
  //       return null;
  //     }
  //     return {
  //       code: 10001
  //     };
  //   }
  //   return null;
  // });

  $scope.tests = [
    { name: "JSON Ref", data: 'data/jsonref.json' },
    { name: "Simple", data: 'data/simple.json' },
    { name: "Basic JSON Schema Type", data: 'data/types.json' },
    { name: "Bootstrap Grid", data: 'data/grid.json' },
    { name: "Complex Key Support", data: 'data/complex-keys.json' },
    { name: "Array", data: 'data/array.json' },
    { name: "Array of types", data: 'data/array-of-types.json' },
    { name: "Tab Array", data: 'data/tabarray.json' },
    { name: "Deep Array", data: 'data/deep-array.json' },
    // { name: "Array Radio-Buttons", data: 'data/array-radiobuttons.json' },
    { name: "TitleMap Examples", data: 'data/titlemaps.json' },
    { name: "Kitchen Sink", data: 'data/sink.json' },
    { name: "Calculate", data: 'data/calculate.json' },
    { name: "Custom Error", data: 'data/custom-error.json' },
    { name: "Hack: Conditional required", data: 'data/conditional-required.json' }
  ];

  $scope.navbarMode = 'default';

  // Load data from gist.
  if (window.location.hash.length > 4) {
    $scope.navbarMode = 'loaded';
    var gistId = window.location.hash.replace(/[\!\#\/]*/g, '');
    $scope.loading = true;
    $http.get('https://api.github.com/gists/' + gistId)
      .then(function(response) {
        $scope.error = null;
        $scope.tests.unshift({name: 'Gist'});
        $scope.selectedTest = $scope.tests[0];
        $scope.loadedData = {
          created: moment(response.data.created_at).fromNow(),
          user: response.data.user !== null ? response.data.user.login : 'Anonymous'
        }
        $scope.loading = false;
        $scope.schemaJson = response.data.files['schema.json'].content;
        $scope.formJson   = response.data.files['form.json'].content;
        $scope.modelData  = JSON.parse(response.data.files['model.json'].content);
      },
      function() {
        $scope.loadedData = 'dummy';
        $scope.error = 'Failed to load gist.';
        $scope.selectedTest = $scope.tests[0];
      }
    );
  } else {
    $scope.selectedTest = $scope.tests[0];
  }

  $scope.$watch('selectedTest',function(val){
    if (val && val.data !== undefined) {
      $http.get(val.data).then(function(res) {setNewData(res.data);});
    }
  });

  $scope.decorator = 'bootstrap-decorator';

  $scope.itParses     = true;
  $scope.itParsesForm = true;


  $scope.$watch('schemaJson',function(val,old){
    if (val && val !== old) {
      try {
        $scope.schema = JSON.parse($scope.schemaJson);
        $scope.itParses = true;
      } catch (e){
        $scope.itParses = false;
      }
    }
  });

  $scope.$watch('formJson',function(val,old){
    if (val && val !== old) {
      try {
        $scope.form = JSON.parse($scope.formJson);
        $scope.itParsesForm = true;
      } catch (e){
        $scope.itParsesForm = false;
      }
    }
  });

  var setNewData = function(data) {
    $scope.schema = data.schema;
    $scope.form   = data.form;
    $scope.schemaJson = JSON.stringify($scope.schema,undefined,2);
    $scope.formJson   = JSON.stringify($scope.form,undefined,2);
    $scope.modelData = data.model || {};
  };

  $scope.pretty = function(){
    return typeof $scope.modelData === 'string' ? $scope.modelData : angular.toJson($scope.modelData);
  };

  $scope.log = function(msg){
    console.log("Simon says",msg);
  };

  $scope.sayNo = function() {
    alert('Noooooooo');
  };

  $scope.say = function(msg) {
    alert(msg);
  };

  $scope.save = function() {
    // To be able to save invalid json and point out errors, we
    // don't save the schema/form but rather the ones in the input.

    $scope.navbarMode = 'saved';

    var gist = {
      "description": "A saved configuration for a schema form example, http://textalk.github.io/angular-schema-form/examples/bootstrap-example.html",
      "public": true,
      "files": {
        "schema.json": {
          "content": $scope.schemaJson
        },
        "form.json": {
          "content": $scope.formJson
        },
        "model.json": {
          "content": JSON.stringify($scope.modelData, undefined, 2)
        }
      }
    };

    $http.post('https://api.github.com/gists', gist)
      .then(function(response) {
        $scope.error = null;
        //$location.hash(response.data.id);
        window.location.hash = response.data.id;
        window.location.hash = response.data.id;
        $scope.savedGistData = {
          data: response.data,
          url: $location.absUrl()
        };
      },
      function() {
        $scope.error = 'Failed to save gist.';
      }
    );
  };

  $scope.submitForm = function(form) {
    // First we broadcast an event so all fields validate themselves
    $scope.$broadcast('schemaFormValidate');
    // Then we check if the form is valid
    if (form.$valid) {
      alert('You did it!');
    }
  };

});
// @license-end