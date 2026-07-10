# Planning — Hello World Landing Page

Source: `requirements.md` (Status: Approved / Finalized, confirmed 2026-07-10)

This is a small, single-page, frontend-only project. The plan below is kept small on purpose, matching the size of the actual work. Every item is traceable back to an FR, NFR, or AC number from the requirements document.

---

## Epics

**EPIC-1: Page Foundation & Hello World Display**
Covers the base page and showing the "Hello World" text on load.
Traces to: FR-1, AC-1.

**EPIC-2: Contact Us Form Structure**
Covers building the Contact Us form and its three fields on the same page.
Traces to: FR-2, FR-3, AC-2.

**EPIC-3: Form Validation & Error Feedback**
Covers required-field checks, email format checks, and showing field-level error messages without losing what the visitor already typed.
Traces to: FR-4, FR-5, FR-6, NFR-4, AC-4, AC-5.

**EPIC-4: Submission Success, Data Handling & Reset**
Covers the on-page success message, local-only handling of the entered data (no network call, no storage), the form reset after success, and the duplicate-click guard.
Traces to: FR-7, FR-8, FR-9, AC-3, AC-6, AC-7.

**EPIC-5: Non-Functional Quality (Responsive, Accessibility, Browser Compatibility, Performance)**
Covers checking the page works well on mobile and desktop sizes, is usable by keyboard only, works on the four listed browsers, and loads within the assumed time target.
Traces to: NFR-1, NFR-2, NFR-3, NFR-7, AC-8.

**EPIC-6: Deployment & Hosting Setup (placeholder, pending Design phase)**
Covers getting the finished static page online over HTTPS. The requirements document leaves the tech stack and hosting choice to the Design phase (A-10, A-12), so the tasks here are named at a high level only and will need to be refined once that decision is made.
Traces to: NFR-5, A-10, A-12.

---

## User Stories

### EPIC-1: Page Foundation & Hello World Display

**US-1.1** — As a Visitor, I want to see "Hello World" text as soon as the page loads, so that I know right away that the page has loaded and is working.
Traces to: FR-1, AC-1. Complexity: S.

### EPIC-2: Contact Us Form Structure

**US-2.1** — As a Visitor, I want to see a Contact Us form on the same page as the "Hello World" text, so that I can send an enquiry without being sent to another page or a pop-up.
Traces to: FR-2, FR-3, AC-2. Complexity: S.

### EPIC-3: Form Validation & Error Feedback

**US-3.1** — As a Visitor, I want the form to tell me clearly if I left a required field empty, so that I know exactly what to fix before I can submit.
Traces to: FR-4, FR-6, AC-4. Complexity: M.

**US-3.2** — As a Visitor, I want the form to check that my email address looks correctly formatted, so that I find out about a typo before I try to submit.
Traces to: FR-5, AC-5. Complexity: S.

**US-3.3** — As a Visitor, I want anything I type into the form to be handled safely by the page, so that my own input cannot cause a script or display problem in my own browser.
Traces to: NFR-4. Complexity: S.

### EPIC-4: Submission Success, Data Handling & Reset

**US-4.1** — As a Visitor, I want to see a clear confirmation message right on the page after I submit a correctly filled form, so that I know my message went through, even though nothing is sent to a server.
Traces to: FR-7, FR-8, AC-3, AC-6. Complexity: M.

**US-4.2** — As a Visitor, I want the form fields to clear automatically after a successful submission, so that I can send another message right away if I want to.
Traces to: FR-9, AC-3. Complexity: S.

**US-4.3** — As a Visitor, I want the Submit button to stop me from accidentally triggering the confirmation more than once if I click quickly, so that I don't see a confusing repeated message.
Traces to: AC-7. Complexity: S.

### EPIC-5: Non-Functional Quality

**US-5.1** — As a Visitor on a mobile phone, I want the "Hello World" text and the Contact Us form to fit the screen properly, so that I don't have to scroll sideways to read or use them.
Traces to: NFR-2, AC-8. Complexity: M.

**US-5.2** — As a Visitor who uses a keyboard instead of a mouse, I want to move through and fill in the form using only the keyboard, so that I can still submit an enquiry.
Traces to: NFR-7. Complexity: S.

**US-5.3** — As a Visitor using any common browser, I want the page and form to work the same way, so that my experience does not depend on which browser I picked.
Traces to: NFR-3. Complexity: M.

**US-5.4** — As a Visitor, I want the page to load quickly, so that I am not left waiting before I can read it or use the form.
Traces to: NFR-1. Complexity: S.

### EPIC-6: Deployment & Hosting Setup (placeholder)

**US-6.1** — As a Project Stakeholder, I want the finished page published somewhere reachable over HTTPS, so that real visitors on the internet can open and use it.
Traces to: NFR-5, A-12. Complexity: M (uncertain — depends on the stack/hosting choice still to come from the Design phase).

---

## Tasks

### EPIC-1 / US-1.1
- Set up the basic single-page structure/layout that will hold both the "Hello World" text and the Contact Us section.
- Add the "Hello World" heading/text so it shows up as soon as the page loads, with no click or scroll needed.
- Check that the text is visible immediately on load (AC-1).

### EPIC-2 / US-2.1
- Add a Contact Us section on the same page, placed below or near the "Hello World" text.
- Add a Name field with a visible label.
- Add an Email field with a visible label.
- Add a Message field (multi-line) with a visible label.
- Add a Submit button.
- Double check that only these three fields exist, with nothing extra like a subject line or phone number (FR-3).

### EPIC-3 / US-3.1
- Add a check that Name, Email, and Message are all filled in before the form can go through.
- Stop the form from submitting if any of these three fields is empty.
- Show a specific, clear error message next to each field that is missing or invalid.
- Make sure that showing an error for one field does not clear out what the visitor already typed in the other fields (FR-6).

### EPIC-3 / US-3.2
- Add a check on the Email field for a valid format (looking for things like an "@" and a domain part).
- Show a clear error message on the Email field specifically when the format check fails.
- Confirm the form still will not submit while the email format is invalid.

### EPIC-3 / US-3.3
- Review how the entered Name, Email, and Message text is handled and displayed (including the console-log placeholder mentioned in FR-8), and confirm it is never inserted into the page as raw, unescaped HTML.

### EPIC-4 / US-4.1
- Add the on-page success confirmation message that appears once the form passes all validation checks.
- Confirm that submitting a valid form does not trigger any network request (this can be checked with a browser's network inspector, per AC-6).
- Handle the submitted Name, Email, and Message data only inside the browser (for example, a console log for demo purposes), with nothing sent out or saved anywhere else.

### EPIC-4 / US-4.2
- Clear the Name, Email, and Message fields once the success message is shown.
- Confirm the form is ready to accept a fresh entry right after the reset.

### EPIC-4 / US-4.3
- Add a safeguard so that clicking Submit more than once quickly (for example, disabling the button briefly after the first click) does not produce more than one success message.
- Confirm only one confirmation message shows up per valid submission.

### EPIC-5 / US-5.1
- Apply a layout that adjusts to both desktop-sized and mobile-sized browser windows.
- Check that there is no horizontal scrolling needed on a mobile-sized screen (AC-8).
- Check that the desktop layout still looks and works fine after the responsive adjustments.

### EPIC-5 / US-5.2
- Confirm every form field has a visible, readable label.
- Confirm a visitor can move through Name, Email, Message, and the Submit button using only the Tab key (and similar keyboard controls), with no mouse needed.
- Confirm error messages and the success message can be noticed and understood without needing to use a mouse.

### EPIC-5 / US-5.3
- Check the page and form behavior on current versions of Chrome, Firefox, Edge, and Safari.
- Note down and fix any differences in how the page looks or behaves between these browsers.

### EPIC-5 / US-5.4
- Check how long the page takes to become readable and usable on a normal broadband connection.
- Compare this against the 3-second target noted in NFR-1, keeping in mind this target is an assumption and not a confirmed requirement from the stakeholder.

### EPIC-6 / US-6.1 (placeholder — pending Design phase output)
- [Placeholder] Set up the hosting environment once the Design phase confirms the tech stack and hosting choice.
- [Placeholder] Turn on HTTPS for the hosted page.
- [Placeholder] Confirm the live, hosted page matches the version that was built and tested.

Note: the three tasks above are intentionally left high-level. They cannot be made more specific until the Design phase decides on a tech stack and a hosting provider (see A-10, A-12 in requirements.md). This epic's tasks should be revisited and detailed once that decision is available.

---

## Dependencies

- US-2.1 (Contact form) builds on top of the page structure created in US-1.1. The base page layout should exist first.
- US-3.1 and US-3.2 (validation) depend on the form fields from US-2.1 already existing, since validation is applied to those fields.
- US-3.3 (safe input handling) depends on US-2.1, for the same reason — there is nothing to check until the input fields exist.
- US-4.1 (success message) depends on US-3.1 and US-3.2 both being in place, since a success message should only ever appear after validation passes.
- US-4.2 (reset) depends on US-4.1, since the reset happens right after the success message is shown.
- US-4.3 (duplicate-click guard) depends on US-4.1, since it guards the same submit action that produces the success message.
- US-5.1, US-5.2, US-5.3, and US-5.4 (the non-functional quality stories) depend on the page and form already being built (EPIC-1 and EPIC-2 complete), since these are checks and adjustments applied to the finished page rather than new features.
- US-6.1 (deployment) depends on all of EPIC-1 through EPIC-4 being complete and working, and also depends on an outside input: the Design phase's decision on tech stack and hosting provider. This dependency is outside this plan's control.

---

## Milestones

**M1 — Page and Form Are Visible and Complete**
The page shows "Hello World" on load, and the Contact Us form with Name, Email, and Message fields plus a Submit button is visible on the same page.
Covers: EPIC-1, EPIC-2. Satisfies: AC-1, AC-2.

**M2 — Form Validation Works**
The form correctly blocks submission and shows clear errors for missing fields or a badly formatted email, without losing what the visitor already typed.
Covers: EPIC-3. Satisfies: AC-4, AC-5.

**M3 — Full Submission Flow Works End-to-End**
A correctly filled form shows the success message, causes no network call, handles the data only in the browser, resets the fields afterward, and does not show more than one success message on a quick double-click.
Covers: EPIC-4. Satisfies: AC-3, AC-6, AC-7.

**M4 — Page Passes Quality Checks**
The page has been checked and adjusted for mobile/desktop layout, keyboard-only use, the four listed browsers, and page load speed.
Covers: EPIC-5. Satisfies: AC-8, NFR-1, NFR-2, NFR-3, NFR-7.

**M5 — Page Is Live**
The finished page is published and reachable over HTTPS.
Covers: EPIC-6. Satisfies: NFR-5. Depends on Design phase output for hosting details.

---

## Risks

- **Deployment scope is not yet fully known.** EPIC-6 tasks are written at a high level because the tech stack and hosting provider are still to be decided in the Design phase (see A-10, A-12 in requirements.md). The complexity estimate for US-6.1 may need to change once that decision is made.
- **Load-time and browser-list targets are assumptions, not confirmed numbers.** NFR-1 (3-second load) and NFR-3 (the four listed browsers) are both flagged in requirements.md as assumptions rather than numbers given directly by a stakeholder. The checks planned under US-5.3 and US-5.4 are measured against these assumed targets, and may need to be revisited if firmer targets are given later.
- **Traffic assumption could turn out wrong.** NFR-8 assumes small, normal traffic. If real traffic ends up much higher, this plan does not cover that case, though a static page generally handles higher traffic more easily than one with a backend (carried over from R-1 in requirements.md).
- **No task currently covers a "this is a demo, not a real contact channel" notice.** Requirements.md flags this only as an awareness item (R-3), not as an in-scope requirement, so no task has been added for it in this plan. If a stakeholder later wants this notice, it would need to be added as a new small task.
- **Any future request to actually receive or store enquiries is out of scope for this plan.** Requirements.md (R-2) notes that adding a backend, email delivery, or a database later is a separate, larger piece of work that would need its own requirements and its own planning pass. Nothing in this plan should be read as covering that future scenario.

---

*Planning stays within the boundaries of the approved requirements.md. Any gaps or open questions found in that document during planning are recorded above under Risks rather than changed directly, since requirements.md is treated as read-only input to this plan.*
