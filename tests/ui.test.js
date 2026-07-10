/**
 * ui.test.js
 *
 * Covers FR-6 (field-specific errors without clearing other fields'
 * typed values), FR-7/FR-9 (success message + reset), and NFR-4 (safe,
 * textContent-only rendering).
 */
"use strict";

var assert = require("assert");
var loadScriptInto = require("./load-script").loadScriptInto;
var createFixture = require("./dom-fixture").createFixture;

function run(t) {
  t.test("showErrors renders the specific message next to each failing field", function () {
    var fixture = createFixture();
    var sandbox = { window: {}, console: console };
    loadScriptInto("js/ui.js", sandbox);
    var showErrors = sandbox.window.HelloWorldApp.showErrors;

    fixture.elements.nameInput.value = "";
    fixture.elements.emailInput.value = "typed-but-invalid";
    fixture.elements.messageInput.value = "I already typed my message";

    showErrors(
      { name: "Please enter your name.", email: "Please enter a valid email address (e.g. name@example.com)." },
      fixture.document
    );

    assert.strictEqual(fixture.elements.nameError.textContent, "Please enter your name.");
    assert.strictEqual(
      fixture.elements.emailError.textContent,
      "Please enter a valid email address (e.g. name@example.com)."
    );
    assert.strictEqual(fixture.elements.messageError.textContent, "");

    // The message field passed validation, but its typed value must be
    // left completely untouched (FR-6) even though other fields errored.
    assert.strictEqual(fixture.elements.messageInput.value, "I already typed my message");
    assert.strictEqual(fixture.elements.emailInput.value, "typed-but-invalid");
  });

  t.test("showErrors adds has-error styling hook only to failing fields", function () {
    var fixture = createFixture();
    var sandbox = { window: {}, console: console };
    loadScriptInto("js/ui.js", sandbox);
    var showErrors = sandbox.window.HelloWorldApp.showErrors;

    showErrors({ email: "Please enter your email address." }, fixture.document);

    assert.strictEqual(fixture.elements.emailWrapper.classList.contains("has-error"), true);
    assert.strictEqual(fixture.elements.nameWrapper.classList.contains("has-error"), false);
    assert.strictEqual(fixture.elements.messageWrapper.classList.contains("has-error"), false);
  });

  t.test("showErrors moves focus to the first invalid field (keyboard support)", function () {
    var fixture = createFixture();
    var sandbox = { window: {}, console: console };
    loadScriptInto("js/ui.js", sandbox);
    var showErrors = sandbox.window.HelloWorldApp.showErrors;

    showErrors(
      { email: "Please enter your email address.", message: "Please enter a message." },
      fixture.document
    );

    assert.strictEqual(fixture.elements.emailInput.focused, true);
    assert.strictEqual(fixture.elements.messageInput.focused, false);
  });

  t.test("showErrors clears previous errors before applying the new set", function () {
    var fixture = createFixture();
    var sandbox = { window: {}, console: console };
    loadScriptInto("js/ui.js", sandbox);
    var showErrors = sandbox.window.HelloWorldApp.showErrors;

    showErrors({ name: "Please enter your name." }, fixture.document);
    assert.strictEqual(fixture.elements.nameError.textContent, "Please enter your name.");

    // Second, corrected attempt only has an email error now.
    showErrors({ email: "Please enter a valid email address (e.g. name@example.com)." }, fixture.document);

    assert.strictEqual(fixture.elements.nameError.textContent, "");
    assert.strictEqual(fixture.elements.nameWrapper.classList.contains("has-error"), false);
    assert.strictEqual(
      fixture.elements.emailError.textContent,
      "Please enter a valid email address (e.g. name@example.com)."
    );
  });

  t.test("showSuccessAndReset shows the confirmation text and resets the form", function () {
    var fixture = createFixture();
    var sandbox = { window: {}, console: console };
    loadScriptInto("js/ui.js", sandbox);
    var showSuccessAndReset = sandbox.window.HelloWorldApp.showSuccessAndReset;

    fixture.elements.successMessage.hidden = true;

    showSuccessAndReset(fixture.elements.form, fixture.elements.successMessage, fixture.document);

    assert.strictEqual(fixture.elements.successMessage.hidden, false);
    assert.strictEqual(fixture.elements.successMessage.textContent, "Thank you, your message has been sent.");
    assert.strictEqual(fixture.elements.form.wasReset, true);
  });

  t.test("showSuccessAndReset clears any leftover error state", function () {
    var fixture = createFixture();
    var sandbox = { window: {}, console: console };
    loadScriptInto("js/ui.js", sandbox);
    var showErrors = sandbox.window.HelloWorldApp.showErrors;
    var showSuccessAndReset = sandbox.window.HelloWorldApp.showSuccessAndReset;

    showErrors({ name: "Please enter your name." }, fixture.document);
    assert.strictEqual(fixture.elements.nameWrapper.classList.contains("has-error"), true);

    showSuccessAndReset(fixture.elements.form, fixture.elements.successMessage, fixture.document);

    assert.strictEqual(fixture.elements.nameError.textContent, "");
    assert.strictEqual(fixture.elements.nameWrapper.classList.contains("has-error"), false);
  });
}

module.exports = { run: run };
