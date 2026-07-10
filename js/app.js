/**
 * app.js
 *
 * Entry point: wires up the Contact Us form on page load.
 * Reads the 3 fields, calls validateForm(), then either shows errors or
 * shows the success message and resets the form (FR-4 through FR-9).
 *
 * No network request is ever made here (AC-6) — on a valid submission the
 * entered data is only logged to the console as a demo placeholder (FR-8).
 */
(function (global, document) {
  "use strict";

  function init() {
    var form = document.getElementById("contact-form");
    var submitButton = document.getElementById("submit-button");
    var successMessage = document.getElementById("success-message");

    if (!form || !submitButton || !successMessage) {
      // Defensive guard: if the expected markup is missing, do nothing
      // rather than throwing on a page that isn't the expected structure.
      return;
    }

    var nameInput = document.getElementById("name");
    var emailInput = document.getElementById("email");
    var messageInput = document.getElementById("message");

    function handleSubmit(event) {
      event.preventDefault();

      // Guard against a double-click producing more than one success
      // message (AC-7, US-4.3): disable the button immediately.
      submitButton.disabled = true;

      var formValues = {
        name: nameInput ? nameInput.value : "",
        email: emailInput ? emailInput.value : "",
        message: messageInput ? messageInput.value : ""
      };

      var result = global.HelloWorldApp.validateForm(formValues);

      if (!result.valid) {
        global.HelloWorldApp.showErrors(result.errors, document);
        // Re-enable the button so the visitor can correct and retry.
        submitButton.disabled = false;
        return;
      }

      // FR-8: demo placeholder only. Nothing is sent over the network and
      // nothing is written to any storage — this is purely a local,
      // in-memory console log for demonstration purposes.
      // eslint-disable-next-line no-console
      console.log("Contact form submitted (demo only, not sent anywhere):", formValues);

      global.HelloWorldApp.showSuccessAndReset(form, successMessage, document);

      // Re-enable the button once the success flow has completed, so the
      // visitor can submit again for a new entry.
      submitButton.disabled = false;
    }

    form.addEventListener("submit", handleSubmit);
  }

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", init);
  } else {
    init();
  }

  // Exposed for tests only.
  global.HelloWorldApp = global.HelloWorldApp || {};
  global.HelloWorldApp.__init = init;
})(window, document);
