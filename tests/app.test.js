/**
 * app.test.js
 *
 * Covers the wiring in js/app.js: the full handleSubmit flow (FR-4
 * through FR-9), the "no network request on submit" guarantee (AC-6),
 * and the double-click / duplicate-success guard (AC-7, US-4.3).
 *
 * Full cross-browser behavioral checks (Chrome/Firefox/Edge/Safari,
 * responsive layout, and manual keyboard-only walkthroughs) are handled
 * separately by the QA phase per planning.md's EPIC-5 — these tests only
 * verify the JavaScript logic itself.
 */
"use strict";

var assert = require("assert");
var loadScriptInto = require("./load-script").loadScriptInto;
var createFixture = require("./dom-fixture").createFixture;

function loadApp(fixture) {
  var sandbox = { window: fixture.window, document: fixture.document, console: console };
  loadScriptInto("js/validators.js", sandbox);
  loadScriptInto("js/ui.js", sandbox);
  loadScriptInto("js/app.js", sandbox);
  return sandbox;
}

function fillForm(elements, values) {
  elements.nameInput.value = values.name;
  elements.emailInput.value = values.email;
  elements.messageInput.value = values.message;
}

function submit(elements) {
  var prevented = false;
  elements.form.dispatchEvent({
    type: "submit",
    preventDefault: function () {
      prevented = true;
    }
  });
  return prevented;
}

function run(t) {
  t.test("invalid submission shows errors, does not reset, and re-enables the button", function () {
    var fixture = createFixture();
    loadApp(fixture);
    var elements = fixture.elements;

    fillForm(elements, { name: "", email: "not-an-email", message: "" });
    var prevented = submit(elements);

    assert.strictEqual(prevented, true, "default form submission must always be prevented");
    assert.strictEqual(elements.nameError.textContent, "Please enter your name.");
    assert.ok(elements.emailError.textContent.length > 0);
    assert.strictEqual(elements.messageError.textContent, "Please enter a message.");
    assert.strictEqual(elements.successMessage.hidden, true, "no success message on invalid submission");
    assert.strictEqual(elements.form.wasReset, false);
    assert.strictEqual(elements.submitButton.disabled, false, "button re-enabled so visitor can retry");
  });

  t.test("valid submission shows success message and resets the form", function () {
    var fixture = createFixture();
    loadApp(fixture);
    var elements = fixture.elements;

    fillForm(elements, { name: "Ada Lovelace", email: "ada@example.com", message: "Hello there" });
    submit(elements);

    assert.strictEqual(elements.successMessage.hidden, false);
    assert.strictEqual(elements.successMessage.textContent, "Thank you, your message has been sent.");
    assert.strictEqual(elements.form.wasReset, true);
    assert.strictEqual(elements.submitButton.disabled, false, "button re-enabled, ready for a new entry (FR-9)");
  });

  t.test("submit button is disabled during processing (double-click guard, AC-7)", function () {
    var fixture = createFixture();
    loadApp(fixture);
    var elements = fixture.elements;

    fillForm(elements, { name: "Ada Lovelace", email: "ada@example.com", message: "Hello there" });
    submit(elements);

    // The button's disabled property should have been flipped to true
    // immediately on click, before being re-enabled once processing
    // finished — this is the guard that stops a rapid double-click from
    // producing more than one success message.
    assert.deepStrictEqual(elements.submitButton.disabledHistory, [true, false]);
  });

  t.test("a second submit right after a successful one only re-validates the (now empty) form, never shows two success messages back to back without a fresh valid fill", function () {
    var fixture = createFixture();
    loadApp(fixture);
    var elements = fixture.elements;

    fillForm(elements, { name: "Ada Lovelace", email: "ada@example.com", message: "Hello there" });
    submit(elements);
    assert.strictEqual(elements.successMessage.hidden, false);
    assert.strictEqual(elements.successMessage.textContent, "Thank you, your message has been sent.");

    // Fields are empty again after the reset (FR-9). A second, immediate
    // submit attempt (e.g. from a double-click) hits validation instead of
    // producing a second, confusing success message.
    var successTextBeforeSecondSubmit = elements.successMessage.textContent;
    submit(elements);

    assert.ok(elements.nameError.textContent.length > 0, "second submit on the now-empty form shows errors");
    assert.strictEqual(
      elements.successMessage.textContent,
      successTextBeforeSecondSubmit,
      "success message text is not duplicated or changed by the second attempt"
    );
  });

  t.test("submitted data is only logged to the console, nothing else observable happens on the network layer", function () {
    var fixture = createFixture();
    var loggedCalls = [];
    var fakeConsole = {
      log: function () {
        loggedCalls.push(Array.prototype.slice.call(arguments));
      }
    };
    var sandbox = { window: fixture.window, document: fixture.document, console: fakeConsole };
    loadScriptInto("js/validators.js", sandbox);
    loadScriptInto("js/ui.js", sandbox);
    loadScriptInto("js/app.js", sandbox);

    fillForm(fixture.elements, { name: "Ada Lovelace", email: "ada@example.com", message: "Hello there" });
    submit(fixture.elements);

    assert.strictEqual(loggedCalls.length, 1, "exactly one console.log call for the demo placeholder (FR-8)");
    var loggedData = loggedCalls[0][1];
    // Compared field-by-field rather than assert.deepStrictEqual(),
    // because loggedData is an object created inside a vm sandbox (a
    // different JS realm) and is not reference-equal to a same-shaped
    // object literal in the outer realm.
    assert.strictEqual(loggedData.name, "Ada Lovelace");
    assert.strictEqual(loggedData.email, "ada@example.com");
    assert.strictEqual(loggedData.message, "Hello there");
    // No fetch/XMLHttpRequest globals are referenced anywhere in app.js,
    // validators.js, or ui.js (confirmed by code review) — this sandbox
    // does not even define those globals, so any accidental network call
    // would throw a ReferenceError and fail this test.
  });
}

module.exports = { run: run };
