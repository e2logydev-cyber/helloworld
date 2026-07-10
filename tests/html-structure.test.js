/**
 * html-structure.test.js
 *
 * QA-added static-structure checks against the actual index.html markup
 * shipped to the browser (not just the JS behavior), so acceptance
 * criteria tied to markup/wiring are verified directly rather than only
 * inferred from reading the file during review.
 *
 * Covers, via plain regex checks on the real file (no jsdom/browser needed):
 *   - AC-1 / FR-1: "Hello World" heading present, unconditionally in markup.
 *   - AC-2 / FR-2 / FR-3: Contact Us form with exactly Name, Email, Message
 *     fields and a Submit button, nothing extra.
 *   - NFR-7: every field has an associated <label for="...">.
 *   - NFR-2: a responsive viewport meta tag is present.
 *   - Script load order matches the documented dependency
 *     (fields.js -> validators.js -> ui.js -> app.js), which the
 *     production code (validators.js/ui.js) relies on per review.md.
 *   - NFR-5 (partial, code-level only): no <meta http-equiv> or markup that
 *     would force insecure http:// sub-resources.
 */
"use strict";

var assert = require("assert");
var fs = require("fs");
var path = require("path");

function readIndexHtml() {
  return fs.readFileSync(path.join(__dirname, "..", "index.html"), "utf8");
}

function run(t) {
  var html = readIndexHtml();

  t.test("AC-1/FR-1: the page contains an unconditional 'Hello World' heading", function () {
    assert.ok(/<h1[^>]*>\s*Hello World\s*<\/h1>/.test(html), "expected an <h1>Hello World</h1> with no surrounding conditional markup");
  });

  t.test("AC-2/FR-2: a Contact Us form exists on the same page (no iframe/separate page reference)", function () {
    assert.ok(/<form[^>]*id="contact-form"/.test(html), "expected a <form id=\"contact-form\"> on the page");
    assert.ok(!/<iframe/i.test(html), "the Contact Us form must be on the same page, not embedded via an iframe");
  });

  t.test("FR-3: the form has exactly Name, Email, Message fields and no extra fields", function () {
    var inputMatches = html.match(/<input[^>]*>/g) || [];
    var textareaMatches = html.match(/<textarea[^>]*>/g) || [];

    // Exactly one <input> for name, one for email; nothing else (no phone,
    // subject, attachment/file input).
    assert.strictEqual(inputMatches.length, 2, "expected exactly 2 <input> elements (name, email)");
    assert.ok(inputMatches.some(function (tag) { return /id="name"/.test(tag); }), "expected an input with id=\"name\"");
    assert.ok(inputMatches.some(function (tag) { return /id="email"/.test(tag); }), "expected an input with id=\"email\"");
    assert.ok(inputMatches.some(function (tag) { return /type="email"/.test(tag); }), "expected the email input to use type=\"email\"");
    assert.ok(!inputMatches.some(function (tag) { return /type="file"/.test(tag); }), "no file/attachment input is in scope (FR-3)");
    assert.ok(!inputMatches.some(function (tag) { return /type="tel"/.test(tag) || /name="phone"/.test(tag); }), "no phone field is in scope (FR-3)");

    assert.strictEqual(textareaMatches.length, 1, "expected exactly 1 <textarea> (message)");
    assert.ok(/id="message"/.test(textareaMatches[0]), "expected the textarea to have id=\"message\"");
  });

  t.test("AC-2: a Submit button exists", function () {
    assert.ok(/<button[^>]*type="submit"[^>]*id="submit-button"/.test(html), "expected <button type=\"submit\" id=\"submit-button\">");
  });

  t.test("NFR-7: every form field (name, email, message) has an associated visible <label for=\"...\">", function () {
    ["name", "email", "message"].forEach(function (field) {
      var labelPattern = new RegExp('<label for="' + field + '">');
      assert.ok(labelPattern.test(html), "expected <label for=\"" + field + "\"> in index.html");
    });
  });

  t.test("NFR-2: a responsive viewport meta tag is present", function () {
    assert.ok(/<meta name="viewport" content="width=device-width, initial-scale=1\.0">/.test(html), "expected a responsive viewport meta tag");
  });

  t.test("Script load order matches the documented dependency: fields.js, then validators.js, then ui.js, then app.js", function () {
    var scriptSrcs = [];
    var re = /<script src="([^"]+)"><\/script>/g;
    var match;
    while ((match = re.exec(html)) !== null) {
      scriptSrcs.push(match[1]);
    }
    assert.deepStrictEqual(scriptSrcs, ["js/fields.js", "js/validators.js", "js/ui.js", "js/app.js"]);
  });

  t.test("error-message elements exist for each field with role=\"alert\" (screen-reader announcement, NFR-7)", function () {
    ["name", "email", "message"].forEach(function (field) {
      var pattern = new RegExp('id="' + field + '-error"[^>]*role="alert"');
      assert.ok(pattern.test(html), "expected id=\"" + field + "-error\" with role=\"alert\"");
    });
  });

  t.test("success message element uses role=\"status\" and aria-live=\"polite\", and starts hidden (NFR-7)", function () {
    assert.ok(/id="success-message"[^>]*role="status"[^>]*aria-live="polite"[^>]*hidden/.test(html));
  });

  t.test("no inline event handler attributes (onclick=, onsubmit=, etc.) are used in the markup", function () {
    assert.ok(!/\bon[a-z]+\s*=/i.test(html), "expected no inline on* event handler attributes in index.html");
  });

  t.test("no hardcoded http:// sub-resource references that would undermine HTTPS (NFR-5)", function () {
    assert.ok(!/src="http:\/\//.test(html) && !/href="http:\/\//.test(html), "expected no http:// (non-HTTPS) sub-resource references");
  });
}

module.exports = { run: run };
