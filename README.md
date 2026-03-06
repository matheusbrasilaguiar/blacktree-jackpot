# Project Template

<!-- When releasing a new version of this template, update the badge number below and tag the commit. See CHANGELOG.md for instructions. -->
[![Template Version](https://img.shields.io/badge/template%20version-1.1.0-blue)](CHANGELOG.md)
![License](https://img.shields.io/badge/license-MIT-green)


> This repository is a comprehensive project template designed to standardize and accelerate the kickoff of new software projects. It brings together industry best practices for technical documentation. The goal is for every new project to be born with structure, organization, and engineering maturity from the very first commit.

---

## Project Status

| Status | Description |
|--------|-------------|
| Planning | Defining scope and requirements |
| In Progress | Actively under development |
| Done | Released and stable |
| Archived | No longer maintained |

**Current Status:** Planning

---

## Quick Links

| Resource | Link |
|----------|------|
| Overview | [docs/01-overview.md](docs/01-overview.md) |
| Objectives & Scope | [docs/02-objectives.md](docs/02-objectives.md) |
| Requirements | [docs/03-requirements.md](docs/03-requirements.md) |
| Architecture | [docs/04-architecture.md](docs/04-architecture.md) |
| Data Model | [docs/05-data-model.md](docs/05-data-model.md) |
| API Contracts | [docs/06-api-contracts.md](docs/06-api-contracts.md) |
| Security | [docs/07-security.md](docs/07-security.md) |
| Quality & Tests | [docs/08-quality.md](docs/08-quality.md) |
| Observability | [docs/09-observability.md](docs/09-observability.md) |
| Glossary | [docs/10-glossary.md](docs/10-glossary.md) |
| References | [docs/11-references.md](docs/11-references.md) |
| Deployment | [docs/12-deployment.md](docs/12-deployment.md) |
| Decisions Log | [docs/13-decisions-log.md](docs/13-decisions-log.md) |
| Diagrams | [docs/diagrams/README.md](docs/diagrams/README.md) |
| ADRs | [docs/adr/README.md](docs/adr/README.md) |
| Changelog | [CHANGELOG.md](CHANGELOG.md) |
| Contributing | [CONTRIBUTING.md](CONTRIBUTING.md) |

---

## Repository Structure

```text
project-template/
│
├── README.md
├── README.template.md
├── CHANGELOG.md
├── CONTRIBUTING.md
├── CODE_OF_CONDUCT.md
├── SECURITY.md
├── LICENSE
├── mkdocs.yml
├── .env.example
├── .markdownlint.json
│
├── docs/
│   ├── 01-overview.md
│   ├── 02-objectives.md
│   ├── 03-requirements.md
│   ├── 04-architecture.md
│   ├── 05-data-model.md
│   ├── 06-api-contracts.md
│   ├── 07-security.md
│   ├── 08-quality.md
│   ├── 09-observability.md
│   ├── 10-glossary.md
│   ├── 11-references.md
│   ├── 12-deployment.md
│   ├── 13-decisions-log.md
│   │
│   ├── adr/
│   │   ├── README.md
│   │   └── 001-template.md
│   │
│   ├── diagrams/
│   │   ├── README.md
│   │   ├── c4-context.md
│   │   ├── c4-container.md
│   │   ├── c4-component.md
│   │   ├── deployment.md
│   │   ├── er-diagram.md
│   │   ├── sequence-flows.md
│   │   └── state-diagram.md
│   │
│   └── design/
│       └── README.md
│
└── .github/
    ├── link-check-config.json
    ├── ISSUE_TEMPLATE/
    │   ├── bug_report.md
    │   ├── feature_request.md
    │   └── task.md
    ├── workflows/
    │   └── ci.yml
    └── PULL_REQUEST_TEMPLATE.md
```

---

## How to Use This Template

1. Click **"Use this template"** on GitHub to create your new repository.
2. Delete this `README.md` and rename `README.template.md` to `README.md`.
3. Fill in the new `README.md` with your project's information, replacing all `TODO` placeholders.
4. Go through each file in `docs/` sequentially and replace the `TODO` placeholders.
5. **Delete entire sections that don't apply** to your project — don't leave them filled with "N/A". A lean document is better than a padded one.
6. Create ADRs in `docs/adr/` for each relevant architectural decision.
7. Produce diagrams in `docs/diagrams/` using Mermaid (renders natively on GitHub).
8. Update `CONTRIBUTING.md` with your project's branching strategy and conventions.
9. *(Optional)* To serve the docs as a website, install `mkdocs` and `mkdocs-material` and run `mkdocs serve`. See `mkdocs.yml` for configuration.

---

## License

This project is licensed under the [MIT License](LICENSE).

---

## Versioning

This template follows [Semantic Versioning](https://semver.org) (SemVer):

- **PATCH** — small fixes and adjustments to existing content
- **MINOR** — new sections or files added without breaking existing structure
- **MAJOR** — large structural changes that affect the overall organization of the template

Each stable version is tagged in Git (`v1.0.0`, `v1.1.0`, etc.) and documented in [CHANGELOG.md](CHANGELOG.md).

When you create a new project from this template, it is recommended to note which template version was used in your project's README for future reference.

