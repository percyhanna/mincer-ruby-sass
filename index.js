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

var Mincer      = require('mincer');
var Template    = Mincer.Template;
var prop        = require('mincer/lib/mincer/common').prop;
var path        = require('path');
var sh = require('execSync');

////////////////////////////////////////////////////////////////////////////////

// Class constructor
var RubySassEngine = module.exports = function RubySassEngine() {
  Template.apply(this, arguments);
  this._includeDirs = [];
};

function shellEscape (text) {
  var shellescape = /[\$\\"]/g;
  return '"' + text.replace(shellescape, '\\$&') + '"';
}

require('util').inherits(RubySassEngine, Template);

RubySassEngine.prototype.addIncludeDir = function (dir) {
  this._includeDirs.push(dir);
};

// Render data
RubySassEngine.prototype.evaluate = function (context, locals) {
  var data = shellEscape(this.data),
      dir = path.dirname(this.file),
      includeDirs = this._includeDirs.concat(dir).map(shellEscape),
      css = sh.exec('echo ' + data + ' | sass -s -q --scss -I ' + includeDirs.join(' -I '));

  if (css.code) {
    throw new Error(css.stdout);
  } else {
    return css.stdout;
  }
};

// Expose default MimeType of an engine
prop(RubySassEngine, 'defaultMimeType', 'text/css');