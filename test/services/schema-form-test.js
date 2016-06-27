chai.should();

describe('schemaForm', function() {
  beforeEach(module('schemaForm'));

  describe('#defaults()', function() {
    it('should generate default form def from a schema',function(){
      inject(function(schemaForm){
        var schema = {
          "type": "object",
          "properties": {
            "name": {
              "title": "Name",
              "description": "Gimme yea name lad",
              "type": "string"
            },
            "gender": {
              "title": "Choose",
              "type": "string",
              "enum": [
                "undefined",
                "null",
                "NaN",
              ]
            },
            "overEighteen": {
              "title": "Are you over 18 years old?",
              "type": "boolean",
              "default": false
            },
            "attributes": {
              "type": "object",
              "required": ['eyecolor'],
              "properties": {
                "eyecolor": { "type": "string", "title": "Eye color" },
                "haircolor": { "type": "string", "title": "Hair color" },
                "shoulders": {
                  "type": "object",
                  "title": "Shoulders",
                  "properties": {
                    "left": { "type": "string" },
                    "right": { "type": "string" },
                  }
                }
              }
            }
          }
        };

        var form = [
          {
            "title": "Name",
            "description": "Gimme yea name lad",
            "schema": {
              "title": "Name",
              "description": "Gimme yea name lad",
              "type": "string"
            },
            "ngModelOptions": {},
            "key": [
              "name"
            ],
            "type": "text"
          },
          {
            "title": "Choose",
            "schema": {
              "title": "Choose",
              "type": "string",
              "enum": [
                "undefined",
                "null",
                "NaN"
              ]
            },
            "ngModelOptions": {},
            "key": [
              "gender"
            ],
            "type": "select",
            "titleMap": [
              {
                "name": "undefined",
                "value": "undefined"
              },
              {
                "name": "null",
                "value": "null"
              },
              {
                "name": "NaN",
                "value": "NaN"
              }
            ]
          },
          {
            "title": "Are you over 18 years old?",
            "schema": {
              "title": "Are you over 18 years old?",
              "type": "boolean",
              "default": false
            },
            "ngModelOptions": {},
            "key": [
              "overEighteen"
            ],
            "type": "checkbox"
          },
          {
            "title": "attributes",
            "schema": {
              "type": "object",
              "required": [
                "eyecolor"
              ],
              "properties": {
                "eyecolor": {
                  "type": "string",
                  "title": "Eye color"
                },
                "haircolor": {
                  "type": "string",
                  "title": "Hair color"
                },
                "shoulders": {
                  "type": "object",
                  "title": "Shoulders",
                  "properties": {
                    "left": {
                      "type": "string"
                    },
                    "right": {
                      "type": "string"
                    }
                  }
                }
              }
            },
            "ngModelOptions": {},
            "type": "fieldset",
            "key": [
              "attributes"
            ],
            "items": [
              {
                "title": "Eye color",
                "required": true,
                "schema": {
                  "type": "string",
                  "title": "Eye color"
                },
                "ngModelOptions": {},
                "key": [
                  "attributes",
                  "eyecolor"
                ],
                "type": "text"
              },
              {
                "title": "Hair color",
                "schema": {
                  "type": "string",
                  "title": "Hair color"
                },
                "ngModelOptions": {},
                "key": [
                  "attributes",
                  "haircolor"
                ],
                "type": "text"
              },
              {
                "title": "Shoulders",
                "schema": {
                  "type": "object",
                  "title": "Shoulders",
                  "properties": {
                    "left": {
                      "type": "string"
                    },
                    "right": {
                      "type": "string"
                    }
                  }
                },
                "ngModelOptions": {},
                "type": "fieldset",
                "key": [
                  "attributes",
                  "shoulders"
                ],
                "items": [
                  {
                    "title": "left",
                    "schema": {
                      "type": "string"
                    },
                    "ngModelOptions": {},
                    "key": [
                      "attributes",
                      "shoulders",
                      "left"
                    ],
                    "type": "text"
                  },
                  {
                    "title": "right",
                    "schema": {
                      "type": "string"
                    },
                    "ngModelOptions": {},
                    "key": [
                      "attributes",
                      "shoulders",
                      "right"
                    ],
                    "type": "text"
                  }
                ]
              }
            ]
          }
        ];

        var f = schemaForm.defaults(schema);
        f.form.should.be.deep.equal(form);
      });
    });

    it('should handle global defaults',function(){
      inject(function(schemaForm){

        var schema = {
          "type": "object",
          "properties": {
            "name": {
              "title": "Name",
              "description": "Gimme yea name lad",
              "type": "string"
            }
          }
        };

        var form = [
          {
            "title": "Name",
            "description": "Gimme yea name lad",
            "schema": {
              "title": "Name",
              "description": "Gimme yea name lad",
              "type": "string"
            },
            "ngModelOptions": { "updateOn": "blur"},
            "foo": "bar",
            "key": [
              "name"
            ],
            "type": "text"
          }
        ];

        var f = schemaForm.defaults(schema,{},{ formDefaults: { foo: "bar", ngModelOptions: { updateOn: 'blur' }}});
        f.form.should.be.deep.equal(form);
      });
    });

    it('should handle x-schema-form defaults',function(){
      inject(function(schemaForm){

        var schema = {
          "type": "object",
          "properties": {
            "name": {
              "title": "Name",
              "description": "Gimme yea name lad",
              "type": "string",
              "x-schema-form": {
                "type": "textarea"
              }
            }
          }
        };



        var f = schemaForm.defaults(schema,{});
        f.form[0].type.should.be.eq('textarea');
      });
    });

    it('should ignore parts of schema in ignore list',function(){
      inject(function(schemaForm){

        var schema = {
          "type": "object",
          "properties": {
            "name": {
              "title": "Name",
              "description": "Gimme yea name lad",
              "type": "string"
            },
            "gender": {
              "title": "Choose",
              "type": "string",
              "enum": [
                "undefined",
                "null",
                "NaN",
              ]
            }
          }
        };

        //no form is implicitly ['*']
        var defaults = schemaForm.defaults(schema).form;
        schemaForm.merge(schema,["*"],{gender:true}).should.be.deep.equal([defaults[0]]);
      });
    });
  });

  describe('#appendRule() and #prependRule()', function() {
    it('should extend with new defaults',function(){
      module(function(schemaFormProvider){
        schemaFormProvider.prependRule('string',function(name,schema,options){
          if (schema.format === 'foobar') {
            var f = schemaFormProvider.createStandardForm(name,schema,options);
            f.type = 'foobar';
            return f;
          }
        });

        schemaFormProvider.appendRule('string',function(name,schema,options){
          var f = schemaFormProvider.createStandardForm(name,schema,options);
          f.type = 'notused';
          return f;
        });
      });

      inject(function(schemaForm){

        var schema = {
          "type": "object",
          "properties": {
            "name": {
              "title": "Name",
              "format": "foobar",
              "description": "Gimme yea name lad",
              "type": "string"
            },
            "gender": {
              "title": "Choose",
              "type": "string",
              "enum": [
                "undefined",
                "null",
                "NaN",
              ]
            }
          }
        };

        //no form is implicitly ['*']
        var defaults = schemaForm.defaults(schema).form;
        defaults[0].type.should.be.equal('foobar');
        defaults[0].title.should.be.equal('Name');
        defaults[1].type.should.be.equal('select');
        defaults[1].title.should.be.equal('Choose');

      });
    });
  });

  describe('#postProcess()', function() {
    it('should be enable post-processing of forms',function(){
      module(function(schemaFormProvider){
        schemaFormProvider.postProcess(function(form){
          form.postProcess = true;
          form.length.should.be.eq(1);
          form[0].title.should.be.eq('Name');
          return form;
        });

      });

      inject(function(schemaForm){

        var schema = {
          "type": "object",
          "properties": {
            "name": {
              "title": "Name",
              "format": "foobar",
              "description": "Gimme yea name lad",
              "type": "string"
            }
          }
        };

        var form = schemaForm.merge(schema,["name"]);
        form.postProcess.should.be.true;

      });
    });
  });

  describe('#merge()', function() {
    it('should merge schema and form def',function(){
      inject(function(schemaForm){
        var schema = {
          "type": "object",
          "properties": {
            "name": {
              "title": "Name",
              "description": "Gimme yea name lad",
              "type": "string"
            },
            "gender": {
              "title": "Choose",
              "type": "string",
              "enum": [
                "undefined",
                "null",
                "NaN",
              ]
            }
          }
        };

        //no form is implicitly ['*']
        var defaults = schemaForm.defaults(schema).form;
        schemaForm.merge(schema).should.be.deep.equal(defaults);
        schemaForm.merge(schema,['*']).should.be.deep.equal(defaults);
        schemaForm.merge(schema,['*',{type:'fieldset'}]).should.be.deep.equal(defaults.concat([{type:'fieldset'}]));

        //simple form
        schemaForm.merge(schema,['gender']).should.be.deep.equal([defaults[1]]);
        schemaForm.merge(schema,['gender','name']).should.be.deep.equal([defaults[1],defaults[0]]);

        //change it up
        var f = angular.copy(defaults[0]);
        f.title = 'Foobar';
        f.type  = 'password';
        schemaForm.merge(schema,[{ key: 'name',title: 'Foobar',type: 'password'}]).should.be.deep.equal([f]);

      });
    });

    it('should translate "readOnly" in schema to "readonly" on the merged form defintion',function(){
      inject(function(schemaForm){
        var schema = {
          "type": "object",
          "properties": {
            "name": {
              "title": "Name",
              "description": "Gimme yea name lad",
              "type": "string"
            },
            "gender": {
              "readOnly": true,
              "title": "Choose",
              "type": "string",
              "enum": [
                "undefined",
                "null",
                "NaN",
              ]
            }
          }
        };

        var merged = schemaForm.merge(schema, ['gender']);
        merged[0].should.have.property('readonly');
        merged[0].readonly.should.eq(true)
      });
    });

    it('should push readOnly in schema down into objects and arrays', function() {
      inject(function(schemaForm) {
        var schema = {
          'type': 'object',
          'readOnly': true,
          'properties': {
            'sub': {
              'type': 'object',
              'properties': {
                'array': {
                  'type': 'array',
                  'items': {
                    'type': 'object',
                    'properties': {
                      'foo': {
                        'type': 'string'
                      }
                    }
                  }
                }
              }
            }
          }
        };

        var merged = schemaForm.merge(schema, ['*']);

        //sub
        merged[0].should.have.property('readonly');
        merged[0].readonly.should.eq(true);

        //array
        merged[0].items[0].should.have.property('readonly');
        merged[0].items[0].readonly.should.eq(true);

        //array items
        merged[0].items[0].items[0].should.have.property('readonly');
        merged[0].items[0].items[0].readonly.should.eq(true);

      });
    });

    it('should push readonly in form def down into objects and arrays', function() {
      inject(function(schemaForm) {
        var schema = {
          'type': 'object',
          'properties': {
            'sub': {
              'type': 'object',
              'properties': {
                'array': {
                  'type': 'array',
                  'items': {
                    'type': 'object',
                    'properties': {
                      'foo': {
                        'type': 'string'
                      }
                    }
                  }
                }
              }
            }
          }
        };

        var merged = schemaForm.merge(schema, [{key: 'sub', readonly: true}]);

        //sub
        merged[0].should.have.property('readonly');
        merged[0].readonly.should.eq(true);

        //array
        merged[0].items[0].should.have.property('readonly');
        merged[0].items[0].readonly.should.eq(true);

        //array items
        merged[0].items[0].items[0].should.have.property('readonly');
        merged[0].items[0].items[0].readonly.should.eq(true);

      });
    });
  });
});
