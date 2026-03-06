# Deployment Diagram

## Purpose

> The Deployment diagram shows how the system's containers are mapped to infrastructure — machines, cloud services, containers, and network zones.
> It answers the question: "Where does this system run and how are the parts connected in production?"
> This diagram is most useful when onboarding new team members, planning infrastructure changes, or troubleshooting production incidents.

> See also: [Architecture](../04-architecture.md) | [Deployment](../12-deployment.md) | [C4 Container Diagram](c4-container.md)

---

## Diagram

> TODO: Replace the placeholders with your actual infrastructure topology.
> Add or remove Node and Container blocks as needed.
> Common node types: cloud region, availability zone, server, Kubernetes cluster, managed service.

```mermaid
C4Deployment
    title Deployment Diagram — [Project Name] (Production)

    Deployment_Node(cloud, "Cloud Provider", "TODO: e.g., AWS / GCP / Azure / etc.") {

        Deployment_Node(region, "Region", "TODO: e.g., us-east-1 / southamerica-east1") {

            Deployment_Node(webTier, "Web / API Tier", "TODO: e.g., ECS / GKE / EC2 / App Service") {
                Container(api, "[API Container]", "TODO: Technology", "TODO: Describe what this container does.")
            }

            Deployment_Node(dataTier, "Data Tier", "TODO: e.g., RDS / Cloud SQL / Managed DB") {
                ContainerDb(db, "[Database]", "TODO: Database engine", "TODO: Describe what data is stored here.")
            }

            Deployment_Node(cacheTier, "Cache Tier", "TODO: e.g., ElastiCache / Memorystore") {
                Container(cache, "[Cache]", "TODO: Technology", "TODO: Describe what is cached.")
            }
        }
    }

    Deployment_Node(cdn, "CDN / Edge", "TODO: e.g., CloudFront / Cloud CDN") {
        Container(frontend, "[Frontend]", "TODO: Technology", "TODO: Describe what the frontend delivers.")
    }

    Rel(frontend, api, "API calls", "HTTPS")
    Rel(api, db, "Reads and writes", "TODO: Protocol")
    Rel(api, cache, "Reads and writes", "TODO: Protocol")
```

---

## Notes

> TODO: Add clarifications about the deployment topology.
> Example: "The database runs in a private subnet with no public access. The API communicates through a VPC endpoint."

