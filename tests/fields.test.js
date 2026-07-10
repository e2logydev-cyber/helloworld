/**
 * fields.test.js
 *
 * QA-added test (see qa-report.md). Directly pins the contents of
 * js/fields.js, the single source of truth for the Contact Us form field
 * identifiers (FR-3), instead of relying only on indirect coverage through
 * validators.test.js / ui.test.js / app.test.js.
 *
 * This closes the "no direct unit test asserts on fields.js's own contents"
 * Low finding raised in review.md, without touching any production file.
 * If someone accidentally edits js/fields.js (typo, reorder, add/remove a
 * field) this test fails with a clear, direct message pointing at the
 * actual source of the mistake, rather than an indirect failure elsewhere.
 */
"use strict";

var assert = require("assert");
var loadScriptInto = require("./load-script").loadScriptInto;

function run(t) {
  t.test("FIELD_NAMES is exactly [\"name\", \"email\", \"message\"] in that order", function () {
    var sandbox = { window: {}, console: console };
    loadScriptInto("js/fields.js", sandbox);

    var fieldNames = sandbox.window.HelloWorldApp.FIELD_NAMES;

    assert.ok(Array.isArray(fieldNames), "FIELD_NAMES must be an array");
    assert.strictEqual(fieldNames.length, 3, "expected exactly 3 fields (FR-3: no subject, phone, or attachments)");
    assert.strictEqual(fieldNames[0], "name");
    assert.strictEqual(fieldNames[1], "email");
    assert.strictEqual(fieldNames[2], "message");
  });

  t.test("FIELD_NAMES values match the element ids/names actually used in index.html", function () {
    var fs = require("fs");
    var path = require("path");
    var html = fs.readFileSync(path.join(__dirname, "..", "index.html"), "utf8");

    var sandbox = { window: {}, console: console };
    loadScriptInto("js/fields.js", sandbox);
    var fieldNames = sandbox.window.HelloWorldApp.FIELD_NAMES;

    fieldNames.forEach(function (field) {
      var idPattern = new RegExp('id="' + field + '"');
      assert.ok(idPattern.test(html), "expected index.html to contain an element with id=\"" + field + "\"");
    });
  });
}

module.exports = { run: run };
