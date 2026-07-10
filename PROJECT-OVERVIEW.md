# Project Overview

_Last updated: 2026-07-09_

This document explains, in plain language, what this project currently is. It is written for a manager or stakeholder who does not need to read code or technical files to understand the state of things.

## 1. Overview

This project is not a finished piece of software yet. What exists today is a **process setup** — a defined, repeatable way of building software using a team of AI "agents," where each agent is responsible for one step of the work.

Think of it like a factory line, but for building software. Instead of one person doing everything, the work is split into stages: someone gathers requirements, someone else plans the work, someone else designs the system, someone else writes the code, someone else reviews it, someone else tests it, and someone else writes the documentation. In this project, each of those stages is handled by a specialized AI agent instead of a human doing it manually, and a lead "orchestrator" agent decides which stage comes next and hands off work to the right specialist.

So, in short: this is the **scaffolding and rulebook for an AI-assisted software development process**, set up and ready to use, but it has not yet been used to build an actual product.

## 2. Why It Exists / Goals

Setting up this process ahead of time solves a few practical problems:

- **Consistency.** Every future feature or product built in this workspace goes through the same steps, in the same order, instead of an ad-hoc approach that can vary from person to person or session to session.
- **Nothing gets skipped.** Steps like "write down the requirements clearly" or "have someone review the code before it ships" are built into the process, not left to chance.
- **Work can be tracked across sessions.** There is a status file (explained below) that records what stage each piece of work is at, so progress is not lost even if the work spans multiple sittings or is picked up by someone else.
- **Automation stays under human control.** The AI agents can prepare code changes, branches, and pull requests (a pull request is a proposed set of code changes waiting for approval before it becomes official), but a person must still approve anything that pushes code or merges it into the main project. Nothing ships automatically without a human saying yes.
- **Reusability.** This setup is not tied to one specific product. Once it is in place, it can be reused for any new feature or product idea brought into this workspace.

## 3. Current Status

To be direct and honest about where things stand today:

- **Only the process setup exists.** The rules, the list of specialist roles, and the shared settings that control how they behave are fully written and ready to use.
- **No real project work has started.** There is no requirements document for an actual product, no plan, no system design, and no application code has been written.
- **Nothing has shipped.** No feature, screen, or system is live or usable yet.
- **This workspace is not yet a formal code repository** (a repository is just a tracked, version-controlled folder for code — this one has not been initialized as one yet).
- **A placeholder technology choice exists, but it is not final.** The setup file mentions a possible combination of technologies (a .NET backend, a React frontend, a PostgreSQL database, and Docker for packaging the app) as an *example default*. The file itself says clearly that this is a placeholder to be reviewed and confirmed once a real project's requirements and design exist — it is not a decision that has actually been made for any real product.
- **A short setup checklist exists but nothing on it is done yet** — things like checking that the right development tools are installed, setting up version control, and setting up the database are all still marked "pending."

In short: the project is at the very beginning of its lifecycle. It is fully prepared to start, but it is waiting for someone to bring it a real feature or product request.

## 4. How It Works

### Pipeline at a Glance

```
Requirements → Planning → Design → Branch Setup → Development
     → Commit & Pull Request → Code Review → Testing & QA
     → Merge → CI/CD (optional) → Release (optional) → Documentation
```

| # | Stage | In one line |
|---|---|---|
| 1 | Requirements | Write down what to build and why |
| 2 | Planning | Break it into tasks and milestones |
| 3 | Design | Decide how it will be built |
| 4 | Branch Setup | Create an isolated working copy |
| 5 | Development | Write the code |
| 6 | Commit & Pull Request | Package the changes for review |
| 7 | Code Review | Check quality, security, and design fit |
| 8 | Testing & QA | Confirm it works as required |
| 9 | Merge | Fold into the official project (needs human approval) |
| 10 | CI/CD (optional) | Automate future build/test/deploy |
| 11 | Release (optional) | Package and publish a version |
| 12 | Documentation | Write guides reflecting what was built |

If review or testing (steps 7–8) finds a problem, the work loops back to Development — up to 3 times before a person is brought in to decide what to do next.

Once a real request comes in (for example, "build a customer invoicing feature"), the work is expected to flow through these stages, in order:

1. **Requirements** — Figure out and write down exactly what needs to be built and why, from a business point of view. No coding or design happens here.
2. **Planning** — Break the requirements down into a concrete list of tasks and milestones, and figure out what order things need to happen in.
3. **Design** — Decide how the system will actually be built: what technology to use, how the different parts will fit together, how data will be stored, and so on.
4. **Branch setup** — Create a separate, isolated working copy of the code (a "branch") so that new work doesn't disturb whatever already exists.
5. **Development** — Write the actual code that implements the design.
6. **Commit & pull request** — Save the finished code changes and package them up as a proposal ("pull request") for someone to review.
7. **Code review** — Someone (in this case, a specialist agent) checks the code for quality, security, and whether it actually matches the design, before it's allowed to move forward.
8. **Testing & QA** — The feature gets tested to make sure it actually works the way the requirements said it should.
9. **Merge** — Once review and testing both pass, the new code is folded into the main, official version of the project. This step still requires a person's explicit approval.
10. **CI/CD (optional)** — Automated pipelines can be set up to build, test, and deploy the software automatically going forward.
11. **Release (optional)** — A version of the product is packaged and made available, along with release notes describing what changed.
12. **Documentation** — Guides, instructions, and reference material are written or updated to reflect what was actually built.

**The review/testing feedback loop, explained simply:** if the code review or the testing step finds a problem, the work goes back to the development stage to get fixed. Once it's fixed, it goes through review and testing again. This can repeat as needed — but if the same stage fails three times in a row, the process stops looping automatically and a person is brought in to make a decision. The reasoning is that if something keeps failing repeatedly, it is usually a sign of a deeper problem with the requirements or the design, not just a small code mistake, and that needs human judgment rather than another automatic retry.

## 5. Key Components

The project is made up of 11 specialist roles ("agents"), each with one clear job, plus one shared settings file that governs how they all behave.

| Role | What it does, in plain terms |
|---|---|
| **SDLC Orchestrator** | The lead coordinator. Figures out what stage the work is at and hands it off to the right specialist. Acts like a project manager, not a hands-on builder. |
| **Requirements Analyst** | Talks through what needs to be built and writes it down clearly as a requirements document. |
| **Planner** | Breaks the requirements into a concrete backlog of tasks, sequences the work, and sets milestones. |
| **Solution Architect** | Designs how the system will actually be built — technology choices, how data is stored, how different parts connect, and security considerations. |
| **Developer** | Writes the actual application code, following the approved design. |
| **Github Agent** | Handles all the version-control housekeeping — creating branches, saving (committing) changes, opening pull requests, and merging or releasing code. Never writes or judges the actual application code itself. |
| **Reviewer** | Checks the finished code for quality, security, and whether it matches the design, before it's allowed to move forward. Does not fix anything itself, only flags issues. |
| **Tester** | Runs and writes tests to check the feature actually works the way the requirements describe. Reports a pass or fail result. |
| **CI/CD Agent** | Sets up automated pipelines that build, test, and deploy the software, based on the approved design. |
| **Technical Writer** | Writes and updates all project documentation — this includes the very document you're reading now. Never touches source code. |
| **SOW Agent** | Produces a client-facing "Statement of Work" document (a formal summary of scope, plan, and pricing that a client could review and sign), when that's needed. |

**Shared settings file:** all of the above agents read from one file (`.claude/project-config.json`) rather than each having their own separate rules. It controls things like: whether this is a brand-new project or an existing one being modified, what tools each agent may use, the placeholder technology defaults mentioned above, a checklist of setup tasks, rules about never installing software without asking the user first, and — importantly — rules that require a human's explicit approval before any code gets pushed or merged.

## 6. The Shared Settings File, in Detail

Section 5 above mentioned that all agents read from one shared file, `.claude/project-config.json`. This section explains what is actually inside that file, in plain terms, so anyone can understand the rules the agents are following without opening the file itself.

**Project mode.** The file has a switch called `projectMode`, currently set to `"new"`. This tells every agent whether they are starting a project from a blank slate, or working inside a codebase that already exists. When it is set to `"new"`, agents design and build freely. When it would be set to `"existing"`, agents are told to treat whatever is already built as a fixed constraint, not something to redesign from scratch.

**Per-agent settings.** For each of the 11 specialist agents named in Section 5, the file has a small entry that says which AI model that agent should use (right now, all of them are set to use whatever model the overall session is already using) and a cap on how long that agent's response is allowed to be.

**Placeholder technology choices.** As mentioned in Section 3, the file lists an example technology stack: a .NET backend, a React frontend, a PostgreSQL database, and Docker for packaging. The file is explicit that these are only example defaults, not a real decision, and must be checked against the actual design document once a real project starts.

**Setup checklist.** A list of nine one-time setup jobs is tracked here, such as installing the right development tools, starting version control, installing dependencies, setting up a database, and confirming that automated build/test pipelines work. All nine are currently marked as not done yet, because no real project has started.

**Rule about installing software.** There is a firm rule that says no agent is ever allowed to install missing tools, programs, or dependencies on its own. If something needed is missing, the agent must stop, explain clearly what is missing and why it matters, and wait for a person to say yes before installing anything.

**Git and GitHub automation rules.** This part controls how much of the version-control work (saving changes, opening pull requests, merging, and so on) happens automatically versus needing a person's sign-off. Right now, the file allows agents to create branches and open pull requests on their own, but it requires a human's explicit approval before anything is pushed to the shared repository or merged into the main codebase. It also holds naming rules for branches (for example, `feature/{ticket-id}-{short-description}`), a commit message style, and rules for pull requests, such as requiring at least one reviewer.

**Project identity placeholders.** Fields like project name, description, and GitHub repository owner/name are all currently placeholder text (for example, "REPLACE_WITH_PROJECT_NAME"), waiting to be filled in once a real project is attached to this workspace.

**Artifact paths.** This is a list of file names the agents agree to use when writing their output, so every agent knows exactly where to look for another agent's work. For example, the Requirements Analyst always writes to `requirements.md`, the Solution Architect always writes to `architecture.md`, and so on. One entry in this list, `designSystemHandoff`, now points to `design-system-handoff/e2logy-design-system/README.md`. This is a visual design reference (colors, fonts, spacing, and ready-made page layouts) that was created separately using Claude's design tool and exported as a bundle of files, rather than being produced by one of the 11 agents. The Solution Architect only adds a short note pointing to it while designing. The Developer is the one who actually opens it and follows it, and only while building screens or components, and only when `projectMode` is set to `"new"`. If a project is instead marked `"existing"`, this file is skipped, because an existing project is expected to already have its own design system in place.

## 7. Progress So Far

**What exists today:**
- The shared settings file (`.claude/project-config.json`) defining how the whole process should run.
- The definitions for all 11 specialist agents, each with a clearly scoped job.
- The overall workflow rule (in `.claude/CLAUDE.md`) that says every request should start with the lead coordinator (the Orchestrator), which then delegates to the right specialist.
- A status-tracking file (`.claude/orchestrator-state.md`) that records which stage each piece of work is at, so progress isn't lost between sessions.
- This overview document.

**What does not exist yet:**
- A requirements document for any real feature or product.
- A project plan or backlog of tasks.
- A system design or architecture document.
- Any actual application code.
- Any tests.
- Any deployed or released version of a product.
- Product-specific documentation (this document only describes the process setup itself, not a real application).
- A finalized technology choice (only a placeholder example exists).
- A formal, version-controlled code repository for this workspace.

## 8. Next Steps

To actually start building something with this setup, the following needs to happen:

1. **Someone brings a real feature or product idea** to the project — for example, "we need a customer portal" or "add an invoicing module."
2. **Requirements get gathered first.** The Requirements Analyst works out exactly what needs to be built and why, and writes it down.
3. **Planning follows.** The Planner turns those requirements into a concrete list of tasks and milestones.
4. **Design comes next.** The Solution Architect decides how the system will actually be built, including confirming or replacing the placeholder technology choices mentioned earlier.
5. **The rest of the pipeline follows automatically** from there — development, review, testing, and eventually release and documentation for the real product — following the same stage-by-stage process described in Section 4, with a person approving any code push or merge along the way.

Until step 1 happens, this project remains what it is today: a ready-to-use process framework, waiting for its first real assignment.
