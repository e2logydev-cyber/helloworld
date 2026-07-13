# SDLC Live Status Dashboard

This is a small internal tool for the AI SDLC orchestration process itself.
It is not part of the "hello world" product (the landing page and contact
form live outside this folder and are not touched by this tool).

It shows a live view of each SDLC stage (Requirements, Planning, Design,
Branch Setup, Development, Commit & PR, Code Review, Testing & QA, Merge,
CI/CD, Release, Documentation) by reading `status.json` in this folder.

## How to run it

1. Open a terminal inside this folder: `sdlc-dashboard/`
2. Start the server:
   ```
   node server.js
   ```
   (You can also set a different port: `node server.js 8080` or `PORT=8080 node server.js`.)
3. Open the URL printed in the terminal, by default:
   ```
   http://localhost:5500
   ```

No `npm install` and no external dependencies are needed — the server uses
only Node's built-in `http`, `fs`, and `path` modules, the same
zero-dependency approach already used by `tests/run-tests.js` in this repo.

## Where the data comes from

`status.json` is written by the orchestrator process as it moves through
each SDLC stage. This dashboard only reads and displays that file — it does
not generate or edit it. The page polls `status.json` every 2 seconds and
redraws itself; this is polling, not a live push connection, so there can be
up to a 2 second delay before a change shows up.

## About "Total Tokens Used"

The token count shown for each stage reflects tokens reported by the
specialist agent that was delegated to do that stage's work (captured from
that agent's own tool-call result). It does not include the full,
end-to-end token cost of the orchestrator's own reasoning and tool calls
outside of delegation. Treat this number as a good-faith measurement of the
delegated work for that stage, not a complete token bill for the whole
session.

Stages that finished before this dashboard existed do not have real
timestamps or token counts on record, so they are shown as "not recorded"
rather than a guessed number.

## The question bridge

Sometimes the orchestrator needs to ask the user a clarifying question in
the middle of a stage, but this dashboard cannot hook into any native chat
UI popup — that layer is owned elsewhere and is not editable from here.
The question bridge is a small file-based workaround so a question can
still be answered from this browser dashboard.

**End-to-end flow:**

1. The orchestrator decides a question needs to go through this bridge
   (this is opt-in per question, see the limitation below) and writes
   `pending-question.json` with `hasPendingQuestion: true` and a `question`
   object (id, stage, text, and either a list of `options` or `null` for a
   free-text answer).
2. The dashboard page, which already polls `status.json` every 2 seconds,
   also polls `pending-question.json` on the same interval. When it sees
   `hasPendingQuestion: true`, it hides the normal stage grid and shows a
   question panel instead: which stage is blocked, the question text, and
   either option buttons or a text box with a submit button.
3. The user answers, either by clicking an option or typing free text and
   clicking submit. The browser sends `POST /api/answer` with
   `{ "questionId": ..., "answerText": ... }` to `server.js`.
4. `server.js` validates the body and writes `answer.json` with
   `status: "unread"` and a fresh `answeredAt` timestamp. The dashboard
   shows "Answer submitted — waiting for the workflow to pick it up." and
   goes back to polling `pending-question.json`.
5. The orchestrator, the next time it is actually invoked, reads
   `answer.json`, sees an unread answer, and resumes the workflow using
   it. Only the orchestrator clears both files back to their empty state
   (`pending-question.json` back to `hasPendingQuestion: false`, and
   `answer.json` back to its `status: "none"` seed values). Once
   `pending-question.json` reports `hasPendingQuestion: false` again, the
   dashboard automatically reverts to the normal stage view on its next
   poll.

**Why `server.js` never clears `pending-question.json` itself:** the
dashboard's "waiting for the workflow to pick it up" message is an
optimistic UI state. The real signal for "is there still an unconsumed
question" is `pending-question.json`, and only the orchestrator knows when
it has actually read and used the answer. If `server.js` cleared that file
as soon as the browser posted an answer, the "unconsumed question" signal
could be lost even though the orchestrator never actually saw it (for
example, if the browser tab is closed right after submitting, or the
orchestrator isn't invoked again for a while). Keeping the two files
separately owned — `pending-question.json` written only by the
orchestrator, `answer.json` written only by `server.js` — keeps that
signal reliable. This is also called out in a code comment in `server.js`
so it is not "simplified away" by a future edit.

**Real limitations, stated plainly:**

- There is no always-on background process on the orchestrator's side in
  this setup. The orchestrator only runs when it is actively invoked
  during a conversation turn. So "resume automatically" really means "the
  orchestrator picks up the answer and continues the next time it is
  actually invoked," not an instant, push-driven resume. The dashboard's
  2-second poll is fast; how quickly the orchestrator side actually picks
  up the answer is not guaranteed to be that fast, and depends on when the
  orchestrator is next run.
- This bridge only covers questions that the orchestrator deliberately
  chooses to route through these two files. It is an opt-in channel for
  specific blocking questions, not a universal intercept of every internal
  tool call any agent makes.

**Files involved:**

- `pending-question.json` — written/overwritten only by the orchestrator.
  Seeded as `{ "hasPendingQuestion": false, "question": null }` when there
  is nothing pending.
- `answer.json` — written only by `server.js` when the dashboard submits an
  answer. Seeded as
  `{ "questionId": null, "answerText": null, "answeredAt": null, "status": "none" }`
  when there is no answer yet, and set to `"status": "unread"` once the
  dashboard submits something. The orchestrator is expected to treat
  `status` as its way of knowing whether it has already consumed a given
  answer.
