/**
 * dom-fixture.js
 *
 * A tiny, hand-written fake DOM used only for running the unit tests in
 * this /tests folder with plain Node (no jsdom, no npm dependencies,
 * consistent with architecture.md's "no build tooling" decision).
 *
 * It implements only the small subset of DOM behavior that
 * js/validators.js, js/ui.js, and js/app.js actually use:
 *   - document.getElementById
 *   - element.textContent / .value / .hidden / .disabled
 *   - element.classList.add/remove/contains
 *   - element.closest(".form-field")
 *   - element.focus()
 *   - form.reset() / form.addEventListener("submit", ...) / dispatch
 */
"use strict";

function createClassList() {
  var classes = new Set();
  return {
    add: function (name) {
      classes.add(name);
    },
    remove: function (name) {
      classes.delete(name);
    },
    contains: function (name) {
      return classes.has(name);
    }
  };
}

function createElement(id) {
  var listeners = {};
  return {
    id: id,
    textContent: "",
    value: "",
    hidden: undefined,
    disabledHistory: [],
    _disabled: false,
    classList: createClassList(),
    _closestParent: null,
    focused: false,
    get disabled() {
      return this._disabled;
    },
    set disabled(val) {
      this._disabled = val;
      this.disabledHistory.push(val);
    },
    closest: function (selector) {
      if (selector === ".form-field" && this._closestParent) {
        return this._closestParent;
      }
      return null;
    },
    focus: function () {
      this.focused = true;
    },
    addEventListener: function (type, handler) {
      listeners[type] = listeners[type] || [];
      listeners[type].push(handler);
    },
    dispatchEvent: function (evt) {
      (listeners[evt.type] || []).forEach(function (handler) {
        handler(evt);
      });
    }
  };
}

function createFormElement(id, fieldsToClearOnReset) {
  var el = createElement(id);
  el.wasReset = false;
  el.reset = function () {
    // Mirrors the browser's native HTMLFormElement.reset() behavior of
    // clearing its associated input values, so tests can rely on the
    // form actually being empty afterward (FR-9).
    (fieldsToClearOnReset || []).forEach(function (field) {
      field.value = "";
    });
    el.wasReset = true;
  };
  return el;
}

/**
 * Builds a fresh fixture mirroring index.html's contact form structure.
 * @returns {{ window: object, document: object, elements: object }}
 */
function createFixture(options) {
  var opts = options || {};
  var readyState = opts.readyState || "complete";

  var nameWrapper = createElement("name-wrapper");
  var emailWrapper = createElement("email-wrapper");
  var messageWrapper = createElement("message-wrapper");

  var nameInput = createElement("name");
  nameInput._closestParent = nameWrapper;

  var emailInput = createElement("email");
  emailInput._closestParent = emailWrapper;

  var messageInput = createElement("message");
  messageInput._closestParent = messageWrapper;

  var nameError = createElement("name-error");
  var emailError = createElement("email-error");
  var messageError = createElement("message-error");

  var submitButton = createElement("submit-button");
  var successMessage = createElement("success-message");
  successMessage.hidden = true;

  var form = createFormElement("contact-form", [nameInput, emailInput, messageInput]);

  var elementsById = {
    "name": nameInput,
    "email": emailInput,
    "message": messageInput,
    "name-error": nameError,
    "email-error": emailError,
    "message-error": messageError,
    "submit-button": submitButton,
    "success-message": successMessage,
    "contact-form": form
  };

  var documentListeners = {};

  var doc = {
    readyState: readyState,
    getElementById: function (id) {
      return elementsById[id] || null;
    },
    addEventListener: function (type, handler) {
      documentListeners[type] = documentListeners[type] || [];
      documentListeners[type].push(handler);
    },
    _fireDomContentLoaded: function () {
      (documentListeners["DOMContentLoaded"] || []).forEach(function (handler) {
        handler();
      });
    }
  };

  var win = {};

  return {
    window: win,
    document: doc,
    elements: {
      nameInput: nameInput,
      emailInput: emailInput,
      messageInput: messageInput,
      nameError: nameError,
      emailError: emailError,
      messageError: messageError,
      nameWrapper: nameWrapper,
      emailWrapper: emailWrapper,
      messageWrapper: messageWrapper,
      submitButton: submitButton,
      successMessage: successMessage,
      form: form
    }
  };
}

module.exports = { createFixture: createFixture };
