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
var fs          = require('fs');
var sh          = require('execSync');
var includeDirs = [];

////////////////////////////////////////////////////////////////////////////////

// Class constructor
var RubySassEngine = module.exports = function RubySassEngine() {
  Template.apply(this, arguments);
};

function shellEscape (text) {
  var shellescape = /[\$\\"]/g;
  return '"' + text.replace(shellescape, '\\$&') + '"';
}

require('util').inherits(RubySassEngine, Template);

RubySassEngine.addIncludeDir = function (dir) {
  includeDirs.push(dir);
};

// Render data
RubySassEngine.prototype.evaluate = function (context, locals) {
  var data = shellEscape(this.data),
      dir = path.dirname(fs.realpathSync(this.file)),
      dirs = includeDirs.concat(dir).map(shellEscape),
      cmd = 'echo ' + data + ' | sass -s -q --scss -I ' + dirs.join(' -I '),
      css = sh.exec(cmd);

  if (css.code) {
    throw new Error('Error compiling Sass: ' + cmd + "\n" + css.stdout);
  } else {
    return css.stdout;
  }
};

// Expose default MimeType of an engine
prop(RubySassEngine, 'defaultMimeType', 'text/css');