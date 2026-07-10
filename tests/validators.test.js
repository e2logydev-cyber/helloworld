/**
 * validators.test.js
 *
 * Covers FR-4 (required fields), FR-5 (email format), AC-4, AC-5.
 */
"use strict";

var assert = require("assert");
var loadScriptInto = require("./load-script").loadScriptInto;

function run(t) {
  var sandbox = { window: {}, console: console };
  loadScriptInto("js/fields.js", sandbox);
  loadScriptInto("js/validators.js", sandbox);
  var validateForm = sandbox.window.HelloWorldApp.validateForm;

  t.test("all fields valid -> valid: true, no errors", function () {
    var result = validateForm({
      name: "Ada Lovelace",
      email: "ada@example.com",
      message: "Hello there"
    });
    assert.strictEqual(result.valid, true);
    // Compared via Object.keys() rather than assert.deepStrictEqual(),
    // because result.errors is an object created inside a vm sandbox
    // (a different JS realm), whose plain-object prototype is not
    // reference-equal to the outer realm's Object.prototype.
    assert.strictEqual(Object.keys(result.errors).length, 0);
  });

  t.test("empty name -> error on name only", function () {
    var result = validateForm({
      name: "",
      email: "ada@example.com",
      message: "Hello there"
    });
    assert.strictEqual(result.valid, false);
    assert.ok(result.errors.name, "expected a name error");
    assert.ok(!result.errors.email, "did not expect an email error");
    assert.ok(!result.errors.message, "did not expect a message error");
  });

  t.test("empty email -> error on email only", function () {
    var result = validateForm({
      name: "Ada",
      email: "",
      message: "Hello there"
    });
    assert.strictEqual(result.valid, false);
    assert.ok(result.errors.email, "expected an email error");
  });

  t.test("empty message -> error on message only", function () {
    var result = validateForm({
      name: "Ada",
      email: "ada@example.com",
      message: ""
    });
    assert.strictEqual(result.valid, false);
    assert.ok(result.errors.message, "expected a message error");
  });

  t.test("all fields empty -> error on all three", function () {
    var result = validateForm({ name: "", email: "", message: "" });
    assert.strictEqual(result.valid, false);
    assert.ok(result.errors.name);
    assert.ok(result.errors.email);
    assert.ok(result.errors.message);
  });

  t.test("badly formatted email (no @) -> email error", function () {
    var result = validateForm({
      name: "Ada",
      email: "abc",
      message: "Hello there"
    });
    assert.strictEqual(result.valid, false);
    assert.ok(result.errors.email, "expected an email format error");
  });

  t.test("badly formatted email (no domain) -> email error", function () {
    var result = validateForm({
      name: "Ada",
      email: "abc@def",
      message: "Hello there"
    });
    assert.strictEqual(result.valid, false);
    assert.ok(result.errors.email, "expected an email format error");
  });

  t.test("whitespace-only fields are treated as empty", function () {
    var result = validateForm({ name: "   ", email: "  ", message: "   " });
    assert.strictEqual(result.valid, false);
    assert.ok(result.errors.name);
    assert.ok(result.errors.email);
    assert.ok(result.errors.message);
  });

  t.test("valid email with subdomain passes", function () {
    var result = validateForm({
      name: "Ada",
      email: "ada@mail.example.co.uk",
      message: "Hello there"
    });
    assert.strictEqual(result.valid, true);
  });
}

module.exports = { run: run };
