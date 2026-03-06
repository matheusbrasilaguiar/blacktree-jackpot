# Changelog

All notable changes to this template will be documented in this file.

This project adheres to [Semantic Versioning](https://semver.org) and the format is based on [Keep a Changelog](https://keepachangelog.com/en/1.1.0/).

---

## [Unreleased]

## [1.1.0] - 2026-02-21

### Added

- Initial template structure with full `docs/` directory.
- Comprehensive documentation: Overview, Objectives, Requirements, Architecture, Data Model, API Contracts, Security, Quality, Observability, Glossary, and References.
- `docs/12-deployment.md` — Complete deployment strategy (CI/CD, release patterns, environment mapping).
- `docs/13-decisions-log.md` — Lightweight alternative to formal ADRs.
- Professional ADR system with templates and guide.
- 7 Mermaid diagram templates: C4 (L1-L3), Deployment, ERD, Sequence, and State.
- Contribution guidelines (`CONTRIBUTING.md`) with GitHub Flow and Conventional Commits.
- CI/CD pipeline using `lychee-action` (fast link checking) and `markdownlint-cli2`.
- GitHub Issue and Pull Request templates.
- MkDocs configuration for documentation-as-a-website.

### Fixed

- Resolved 60+ CI linting and link checking failures.
- Fixed broken relative links in `SECURITY.md` and `docs/04-architecture.md`.
- Corrected placeholder status in ADR template.
- Normalized master as the default branch across all documentation and workflows.
- Added `.gitignore` to prevent documentation build artifacts (`site/`) from being committed.

## [1.0.0] - 2026-02-21

### Added

- Initial project template setup with basic documentation structure.

---

## How to Update This File

When making changes to the template, add an entry under `[Unreleased]` using one of the following categories:

- **Added** — new files or sections introduced to the template
- **Changed** — changes to existing content or structure
- **Deprecated** — sections or files that will be removed in a future version
- **Removed** — files or sections that were removed
- **Fixed** — corrections to placeholders, links, or instructions

When releasing a new version, move the contents of `[Unreleased]` to a new versioned section, tag the commit in Git, and reset `[Unreleased]` to empty.

```bash
git tag -a v1.0.0 -m "release: v1.0.0"
git push origin v1.0.0
```

