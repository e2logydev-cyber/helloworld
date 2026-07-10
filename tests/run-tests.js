/**
 * run-tests.js
 *
 * Minimal, dependency-free test runner. Run with:
 *   node tests/run-tests.js
 *
 * No test framework or npm dependency is used, consistent with
 * architecture.md's "no build tooling required" decision for this
 * static, frontend-only project.
 */
"use strict";

var testFiles = ["./validators.test.js", "./ui.test.js", "./app.test.js"];

var passCount = 0;
var failCount = 0;
var currentFile = "";

var t = {
  test: function (description, fn) {
    try {
      fn();
      passCount += 1;
      console.log("  ✓ " + description);
    } catch (err) {
      failCount += 1;
      console.log("  ✗ " + description);
      console.log("    " + (err && err.message ? err.message : err));
    }
  }
};

testFiles.forEach(function (file) {
  currentFile = file;
  console.log("\n" + file);
  var mod = require(file);
  mod.run(t);
});

console.log("\n----------------------------------------");
console.log(passCount + " passed, " + failCount + " failed");

if (failCount > 0) {
  process.exitCode = 1;
}
