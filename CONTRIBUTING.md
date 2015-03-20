Contributing
------------
We love contributions!

**Please base any merge request on the *development* branch instead of *master*.**

The reason for this is that we're trying to use
[git flow](http://danielkummer.github.io/git-flow-cheatsheet/), and it makes merging your pull
request heck of a lot easier for us.

Please avoid including anything from the `dist/` directory as that can make merging harder, and we
always generate these files when we make a new release.

If its a new field type consider making it an add-on instead,
especially if it has external dependencies. See [extending Schema Form documentation.](docs/extending.md)

With new features we love to see updates to the docs as well as tests, that makes it super
easy and fast for us to merge it!

Also consider running any code through the code style checker [jscs](https://github.com/mdevils/node-jscs)
(or even better use it in your editor) with preset set to `google`. You can also us `gulp jscs` to
check your code.
