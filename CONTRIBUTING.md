Contributing
============
   - [How to setup to develop](#setup)
   - [How to build the package](#build)
   - [Working on the libraries](#work)
   - [PR requirements](#requirements)

<a name="setup"></a>
## How to setup to develop
To get started clone all json-schema-form library repos into sibling folders.
```bash
git clone https://github.com/json-schema-form/json-schema-form-core.git
git clone https://github.com/json-schema-form/angular-schema-form.git
git clone https://github.com/json-schema-form/angular-schema-form-bootstrap.git
git clone https://github.com/json-schema-form/angular-schema-form-material.git
```
Install [Node.js](https://nodejs.org) for your development environment. Currently working in Node v8.1.2 at least.

Install dev/global dependencies and bower references to use demo site
```bash
npm install
npm install -g webpack eslint mocha # json-schema-form-core
npm install -g webpack eslint karma # angular-schema-form
bower install
```
Once cloned each repo has npm commands for assisting development
```bash
npm run test # Run unit tests
npm run build # Run the build
npm run dist # not in json-schema-form-core # Run the build and minify
npm run watch # Run the build and watch for changes
```

<a name="build"></a>
## How to build the package
When working on `angular-schema-form` running the `npm build` will look for a sibling
folder when importing `json-schema-form-core`. This allows you to work on bugs or
issues that require work on both libraries simultaneously.

This is set up for bootstrap and material design decorators also.

The bootstrap repo is required to build `angular-schema-form` with the bootstrap
decorator bundle distribution.

<a name="work"></a>
## Working on the libraries
When I work on the libraries I use a multi-tab console tool like
Terminator (Linux) or ConEmu (Windows)

Run each of the following in a separate tab:
```bash
json-schema-form-core> npm run watch
json-schema-form-core> npm run test
angular-schema-form> npm run watch
angular-schema-form> npm run test
```
This will re-compile all the libraries after changes that affect them which
then runs the related tests.

A static file web server is required to run the examples, but the example
can be used to run saved gist of the example app. It can help to add a model
to one of the example app json files to test with.

<a name="requirements"></a>
## PR requirements
We love contributions!

**Please base any merge request on the *development* branch instead of *master*.**

The reason for this is that we're trying to use
[git flow](http://danielkummer.github.io/git-flow-cheatsheet/), and it makes merging your pull
request a heck of a lot easier for us.

Please **avoid including anything from the `dist/`** directory as that can make merging harder, and we
always generate these files when we make a new release.

**The bootstrap decorator, has been moved to it's own repo. It's here [github.com/json-schema-form/angular-schema-form-bootstrap](https://github.com/json-schema-form/angular-schema-form-bootstrap)**

Feel free to submit issues on the main repo anyway though.

If its a new field type consider making it an add-on instead,
especially if it has external dependencies. See [extending Schema Form documentation.](docs/extending.md)

With new features we love to see updates to the docs as well as tests, that makes it super
easy and fast for us to merge it!

Also consider running any code through the code style checker [jscs](https://github.com/mdevils/node-jscs)
(or even better use it in your editor) with preset set to `google`. You can also
use `gulp jscs` to check your code. I hope to set up ESLint in the not too distant future.
