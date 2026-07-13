/**
 * server.js
 *
 * Zero-dependency static file server for the SDLC dashboard.
 * Uses only Node's built-in http, fs, and path modules — no npm install,
 * consistent with this repo's existing "no npm install" test tooling
 * (see tests/run-tests.js).
 *
 * Also serves one API route, POST /api/answer, used by the "question
 * bridge" (see README.md). This lets the browser dashboard answer a
 * clarifying question the orchestrator has posted to pending-question.json,
 * without needing any native chat UI popup.
 *
 * Usage:
 *   node server.js
 *   node server.js 8080
 *   PORT=8080 node server.js
 *
 * Then open the printed URL in a browser.
 */
"use strict";

var http = require("http");
var fs = require("fs");
var path = require("path");

var DEFAULT_PORT = 5500;
var MAX_BODY_BYTES = 1024 * 1024; // 1 MB safety cap on the request body
var ANSWER_FILE = path.join(__dirname, "answer.json");

function resolvePort() {
  var cliArg = process.argv[2];
  if (cliArg && !isNaN(Number(cliArg))) {
    return Number(cliArg);
  }
  if (process.env.PORT && !isNaN(Number(process.env.PORT))) {
    return Number(process.env.PORT);
  }
  return DEFAULT_PORT;
}

var PORT = resolvePort();
var ROOT_DIR = __dirname;

var CONTENT_TYPES = {
  ".html": "text/html; charset=utf-8",
  ".css": "text/css; charset=utf-8",
  ".js": "text/javascript; charset=utf-8",
  ".json": "application/json; charset=utf-8"
};

function sendNotFound(res) {
  res.writeHead(404, { "Content-Type": "text/plain; charset=utf-8" });
  res.end("404 Not Found");
}

function sendServerError(res, err) {
  res.writeHead(500, { "Content-Type": "text/plain; charset=utf-8" });
  res.end("500 Internal Server Error: " + (err && err.message ? err.message : "unknown error"));
}

function sendJson(res, statusCode, payload) {
  var body = JSON.stringify(payload);
  res.writeHead(statusCode, { "Content-Type": "application/json; charset=utf-8" });
  res.end(body);
}

/**
 * Reads the full request body as text, guarding against bodies over
 * MAX_BODY_BYTES so a malformed/huge request can't exhaust memory.
 * Calls back with (err, bodyText).
 */
function readRequestBody(req, callback) {
  var chunks = [];
  var totalBytes = 0;
  var done = false;

  req.on("data", function (chunk) {
    if (done) {
      return;
    }
    totalBytes += chunk.length;
    if (totalBytes > MAX_BODY_BYTES) {
      done = true;
      callback(new Error("Request body too large"));
      req.destroy();
      return;
    }
    chunks.push(chunk);
  });

  req.on("end", function () {
    if (done) {
      return;
    }
    done = true;
    callback(null, Buffer.concat(chunks).toString("utf8"));
  });

  req.on("error", function (err) {
    if (done) {
      return;
    }
    done = true;
    callback(err);
  });
}

/**
 * POST /api/answer
 *
 * Body: { "questionId": "<string>", "answerText": "<string>" }
 * Writes answer.json with status "unread" and a fresh answeredAt timestamp.
 *
 * IMPORTANT ORDERING NOTE — do not "simplify" this away:
 * This handler intentionally does NOT touch pending-question.json. Clearing
 * hasPendingQuestion back to false is the orchestrator's job, done only
 * after it has actually read answer.json and resumed the workflow. If this
 * server cleared pending-question.json itself, the dashboard's optimistic
 * UI could move on while the orchestrator still has no idea an answer
 * exists yet (e.g. if the browser tab is closed or the orchestrator isn't
 * invoked again for a while) — the "is there an unconsumed question"
 * signal would be lost. Keep the two files owned by two different writers:
 * pending-question.json is orchestrator-owned, answer.json is
 * server.js-owned.
 */
function handleAnswerSubmission(req, res) {
  readRequestBody(req, function (err, bodyText) {
    if (err) {
      sendJson(res, 400, { error: "Failed to read request body: " + err.message });
      return;
    }

    var parsed;
    try {
      parsed = JSON.parse(bodyText);
    } catch (parseErr) {
      sendJson(res, 400, { error: "Malformed JSON body: " + parseErr.message });
      return;
    }

    if (!parsed || typeof parsed !== "object") {
      sendJson(res, 400, { error: "Request body must be a JSON object" });
      return;
    }

    var questionId = parsed.questionId;
    var answerText = parsed.answerText;

    if (typeof questionId !== "string" || questionId.length === 0) {
      sendJson(res, 400, { error: "Missing or invalid required field: questionId" });
      return;
    }
    if (typeof answerText !== "string" || answerText.length === 0) {
      sendJson(res, 400, { error: "Missing or invalid required field: answerText" });
      return;
    }

    var answerRecord = {
      questionId: questionId,
      answerText: answerText,
      answeredAt: new Date().toISOString(),
      status: "unread"
    };

    fs.writeFile(ANSWER_FILE, JSON.stringify(answerRecord, null, 2) + "\n", function (writeErr) {
      if (writeErr) {
        sendServerError(res, writeErr);
        return;
      }
      sendJson(res, 200, { ok: true, message: "Answer recorded.", answer: answerRecord });
    });
  });
}

var server = http.createServer(function (req, res) {
  var requestPath = req.url.split("?")[0];

  if (requestPath === "/api/answer") {
    if (req.method !== "POST") {
      sendJson(res, 405, { error: "Method not allowed. Use POST." });
      return;
    }
    handleAnswerSubmission(req, res);
    return;
  }

  if (requestPath === "/") {
    requestPath = "/dashboard.html";
  }

  // Resolve against ROOT_DIR and ensure the result stays inside it
  // (basic protection against path traversal via "..").
  var safePath = path.normalize(path.join(ROOT_DIR, requestPath));
  if (safePath.indexOf(ROOT_DIR) !== 0) {
    sendNotFound(res);
    return;
  }

  fs.readFile(safePath, function (err, data) {
    if (err) {
      sendNotFound(res);
      return;
    }

    var ext = path.extname(safePath).toLowerCase();
    var contentType = CONTENT_TYPES[ext] || "application/octet-stream";

    try {
      res.writeHead(200, { "Content-Type": contentType });
      res.end(data);
    } catch (writeErr) {
      sendServerError(res, writeErr);
    }
  });
});

server.listen(PORT, function () {
  console.log("SDLC dashboard running at http://localhost:" + PORT + " — press Ctrl+C to stop.");
});
