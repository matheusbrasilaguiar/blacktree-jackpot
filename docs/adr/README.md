# Architecture Decision Records (ADR)

## What is an ADR?

An Architecture Decision Record is a document that captures an important architectural decision made during the course of a project, together with its context, the alternatives considered, and the reasoning behind the final choice.

ADRs are not just about documenting what was decided — they are about documenting why. This makes it possible for anyone joining the project later to understand the rationale behind the current state of the system, without having to reconstruct decisions from memory or scattered conversations.

---

## When to Write an ADR

Write an ADR whenever a decision:

- Has a significant impact on the architecture, structure, or behavior of the system
- Is difficult or costly to reverse
- Involves trade-offs between meaningful alternatives
- Would be hard for a new team member to understand without context

When in doubt, write it. A short ADR is better than no ADR.

---

## ADR Lifecycle

Each ADR has a status that reflects its current state:

| Status | Description |
|--------|-------------|
| Proposed | The decision is under discussion and has not been formally accepted yet |
| Accepted | The decision has been agreed upon and is in effect |
| Deprecated | The decision was once accepted but is no longer relevant or recommended |
| Superseded | The decision has been replaced by a newer ADR |

---

## How to Create a New ADR

1. Copy the file `001-template.md` and rename it following the pattern: `NNN-short-title-in-kebab-case.md`, where `NNN` is the next sequential number.
2. Fill in all sections of the template.
3. Set the status to `Proposed` until the decision is agreed upon by the relevant stakeholders.
4. Update the index table below when the ADR is accepted.
5. If a decision is later superseded, update its status and add a reference to the new ADR.

---

## ADR Index

> TODO: Add a new row to this table each time an ADR is accepted.

| ID | Title | Status | Date |
|----|-------|--------|------|
| — | *This table should list only accepted ADRs. Copy [001-template.md](001-template.md) to create a new ADR.* | — | — |

