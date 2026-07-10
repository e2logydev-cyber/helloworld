/**
 * load-order.test.js
 *
 * QA-added characterization test (see qa-report.md). This documents, at a
 * test level, the exact failure behavior review.md flagged as a Low,
 * non-blocking finding: if js/fields.js is missing or loaded after
 * js/validators.js / js/ui.js, HelloWorldApp.FIELD_NAMES is undefined, and
 * the first call into validateForm()/showErrors()/clearErrors() throws a
 * plain TypeError rather than failing gracefully or with a clear message.
 *
 * This test does NOT fix that behavior (no production file is touched here
 * — QA does not modify application code) and does NOT assert this is
 * desirable; it only pins down and makes visible the current failure mode
 * so that (a) it is not silently forgotten, and (b) if development later
 * adds the recommended defensive guard, this test's expectation would need
 * to be deliberately updated, which is exactly the point of a
 * characterization test.
 */
"use strict";

var assert = require("assert");
var loadScriptInto = require("./load-script").loadScriptInto;

function run(t) {
  t.test("[known limitation, non-blocking per review.md] loading validators.js before fields.js throws a TypeError instead of a clear error", function () {
    var sandbox = { window: {}, console: console };
    // Intentionally NOT loading js/fields.js first, to reproduce the
    // documented load-order coupling risk.
    var threw = false;
    var errorInstance = null;
    try {
      loadScriptInto("js/validators.js", sandbox);
      var validateForm = sandbox.window.HelloWorldApp.validateForm;
      validateForm({ name: "Ada", email: "ada@example.com", message: "hi" });
    } catch (err) {
      threw = true;
      errorInstance = err;
    }

    assert.strictEqual(threw, true, "expected validateForm() to throw when fields.js was not loaded first");
    // Compared via err.name/err.constructor.name rather than
    // `instanceof TypeError`, because the error is thrown inside a vm
    // sandbox (a different JS realm), whose TypeError constructor is not
    // reference-equal to the outer realm's TypeError (same pattern already
    // used in validators.test.js/app.test.js for cross-realm comparisons).
    assert.strictEqual(
      errorInstance && errorInstance.constructor && errorInstance.constructor.name,
      "TypeError",
      "expected a generic TypeError (current behavior), not a clear, purpose-built error message"
    );
  });

  t.test("[known limitation, non-blocking per review.md] loading ui.js before fields.js throws a TypeError instead of a clear error", function () {
    var sandbox = { window: {}, console: console };
    var threw = false;
    var errorInstance = null;
    try {
      loadScriptInto("js/ui.js", sandbox);
      var showErrors = sandbox.window.HelloWorldApp.showErrors;
      showErrors({ name: "Please enter your name." }, { getElementById: function () { return null; } });
    } catch (err) {
      threw = true;
      errorInstance = err;
    }

    assert.strictEqual(threw, true, "expected showErrors() to throw when fields.js was not loaded first");
    assert.strictEqual(
      errorInstance && errorInstance.constructor && errorInstance.constructor.name,
      "TypeError",
      "expected a generic TypeError (current behavior), not a clear, purpose-built error message"
    );
  });
}

module.exports = { run: run };
