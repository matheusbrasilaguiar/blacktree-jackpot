# C4 Container Diagram — Level 2

## Purpose

> The Container diagram zooms into the system boundary and shows the high-level technical building blocks — applications, services, databases, and other containers — and how they communicate with each other.
> A "container" in C4 terms is any separately deployable or runnable unit, not necessarily a Docker container.
> This diagram answers: "What are the main technical pieces of this system and how do they interact?"

---

## Diagram

> TODO: Replace the placeholders below with your system's actual containers.
> Common container types: Web App, Mobile App, API, Worker, Database, Cache, Message Broker, File Storage.
> Add or remove blocks as needed.

```mermaid
C4Container
    title Container Diagram — [Project Name]

    Person(user, "User", "TODO: Describe the primary user.")

    System_Boundary(system, "[Project Name]") {
        Container(webApp, "Web Application", "TODO: Technology", "TODO: Responsibility of this container.")
        Container(api, "API", "TODO: Technology", "TODO: Responsibility of this container.")
        Container(worker, "Background Worker", "TODO: Technology", "TODO: Responsibility of this container. Remove if not applicable.")
        ContainerDb(database, "Database", "TODO: Technology", "TODO: What data this database stores.")
        ContainerDb(cache, "Cache", "TODO: Technology", "TODO: What this cache stores. Remove if not applicable.")
    }

    System_Ext(externalSystem, "External System", "TODO: Describe the external system.")

    Rel(user, webApp, "TODO: Describe the interaction.", "HTTPS")
    Rel(webApp, api, "TODO: Describe the interaction.", "HTTPS / JSON")
    Rel(api, database, "TODO: Describe the interaction.", "TODO: Protocol")
    Rel(api, cache, "TODO: Describe the interaction.", "TODO: Protocol")
    Rel(api, externalSystem, "TODO: Describe the interaction.", "TODO: Protocol")
    Rel(worker, database, "TODO: Describe the interaction.", "TODO: Protocol")
```

---

## Notes

> TODO: Add any clarifications about this diagram.
> Example: "The Background Worker is triggered by events from the database change stream. It does not expose any HTTP interface."

