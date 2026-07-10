/**
 * validators.js
 *
 * Required-field and email-format checks (FR-4, FR-5).
 * Pure functions only — no DOM access here, so these are easy to unit test
 * in isolation (see /tests/validators.test.js).
 *
 * Exposed on the shared "HelloWorldApp" namespace so app.js can use it
 * without needing a build step or ES module loader.
 */
(function (global) {
  "use strict";

  // Simple, reasonable email pattern: something@something.something
  // Not a full RFC-5322 validator, just a practical "looks like an email" check per FR-5.
  var EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

  /**
   * Validates a single set of form values.
   * @param {{ name: string, email: string, message: string }} formValues
   * @returns {{ valid: boolean, errors: { name?: string, email?: string, message?: string } }}
   */
  function validateForm(formValues) {
    var values = formValues || {};
    var name = (values.name || "").trim();
    var email = (values.email || "").trim();
    var message = (values.message || "").trim();

    var errors = {};

    if (!name) {
      errors.name = "Please enter your name.";
    }

    if (!email) {
      errors.email = "Please enter your email address.";
    } else if (!EMAIL_PATTERN.test(email)) {
      errors.email = "Please enter a valid email address (e.g. name@example.com).";
    }

    if (!message) {
      errors.message = "Please enter a message.";
    }

    return {
      valid: Object.keys(errors).length === 0,
      errors: errors
    };
  }

  global.HelloWorldApp = global.HelloWorldApp || {};
  global.HelloWorldApp.validateForm = validateForm;
})(window);
