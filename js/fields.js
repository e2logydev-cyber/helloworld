/**
 * fields.js
 *
 * Single source of truth for the Contact Us form field identifiers
 * (Name, Email, Message). `validators.js` and `ui.js` both read this list
 * instead of hardcoding their own copy of ["name", "email", "message"], so
 * a rename/add/remove only has to happen in one place.
 *
 * These values must keep matching the element `id`/`name` attributes used
 * in `index.html` (FR-3).
 *
 * Exposed on the shared "HelloWorldApp" namespace so the other scripts can
 * use it without needing a build step or ES module loader. Must be loaded
 * before validators.js and ui.js (see index.html script order).
 */
(function (global) {
  "use strict";

  global.HelloWorldApp = global.HelloWorldApp || {};
  global.HelloWorldApp.FIELD_NAMES = ["name", "email", "message"];
})(window);
