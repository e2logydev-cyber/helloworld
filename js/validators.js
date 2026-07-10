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

  global.HelloWorldApp = global.HelloWorldApp || {};

  // Field identifiers come from js/fields.js (the single source of truth
  // shared with ui.js and matching index.html's element ids/names). This
  // must be loaded before validators.js (see index.html script order).
  var FIELD_NAMES = global.HelloWorldApp.FIELD_NAMES;

  // Simple, reasonable email pattern: something@something.something
  // Not a full RFC-5322 validator, just a practical "looks like an email" check per FR-5.
  var EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

  var REQUIRED_MESSAGES = {
    name: "Please enter your name.",
    email: "Please enter your email address.",
    message: "Please enter a message."
  };

  /**
   * Validates a single set of form values.
   * @param {{ name: string, email: string, message: string }} formValues
   * @returns {{ valid: boolean, errors: { name?: string, email?: string, message?: string } }}
   */
  function validateForm(formValues) {
    var values = formValues || {};
    var errors = {};

    FIELD_NAMES.forEach(function (field) {
      var value = (values[field] || "").trim();

      if (!value) {
        errors[field] = REQUIRED_MESSAGES[field];
      } else if (field === "email" && !EMAIL_PATTERN.test(value)) {
        errors.email = "Please enter a valid email address (e.g. name@example.com).";
      }
    });

    return {
      valid: Object.keys(errors).length === 0,
      errors: errors
    };
  }

  global.HelloWorldApp.validateForm = validateForm;
})(window);
