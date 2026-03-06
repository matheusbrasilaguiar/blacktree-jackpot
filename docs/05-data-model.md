# Data Model

## Overview

> TODO: Describe the data model at a high level.
> What are the main entities? What is the nature of the data — transactional, analytical, event-based?
> Mention the general persistence strategy adopted (relational, document, key-value, hybrid, etc.) and why.

> See also: [ER Diagram](diagrams/er-diagram.md)

---

## Database Strategy

> TODO: Describe the database technology choices and the reasoning behind them.
> If multiple databases are used (e.g., relational for transactional data and a cache for session data), explain each and its purpose.
> If the decision was formally recorded, link to the corresponding ADR.

| Database | Type | Purpose | ADR |
|----------|------|---------|-----|
| TODO | Relational / Document / Key-Value / Graph / Time-Series / etc. | TODO | — |

---

## Entities

> TODO: For each main entity in the system, create a subsection describing its purpose and attributes.
> Copy and repeat the block below for each entity.
> Attribute types should be described conceptually (text, number, date, boolean, identifier) rather than as specific database types, since this document is technology-agnostic.

---

### [Entity Name]

> TODO: Describe what this entity represents in the business domain.

| Attribute | Type | Required | Description |
|-----------|------|----------|-------------|
| id | Identifier | Yes | Unique identifier for the record |
| TODO | TODO | Yes / No | TODO |

**Relationships:**

> TODO: Describe how this entity relates to others.
> Example: "One User can have many Orders. Each Order belongs to exactly one User."

**Business Rules:**

> TODO: List any business rules specific to this entity.
> Example: "An Order cannot be deleted once it has been fulfilled."

---

## Relationships Overview

> TODO: Summarize the relationships between all entities in the system.
> Use the ER diagram to represent this visually.

| Entity A | Relationship | Entity B | Description |
|----------|-------------|----------|-------------|
| TODO | one-to-one / one-to-many / many-to-many | TODO | TODO |

> See also: [ER Diagram](diagrams/er-diagram.md)

---

## Data Lifecycle

> TODO: Describe how data is created, updated, and removed throughout the system.
> Address the following where applicable:

### Retention Policy

> TODO: How long is data kept? Is there a policy for archiving or deleting old records?
> Example: "Logs are retained for 90 days. User data is retained for the duration of the account plus 30 days after deletion request."

### Soft Delete vs Hard Delete

> TODO: Describe whether records are permanently deleted or marked as inactive.
> Example: "Users and orders are soft-deleted to preserve audit history. Temporary session data is hard-deleted."

### Audit Trail

> TODO: Describe whether changes to data are tracked and how.
> Example: "All changes to financial records are logged in an audit table with the actor, timestamp, and previous value."

---

## Migration Strategy

> TODO: Describe how database schema changes are managed over time.
> Example: "All schema changes are applied through versioned migration scripts managed by the project's migration tool. Migrations are run automatically during deployment."

---

## Sensitive Data

> TODO: Identify which attributes contain sensitive or personal data and how they are handled.
> This section complements the security document.

| Entity | Attribute | Sensitivity | Handling |
|--------|-----------|-------------|----------|
| TODO | TODO | Personal / Financial / Health / Credentials | Encrypted at rest / Hashed / Masked / Tokenized |

> See also: [Security](07-security.md)

---

## Indexing and Query Strategy

> TODO: Describe the indexing strategy for performance-critical queries, if known at this stage.
> Example: "Orders will be frequently queried by user and status. An index on (user_id, status) is planned."
> This section can be filled progressively as the project evolves.

| Entity | Indexed Attributes | Reason |
|--------|--------------------|--------|
| TODO | TODO | TODO |

