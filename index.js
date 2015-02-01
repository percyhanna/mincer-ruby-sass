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
var temp        = require('temp');
var includeDirs = [];

////////////////////////////////////////////////////////////////////////////////

// Class constructor
var RubySassEngine = module.exports = function RubySassEngine() {
  Template.apply(this, arguments);
};

function shellEscape (text) {
  var shellescape = /[\$\\"`]/g;
  return '"' + text.replace(shellescape, '\\$&') + '"';
}

require('util').inherits(RubySassEngine, Template);

RubySassEngine.addIncludeDir = function (dir) {
  includeDirs.push(dir);
};

// Render data
RubySassEngine.prototype.evaluate = function (context, locals) {
  var scssInputPath = temp.path({ suffix: '.scss' }),
      dirs = includeDirs.concat(path.dirname(this.file)).map(shellEscape),
      cmdPath = path.resolve(__dirname, 'bin/sass'),
      dependencyPath = temp.path({ suffix: '.json' }),
      cssOutputPath = temp.path({ suffix: '.css' }),
      cmd = [
        cmdPath,
        '-q',
        '--scss',
        '--dependencies-out',
        JSON.stringify(dependencyPath),
        '-I ' + dirs.join(' -I '),
        scssInputPath,
        cssOutputPath
      ];

  fs.writeFileSync(scssInputPath, this.data);

  var exec = sh.exec(cmd.join(' '));

  if (!fs.existsSync(dependencyPath)) {
    throw new Error('Could not load dependent files from Sass: file does not exist.\n' + exec.stdout);
  }

  var dependentFileContent = fs.readFileSync(dependencyPath, { encoding: 'utf8' });

  if (dependentFileContent) {
    var dependentFiles = JSON.parse(dependentFileContent);
    dependentFiles.forEach(function (file) {
      context.dependOn(path.resolve(file));
    });
  }

  if (exec.code) {
    throw new Error('Error compiling Sass: ' + exec + "\n" + exec.stdout);
  } else {
    return this.data = fs.readFileSync(cssOutputPath, { encoding: 'utf8' });
  }
};

// Expose default MimeType of an engine
prop(RubySassEngine, 'defaultMimeType', 'text/css');