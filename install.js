'use strict';

var path = require('path')
  , fs = require('fs');

//
// Compatibility with older node.js.
//
var existsSync = fs.existsSync || path.existsSync;

//
// Our own pre-commit hook runner.
//
var hook = fs.readFileSync('./hook');
var hookJs = fs.readFileSync('./hook.js');

//
// The root of repository.
//
var root = path.resolve(__dirname, '../..');

//
// The location .git and it's hooks
//
var git = path.resolve(root, '.git')
  , hooks = path.resolve(git, 'hooks')
  , precommit = path.resolve(hooks, 'pre-commit')
  , precommitJs = path.resolve(hooks, 'pre-commit.js');

//
// Check if we are in a git repository so we can bail out early when this is not
// the case.
//
if (!existsSync(git) || !fs.lstatSync(git).isDirectory()) return;

//
// Create a hooks directory if it's missing.
//
if (!existsSync(hooks)) fs.mkdirSync(hooks);

//
// If there's an existing `pre-commit` hook we want to back it up instead of
// overriding it and losing it completely
//
function writeWithBackup(file, contents) {
  if (
     existsSync(file)
    && fs.readFileSync(file).toString('utf8') !== contents.toString('utf8')
  ) {
    console.log('');
    console.log('pre-commit: Detected an existing git pre-commit hook');
    fs.writeFileSync(file + '.old', fs.readFileSync(file));
    console.log('pre-commit: Old pre-commit hook backed up to pre-commit.old');
    console.log('');
  }
  fs.writeFileSync(file, contents);
  fs.chmodSync(file, '755');
}

writeWithBackup(precommit, hook);
writeWithBackup(precommitJs, hookJs);
