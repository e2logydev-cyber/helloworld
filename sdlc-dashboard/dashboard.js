/**
 * dashboard.js
 *
 * Polls status.json every 2 seconds and re-renders the stage grid.
 * Also polls pending-question.json on the same interval for the
 * "question bridge": when the orchestrator has an open question blocking a
 * stage, this replaces the normal stage view with a question panel so the
 * user can answer from the browser instead of only in chat.
 *
 * No frameworks, no build step. DOM nodes are built with createElement /
 * textContent (never innerHTML), consistent with this repo's existing
 * "no unsafe HTML injection" convention.
 */
"use strict";

var POLL_INTERVAL_MS = 2000;
var STATUS_URL = "status.json";
var PENDING_QUESTION_URL = "pending-question.json";
var ANSWER_ENDPOINT = "/api/answer";

var stageGridEl = document.getElementById("stage-grid");
var lastUpdatedEl = document.getElementById("last-updated");
var connectionIndicatorEl = document.getElementById("connection-indicator");
var mainEl = document.querySelector("main");

var questionPanelEl = document.getElementById("question-panel");
var questionStageEl = document.getElementById("question-stage");
var questionTextEl = document.getElementById("question-text");
var questionOptionsEl = document.getElementById("question-options");
var questionFeedbackEl = document.getElementById("question-feedback");

// Tracks what is currently rendered in the question panel so we don't
// rebuild the form (and lose focus/typed text) on every 2-second poll tick
// when nothing has actually changed.
var questionUiState = {
  renderedQuestionId: null, // id of the question whose form is currently built
  submittedQuestionId: null, // id we already successfully POSTed an answer for
  freeTextValue: "", // preserves what the user typed if a submit attempt fails
  isSubmitting: false
};

function formatDateTime(isoString) {
  if (!isoString) {
    return "—";
  }
  var d = new Date(isoString);
  if (isNaN(d.getTime())) {
    return "—";
  }
  return d.toLocaleString();
}

function formatDuration(totalSeconds) {
  if (totalSeconds === null || totalSeconds === undefined || isNaN(totalSeconds)) {
    return "—";
  }
  var seconds = Math.floor(totalSeconds % 60);
  var minutes = Math.floor(totalSeconds / 60) % 60;
  var hours = Math.floor(totalSeconds / 3600);

  var parts = [];
  if (hours > 0) {
    parts.push(hours + "h");
  }
  if (hours > 0 || minutes > 0) {
    parts.push(minutes + "m");
  }
  parts.push(seconds + "s");

  return parts.join(" ");
}

function statusClass(status) {
  var normalized = String(status || "").toLowerCase();
  if (normalized === "pending" || normalized === "running" || normalized === "completed" || normalized === "failed") {
    return "status-" + normalized;
  }
  return "status-pending";
}

function createDetailRow(labelText, valueText, isMuted) {
  var row = document.createElement("div");
  row.className = "stage-detail-row";

  var label = document.createElement("span");
  label.className = "label";
  label.textContent = labelText;

  var value = document.createElement("span");
  value.className = "value" + (isMuted ? " not-recorded" : "");
  value.textContent = valueText;

  row.appendChild(label);
  row.appendChild(value);
  return row;
}

function createStageCard(stage) {
  var card = document.createElement("div");
  card.className = "stage-card";

  var header = document.createElement("div");
  header.className = "stage-card-header";

  var name = document.createElement("span");
  name.className = "stage-name";
  name.textContent = stage.name || "Unknown stage";

  var badge = document.createElement("span");
  badge.className = "status-badge " + statusClass(stage.status);
  badge.textContent = stage.status || "Pending";

  header.appendChild(name);
  header.appendChild(badge);
  card.appendChild(header);

  card.appendChild(createDetailRow("Start", formatDateTime(stage.startTime), false));
  card.appendChild(createDetailRow("End", formatDateTime(stage.endTime), false));
  card.appendChild(createDetailRow("Duration", formatDuration(stage.durationSeconds), false));

  var tokensText;
  var tokensMuted = false;
  if (stage.tokensUsed === null || stage.tokensUsed === undefined) {
    tokensText = stage.tokensNote ? stage.tokensNote : "not recorded";
    tokensMuted = true;
  } else {
    tokensText = String(stage.tokensUsed);
  }
  card.appendChild(createDetailRow("Total Tokens Used", tokensText, tokensMuted));

  return card;
}

function render(data) {
  // Clear existing content without innerHTML.
  while (stageGridEl.firstChild) {
    stageGridEl.removeChild(stageGridEl.firstChild);
  }

  var stages = (data && Array.isArray(data.stages)) ? data.stages : [];
  stages.forEach(function (stage) {
    stageGridEl.appendChild(createStageCard(stage));
  });

  lastUpdatedEl.textContent = "Last updated: " + (data && data.lastUpdated ? formatDateTime(data.lastUpdated) : "—");
}

function showConnectionLost(isLost) {
  connectionIndicatorEl.hidden = !isLost;
}

function poll() {
  var url = STATUS_URL + "?t=" + Date.now();

  fetch(url, { cache: "no-store" })
    .then(function (response) {
      if (!response.ok) {
        throw new Error("HTTP " + response.status);
      }
      return response.json();
    })
    .then(function (data) {
      showConnectionLost(false);
      render(data);
    })
    .catch(function () {
      showConnectionLost(true);
    });
}

function clearFeedback() {
  questionFeedbackEl.hidden = true;
  questionFeedbackEl.textContent = "";
  questionFeedbackEl.className = "question-feedback";
}

function showFeedback(message, isError) {
  questionFeedbackEl.hidden = false;
  questionFeedbackEl.textContent = message;
  questionFeedbackEl.className = "question-feedback " + (isError ? "feedback-error" : "feedback-success");
}

function setQuestionViewVisible(isVisible) {
  questionPanelEl.hidden = !isVisible;
  if (mainEl) {
    mainEl.hidden = isVisible;
  }
}

/** Sends the answer to the server and updates the panel based on the result. */
function submitAnswer(questionId, answerText, submitButtonEls) {
  questionUiState.isSubmitting = true;
  clearFeedback();
  (submitButtonEls || []).forEach(function (el) {
    el.disabled = true;
  });

  fetch(ANSWER_ENDPOINT, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ questionId: questionId, answerText: answerText })
  })
    .then(function (response) {
      return response.json().catch(function () {
        return {};
      }).then(function (body) {
        if (!response.ok) {
          var errMessage = (body && body.error) ? body.error : ("HTTP " + response.status);
          throw new Error(errMessage);
        }
        return body;
      });
    })
    .then(function () {
      questionUiState.isSubmitting = false;
      questionUiState.submittedQuestionId = questionId;
      questionUiState.freeTextValue = "";
      showFeedback("Answer submitted — waiting for the workflow to pick it up.", false);
    })
    .catch(function (err) {
      questionUiState.isSubmitting = false;
      (submitButtonEls || []).forEach(function (el) {
        el.disabled = false;
      });
      showFeedback("Could not submit your answer (" + err.message + "). Please try again.", true);
    });
}

function buildOptionButtons(question) {
  var wrapper = document.createElement("div");
  wrapper.className = "question-options";

  var allButtons = [];
  question.options.forEach(function (optionText) {
    var button = document.createElement("button");
    button.type = "button";
    button.className = "question-option-button";
    button.textContent = optionText;
    allButtons.push(button);
    wrapper.appendChild(button);
  });

  allButtons.forEach(function (button, index) {
    button.addEventListener("click", function () {
      submitAnswer(question.id, question.options[index], allButtons);
    });
  });

  return wrapper;
}

function buildFreeTextForm(question) {
  var wrapper = document.createElement("div");
  wrapper.className = "question-options";

  var input = document.createElement("textarea");
  input.className = "question-text-input";
  input.rows = 2;
  input.placeholder = "Type your answer here...";
  input.value = questionUiState.freeTextValue;
  input.addEventListener("input", function () {
    questionUiState.freeTextValue = input.value;
  });

  var submitButton = document.createElement("button");
  submitButton.type = "button";
  submitButton.className = "question-submit-button";
  submitButton.textContent = "Submit answer";

  submitButton.addEventListener("click", function () {
    var trimmed = input.value.trim();
    if (!trimmed) {
      showFeedback("Please enter an answer before submitting.", true);
      return;
    }
    submitAnswer(question.id, trimmed, [submitButton]);
  });

  wrapper.appendChild(input);
  wrapper.appendChild(submitButton);
  return wrapper;
}

function renderQuestionForm(question) {
  while (questionOptionsEl.firstChild) {
    questionOptionsEl.removeChild(questionOptionsEl.firstChild);
  }

  var content;
  if (Array.isArray(question.options) && question.options.length > 0) {
    content = buildOptionButtons(question);
  } else {
    content = buildFreeTextForm(question);
  }

  while (content.firstChild) {
    questionOptionsEl.appendChild(content.firstChild);
  }

  questionStageEl.textContent = "Blocking stage: " + (question.stage || "Unknown stage");
  questionTextEl.textContent = question.text || "";
  clearFeedback();

  questionUiState.renderedQuestionId = question.id;
}

/**
 * Renders the "already answered, waiting on the orchestrator" state so the
 * user doesn't see the form again after a successful submit, even though
 * pending-question.json still reports hasPendingQuestion: true until the
 * orchestrator actually consumes the answer and clears it.
 */
function renderAwaitingPickup(question) {
  while (questionOptionsEl.firstChild) {
    questionOptionsEl.removeChild(questionOptionsEl.firstChild);
  }
  questionStageEl.textContent = "Blocking stage: " + (question.stage || "Unknown stage");
  questionTextEl.textContent = question.text || "";
  showFeedback("Answer submitted — waiting for the workflow to pick it up.", false);
}

function handlePendingQuestionData(data) {
  var hasPendingQuestion = !!(data && data.hasPendingQuestion && data.question);

  if (!hasPendingQuestion) {
    // No open question (or the orchestrator has cleared it) — revert to the
    // normal stage dashboard and reset local UI state for the next question.
    if (!questionPanelEl.hidden) {
      setQuestionViewVisible(false);
    }
    questionUiState.renderedQuestionId = null;
    questionUiState.submittedQuestionId = null;
    questionUiState.freeTextValue = "";
    return;
  }

  var question = data.question;
  setQuestionViewVisible(true);

  if (questionUiState.submittedQuestionId === question.id) {
    // Already answered this one; keep showing the confirmation until the
    // orchestrator clears the question (handled in the branch above).
    renderAwaitingPickup(question);
    return;
  }

  if (questionUiState.renderedQuestionId !== question.id) {
    // New question we haven't built a form for yet — reset local state and
    // render fresh (a new question id means any previous submit no longer
    // applies).
    questionUiState.freeTextValue = "";
    renderQuestionForm(question);
  }
}

function pollPendingQuestion() {
  var url = PENDING_QUESTION_URL + "?t=" + Date.now();

  fetch(url, { cache: "no-store" })
    .then(function (response) {
      if (!response.ok) {
        throw new Error("HTTP " + response.status);
      }
      return response.json();
    })
    .then(function (data) {
      handlePendingQuestionData(data);
    })
    .catch(function () {
      // If pending-question.json can't be read, fail quietly and keep
      // showing whatever was last rendered; the main status poll already
      // surfaces a connection-lost indicator for real outages.
    });
}

function pollAll() {
  poll();
  pollPendingQuestion();
}

pollAll();
setInterval(pollAll, POLL_INTERVAL_MS);
