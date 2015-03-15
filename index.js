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
var execSync    = require('sync-exec');
var temp        = require('temp');
var includeDirs = [];

var showRawOutput = function (path) {
  return false;
};

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

RubySassEngine.setShowRawOutput = function (fn) {
  if (typeof fn === 'function') {
    showRawOutput = fn;
  }
};

// Render data
RubySassEngine.prototype.evaluate = function (context, locals) {
  if (showRawOutput(this.file)) {
    return this.data;
  }

  var scssInputPath = temp.path({ suffix: '.scss' }),
      dirs = includeDirs.concat(path.dirname(this.file)).map(shellEscape),
      dependencyPath = temp.path({ suffix: '.json' }),
      cssOutputPath = temp.path({ suffix: '.css' }),
      cssSourcemapOutputPath = cssOutputPath + '.map',
      withSourcemap = context.environment.isEnabled('source_maps'),
      cmd = [
        './sass',
        '-q',
        withSourcemap ? '--sourcemap' : '',
        '--dependencies-out',
        dependencyPath,
        '-I ' + dirs.join(' -I '),
        scssInputPath,
        cssOutputPath
      ];

  fs.writeFileSync(scssInputPath, this.data);

  var exec = execSync(cmd.join(' '), { cwd: __dirname + '/bin' });

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

  if (withSourcemap && cssSourcemapOutputPath && fs.existsSync(cssSourcemapOutputPath)) {
    var sourcemap = fs.readFileSync(cssSourcemapOutputPath, { encoding: 'utf8' });

    if (sourcemap) {
      var map = JSON.parse(sourcemap);
      var dir = path.dirname(context.pathname);
      map.sources.forEach(function (file, idx) {
        var rel = path.relative(dir, file);
        if (path.sep === '\\') { rel = rel.replace('\\', '/'); }
        map.sources[idx] = rel;
      });
      this.map = JSON.stringify(map);
    }
  }

  if (exec.status || !fs.existsSync(cssOutputPath)) {
    throw new Error('Error compiling Sass: ' + exec.stderr + "\n" + exec.stdout);
  } else {
    return this.data = fs.readFileSync(cssOutputPath, { encoding: 'utf8' });
  }
};

// Expose default MimeType of an engine
prop(RubySassEngine, 'defaultMimeType', 'text/css');