/* jshint expr: true */
chai.should();

describe('Schema form',function(){

  describe('directive',function(){
    beforeEach(module('templates'));
    beforeEach(module('schemaForm'));
    beforeEach(
      //We don't need no sanitation. We don't need no though control.
      module(function($sceProvider){
        $sceProvider.enabled(false);
      })
    );



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

    it('should handle buttons',function(){

      inject(function($compile,$rootScope){
        var scope = $rootScope.$new();
        scope.obj = {};

        scope.schema = exampleSchema;

        scope.form = ["*",{ type: 'button',title: 'Okidoki', onClick: sinon.spy()}];

        var tmpl = angular.element('<form sf-schema="schema" sf-form="form" sf-model="obj"></form>');

        $compile(tmpl)(scope);
        $rootScope.$apply();

        tmpl.children().length.should.be.equal(3);
        tmpl.children().eq(0).is('div.form-group').should.be.true;
        tmpl.children().eq(0).find('input').is('input[type="text"]').should.be.true;
        tmpl.children().eq(1).is('div.form-group').should.be.true;
        tmpl.children().eq(1).children('select').length.should.equal(1);
        tmpl.children().eq(2).find('button').length.should.be.equal(1);
        tmpl.children().eq(2).find('button').text().should.be.equal('Okidoki');

        scope.form[1].onClick.should.not.have.beenCalled;
        tmpl.children().eq(2).find('button').click();
        scope.form[1].onClick.should.have.beenCalledOnce;
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

    it('should display custom validationMessages when specified',function(done){

      inject(function($compile,$rootScope){
        var scope = $rootScope.$new();
        scope.person = {};

        scope.schema = {
          "type": "object",
          "properties": {
            "name": {
              "type": "string",
              "pattern": "^[a-z]+",
              "validationMessage": "You are only allowed lower case letters in name."
            },
            "nick": {
              "type": "string",
              "pattern": "^[a-z]+",
            },
          }
        };

        scope.form = [
          "name",
          {
            key: 'nick',
            validationMessage: 'Foobar'
          }
        ];

        var tmpl = angular.element('<form name="theform" sf-schema="schema" sf-form="form" sf-model="person"></form>');

        $compile(tmpl)(scope);
        $rootScope.$apply();
        tmpl.find('input').each(function(){
          $(this).scope().ngModel.$setViewValue('AÖ');
        });

        var errors = tmpl.find('.help-block');

        //timeout so we can do a second $apply
        setTimeout(function(){
          $rootScope.$apply(); //this actually updates the view with error messages
          errors.eq(0).text().should.be.equal("You are only allowed lower case letters in name.");
          errors.eq(1).text().should.be.equal("Foobar");
          done();
        },0);

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

    it('should handle schema form defaults in deep structure',function(){

      inject(function($compile,$rootScope){
        var scope = $rootScope.$new();
        scope.person = {
          name: 'Foobar'
        };

        scope.schema = {
          "type": "object",
          "properties": {
            "props" : {
              "type": "object",
              "title": "Person",
              "properties": {
                "name": {
                  "type": "string",
                  "title": "Name"
                },
                "nick": {
                  "type": "string",
                  "title": "Nick"
                },
                "alias": {
                  "type": "string",
                  "title": "Alias"
                }
              }
            }
          }
        };

        //The form defines a fieldset for person, and changes the order of fields
        //but titles should come from the schema
        scope.form = [{
          type: 'fieldset',
          key:  'props',
          items: [
            'props.nick',
            'props.name',
            'props.alias'
          ]
        }];

        var tmpl = angular.element('<form sf-schema="schema" sf-form="form" sf-model="person"></form>');

        $compile(tmpl)(scope);
        $rootScope.$apply();

        tmpl.children().length.should.be.eq(1);
        var labels = tmpl.children().children().find('label');
        labels.eq(0).text().should.equal('Nick');
        labels.eq(1).text().should.equal('Name');
        labels.eq(2).text().should.equal('Alias');

      });
    });


    it('should skip title if form says "notitle"',function(){

      inject(function($compile,$rootScope){
        var scope = $rootScope.$new();
        scope.person = {};

        scope.schema = exampleSchema;

        scope.form = [{
          key: 'name',
          notitle: true
        },{
          key: 'gender',
          notitle: true
        }];

        var tmpl = angular.element('<form sf-schema="schema" sf-form="form" sf-model="person"></form>');

        $compile(tmpl)(scope);
        $rootScope.$apply();

        tmpl.children().length.should.be.equal(2);
        tmpl.children().eq(0).find('label').hasClass('ng-hide').should.be.true;
        tmpl.children().eq(1).find('label').hasClass('ng-hide').should.be.true;
      });
    });


    it('should generate checkboxes for arrays with enums',function(){

      inject(function($compile,$rootScope){
        var scope = $rootScope.$new();
        scope.person = {};

        scope.schema = {
          "type": "object",
          "properties": {
            "names": {
              "type": "array",
              "items": {
                "type": "string",
                "enum": ["foo","bar"]
              }
            }          }
        };

        scope.form = [
          "names",
          { key: "foobars", type: "checkboxes", titleMap:{ 'foo':'Foo','bar':'Bar'}}
        ];

        var tmpl = angular.element('<form sf-schema="schema" sf-form="form" sf-model="person"></form>');

        $compile(tmpl)(scope);
        $rootScope.$apply();

        //TODO: more asserts
        tmpl.children().length.should.be.equal(2);
        tmpl.children().eq(0).find('input[type=checkbox]').length.should.be.eq(2);
      });
    });

    it('should use radio buttons when they are wanted',function(){

      inject(function($compile,$rootScope){
        var scope = $rootScope.$new();
        scope.person = {};

        scope.schema = {
          "type": "object",
          "properties": {
            "names": {
              "type": "string",
              "enum": ["one","two"]
            },
            "opts": {
              "type": "string",
              "enum": ["one","two"]
            },
          }
        };

        scope.form = [
          { key: "names", type: "radios",titleMap: { one: "One", two: "The rest" }},
          { key: "opts", type: "radiobuttons",titleMap: { one: "One", two: "The rest" }}
        ];

        var tmpl = angular.element('<form sf-schema="schema" sf-form="form" sf-model="person"></form>');

        $compile(tmpl)(scope);
        $rootScope.$apply();
        //TODO: more asserts

        tmpl.children().length.should.be.equal(2);
        tmpl.children().eq(0).find('input[type=radio]').length.should.be.eq(2);
        tmpl.children().eq(0).find('.radio').length.should.be.eq(2);
        tmpl.children().eq(1).find('input[type=radio]').length.should.be.eq(2);
        tmpl.children().eq(1).find('.btn').length.should.be.eq(2);

      });
    });

    it('should use radio buttons with HTML',function(){

      inject(function($compile,$rootScope){
        var scope = $rootScope.$new();
        scope.person = {};

        scope.schema = {
          "type": "object",
          "properties": {
            "names": {
              "type": "string",
              "enum": ["one","two"],
              "description": "Cats are <a id='gh' href='http://github.com'>so</a> cool.",
              "title": "<span id='dontyouknowimloko'>testlokol</span>"
            },
            "opts": {
              "type": "string",
              "enum": ["one","two"]
            },
            "boxe": {
              "type": "boolean",
              "title": "<span id='bawkses'>whavre</span>",
              "description": "Cats are <a id='gh' href='http://github.com'>so</a> cool."
            },
          }
        };

        scope.form = [
          { key: "names", type: "radios",titleMap: { one: "one<br\>direction", two: "<div class='spicegirls'>Baby spice</div>" }},
          { key: "opts", type: "radiobuttons",titleMap: { one: "One", two: "The <span id='testerish'>rest</span>" }},
          "boxe"
        ];

        var tmpl = angular.element('<form sf-schema="schema" sf-form="form" sf-model="person"></form>');

        $compile(tmpl)(scope);
        $rootScope.$apply();

        tmpl.find('.spicegirls').length.should.be.equal(1);
        tmpl.find('#testerish').length.should.be.equal(1);
        tmpl.find('#bawkses').length.should.be.equal(1);
        tmpl.find('#gh').length.should.be.equal(2);

      });
    });



    it('should handle a simple div when type "section" is specified',function(){

      inject(function($compile,$rootScope){
        var scope = $rootScope.$new();
        scope.person = {};

        scope.schema = exampleSchema;

        scope.form = [{
          type: "section",
          items: [
            {
              key: 'name',
              notitle: true
            },
            {
              key: 'gender',
              notitle: true
            }
          ]
        }];

        var tmpl = angular.element('<form sf-schema="schema" sf-form="form" sf-model="person"></form>');

        $compile(tmpl)(scope);
        $rootScope.$apply();

        tmpl.children().length.should.be.equal(1);
        tmpl.children().eq(0).is('div').should.be.true;
        tmpl.children().eq(0).hasClass('btn-group').should.be.false;
        tmpl.children().eq(0).children().length.should.be.eq(2);
      });
    });

    it('should handle a simple div with a condition if "conditional" is specified',function(done){

      inject(function($compile,$rootScope){
        var scope = $rootScope.$new();
        scope.person = { show: false };

        scope.schema = exampleSchema;

        scope.form = [{
          type: "conditional",
          condition: "person.show",
          items: [
            {
              key: 'name',
              notitle: true
            },
            {
              key: 'gender',
              notitle: true
            }
          ]
        }];

        var tmpl = angular.element('<form sf-schema="schema" sf-form="form" sf-model="person"></form>');

        $compile(tmpl)(scope);
        $rootScope.$apply();

        tmpl.children().length.should.be.equal(0);

        //Do a setTimeout so we kan do another $apply
        setTimeout(function(){
          scope.person.show = true;
          scope.$apply();
          tmpl.children().length.should.be.equal(1);
          tmpl.children().eq(0).is('div').should.be.true;
          tmpl.children().eq(0).hasClass('btn-group').should.be.false;
          tmpl.children().eq(0).children().length.should.be.eq(2);
          done();
        },10);

      });
    });




    it('should handle "action" groups, same as "section" but with a bootstrap class "btn-group"',function(){

      inject(function($compile,$rootScope){
        var scope = $rootScope.$new();
        scope.person = {};

        scope.schema = exampleSchema;

        scope.form = [{
          type: "actions",
          items: [
            {
              type: 'submit',
              title: 'yes'
            },
            {
              type: 'button',
              title: 'no'
            }
          ]
        }];

        var tmpl = angular.element('<form sf-schema="schema" sf-form="form" sf-model="person"></form>');

        $compile(tmpl)(scope);
        $rootScope.$apply();

        tmpl.children().length.should.be.equal(1);
        tmpl.children().eq(0).is('div').should.be.true;
        tmpl.children().eq(0).hasClass('btn-group').should.be.true;
        tmpl.children().eq(0).children().length.should.be.eq(2);
        tmpl.children().eq(0).children().eq(0).is('input').should.be.true;
        tmpl.children().eq(0).children().eq(1).is('button').should.be.true;
      });
    });


    it('should use datepicker directive when format is "date"',function(){

      //Mock pickadate
      $.fn.pickadate = sinon.stub().returns({
        set: sinon.stub(),
        get: sinon.stub().returns('get')
      });
      $.fn.pickadate.defaults = { format: 'yyyy-mm-dd' };

      inject(function($compile,$rootScope){
        var scope = $rootScope.$new();
        scope.person = { partee: '2014-01-01'};

        scope.schema = {
          type: "object",
          properties: {
            partee: {
              title: "Parteeeeee",
              type: "string",
              format: "date"
            }
          }
        };


        scope.form = [{
          key:'partee',
          maxDate: new Date(),
          minDate: '2014-02-13',
        }];

        var tmpl = angular.element('<form sf-schema="schema" sf-form="form" sf-model="person"></form>');

        $compile(tmpl)(scope);
        $rootScope.$apply();
        tmpl.children().length.should.be.equal(1);
        tmpl.children().eq(0).is('div').should.be.true;
        tmpl.children().eq(0).find('input[pick-a-date]').length.should.ok;
        tmpl.children().eq(0).find('input[pick-a-date]').attr('max-date').should.be.ok;
        tmpl.children().eq(0).find('input[pick-a-date]').attr('min-date').should.be.ok;

        $.fn.pickadate.should.have.beenCalled;

      });
    });

    it('should render custom html when type "help" is specified',function(){

      //We don't need no sanitation. We don't need no though control.
      module(function($sceProvider){
        $sceProvider.enabled(false);
      });

      inject(function($compile,$rootScope){
        var scope = $rootScope.$new();
        scope.person = { };

        scope.schema = {
          type: "object",
          properties: {
            name: {
              type: "string",
            }
          }
        };


        scope.form = [
          {
            type:      "help",
            helpvalue: "<h1>Yo Ninja!</h1>"
          },
          "name"
        ];

        var tmpl = angular.element('<form sf-schema="schema" sf-form="form" sf-model="person"></form>');

        $compile(tmpl)(scope);
        $rootScope.$apply();

        tmpl.children().length.should.eq(2);
        tmpl.children().eq(0).is('div').should.be.true;
        tmpl.children().eq(0).children().length.should.eq(1);
        tmpl.children().eq(0).children().html().should.be.eq("Yo Ninja!");

      });
    });

    it('should render tabs with items in them when specified',function(){

      inject(function($compile,$rootScope){
        var scope = $rootScope.$new();
        scope.person = { };

        scope.schema = {
          type: "object",
          properties: {
            name: { type: "string", title: "Name" },
            alias: { type: "string", title: "Alias" },
            nick: { type: "string", title: "Nickname" },
            tag: { type: "string", title: "Tag" },
          }
        };

        scope.form = [
          {
            type:      "tabs",
            tabs: [
              {
                title: "Tab 1",
                items: [
                  "name",
                  "tag"
                ]
              },
              {
                title: "Tab 2",
                items: [
                  "alias",
                  "nick"
                ]
              }
            ]
          },
        ];

        var tmpl = angular.element('<form sf-schema="schema" sf-form="form" sf-model="person"></form>');

        $compile(tmpl)(scope);
        $rootScope.$apply();

        tmpl.children().length.should.eq(1);
        var tabs  = tmpl.children().children().eq(0);
        var panes = tmpl.children().children().eq(1);

        tabs.is('ul').should.be.true;
        tabs.children().length.should.be.eq(2);
        tabs.children().eq(0).children().html().should.equal('Tab 1');
        tabs.children().eq(1).children().html().should.equal('Tab 2');

        panes.is('div').should.be.true;

        panes.children().length.should.be.eq(2);
        panes.children().eq(0).children().length.should.be.eq(2);
        panes.children().eq(0).children().eq(0).find('label').html().should.eq('Name');
        panes.children().eq(0).children().eq(1).find('label').html().should.eq('Tag');

        panes.children().eq(1).children().length.should.be.eq(2);
        panes.children().eq(1).children().eq(0).find('label').html().should.eq('Alias');
        panes.children().eq(1).children().eq(1).find('label').html().should.eq('Nickname');

      });
    });


    it('should render a list of subforms when schema type is array',function(){

      inject(function($compile,$rootScope){
        var scope = $rootScope.$new();
        scope.person = {};

        scope.schema = {
          "type": "object",
          "properties": {
            "names": {
              "type": "array",
              "items": {
                "type": "string",
                "title": "Name"
              }
            },
            "subforms": {
              "type": "array",
              "items": {
                "type": "object",
                "title": "subform",
                "properties": {
                  "one": { "type": "string" },
                  "two": { "type": "number", "title": "Two" }
                }
              }
            },
            "subsubforms": {
              "type": "array",
              "items": {
                "type": "object",
                "title": "subform",
                "properties": {
                  "one": { "type": "string" },
                  "list": {
                    "type": "array",
                    "items": {
                      "type": "number",
                      "title": "sublist numbers"
                    }
                  }
                }
              }
            }
          }
        };

        scope.form = [
          "names",
          {
            key: "subforms",
            type: "array",
            items: [
              "subforms[].one"
            ]
          },
          "subsubforms"
        ];

        var tmpl = angular.element('<form sf-schema="schema" sf-form="form" sf-model="person"></form>');

        $compile(tmpl)(scope);
        $rootScope.$apply();

        //TODO: more asserts
        tmpl.children().length.should.be.equal(3);
        tmpl.children().eq(0).find('input').length.should.be.eq(1);
        tmpl.children().eq(0).find('button').length.should.be.eq(2);
        tmpl.children().eq(0).find('button').eq(1).text().trim().should.be.eq('Add');

        tmpl.children().eq(1).find('input').length.should.be.eq(1);
        tmpl.children().eq(1).find('fieldset').length.should.be.eq(0);
        tmpl.children().eq(1).find('button').length.should.be.eq(2);
        tmpl.children().eq(1).find('button').eq(1).text().trim().should.be.eq('Add');

        tmpl.children().eq(2).find('input').length.should.be.eq(2);
        tmpl.children().eq(2).find('fieldset').length.should.be.eq(1);
        tmpl.children().eq(2).find('button').length.should.be.eq(4);
        tmpl.children().eq(2).find('button').eq(3).text().trim().should.be.eq('Add');


      });
    });

    it('should render a tabarray of subforms when asked',function(){

      inject(function($compile,$rootScope){
        var scope = $rootScope.$new();
        scope.person = {
          names: ['me','you','another']
        };

        scope.schema = {
          "type": "object",
          "properties": {
            "names": {
              "type": "array",
              "items": {
                "type": "string",
                "title": "Name"
              }
            },
            "subforms": {
              "type": "array",
              "items": {
                "type": "object",
                "title": "subform",
                "properties": {
                  "one": { "type": "string" },
                  "two": { "type": "number", "title": "Two" }
                }
              }
            }
          }
        };

        scope.form = [
          { key: "names", type: "tabarray" },
          {
            key: "subforms",
            type: "tabarray",
            tabType: "right",
            items: [
              "subforms[].one"
            ]
          }
        ];

        var tmpl = angular.element('<form sf-schema="schema" sf-form="form" sf-model="person"></form>');

        $compile(tmpl)(scope);
        $rootScope.$apply();

        //TODO: more asserts
        tmpl.children().length.should.be.equal(2);
        tmpl.children().eq(0).find('input').length.should.be.eq(3);
        tmpl.children().eq(0).find('button').length.should.be.eq(3);
        tmpl.children().eq(0).find('button').eq(0).text().trim().should.be.eq('Remove');
        tmpl.children().eq(0).is('div').should.be.true;
        tmpl.children().eq(0).attr('sf-array').should.be.thruthy;
        tmpl.children().eq(0).find('.tabs-left').length.should.be.eq(1);

        tmpl.children().eq(1).find('input').length.should.be.eq(1);
        tmpl.children().eq(1).find('fieldset').length.should.be.eq(0);
        tmpl.children().eq(1).find('button').length.should.be.eq(1);
        tmpl.children().eq(1).find('button').text().trim().should.be.eq('Remove');
        tmpl.children().eq(1).attr('sf-array').should.be.thruthy;
        tmpl.children().eq(1).find('.tabs-left').length.should.be.eq(0);
        tmpl.children().eq(1).find('.tabs-right').length.should.be.eq(1);

      });
    });


  });


  describe('service',function(){
    beforeEach(module('templates'));
    beforeEach(module('schemaForm'));

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

    it('should be extendable with new defaults',function(){
      module(function(schemaFormProvider){
        schemaFormProvider.prependRule('string',function(name,schema,options){
          if (schema.format === 'foobar') {
            var f = schemaFormProvider.createStandardForm(schema,options);
            f.type = 'foobar';
            return f;
          }
        });

        schemaFormProvider.appendRule('string',function(name,schema,options){
          var f = schemaFormProvider.createStandardForm(schema,options);
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

      });
    });

  });

  describe('decorator factory service',function(){
    beforeEach(module('templates'));
    beforeEach(module('schemaForm'));

    it('should enable you to create new decorator directives',function(){
      module(function(schemaFormDecoratorsProvider){
        schemaFormDecoratorsProvider.createDecorator('foobar',{ 'foo':'/bar.html' },[angular.noop]);
      });

      inject(function($rootScope,$compile,$templateCache){
        $templateCache.put('/bar.html','<div class="yes">YES</div>');

        //Since our directive does a replace we need a wrapper to actually check the content.
        var templateWithWrap = angular.element('<div id="wrap"><foobar form="{ type: \'foo\'}"></foobar></div>');
        var template         = templateWithWrap.children().eq(0);

        $compile(template)($rootScope);
        $rootScope.$apply();
        templateWithWrap.children().length.should.equal(1);
        templateWithWrap.children().is('div').should.be.true;
        templateWithWrap.children().hasClass('yes').should.be.true;

      });
    });
  });


});
