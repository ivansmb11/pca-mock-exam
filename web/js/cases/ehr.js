// EHR Healthcare — questions grounded in case requirements, mapped to GCP managed services and the Well-Architected Framework.

export const EHR_QUESTIONS = [
  {
    id: "ehr1",
    topic: "Networking & Hybrid",
    case: "EHR Healthcare",
    type: "single",
    text: "To provide a secure, high-performance connection between EHR's on-premises systems and Google Cloud while keeping the legacy insurance-provider interfaces reachable, which connectivity design should the architect choose?",
    options: {
      A: "Dedicated Interconnect with redundant links in two metro zones, paired with Cloud Router for dynamic BGP route exchange",
      B: "A single Classic VPN tunnel over the public internet to the production VPC",
      C: "Cloud NAT plus public IP allow-listing so on-prem hosts can call cloud APIs",
      D: "Direct Peering to exchange traffic with Google at the edge for general workload connectivity"
    },
    correct: ["A"],
    why: {
      A: "Dedicated Interconnect delivers a private, high-bandwidth, low-latency link with redundancy, and Cloud Router automates BGP route exchange so on-prem and cloud reach each other reliably — serving the Reliability and Performance Optimization pillars.",
      B: "A single Classic VPN tunnel rides the public internet with limited throughput and no redundancy, failing the high-performance and availability needs.",
      C: "Cloud NAT and public allow-listing expose traffic to the internet and do not provide a private, predictable, high-performance path.",
      D: "Direct Peering only exchanges traffic with Google's public-facing services and does not give private RFC 1918 connectivity into the VPC for the legacy interfaces."
    }
  },
  {
    id: "ehr2",
    topic: "Security & Compliance",
    case: "EHR Healthcare",
    type: "single",
    text: "Users are managed in Microsoft Active Directory, and EHR wants staff to sign in to Google Cloud with existing credentials without rebuilding identity. What is the recommended approach?",
    options: {
      A: "Manually recreate every AD user as a separate Cloud Identity account and have admins reset passwords",
      B: "Use Google Cloud Directory Sync to provision identities into Cloud Identity and federate sign-in to Active Directory via SAML",
      C: "Store AD service-account passwords in Secret Manager and share them with the team",
      D: "Grant all engineers a single shared Google account protected by a strong password"
    },
    correct: ["B"],
    why: {
      A: "Manually recreating accounts is error-prone, unscalable, and creates a second password store to manage, undermining operational excellence.",
      B: "GCDS one-way syncs AD users and groups into Cloud Identity while SAML federation delegates authentication back to AD, giving single source of truth and SSO — squarely the Security, Privacy and Compliance pillar.",
      C: "Sharing service-account passwords destroys auditability and individual accountability, a security anti-pattern.",
      D: "A shared account eliminates per-user audit trails and least privilege, which is unacceptable for a regulated PHI environment."
    }
  },
  {
    id: "ehr3",
    topic: "Compute & Containers",
    case: "EHR Healthcare",
    type: "single",
    text: "EHR must provide a consistent way to manage multiple container-based environments and apply the same policies and configuration across all of them. Which capability best meets this?",
    options: {
      A: "Register the GKE clusters into a fleet and use Config Sync and Policy Controller to apply configuration and guardrails from a single source of truth",
      B: "Give each team its own standalone cluster and let them edit YAML manifests independently",
      C: "Deploy all workloads to a single very large zonal cluster to avoid managing more than one",
      D: "Run the containers on individual Compute Engine VMs managed with startup scripts"
    },
    correct: ["A"],
    why: {
      A: "A GKE fleet with Config Sync and Policy Controller applies consistent config and policy guardrails across many clusters from one Git source of truth — directly serving Operational Excellence.",
      B: "Independent per-team manifests cause configuration drift and inconsistent policy, the exact problem EHR wants to eliminate.",
      C: "A single zonal cluster is a single point of failure and cannot meet 99.9% availability or environment isolation needs.",
      D: "Hand-managed VMs with startup scripts abandon Kubernetes orchestration and add administration cost rather than reducing it."
    }
  },
  {
    id: "ehr4",
    topic: "Compute & Containers",
    case: "EHR Healthcare",
    type: "single",
    text: "All customer-facing systems require a minimum of 99.9% availability and EHR wants to reduce latency for its multi-national users. How should the architect deploy the containerized web apps?",
    options: {
      A: "A single-zone GKE cluster fronted by a regional internal load balancer",
      B: "Regional GKE clusters in multiple regions behind a global external Application Load Balancer that routes users to the nearest healthy backend",
      C: "A zonal GKE cluster with a static external IP and manual failover to a backup zone",
      D: "Compute Engine instances in one region behind a network passthrough load balancer"
    },
    correct: ["B"],
    why: {
      A: "A single-zone cluster cannot survive a zonal outage and an internal load balancer does not serve external customers, missing both availability and reach.",
      B: "Regional clusters across regions behind the global external Application Load Balancer provide multi-zone and multi-region redundancy with Anycast routing to the closest backend — meeting the Reliability and Performance Optimization pillars.",
      C: "Manual failover from a zonal cluster cannot guarantee 99.9% and adds operational toil during incidents.",
      D: "Single-region VMs behind an L4 passthrough balancer lack global routing and HTTP-aware features needed for low-latency global delivery."
    }
  },
  {
    id: "ehr5",
    topic: "SRE & Operations",
    case: "EHR Healthcare",
    type: "multi",
    pick: 2,
    text: "EHR needs centralized, proactive visibility into system performance and consistent log retention, and wants to stop the pattern of ignored email alerts. Which two actions best deliver this? (Choose two.)",
    options: {
      A: "Centralize telemetry in Cloud Monitoring and Cloud Logging, configuring log buckets with defined retention and log sinks for archival",
      B: "Define SLOs and create alerting policies that page on-call engineers through a real notification channel such as PagerDuty or a chat integration",
      C: "Keep the existing open-source tools per environment and continue emailing alerts to a shared inbox",
      D: "Export all logs to a local spreadsheet that an analyst reviews weekly",
      E: "Disable alerting entirely to reduce noise and rely on customer reports of outages"
    },
    correct: ["A", "B"],
    why: {
      A: "Cloud Monitoring and Cloud Logging give one pane of glass, and log buckets with retention plus sinks satisfy consistent log retention and compliance — the Operational Excellence pillar.",
      B: "SLO-based alerting policies that page a real on-call channel turn signals into proactive action and fix the ignored-email anti-pattern — also Operational Excellence and Reliability.",
      C: "Per-environment open-source tools and a shared email inbox reproduce the fragmented visibility and ignored alerts EHR is trying to escape.",
      D: "A manually reviewed spreadsheet is neither real-time nor proactive and cannot scale.",
      E: "Disabling alerting and waiting for customer complaints is the opposite of proactive monitoring and harms reliability."
    }
  },
  {
    id: "ehr6",
    topic: "Data & Analytics",
    case: "EHR Healthcare",
    type: "single",
    text: "EHR must create interfaces to ingest and normalize clinical data from new insurance providers and then make this data available for analytics, while protecting PHI. Which combination best fits?",
    options: {
      A: "Cloud Healthcare API to ingest FHIR and HL7v2 data, de-identify it with infoType transformations, then stream the safe dataset to BigQuery for analytics",
      B: "Have providers SFTP raw clinical files into a public Cloud Storage bucket that analysts query directly",
      C: "Load raw, fully identified PHI straight into a shared BigQuery dataset accessible to all analysts",
      D: "Store the clinical messages in Firestore and run ad hoc scans for sensitive fields when reports are requested"
    },
    correct: ["A"],
    why: {
      A: "Cloud Healthcare API natively ingests FHIR and HL7v2 and de-identifies via infoType transforms before export to BigQuery, normalizing provider data while protecting PHI — serving Security, Privacy and Compliance plus Performance Optimization for analytics.",
      B: "A public bucket exposes PHI and stores unnormalized raw files, violating compliance and offering no clinical-standard interface.",
      C: "Loading fully identified PHI into a broadly accessible dataset breaks least privilege and regulatory compliance.",
      D: "Firestore is not built for clinical-standard ingestion or large-scale analytics, and on-demand scanning is unreliable for compliance."
    }
  },
  {
    id: "ehr7",
    topic: "AI & ML",
    case: "EHR Healthcare",
    type: "single",
    text: "EHR wants to make predictions and generate reports on healthcare industry trends from provider data that already lands in BigQuery, with minimal data movement and operational overhead. What should the architect recommend?",
    options: {
      A: "Train and serve forecasting and classification models with BigQuery ML using SQL directly on the warehouse data",
      B: "Export the data to CSV, train a model on a self-managed GPU VM, and re-import scores nightly",
      C: "Build a custom prediction service on Compute Engine that polls BigQuery every minute",
      D: "Hand the raw tables to analysts to compute trends manually in a spreadsheet"
    },
    correct: ["A"],
    why: {
      A: "BigQuery ML builds and serves models with SQL where the data already lives, avoiding data movement and infrastructure management while enabling trend prediction and reporting — the Cost Optimization and Operational Excellence pillars.",
      B: "Exporting to CSV and managing a GPU VM adds data-movement risk and undifferentiated heavy lifting that BigQuery ML removes.",
      C: "A custom polling service on Compute Engine reinvents managed prediction and raises both cost and operational toil.",
      D: "Manual spreadsheet analysis does not scale and cannot produce reliable predictive insights."
    }
  },
  {
    id: "ehr8",
    topic: "Migration & Modernization",
    case: "EHR Healthcare",
    type: "single",
    text: "EHR is leaving a colocation facility whose lease is expiring and must move its MySQL and SQL Server databases to managed services with minimal downtime. What is the best approach?",
    options: {
      A: "Use Database Migration Service to perform continuous, minimal-downtime migration into Cloud SQL for MySQL and Cloud SQL for SQL Server",
      B: "Take a one-time mysqldump, copy it over the weekend, and accept an extended outage during cutover",
      C: "Lift the existing database VMs into Compute Engine and keep self-managing patching, backups, and replication",
      D: "Rewrite both relational databases as documents in Firestore before the lease ends"
    },
    correct: ["A"],
    why: {
      A: "Database Migration Service streams changes continuously into managed Cloud SQL for MySQL and SQL Server, enabling near-zero-downtime cutover and offloading database administration — serving Reliability and Cost Optimization.",
      B: "A dump-and-restore over the weekend forces a long outage and risks data divergence, conflicting with availability goals.",
      C: "Rehosting database VMs keeps the administration burden EHR wants to reduce and does not modernize to a managed service.",
      D: "Re-platforming relational schemas into Firestore is a risky, time-consuming rewrite that is unnecessary for the lease deadline."
    }
  }
];
