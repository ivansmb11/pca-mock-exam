// EHR Healthcare — questions grounded in case requirements, mapped to current GCP services and the Well-Architected Framework.

export const EHR_QUESTIONS = [
  {
    id: "ehr1",
    topic: "Networking & Hybrid",
    case: "EHR Healthcare",
    type: "single",
    text: "EHR keeps legacy file- and API-based insurance interfaces on-premises and needs a secure, high-performance, redundant private path between those systems and Google Cloud. Which connectivity design should the architect choose?",
    options: {
      A: "HA VPN with two tunnels over the public internet, using Cloud Router and BGP to exchange routes with the on-premises network reliably",
      B: "Partner Interconnect through a single service provider in one metro, relying on the partner SLA for path redundancy and BGP route exchange",
      C: "Dedicated Interconnect with redundant connections across two metro availability zones, with Cloud Router and BGP for dynamic route exchange",
      D: "Cross-Cloud Interconnect linking the colocation provider to Google, using Cloud Router and BGP to advertise the on-premises insurance routes"
    },
    correct: ["C"],
    why: {
      A: "HA VPN rides the public internet so throughput and latency are not guaranteed, falling short of the high-performance private link the interfaces need.",
      B: "Partner Interconnect through one provider in a single metro leaves a single fault domain that cannot meet the redundancy the legacy path requires.",
      C: "Dedicated Interconnect across two metro zones gives a private, high-bandwidth, low-latency link with no single point of failure, and Cloud Router automates routing — serving the Reliability and Performance Optimization pillars.",
      D: "Cross-Cloud Interconnect is built to link Google with another cloud provider, not to reach an on-premises colocation data center."
    }
  },
  {
    id: "ehr2",
    topic: "Security & Compliance",
    case: "EHR Healthcare",
    type: "single",
    text: "EHR manages staff in Microsoft Active Directory and wants employees to sign in to Google Cloud with their existing AD credentials without standing up a parallel identity store. What should the architect recommend?",
    options: {
      A: "Deploy Managed Service for Microsoft Active Directory and join Google Cloud workloads to that hardened domain so staff authenticate with their AD logins",
      B: "Configure Workforce Identity Federation against AD FS so staff get short-lived access without ever provisioning any user accounts into Cloud Identity",
      C: "Run Google Cloud Directory Sync hourly to push AD users and groups into Cloud Identity and rely on those synced passwords for console sign-in",
      D: "Sync AD users into Cloud Identity with Google Cloud Directory Sync and federate authentication back to Active Directory using SAML single sign-on"
    },
    correct: ["D"],
    why: {
      A: "Managed Microsoft AD provides a cloud-hosted domain for workloads but does not give staff single sign-on to the Google Cloud console with their AD identities.",
      B: "Workforce Identity Federation grants access without provisioning, but EHR wants durable Cloud Identity principals for group-based IAM, which federation alone does not create.",
      C: "Syncing passwords leaves two credential stores in sync conflict and is explicitly discouraged, since authentication should be delegated rather than copied.",
      D: "GCDS makes Cloud Identity the provisioning target while SAML delegates authentication to AD, giving one source of truth and SSO — squarely the Security, Privacy and Compliance pillar."
    }
  },
  {
    id: "ehr3",
    topic: "Compute & Containers",
    case: "EHR Healthcare",
    type: "single",
    text: "EHR runs several container-based environments on multiple Kubernetes clusters and must enforce the same configuration and policy guardrails consistently across all of them. Which approach best meets this requirement?",
    options: {
      A: "Stand up one large GKE Autopilot cluster and isolate each environment with namespaces, RBAC, and per-team network policies inside that single cluster",
      B: "Register the GKE clusters into a fleet and use Config Sync and Policy Controller to apply configuration and guardrails from one Git source of truth",
      C: "Deploy Cloud Service Mesh across the clusters and let its traffic and authorization policies govern configuration and security uniformly everywhere",
      D: "Migrate the workloads to Cloud Run services and rely on organization policy plus per-service IAM bindings to keep every environment configured the same"
    },
    correct: ["B"],
    why: {
      A: "One Autopilot cluster with namespaces is still a single cluster, which cannot represent multiple separate environments or survive a cluster-level failure.",
      B: "A GKE Enterprise fleet with Config Sync and Policy Controller applies consistent config and policy across many clusters from one Git source — directly serving Operational Excellence.",
      C: "Cloud Service Mesh governs service-to-service traffic and security but does not reconcile cluster configuration or enforce general resource policy.",
      D: "Cloud Run drops the Kubernetes model the apps already use and organization policy does not manage in-cluster workload configuration drift."
    }
  },
  {
    id: "ehr4",
    topic: "Compute & Containers",
    case: "EHR Healthcare",
    type: "single",
    text: "EHR must give its multi-national customers at least 99.9% availability while reducing latency for the containerized web applications. How should the architect deploy them?",
    options: {
      A: "Regional GKE clusters in several regions behind a global external Application Load Balancer that routes each user to the nearest healthy backend",
      B: "A regional GKE cluster in one region behind a global external Application Load Balancer, scaling node pools out to absorb the multi-national traffic",
      C: "Zonal GKE clusters in two regions behind a global external Application Load Balancer, with health checks failing traffic over between the zones",
      D: "Managed instance groups across two regions behind a global external proxy Network Load Balancer that forwards TCP connections to the closest region"
    },
    correct: ["A"],
    why: {
      A: "Regional clusters across multiple regions behind the global Application Load Balancer give multi-zone and multi-region redundancy with Anycast routing to the closest backend — meeting the Reliability and Performance Optimization pillars.",
      B: "A single region still fails on a regional outage and cannot lower latency for users far from that one region, missing both goals.",
      C: "Zonal clusters have no in-cluster zonal redundancy, so a single zone failure can take a whole cluster down despite the load balancer.",
      D: "An L4 proxy Network Load Balancer lacks the HTTP-aware routing and content features the web apps need for low-latency global delivery."
    }
  },
  {
    id: "ehr5",
    topic: "SRE & Operations",
    case: "EHR Healthcare",
    type: "multi",
    pick: 2,
    text: "EHR wants centralized, proactive visibility into system performance, consistent log retention, and an end to ignored email alerts. Which two actions best deliver this? (Choose two.)",
    options: {
      A: "Centralize telemetry in Cloud Monitoring and Cloud Logging, with log buckets set to defined retention and sinks for long-term archival of records",
      B: "Forward all Cloud Logging data to a third-party SIEM and let that external tool own dashboards, retention, and every alert across the environments",
      C: "Keep the per-environment open-source monitoring tools and continue routing their alert emails into the existing shared team inbox for triage later",
      D: "Define SLOs and create alerting policies that page the on-call engineer through a real channel such as PagerDuty or a chat integration on breach",
      E: "Raise a metric-threshold alert for every resource and email it to the whole engineering distribution list so nothing can ever go unnoticed again"
    },
    correct: ["A", "D"],
    why: {
      A: "Cloud Monitoring and Logging give one pane of glass, and log buckets with retention plus sinks satisfy consistent retention and compliance — the Operational Excellence pillar.",
      B: "Shipping everything to a SIEM abandons native integration and still leaves no SLO-driven, actionable paging for the on-call engineer.",
      C: "Per-environment tools and a shared email inbox reproduce the fragmented visibility and ignored alerts EHR is trying to escape.",
      D: "SLO-based policies that page a real on-call channel turn signals into proactive action and fix the ignored-email anti-pattern — Operational Excellence and Reliability.",
      E: "Alerting on every threshold and emailing everyone recreates the noisy, ignored-alert pattern rather than focusing on what truly matters."
    }
  },
  {
    id: "ehr6",
    topic: "Data & Analytics",
    case: "EHR Healthcare",
    type: "single",
    text: "EHR must build interfaces to ingest and normalize clinical data from new insurance providers and then expose it for analytics while protecting PHI. Which combination best fits this requirement?",
    options: {
      A: "Land raw FHIR and HL7v2 files in Cloud Storage, run Dataflow to parse them, and write the parsed records straight into BigQuery for the analysts",
      B: "Receive provider messages over Pub/Sub, transform them with Dataflow, and load the results into BigQuery, applying column-level access controls there",
      C: "Ingest the clinical feeds with the Cloud Healthcare API, then have analysts query the FHIR and HL7v2 stores in place using its native search endpoints",
      D: "Ingest the feeds with Cloud Healthcare API, redact PHI with Sensitive Data Protection, and stream the de-identified records to BigQuery for analytics",
      E: "Stage the provider files in Cloud Storage, scan them with Sensitive Data Protection on a schedule, then load only the clean rows into BigQuery tables"
    },
    correct: ["D"],
    why: {
      A: "Hand-built Dataflow parsing skips the clinical-standard handling and the de-identification that PHI in BigQuery requires.",
      B: "Pub/Sub and Dataflow can move data but provide no FHIR or HL7v2 normalization, leaving the clinical interface unbuilt.",
      C: "Querying the Healthcare API stores directly serves operational lookups, not the large-scale trend analytics EHR needs.",
      D: "Cloud Healthcare API normalizes FHIR and HL7v2 and de-identifies via Sensitive Data Protection before export to BigQuery — serving the Security, Privacy and Compliance pillar.",
      E: "Scheduled scans on staged files are batchy and brittle and still lack the clinical-standard ingestion interface providers expect."
    }
  },
  {
    id: "ehr7",
    topic: "AI & ML",
    case: "EHR Healthcare",
    type: "single",
    text: "EHR wants to predict healthcare industry trends and generate reports from provider data that already lands in BigQuery, with minimal data movement and operational overhead. What should the architect recommend?",
    options: {
      A: "Schedule a Vertex AI pipeline that reads from BigQuery, trains a custom model on managed training, and writes the predictions back into the warehouse",
      B: "Create models with BigQuery ML using SQL so training and prediction run directly on the warehouse data without moving it out of BigQuery at all",
      C: "Register the BigQuery tables with Vertex AI Feature Store, then train and serve an AutoML model that returns the forecasts for downstream reporting",
      D: "Stream the BigQuery tables into Vertex AI, fine-tune a foundation model on the records, and call its endpoint to produce the trend predictions and reports"
    },
    correct: ["B"],
    why: {
      A: "A Vertex AI custom pipeline works but adds orchestration and training infrastructure that is unnecessary when the data already sits in BigQuery.",
      B: "BigQuery ML builds and serves models with SQL where the data already lives, avoiding movement and infrastructure — the Cost Optimization and Operational Excellence pillars.",
      C: "Routing data through Feature Store and AutoML introduces extra services and data movement for what is a straightforward in-warehouse forecast.",
      D: "Fine-tuning a foundation model is overkill for structured trend forecasting and forces costly data movement out of the warehouse."
    }
  },
  {
    id: "ehr8",
    topic: "Migration & Modernization",
    case: "EHR Healthcare",
    type: "single",
    text: "EHR's colocation lease is expiring and it must move its MySQL and SQL Server databases to managed services with minimal downtime during the cutover. What is the best approach?",
    options: {
      A: "Lift the existing database VMs into Compute Engine first, then re-platform each engine to Cloud SQL later once the colocation facility is fully vacated",
      B: "Export each database to Cloud Storage, import the dumps into Cloud SQL over the cutover weekend, and accept the outage while the data finishes loading",
      C: "Use Database Migration Service to run continuous replication into Cloud SQL for MySQL and Cloud SQL for SQL Server, then cut over with minimal downtime",
      D: "Set up Cloud SQL replicas, configure native MySQL and SQL Server log shipping from the colocation databases by hand, and promote the replicas at cutover"
    },
    correct: ["C"],
    why: {
      A: "Rehosting to Compute Engine first keeps the administration burden EHR wants to shed and delays the move past the expiring lease.",
      B: "Dump-and-import over a weekend forces a long outage and risks data divergence, conflicting with the minimal-downtime goal.",
      C: "Database Migration Service streams changes continuously into managed Cloud SQL for both engines, enabling near-zero-downtime cutover — serving the Reliability and Cost Optimization pillars.",
      D: "Hand-configured log shipping is fragile, error-prone, and reinvents the continuous replication that the managed service already provides."
    }
  }
];
