/**
 *  class RubySassEngine
 *
 *  Engine for the SASS/SCSS compiler. You will need `sass` Ruby gem installed
 *  in order to use [[Mincer]] with `*.sass` or `*.scss` files:
 *
 *      gem install sass
 *
 *
 *  ##### SUBCLASS OF
 *
 *  [[Template]]
 **/


'use strict';

var Mincer    = require('mincer');
var Template  = Mincer.Template;
var prop      = require('mincer/lib/mincer/common').prop;

var sh = require('execSync');

////////////////////////////////////////////////////////////////////////////////

// Class constructor
var RubySassEngine = module.exports = function RubySassEngine() {
  Template.apply(this, arguments);
};

require('util').inherits(RubySassEngine, Template);

// Render data
RubySassEngine.prototype.evaluate = function (context/*, locals*/) {
  var css = sh.exec('sass --scss ' + this.file);
  return css.stdout;
};


// Expose default MimeType of an engine
prop(RubySassEngine, 'defaultMimeType', 'text/css');