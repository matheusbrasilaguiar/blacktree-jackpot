# API Contracts

## Overview

> TODO: Describe at a high level how this project exposes or consumes APIs.
> Does it provide an API to external consumers? Does it consume external APIs? Both?
> Mention the general communication style adopted (request-response, event-driven, streaming, etc.).

---

## API Style

> TODO: Describe the API paradigm(s) adopted in this project and the reasoning behind the choice.
> If the decision was formally recorded, link to the corresponding ADR.

| Style | Usage | ADR |
|-------|-------|-----|
| REST / GraphQL / gRPC / WebSocket / Event / etc. | Internal / External / Both | — |

---

## Versioning Strategy

> TODO: Describe how API versions are managed.
> Example: "The API is versioned via URL path prefix (e.g., /v1/). Breaking changes always result in a new version. Previous versions are supported for a minimum of 6 months after a new version is released."

---

## General Conventions

> TODO: Describe the standards and conventions that apply across all endpoints or contracts.
> Remove subsections that do not apply to your project.

### Naming

> TODO: Describe naming conventions for endpoints, fields, and events.
> Example: "Endpoints use kebab-case. Request and response fields use camelCase. Event names use PascalCase."

### Date and Time Format

> TODO: Describe how dates and times are represented.
> Example: "All date and time values use ISO 8601 format in UTC (e.g., 2024-01-15T14:30:00Z)."

### Pagination

> TODO: Describe the pagination strategy for list endpoints.
> Example: "List endpoints use cursor-based pagination. Responses include a nextCursor field. Page size defaults to 20 and is configurable via a limit parameter."

### Error Responses

> TODO: Describe the standard structure for error responses.
> Example: "All errors return a JSON body with the fields: code (machine-readable string), message (human-readable description), and details (optional array of field-level errors)."

### Authentication

> TODO: Describe how API consumers authenticate themselves.
> Example: "All endpoints require a Bearer token in the Authorization header. Detailed treatment is in the security document."

> See also: [Security](07-security.md)

---

## Endpoints

> TODO: Document each endpoint or group of endpoints provided by this project.
> For projects with a large number of endpoints, link to an external specification (OpenAPI/Swagger) and use this section only for a high-level summary.
> Copy and repeat the block below for each resource or endpoint group.

### [Resource or Endpoint Group Name]

> TODO: Briefly describe what this resource represents or what this group of endpoints does.

| Method | Path | Description | Auth Required |
|--------|------|-------------|---------------|
| GET | /TODO | TODO | Yes / No |
| POST | /TODO | TODO | Yes / No |
| PUT | /TODO | TODO | Yes / No |
| DELETE | /TODO | TODO | Yes / No |

**Request example:**

> TODO: Describe the expected request body or parameters for the most relevant operation.
> Keep it schema-focused, not tied to a specific technology.

**Response example:**

> TODO: Describe the expected response structure for the most relevant operation.

**Error cases:**

> TODO: List the expected error scenarios for this endpoint group.

| Code | Scenario |
|------|----------|
| TODO | TODO |

---

## API Specification

> TODO: If a formal specification file exists (OpenAPI, AsyncAPI, GraphQL schema, Protobuf, etc.), link to it here.
> Example: "The full OpenAPI specification is available at docs/api/openapi.yaml."

---

## Event Contracts

> TODO: If this project produces or consumes events through a message broker or event bus, document the event contracts here.
> For each event, describe its name, producer, consumers, and payload structure.
> Remove this section if the project does not use event-driven communication.

### [Event Name]

> TODO: Describe what triggers this event and what it represents in the domain.

| Property | Value |
|----------|-------|
| Producer | TODO |
| Consumers | TODO |
| Channel / Topic | TODO |
| Schema format | JSON / Avro / Protobuf / etc. |

**Payload structure:**

> TODO: Describe the fields present in the event payload.

| Field | Type | Required | Description |
|-------|------|----------|-------------|
| TODO | TODO | Yes / No | TODO |

---

## Consumed External APIs

> TODO: List the external APIs this project depends on.
> For each one, describe its purpose and any relevant contract details or limitations.

| API | Provider | Purpose | Documentation |
|-----|----------|---------|---------------|
| TODO | TODO | TODO | TODO |

---

## Deprecation Policy

> TODO: Describe how API deprecation is handled.
> Example: "Deprecated endpoints are marked with a Deprecation response header. Consumers are notified via changelog and have a minimum of 3 months to migrate before removal."

