/**
 * load-script.js
 *
 * Loads one of the project's browser scripts (js/validators.js, js/ui.js,
 * js/app.js) into a Node `vm` sandbox that exposes a fake `window` /
 * `document`, so the exact same source files shipped to the browser can be
 * exercised by the unit tests below with zero build step and zero
 * third-party test dependencies.
 */
"use strict";

var fs = require("fs");
var path = require("path");
var vm = require("vm");

/**
 * @param {string} relativeFilePath e.g. "js/validators.js"
 * @param {object} sandbox must include at least { window, console }
 */
function loadScriptInto(relativeFilePath, sandbox) {
  var fullPath = path.join(__dirname, "..", relativeFilePath);
  var code = fs.readFileSync(fullPath, "utf8");
  var context = vm.createContext(sandbox);
  vm.runInContext(code, context, { filename: relativeFilePath });
  return sandbox;
}

module.exports = { loadScriptInto: loadScriptInto };
