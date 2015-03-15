[![Build Status](https://travis-ci.org/percyhanna/mincer-ruby-sass.svg?branch=master)](https://travis-ci.org/percyhanna/mincer-ruby-sass)

mincer-ruby-sass
================

Mincer Sass/SCSS engine that uses official Ruby Sass engine.

NOTES
-----

* This package assumes you have the Ruby Sass gem installed. We do not use the gem's
provided binary file, but we do `require 'sass'`. We use our own "bin" file internally
to add invalidation functionality by making Mincer `dependOn` each individual file
included in the `.scss` file.
