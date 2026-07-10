# Requirements — Hello World Landing Page

**Status: Approved / Finalized** — confirmed by user on 2026-07-10.

## Project Overview
This project is a simple, single public web page. The page shows a "Hello World" heading/text, and on the same page there is a Contact Us form so visitors can fill in an enquiry. This is a **frontend-only, static page** — there is no backend server, no database, and no email delivery of any kind. Nothing typed into the Contact Us form is sent anywhere or saved anywhere outside the visitor's own browser. There is no login, no user account area, and no other pages planned at this stage. This is a first pipeline/demo project to prove out the working end-to-end process, so it should still be built cleanly and correctly, even though it does not handle or store any real visitor data.

## Objectives
- OBJ-1: Give visitors a simple, working page that clearly shows "Hello World" text.
- OBJ-2: Let visitors fill in and submit a Contact Us form on the same page, without needing to create an account.
- OBJ-3: Give the visitor clear, immediate feedback (a success message shown on the page) once they submit a correctly filled-in form, entirely within their own browser, with no data sent to or kept on any server.

## Scope

**In scope:**
- One single public page containing:
  - "Hello World" text/heading.
  - A Contact Us form (Name, Email, Message).
- A static, frontend-only build — no backend server, no database, no email sending. The whole page runs in the visitor's browser.
- Client-side (in-browser) validation of the form (required fields, email format).
- A client-side success confirmation shown on the page after the visitor submits a validly filled-in form. The "submission" is simulated locally (for example, the entered data may simply be logged to the browser console for demo purposes) — it is not sent to or stored by any backend.
- Basic input validation and error messages shown to the visitor, all handled in the browser.

**Out of scope:**
- Any server-side handling of the form (no API endpoint, no server receiving the data).
- Emailing the enquiry to anyone (no project owner, admin, or any other recipient receives it).
- Saving/storing the enquiry in a database or any other persistent storage.
- User accounts, login, or authentication of any kind.
- Multiple pages, navigation menus, or a content management system.
- An admin dashboard to view/manage enquiries (there is nothing to manage, since nothing is stored).
- Multi-language / translated content.
- Integration with a CRM, ticketing system, or marketing tool.
- Mobile app or native app version (this is a web page only).

## Functional Requirements

- FR-1: The page must display the text "Hello World" visibly on page load, without requiring any user action.
- FR-2: The page must display a Contact Us form on the same page (not a separate page or pop-up), below or near the "Hello World" text.
- FR-3: The Contact Us form must contain exactly these fields: Name (text), Email (text), Message (multi-line text). Confirmed as final — no other fields (no subject line, no phone number, no attachments).
- FR-4: Name, Email, and Message must all be required fields. The form must not submit if any of them is empty.
- FR-5: The Email field must be validated, in the browser, to be in a correctly formatted email address (e.g., contains "@" and a domain) before the form is treated as valid.
- FR-6: If validation fails, the form must show a clear, specific error message next to the field that failed, without clearing out what the visitor already typed in other fields.
- FR-7: When the form passes validation, the visitor must see a clear on-page confirmation message (e.g., "Thank you, your message has been sent."), shown entirely by the browser. No network request to any backend is made to deliver this message.
- FR-8: On successful (validated) submission, the entered data (Name, Email, Message) is handled only within the browser — for example, it may be logged to the browser's developer console as a demo placeholder — and is not sent to any server, saved to any database, or emailed anywhere. Nothing about the enquiry persists after the visitor reloads or closes the page.
- FR-9: After showing the success confirmation, the form should clear/reset its fields, ready for a new entry if the visitor wants to submit again.

## Non-functional Requirements

- NFR-1: The page must load and become usable (able to read the text and see the form) within 3 seconds on a standard broadband connection. *(Assumption — no specific target was given; flagged as an assumption, not a confirmed SLA.)*
- NFR-2: The page must be usable on both desktop and mobile-sized browser windows (responsive layout).
- NFR-3: The page must work correctly on current versions of Chrome, Firefox, Edge, and Safari. *(Assumption — no specific browser list was given.)*
- NFR-4: All form input must be handled safely in the browser (e.g., not inserted into the page as raw, unescaped HTML) so that a visitor cannot trigger a script-injection issue in their own browser session, even though nothing is sent to a server.
- NFR-5: The page itself should be served over HTTPS (encrypted connection) once hosted, as general good practice for any public web page. This is no longer tied to form submission, since the form does not send data to a server at all.
- NFR-6: Since no enquiry data is transmitted or stored anywhere outside the visitor's own browser, there is no exposure risk to a third party or any recipient — enquiry data simply does not exist anywhere once the visitor leaves the page.
- NFR-7: Basic accessibility must be supported: form fields must have visible labels, and the page must be usable with keyboard navigation alone (no mouse required).
- NFR-8: The system should reasonably handle normal small-scale traffic (occasional visitors) as a static page, since no specific expected traffic volume was provided. *(Assumption — flagged as a risk if traffic turns out to be much higher than expected, though a static frontend-only page scales easily.)*

## User Roles

- **Visitor** — Any member of the public who opens the page. Can read the "Hello World" text and fill in and submit the Contact Us form, and sees a success or error message directly on the page. No login or account is required or available.

There is no "Project Owner / Recipient" role in this phase, and no "admin" role with a login-protected dashboard. Since the form does not send data anywhere, there is no one who receives or reviews submitted enquiries at this time. If the project owner later wants to actually receive or review enquiries, that requires adding a backend (email delivery and/or storage) as a new phase of work — see Risks.

## Business Rules

- BR-1: A submission is only treated as valid (and only then shown a success confirmation) if Name, Email, and Message are all present and Email passes basic format validation, checked entirely in the browser.
- BR-2: Since there is no backend, the system has no responsibility to guarantee any enquiry is saved, delivered, or retrievable afterward. Enquiry data exists only for the duration of the visitor's session in their own browser.
- BR-3: No enquiry data is sent to, or made visible to, any other person or system. It stays local to the submitting visitor's own browser only.

## Acceptance Criteria

- AC-1: Given a visitor opens the page, when the page finishes loading, then the text "Hello World" is visible without any further action.
- AC-2: Given a visitor is on the page, when they scroll to or view the Contact Us section, then they see fields for Name, Email, and Message, and a Submit button.
- AC-3: Given a visitor submits the form with all fields filled in correctly, when the submission is processed, then the visitor sees an on-page success confirmation message, and the form fields are cleared/reset.
- AC-4: Given a visitor submits the form with one or more required fields empty, when they try to submit, then the form does not submit and shows a clear error for each missing/invalid field.
- AC-5: Given a visitor enters an incorrectly formatted email address (e.g., "abc" with no "@"), when they try to submit, then the form shows a validation error on the Email field and does not submit.
- AC-6: Given a valid form submission, when it is processed, then the visitor sees the on-page success message, and no network request is sent to any server, and no data is written to any database — this can be confirmed by observing there is no outgoing network call for the submission (e.g., using the browser's network inspector).
- AC-7: Given a visitor double-clicks Submit quickly on a validly filled form, when the system processes it, then only one success message is shown (for example, the button is disabled after the first click), avoiding a confusing repeated or flickering confirmation.
- AC-8: Given the page is loaded on a mobile-sized screen, when the visitor views it, then the "Hello World" text and the Contact Us form are both fully visible and usable without horizontal scrolling.

## Assumptions

- A-1: The target audience is the general public / any visitor who reaches the page link — this is a public-facing page open to the internet, not restricted to a specific internal audience.
- A-2: This is primarily a first pipeline/demo project to prove out the working end-to-end process (requirements through deployment), rather than solving a specific, pressing business problem. Since it is frontend-only, no real visitor data is actually collected or put at risk.
- A-3: **Confirmed, final.** Contact form fields are Name, Email, and Message only (no phone number, subject line, attachments, or other fields).
- A-4: **Confirmed, final.** This is a frontend-only project. There is no email delivery and no database of any kind. On successful validation, the form only shows an on-page success message; the entered data may optionally be logged to the browser console as a demo placeholder, but is not sent or stored anywhere else.
- A-5: No admin login/dashboard is needed, since there is nothing stored to browse. If the project later needs to actually receive/manage real enquiries, that would require adding a backend as new, separate scope.
- A-6: The success message text and exact styling are not specified, so a simple, generic message (e.g., "Thank you, your message has been sent.") is assumed; exact wording/design can be refined in the Design phase.
- A-7: **Confirmed, final.** The form resets/clears its fields after a successful submission, so the visitor can submit again if desired (see FR-9 and AC-3 for the detailed behavior).
- A-8: An earlier draft included a dedicated anti-spam and duplicate-submission protection requirement (e.g., a honeypot field or CAPTCHA). This has been dropped from the current requirements, because there is no backend or stored data for a bot to actually harm — a bot "submitting" the form only ever affects that bot's own browser session, with no impact on any real record or recipient. A lighter double-click safeguard (disabling the button briefly after submit) is kept purely as a UI-polish item (AC-7), not as data protection.
- A-9: There is no requirement for multiple languages, dark mode, or any advanced branding beyond a basic clean page layout, unless specified later.
- A-10: The tech stack placeholder in `.claude/project-config.json` (Node/Express + React + PostgreSQL + Docker) assumed a backend and database that no longer apply to this frontend-only scope. It is left for the Design phase to confirm a frontend-only tech stack (e.g., static HTML/CSS/JS or a frontend framework) with no backend/database components, since no strong preference was stated.
- A-11: No specific performance target, uptime target, or expected traffic volume was provided, so modest, reasonable defaults were assumed (see NFR-1 and NFR-8).
- A-12: No specific hosting environment/provider constraint was given; hosting choice (e.g., a static hosting service) is left to the Design phase.

## Risks

- R-1: If actual expected traffic is much higher than the "small-scale" assumption (NFR-8), the requirements may need revisiting, though a static frontend-only page generally scales more easily than one with a backend.
- R-2: If the project owner later decides they do want to actually receive or track real enquiries, that is a significant new scope addition (adding a backend, email delivery, and/or a database) not currently included, and would need its own requirements pass.
- R-3: Because there is no persistence at all, if the "hello world" demo is ever mistaken for a real contact channel by an actual visitor, their message will not reach anyone. This may be worth a small on-page note if the page is ever shown to real customers, to avoid confusion (not currently in scope, flagged here as an awareness item only).
