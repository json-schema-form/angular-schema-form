Angular Schema Form
===================

Generate forms from a JSON schema, with AngularJS!

Schema Form is a set of AngularJS directives (and a service..) that can create a form directly from a json schema
definition and also validate against that schema. The defaults may be fine for a lot cases, but you can also 
customize it, changing order and type of fields.


Schema Form is inspired by the nice [JSON Form](https://github.com/joshfire/jsonform) library and aims to be roughly
compatible with it, especially it's form defintion. What sets Schema Form apart from JSON Form is that Schema Form
aims to be deeply integrated with AngularJS, i.e. to use the standard AngularJS way of handling forms. It also uses
[tv4](https://github.com/geraintluff/tv4) for validation which means its compatible with version 4 of the json schema
standard. Schema Form, as a default, generates bootstrap 3 friendly HTML. 

Another thing that sets Schema Form apart is that it, at the moment, doesn't implement half of what JSON Form 
does, nor have any documentation! Which of course we hope to remedy soon.


Try out the [example](http://textalk.github.io/angular-schema-form/src/bootstrap-example.html) where you can edit
the schema or the form definition and see what comes out!


Basic Usage
-----------

```html
<form sf-schema="schema" sf-form="form" sf-model="data"></form>
```

```javascript
function FormController($scope) {
  $scope.schema = {
    type: "object",
    properties: {
      name: { type: "string", minLength: 2, title: "Name", description: "Name or alias" },
      title: { 
        type: "string",
        enum: ['dr','jr','sir','mrs','mr','NaN','dj']
    }
  };
  
  
  $scope.form = [
    "*",
    { 
      type: "submit",
      title: "Save",
    }
  ];
  
  $scope.data = {};
}
```




