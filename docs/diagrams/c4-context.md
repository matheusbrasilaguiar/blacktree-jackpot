# C4 Context Diagram — Level 1

## Purpose

> The Context diagram shows the system as a single box in the center, surrounded by its users and the external systems it interacts with. It answers the question: "What is this system and who uses it?"
> This is the highest-level view and should be understandable by anyone, technical or not.

---

## Diagram

> TODO: Replace the placeholders below with your system's actual actors and external systems.
> Add or remove Person and System blocks as needed.
> Relationship labels should describe the nature of the interaction from the perspective of the arrow's direction.

```mermaid
C4Context
    title System Context — [Project Name]

    Person(user, "User", "TODO: Describe the primary user of the system.")
    Person_Ext(externalUser, "External User", "TODO: Describe an external actor, if any. Remove if not applicable.")

    System(system, "[Project Name]", "TODO: One sentence describing what this system does.")

    System_Ext(externalSystemA, "External System A", "TODO: Describe this external system and its role.")
    System_Ext(externalSystemB, "External System B", "TODO: Describe this external system and its role.")

    Rel(user, system, "TODO: Describe how the user interacts with the system.")
    Rel(system, externalSystemA, "TODO: Describe the interaction.")
    Rel(system, externalSystemB, "TODO: Describe the interaction.")
```

---

## Notes

> TODO: Add any clarifications or observations about this diagram that are not self-evident from the visual alone.
> Example: "External System A is a third-party payment provider. The interaction is outbound only — this system initiates all requests."

