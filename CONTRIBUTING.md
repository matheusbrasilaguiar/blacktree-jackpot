# Contributing Guide

> This document describes how to contribute to this project. Read it carefully before opening an issue or submitting a pull request.

---

## Table of Contents

- [Getting Started](#getting-started)
- [Branching Strategy](#branching-strategy)
- [Commit Convention](#commit-convention)
- [Pull Request Process](#pull-request-process)
- [Code Review Guidelines](#code-review-guidelines)
- [Reporting Bugs](#reporting-bugs)
- [Requesting Features](#requesting-features)

---

## Getting Started

1. Fork the repository and clone your fork locally.
2. Create a new branch from `master` following the [Branching Strategy](#branching-strategy).
3. Make your changes, following the project's conventions.
4. Open a Pull Request against `master` with a clear description of what was changed and why.

---

## Branching Strategy

This project follows **GitHub Flow** — a lightweight, branch-based workflow.

| Branch type | Pattern | Description |
|-------------|---------|-------------|
| Main | `master` | Always deployable. Protected. Direct commits are not allowed. |
| Feature | `feat/<short-description>` | New features or documentation additions |
| Bug fix | `fix/<short-description>` | Corrections to existing content or behavior |
| Chore | `chore/<short-description>` | Maintenance tasks, dependency updates, tooling changes |
| Release | `release/<version>` | Release preparation (if applicable) |

**Rules:**

- Branch off from `master`.
- Keep branches short-lived — open a PR as soon as the work is ready for review.
- Delete the branch after merging.
- Never commit directly to `master`.

---

## Commit Convention

This project follows the [Conventional Commits](https://www.conventionalcommits.org) specification.

### Format

```text
<type>(<scope>): <short description>

[optional body]

[optional footer]
```

### Types

| Type | When to Use |
|------|-------------|
| `feat` | A new feature or documentation section |
| `fix` | A bug fix or correction to existing content |
| `docs` | Changes to documentation only |
| `chore` | Build process, tooling, or maintenance changes |
| `refactor` | Restructuring without adding features or fixing bugs |
| `test` | Adding or updating tests |
| `ci` | Changes to CI/CD configuration |

### Examples

```text
feat(docs): add observability document with logging and metrics strategy

fix(diagrams): correct broken link to deployment diagram

chore: update template version badge to 1.1.0
```

**Rules:**
- Use the imperative mood in the subject line: "add", not "added" or "adds"
- Keep the subject line under 72 characters
- Reference issues when applicable: `Closes #42`

---

## Pull Request Process

1. Make sure your branch is up to date with `master` before opening a PR.
2. Fill in the **Pull Request Template** completely — do not delete sections.
3. Assign at least one reviewer.
4. A PR must have **at least one approval** before merging.
5. All automated checks must pass before merging.
6. Use **Squash and Merge** to keep the commit history clean on `master`.

---

## Code Review Guidelines

**As an author:**
- Self-review your changes before requesting a review.
- Respond to all comments — even if just to acknowledge or explain your reasoning.
- Do not merge with unresolved comments.

**As a reviewer:**
- Be constructive and specific — explain *why* something should change.
- Distinguish between blocking issues and suggestions.
- Approve only when you are genuinely satisfied with the change.

---

## Reporting Bugs

Use the **[Bug Report](.github/ISSUE_TEMPLATE/bug_report.md)** issue template. Provide as much context as possible, including steps to reproduce, expected behavior, and actual behavior.

---

## Requesting Features

Use the **[Feature Request](.github/ISSUE_TEMPLATE/feature_request.md)** issue template. Describe the problem the feature solves and, if possible, the proposed solution and acceptance criteria.

