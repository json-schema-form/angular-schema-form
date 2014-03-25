/* jshint expr: true */
chai.should();

describe('Schema form',function(){
  beforeEach(module('templates'));
  beforeEach(module('schemaForm'));

  describe('directive',function(){

    var exampleSchema = {
      "type": "object",
      "properties": {
        "name": {
          "title": "Name",
          "description": "Gimme yea name lad",
          "type": "string"
        },
        "gender": {
          "title": "Choose:",
          "type": "string",
          "enum": [
            "undefined",
            "null",
            "NaN",
          ]
        }
      }
    };


    it('should generate html and compile it',function(){

      inject(function($compile,$rootScope){
        var scope = $rootScope.$new();
        scope.person = {};

        scope.schema = exampleSchema;

        scope.form = ["*"];

        var tmpl = angular.element('<form sf-schema="schema" sf-form="form" sf-model="person"></form>');

        $compile(tmpl)(scope);
        $rootScope.$apply();

        tmpl.children().length.should.be.equal(2);
        tmpl.children().eq(0).is('div.form-group').should.be.true;
        tmpl.children().eq(0).find('input').is('input[type="text"]').should.be.true;
        tmpl.children().eq(0).find('input').attr('ng-model').should.be.equal('model.name');
        tmpl.children().eq(1).is('div.form-group').should.be.true;
        tmpl.children().eq(1).children('select').length.should.equal(1);

      });
    });

    it('should generate html and compile it, deep structure',function(){

      inject(function($compile,$rootScope){
        var scope = $rootScope.$new();
        scope.person = {};

        scope.schema =  {
          "type": "object",
          "properties": {
            "name": {
              "title": "Name",
              "description": "Gimme yea name lad",
              "type": "string"
            },
            "ianal": {
              "type": "boolean",
              "title":'IANAL'
            },
            "age": {
              "type": "integer",
              "title":'Age',
              "minimum": 0
            },
            "sum": {
              "type": "number",
              "title": "summa"
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
            "attributes": {
              "type": "object",
              "title": "Attributes",
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

        scope.form = ["*"];

        var tmpl = angular.element('<form sf-schema="schema" sf-form="form" sf-model="person" sf-decorator="bootstrap-decorator"></form>');

        $compile(tmpl)(scope);
        $rootScope.$apply();

        tmpl.children().length.should.be.equal(6);
        tmpl.children().eq(0).is('div.form-group').should.be.true;
        tmpl.children().eq(0).find('input').is('input[type="text"]').should.be.true;
        tmpl.children().eq(0).find('input').attr('ng-model').should.be.equal('model.name');

        tmpl.children().eq(1).is('div.checkbox').should.be.true;
        tmpl.children().eq(1).find('input[type="checkbox"]').length.should.be.eq(1);

        tmpl.children().eq(2).is('div.form-group').should.be.true;
        tmpl.children().eq(2).find('input[type="number"]').length.should.be.eq(1);

        tmpl.children().eq(3).is('div.form-group').should.be.true;
        tmpl.children().eq(3).find('input[type="number"]').length.should.be.eq(1);

        tmpl.children().eq(4).is('div.form-group').should.be.true;
        tmpl.children().eq(4).find('select').length.should.be.eq(1);

        tmpl.children().eq(5).is('fieldset').should.be.true;
        tmpl.children().eq(5).children().eq(0).is('legend').should.be.true;
        tmpl.children().eq(5).children().eq(3).is('fieldset').should.be.true;
        tmpl.children().eq(5).children().eq(3).children().length.should.be.eq(3);
        tmpl.children().eq(5).children().eq(3).find('input[ng-model="model.attributes.shoulders.left"]').length.should.be.eq(1);
        tmpl.children().eq(5).children().eq(3).find('input[ng-model="model.attributes.shoulders.right"]').length.should.be.eq(1);

      });
    });


    it('should generate html and compile it, leaving existing inputs intact',function(){

      inject(function($compile,$rootScope){
        var scope = $rootScope.$new();
        scope.person = {};

        scope.schema = exampleSchema;

        scope.form = ["*"];

        var tmpl = angular.element('<form sf-schema="schema" sf-form="form" sf-model="person"><input type="text" ng-model="person.name" value="OMG"></form>');

        $compile(tmpl)(scope);
        $rootScope.$apply();

        tmpl.children().length.should.be.equal(2);
        tmpl.children().eq(0).is('input[type="text"]').should.be.true;
        tmpl.children().eq(0).attr('ng-model').should.be.equal('person.name');
        tmpl.children().eq(1).is('div.form-group').should.be.true;
        tmpl.children().eq(1).children('select').length.should.equal(1);

      });
    });

    it('should handle submit buttons',function(){

      inject(function($compile,$rootScope){
        var scope = $rootScope.$new();
        scope.obj = {};

        scope.schema = exampleSchema;

        //just a button
        scope.form = [{ type: 'submit',title: 'Okidoki'}];
        var tmpl = angular.element('<form sf-schema="schema" sf-form="form" sf-model="obj"></form>');
        $compile(tmpl)(scope);
        $rootScope.$apply();

        tmpl.children().length.should.be.equal(1);
        tmpl.find('input').is('input[type=submit]').should.be.true;
        tmpl.find('input').val().should.be.equal('Okidoki');

        //with the rest of the schema
        scope.form = ["*",{ type: 'submit',title: 'Okidoki'}];

        tmpl = angular.element('<form sf-schema="schema" sf-form="form" sf-model="obj"></form>');

        $compile(tmpl)(scope);
        $rootScope.$apply();
        tmpl.children().length.should.be.equal(3);
        tmpl.children().eq(0).is('div.form-group').should.be.true;
        tmpl.children().eq(0).find('input').is('input[type="text"]').should.be.true;
        tmpl.children().eq(1).is('div.form-group').should.be.true;
        tmpl.children().eq(1).children('select').length.should.equal(1);
        tmpl.children().eq(2).find('input').is('input[type=submit]').should.be.true;
        tmpl.children().eq(2).find('input').val().should.be.equal('Okidoki');

      });

    });

    it('should use disable readonly input fields, v3 style',function(){

      inject(function($compile,$rootScope){
        var scope = $rootScope.$new();
        scope.person = {};

        scope.schema = {
          "type": "object",
          "properties": {
            "name": { "type": "string", "readonly": true },
            "nick": { "type": "string" }
          }
        };

        scope.form = ["*"];

        var tmpl = angular.element('<form sf-schema="schema" sf-form="form" sf-model="person"></form>');

        $compile(tmpl)(scope);
        $rootScope.$apply();

        tmpl.children().length.should.be.equal(2);
        tmpl.children().eq(0).is('div.form-group').should.be.true;
        tmpl.children().eq(0).find('input').is('input[type="text"]').should.be.true;
        tmpl.children().eq(0).find('input').attr('disabled').should.be.equal('disabled');
        tmpl.children().eq(1).is('div.form-group').should.be.true;
        tmpl.children().eq(1).children('input').length.should.equal(1);
        expect(tmpl.children().eq(1).children('input').attr('disabled')).to.be.undefined;
      });
    });

    it('should use disable readonly input fields, v4 style',function(){

      inject(function($compile,$rootScope){
        var scope = $rootScope.$new();
        scope.person = {};

        scope.schema = {
          "type": "object",
          "properties": {
            "name": { "type": "string", "readOnly": true },
            "nick": { "type": "string" }
          }
        };

        scope.form = ["*"];

        var tmpl = angular.element('<form sf-schema="schema" sf-form="form" sf-model="person"></form>');

        $compile(tmpl)(scope);
        $rootScope.$apply();

        tmpl.children().length.should.be.equal(2);
        tmpl.children().eq(0).is('div.form-group').should.be.true;
        tmpl.children().eq(0).find('input').is('input[type="text"]').should.be.true;
        tmpl.children().eq(0).find('input').attr('disabled').should.be.equal('disabled');
        tmpl.children().eq(1).is('div.form-group').should.be.true;
        tmpl.children().eq(1).children('input').length.should.equal(1);
        expect(tmpl.children().eq(1).children('input').attr('disabled')).to.be.undefined;
      });
    });

    it('should use disable readonly input fields, form override',function(){

      inject(function($compile,$rootScope){
        var scope = $rootScope.$new();
        scope.person = {};

        scope.schema = {
          "type": "object",
          "properties": {
            "name": { "type": "string" },
            "nick": { "type": "string", "readOnly": true }
          }
        };

        scope.form = [
          { key: 'name', readonly: true },
          { key: 'nick', readonly: false },
        ];

        var tmpl = angular.element('<form sf-schema="schema" sf-form="form" sf-model="person"></form>');

        $compile(tmpl)(scope);
        $rootScope.$apply();

        tmpl.children().length.should.be.equal(2);
        tmpl.children().eq(0).is('div.form-group').should.be.true;
        tmpl.children().eq(0).find('input').is('input[type="text"]').should.be.true;
        tmpl.children().eq(0).find('input').attr('disabled').should.be.equal('disabled');
        tmpl.children().eq(1).is('div.form-group').should.be.true;
        tmpl.children().eq(1).children('input').length.should.equal(1);
        expect(tmpl.children().eq(1).children('input').attr('disabled')).to.be.undefined;
      });
    });


    it('should use ng-required on required fields',function(){

      inject(function($compile,$rootScope){
        var scope = $rootScope.$new();
        scope.person = {};

        scope.schema = {
          "type": "object",
          "required": ["name"],
          "properties": {
            "name": { "type": "string" },
            "nick": { "type": "string" }
          }
        };

        scope.form = ["*"];

        var tmpl = angular.element('<form sf-schema="schema" sf-form="form" sf-model="person"></form>');

        $compile(tmpl)(scope);
        $rootScope.$apply();

        tmpl.children().length.should.be.equal(2);
        tmpl.children().eq(0).is('div.form-group').should.be.true;
        tmpl.children().eq(0).find('input').is('input[type="text"]').should.be.true;
        tmpl.children().eq(0).find('input').attr('required').should.be.equal('required');
        tmpl.children().eq(0).find('input').attr('ng-model').should.be.equal('model.name');
        tmpl.children().eq(1).is('div.form-group').should.be.true;
        tmpl.children().eq(1).children('input').length.should.equal(1);
        expect(tmpl.children().eq(1).children('input').attr('required')).to.be.undefined;
      });
    });

    it('should use ng-required on required fields, json schema v3',function(){

      inject(function($compile,$rootScope){
        var scope = $rootScope.$new();
        scope.person = {};

        scope.schema = {
          "type": "object",
          "properties": {
            "name": { "type": "string", "required": true },
            "nick": { "type": "string" }
          }
        };

        scope.form = ["*"];

        var tmpl = angular.element('<form sf-schema="schema" sf-form="form" sf-model="person"></form>');

        $compile(tmpl)(scope);
        $rootScope.$apply();

        tmpl.children().length.should.be.equal(2);
        tmpl.children().eq(0).is('div.form-group').should.be.true;
        tmpl.children().eq(0).find('input').is('input[type="text"]').should.be.true;
        tmpl.children().eq(0).find('input').attr('required').should.be.equal('required');
        tmpl.children().eq(0).find('input').attr('ng-model').should.be.equal('model.name');
        tmpl.children().eq(1).is('div.form-group').should.be.true;
        tmpl.children().eq(1).children('input').length.should.equal(1);
        expect(tmpl.children().eq(1).children('input').attr('required')).to.be.undefined;
      });
    });

    it('should use ng-required on required fields, form override',function(){

      inject(function($compile,$rootScope){
        var scope = $rootScope.$new();
        scope.person = {};

        scope.schema = {
          "type": "object",
          "properties": {
            "name": { "type": "string" },
            "nick": { "type": "string", "required": true }
          }
        };

        scope.form = [
          { key: 'name', required: true },
          { key: 'nick', required: false },
        ];

        var tmpl = angular.element('<form sf-schema="schema" sf-form="form" sf-model="person"></form>');

        $compile(tmpl)(scope);
        $rootScope.$apply();

        tmpl.children().length.should.be.equal(2);
        tmpl.children().eq(0).is('div.form-group').should.be.true;
        tmpl.children().eq(0).find('input').is('input[type="text"]').should.be.true;
        tmpl.children().eq(0).find('input').attr('required').should.be.equal('required');
        tmpl.children().eq(0).find('input').attr('ng-model').should.be.equal('model.name');
        tmpl.children().eq(1).is('div.form-group').should.be.true;
        tmpl.children().eq(1).children('input').length.should.equal(1);
        expect(tmpl.children().eq(1).children('input').attr('required')).to.be.undefined;
      });
    });

    it('should honor defaults in schema',function(){

      inject(function($compile,$rootScope){
        var scope = $rootScope.$new();
        scope.person = {
          name: 'Foobar'
        };

        scope.schema = {
          "type": "object",
          "properties": {
            "name": {
              "type": "string",
              "default": "Bar"
            },
            "nick": {
              "type": "string",
              "default": "Zeb"
            },
            "alias": {
              "type": "string"
            },
          }
        };

        scope.form = ["*"];

        var tmpl = angular.element('<form sf-schema="schema" sf-form="form" sf-model="person"></form>');

        $compile(tmpl)(scope);
        $rootScope.$apply();

        scope.person.name.should.be.equal('Foobar');
        scope.person.nick.should.be.equal('Zeb');
        expect(scope.person.alias).to.be.undefined;

      });
    });



  });


  describe('decorator directive',function(){
    it('should decorate',function(){

      inject(function($compile,$rootScope){
        var scope = $rootScope.$new();
        scope.obj = {};

        var tmpl = angular.element('<schema-form-decorator title="foobar"><input type="text"></schema-form-decorator>');

        $compile(tmpl)(scope);
        $rootScope.$apply();

        tmpl.is('div.decorator').should.be.true;
        tmpl.children().length.should.be.eq(3);
        tmpl.find('input').length.should.be.eq(1);
        tmpl.find('.description').hasClass('ng-hide').should.be.true;

        tmpl = angular.element('<schema-form-decorator description="Hell yea!"><input type="text"></schema-form-decorator>');

        $compile(tmpl)(scope);
        $rootScope.$apply();

        tmpl.is('div.decorator').should.be.true;
        tmpl.children().length.should.be.eq(3);
        tmpl.find('input').length.should.be.eq(1);
        tmpl.find('.description').hasClass('ng-hide').should.be.false;
        tmpl.find('.description').text().should.be.equal('Hell yea!');

      });
    });

  });

  describe('service',function(){
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
            key: "name",
            type: "text",
            title: "Name",
            description: "Gimme yea name lad",
            schema: {
              "title": "Name",
              "description": "Gimme yea name lad",
              "type": "string"
            },
          },
          {
            title: 'Choose',
            key: "gender",
            type: "select",
            titleMap: {
              "undefined": "undefined",
              "null": "null",
              "NaN": "NaN"
            },
            schema: {
              "title": "Choose",
              "type": "string",
              "enum": [
                "undefined",
                "null",
                "NaN",
              ]
            }
          },
          {
              type: "fieldset",
              items: [
                { key: "attributes.eyecolor", required: true, type: 'text', title: "Eye color", schema: { "type": "string", "title": "Eye color" }},
                { key: "attributes.haircolor", type: 'text', title: "Hair color", schema: { "type": "string", "title": "Hair color" } },
                {
                  type: "fieldset",
                  title: "Shoulders",
                  items: [
                    { key: "attributes.shoulders.left",  type: 'text', schema:{ "type": "string" } },
                    { key: "attributes.shoulders.right", type: 'text', schema: { "type": "string" }},
                  ],
                  schema: {
                    "type": "object",
                    "title": "Shoulders",
                    "properties": {
                      "left": { "type": "string" },
                      "right": { "type": "string" },
                    }
                  }
                }
              ],
              schema: {
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

        ];
        var f = schemaForm.defaults(schema);
        f.form.should.be.deep.equal(form);

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


        var form = [
          "name",
          {
            title: 'Choose',
            key: "gender",
            type: "select",
            titleMap: {
              "undefined": "undefined",
              "null": "null",
              "NaN": "NaN"
            }
          }
        ];

      });
    });

  });
});



