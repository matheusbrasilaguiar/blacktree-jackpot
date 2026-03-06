# C4 Component Diagram — Level 3

## Purpose

> The Component diagram zooms into a single **Container** (defined in the C4 Container diagram) and shows its internal building blocks — components, modules, or services — and how they communicate with each other.
> This diagram answers the question: "What is inside this container and how is it structured?"
> It is most valuable for complex containers where the internal structure is non-obvious or actively evolving.

> See also: [C4 Context Diagram](c4-context.md) | [C4 Container Diagram](c4-container.md)

---

## Diagram

> TODO: Replace the container name and component blocks below with the actual internals of the container you are describing.
> Repeat this diagram for each container that warrants internal documentation.
> Add or remove Component blocks as needed.
> Relationship labels should describe the direction and nature of the interaction.

```mermaid
C4Component
    title Component Diagram — [Container Name]

    Container_Boundary(container, "[Container Name]") {
        Component(componentA, "[Component A]", "[Technology]", "TODO: Describe the responsibility of this component.")
        Component(componentB, "[Component B]", "[Technology]", "TODO: Describe the responsibility of this component.")
        Component(componentC, "[Component C]", "[Technology]", "TODO: Describe the responsibility of this component.")
        Component(componentD, "[Component D]", "[Technology]", "TODO: Describe the responsibility of this component.")
    }

    System_Ext(externalSystem, "External System", "TODO: Describe the external system.")
    ContainerDb_Ext(database, "Database", "TODO: Database technology", "TODO: Describe what data is stored.")

    Rel(componentA, componentB, "TODO: Describe interaction", "TODO: Protocol / method call")
    Rel(componentB, componentC, "TODO: Describe interaction", "TODO: Protocol / method call")
    Rel(componentC, componentD, "TODO: Describe interaction", "TODO: Protocol / method call")
    Rel(componentA, externalSystem, "TODO: Describe interaction", "TODO: Protocol")
    Rel(componentD, database, "Reads and writes", "SQL / ORM / etc.")
```

---

## Notes

> TODO: Add any clarifications about the component boundaries, design decisions, or known limitations visible in this diagram.
> Example: "Component B acts as an anti-corruption layer. It translates external API responses into internal domain objects before handing them off to Component C."

