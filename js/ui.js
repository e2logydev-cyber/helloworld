/**
 * ui.js
 *
 * Show/hide field error messages, show the success message, and reset the
 * form (FR-6, FR-7, FR-9). All user-supplied or user-facing text is written
 * with textContent (never innerHTML) so nothing typed by a visitor can be
 * interpreted as HTML/script (NFR-4).
 *
 * Exposed on the shared "HelloWorldApp" namespace so app.js can use it
 * without needing a build step or ES module loader.
 */
(function (global) {
  "use strict";

  var FIELD_NAMES = ["name", "email", "message"];

  /**
   * Clears every field-level error message and the "has-error" styling hook.
   * @param {Document|HTMLElement} root
   */
  function clearErrors(root) {
    FIELD_NAMES.forEach(function (field) {
      var errorEl = root.getElementById(field + "-error");
      var fieldWrapper = root.getElementById(field);

      if (errorEl) {
        errorEl.textContent = "";
      }
      if (fieldWrapper) {
        var wrapper = fieldWrapper.closest(".form-field");
        if (wrapper) {
          wrapper.classList.remove("has-error");
        }
      }
    });
  }

  /**
   * Renders field-specific error messages without touching the values the
   * visitor already typed in other fields (FR-6).
   * @param {{ name?: string, email?: string, message?: string }} errors
   * @param {Document} root
   */
  function showErrors(errors, root) {
    var doc = root || document;
    clearErrors(doc);

    var firstInvalidField = null;

    FIELD_NAMES.forEach(function (field) {
      var message = errors ? errors[field] : null;
      if (!message) {
        return;
      }

      var errorEl = doc.getElementById(field + "-error");
      var inputEl = doc.getElementById(field);

      if (errorEl) {
        errorEl.textContent = message;
      }
      if (inputEl) {
        var wrapper = inputEl.closest(".form-field");
        if (wrapper) {
          wrapper.classList.add("has-error");
        }
        if (!firstInvalidField) {
          firstInvalidField = inputEl;
        }
      }
    });

    // Move focus to the first invalid field so keyboard-only visitors
    // immediately land where they need to fix something (NFR-7).
    if (firstInvalidField) {
      firstInvalidField.focus();
    }
  }

  /**
   * Shows the on-page success confirmation and resets the form fields
   * (FR-7, FR-9). Uses textContent so nothing echoed back can be
   * interpreted as markup (NFR-4).
   * @param {HTMLFormElement} formEl
   * @param {HTMLElement} successEl
   * @param {Document} root
   */
  function showSuccessAndReset(formEl, successEl, root) {
    var doc = root || document;

    clearErrors(doc);

    if (successEl) {
      successEl.textContent = "Thank you, your message has been sent.";
      successEl.hidden = false;
    }

    if (formEl) {
      formEl.reset();
    }
  }

  /**
   * Hides the success message (e.g. when the visitor starts a new attempt).
   * @param {HTMLElement} successEl
   */
  function hideSuccess(successEl) {
    if (successEl) {
      successEl.hidden = true;
      successEl.textContent = "";
    }
  }

  global.HelloWorldApp = global.HelloWorldApp || {};
  global.HelloWorldApp.clearErrors = clearErrors;
  global.HelloWorldApp.showErrors = showErrors;
  global.HelloWorldApp.showSuccessAndReset = showSuccessAndReset;
  global.HelloWorldApp.hideSuccess = hideSuccess;
})(window);
