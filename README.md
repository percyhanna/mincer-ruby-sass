[![Build Status](https://travis-ci.org/percyhanna/mincer-ruby-sass.svg?branch=master)](https://travis-ci.org/percyhanna/mincer-ruby-sass)

mincer-ruby-sass
================

Mincer Sass/SCSS engine that uses official Ruby Sass engine with Sourcemap support.

NOTES
-----

* This package assumes you have the Ruby Sass gem installed. We do not use the gem's
provided binary file, but we do `require 'sass'`. We use our own "bin" file internally
to add invalidation functionality by making Mincer `dependOn` each individual file
included in the `.scss` file.

Sourcemap Support
-----------------

Sourcemap support is still a little experimental. In our own local testing, we found
that `@import`ed files often fail when accessed/compiled directly, since mixins and
variables are not avaiable. To allow accessing those files directly, there is a
`setShowRawOutput` method to define a custom predicate to determine whether to show
raw ouput vs. compiled Sass output. If your predicate returns a truthy value, then
the raw file contents will be shown, instead of the compiled Sass. An example usage
can be found below.

**Example:**

```javascript
var sassEngine = require('mincer-ruby-sass');

var COMPILED_STYLESHEETS = /stylehseets\/(app|mobile)\./;

sassEngine.setShowRawOutput(function (path) {
  return !COMPILED_STYLESHEETS.test(path);
});
```

This will show the raw output for any path that does not match the defined regex,
in this case, the `app.(s)css` and `mobile.(s)css` paths. So, any `@import`ed
assets will show their raw contents, while the two files above will show the
compiled contents.
