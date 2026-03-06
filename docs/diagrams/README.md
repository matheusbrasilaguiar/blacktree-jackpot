# Diagrams

## Overview

This directory contains all architectural and domain diagrams for this project. Diagrams are written using [Mermaid](https://mermaid.js.org), which renders natively in GitHub without any external tools or image files.

To preview diagrams locally, use a Mermaid-compatible editor such as the Mermaid Live Editor at mermaid.live, or install a Mermaid extension for your code editor.

---

## How to Write a Mermaid Diagram

Diagrams are embedded in Markdown files using fenced code blocks with the `mermaid` language identifier:

~~~text`n```mermaid
graph TD
    A[Start] --> B[End]
```
~~~text`n
---

## Diagram Index

| File | Type | Description |
|------|------|-------------|
| [c4-context.md](c4-context.md) | C4 Level 1 — Context | The system in its environment and its external actors |
| [c4-container.md](c4-container.md) | C4 Level 2 — Container | The internal building blocks of the system |
| [c4-component.md](c4-component.md) | C4 Level 3 — Component | The internal components of a specific container |
| [deployment.md](deployment.md) | Deployment | Infrastructure topology and how containers map to infrastructure |
| [er-diagram.md](er-diagram.md) | Entity-Relationship | Data model and relationships between entities |
| [sequence-flows.md](sequence-flows.md) | Sequence | Communication flows between components for critical operations |
| [state-diagram.md](state-diagram.md) | State | Lifecycle and state transitions of key domain entities |

---

## Diagramming Guidelines

- Keep diagrams focused. One diagram should communicate one idea clearly.
- Prefer accuracy over completeness. A diagram that is partially wrong is worse than no diagram.
- Update diagrams whenever the system changes. An outdated diagram is misleading.
- Add a brief description above each diagram explaining its purpose and what the reader should take away from it.
- Use consistent naming between diagrams and the rest of the documentation.

