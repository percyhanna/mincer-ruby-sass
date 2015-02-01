mincer-ruby-sass
================

Mincer Sass/Scss engine that uses official Ruby Sass engine

NOTES
-----

* This package assumes you have the Ruby Sass gem installed. We do not use the gem's
provided binary file, but we do `require 'sass'`. We use our own "bin" file internally
to add invalidation functionality by making Mincer `dependOn` each individual file
included in the `.scss` file.

* This package uses the [execSync](https://www.npmjs.org/package/execSync) package,
which is not recommended to be run in production environments. The purpose of
this package is to compile Sass stylesheets in either a local development
environment or in a deployment environment, and not ever in a live production
environment.
