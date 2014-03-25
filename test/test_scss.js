'use strict';

var Mincer = require('mincer'),
    RubySassEngine = require('../index');

// use a Sass engine that compiles with official Sass release
Mincer.registerEngine('.sass', RubySassEngine);
Mincer.registerEngine('.scss', RubySassEngine);

var env = new Mincer.Environment(__dirname);
env.appendPath(__dirname + '/fixtures');

var compiledAsset = env.findAsset('test').toString();

if (compiledAsset.indexOf('body h1') !== -1) {
  console.log('OK');
} else {
  console.error('Failed to compile Sass');
  process.exit(1);
}