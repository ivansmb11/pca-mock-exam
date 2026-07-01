// Week 1 — Cloud Foundations. Generated from the Week 1 study-group deck
// (docs/week1.pdf → docs/week1.md): identity & governance (Cloud Identity vs
// IAM, resource hierarchy, org policies, audit logs), database selection
// (SQL/NoSQL, OLTP/OLAP), and cloud economics + app modernization (Capex/Opex,
// CUDs, microservices migration, hybrid patterns). Distractors are real GCP
// near-misses balanced for equal length so only architecture judgment selects
// the key.

export const WEEK1_QUESTIONS = [
  // ------------------------------------------------ identity & governance
  {
    id: "w1g1",
    topic: "Identity & Governance",
    case: null,
    type: "single",
    text: "Your enterprise has just created its Google Cloud organization on top of Cloud Identity. Leadership requires that the single highly privileged account able to recover the organization be used only for break-glass situations, while a platform team handles day-to-day IAM grants across the organization following least privilege. How should you assign these responsibilities?",
    options: {
      A: "Reserve the Cloud Identity Super Admin account, protected with multi-factor authentication, for break-glass use only, and grant the platform team the Organization Administrator IAM role for daily operations",
      B: "Have the platform team sign in with the Cloud Identity Super Admin account for their daily work, and grant a separate recovery group the Organization Administrator IAM role to keep as a backup identity",
      C: "Grant the platform team the basic Owner role on the organization resource so they can manage every project directly, and disable multi-factor authentication on the Super Admin account to speed logins",
      D: "Assign both the Super Admin role and the Organization Administrator role to every platform engineer so that any of them can recover the organization and also grant IAM roles day to day as needed"
    },
    correct: ["A"],
    why: {
      A: "The Cloud Identity Super Admin is only needed to bootstrap and recover the organization, so it stays a break-glass account with MFA, while the Organization Administrator IAM role handles daily grants, serving the Security pillar.",
      B: "Using the Super Admin account for routine work violates least privilege and best practice; that account should be reserved for break-glass recovery, not everyday IAM administration.",
      C: "The Owner role is far broader than needed, and disabling MFA on the Super Admin account removes the key protection on the most privileged identity in the whole organization.",
      D: "Spreading Super Admin across every engineer massively widens the blast radius of the most powerful account, which directly contradicts the break-glass and least-privilege requirement."
    }
  },
  {
    id: "w1g2",
    topic: "Security & Compliance",
    case: null,
    type: "single",
    text: "Past misconfigurations attached external IP addresses to backend Compute Engine instances that were never meant to be reachable from the internet. You must guarantee that external IPs can be configured only on the frontend instances and can never be added to backend instances, regardless of who provisions them. What should you do?",
    options: {
      A: "Define an Organization Policy with the compute.vmExternalIpAccess constraint that permits external IPs only on the frontend instances and denies them on every other Compute Engine instance",
      B: "Create an Identity and Access Management policy binding the IT networking staff to the compute.networkAdmin role at the organization level so that only they can attach external IP addresses",
      C: "Build a custom Identity and Access Management role that includes the compute.addresses.create permission and grant it exclusively to the team that is responsible for the frontend instances",
      D: "Revoke the compute.networkAdmin role from every principal in the projects that host the backend instances so that no remaining user retains the ability to assign external IP addresses"
    },
    correct: ["A"],
    why: {
      A: "The compute.vmExternalIpAccess constraint is the Organization Policy that whitelists which instances may have external IPs and blocks all others by configuration, enforcing the rule for everyone and serving the Security pillar.",
      B: "Granting compute.networkAdmin controls who holds the permission but still lets those admins attach an external IP to a backend instance, so it does not enforce the restriction.",
      C: "A custom role with compute.addresses.create governs who can reserve addresses, not which instances may use them, so backend instances could still receive external IPs.",
      D: "Revoking a role removes some principals access, but any remaining privileged identity or inherited grant could still place an external IP on a backend instance."
    }
  },
  {
    id: "w1g3",
    topic: "Identity & Governance",
    case: null,
    type: "single",
    text: "A group of contractors inherits the Editor role through a binding at the organization node, which they legitimately need for most tasks. Security now mandates that these contractors must never be able to delete Cloud Storage buckets anywhere in the organization, even though the inherited role grants that permission. What should you do?",
    options: {
      A: "Create an IAM deny policy that denies the storage.buckets.delete permission for the contractor principal set, attached high in the resource hierarchy so that it is inherited everywhere",
      B: "Remove the Editor role binding for the contractors at each individual project so that the delete permission no longer reaches the Cloud Storage buckets they should not be able to remove",
      C: "Set an Organization Policy constraint that restricts the storage.buckets.delete permission for the contractor group across every project and folder that exists within the organization",
      D: "Replace the contractors inherited Editor grant with a custom role that omits storage.buckets.delete, and then reapply that new custom role to them at the same organization node"
    },
    correct: ["A"],
    why: {
      A: "IAM allow policies are additive and cannot subtract an inherited permission, so a deny policy on storage.buckets.delete is the mechanism that overrides the grant for those principals wherever it reaches, serving the Security pillar.",
      B: "The Editor role is granted at the organization node and flows down by inheritance; there is no project-level binding to remove, so the delete permission still reaches the buckets.",
      C: "Organization Policy governs how resources can be configured, not which permissions a principal may use, so it cannot subtract a single IAM permission from a group.",
      D: "Rebuilding the grant as a custom role also strips the many other Editor permissions the contractors legitimately need, breaking their day-to-day work."
    }
  },
  {
    id: "w1g4",
    topic: "Security & Compliance",
    case: null,
    type: "single",
    text: "Your organization enforces an Organization Policy at the org node that blocks the creation of Compute Engine instances with external IP addresses. A single DMZ project must be allowed to run appliances with external IPs, while every other project stays locked down. What should you do?",
    options: {
      A: "Set an Organization Policy on the DMZ project that overrides the inherited constraint and allows external IP addresses, while leaving the enforced restriction in place for all of the other projects",
      B: "Delete the Organization Policy at the org node so that external IPs become allowed everywhere, and then rely on firewall rules within each project to block internet exposure where it is unwanted",
      C: "Grant the DMZ project team the compute.networkAdmin IAM role at the project level so that their additional permissions let them attach external IP addresses despite the org-level constraint",
      D: "Move the DMZ project out of the organization into a standalone project with no parent so that the inherited Organization Policy no longer applies to the appliances that require external IPs"
    },
    correct: ["A"],
    why: {
      A: "Organization Policies inherit top-down but allow overrides at lower nodes, so a project-level policy that permits external IPs unblocks only the DMZ project while the org-level restriction protects the rest, serving the Security pillar.",
      B: "Deleting the org-node policy removes the guardrail from every project and shifts the burden onto per-project firewall rules, which is exactly the broad exposure you must avoid.",
      C: "Organization Policy restrictions are not IAM permissions, so granting a stronger IAM role does not lift a constraint and the instances would still be blocked from external IPs.",
      D: "Detaching the project from the organization abandons all inherited governance and billing structure, an extreme change that breaks central management for a single exception."
    }
  },
  {
    id: "w1g5",
    topic: "Identity & Governance",
    case: null,
    type: "multi",
    pick: 2,
    text: "A compliance mandate has two parts: newly created resources must be confined to European locations, and only the central platform team may change which Organization Policies are in effect. You want to satisfy both parts using the correct mechanism for each requirement. Which two actions should you take? (Choose two)",
    options: {
      A: "Configure the gcp.resourceLocations Organization Policy constraint to allow only European regions so that any attempt to create a resource elsewhere is blocked",
      B: "Grant the platform team the Organization Policy Administrator IAM role so that only they can define or modify Organization Policy constraints for the organization",
      C: "Enable VPC Service Controls around every project to keep the newly created resources confined to the European locations that the compliance mandate requires",
      D: "Apply an IAM deny policy that blocks resource creation for every principal operating outside the European regions that are named in the compliance mandate",
      E: "Grant the platform team the basic Owner role on the organization so that their broad access lets them adjust the Organization Policies whenever it is needed"
    },
    correct: ["A", "B"],
    why: {
      A: "The gcp.resourceLocations constraint is the Organization Policy that limits where resources can be created, enforcing the residency requirement and serving the Security pillar.",
      B: "The Organization Policy Administrator role scopes the who: it lets exactly the platform team manage constraints while everyone else cannot, which is the IAM half of the mandate.",
      C: "VPC Service Controls mitigates data exfiltration across a service perimeter; it does not restrict the physical location where new resources may be created.",
      D: "IAM deny policies subtract permissions from principals; they do not express geographic location rules, so they cannot enforce a resource-residency boundary.",
      E: "The Owner role is far broader than managing Organization Policies and violates least privilege, handing the team control over every resource in the organization."
    }
  },
  {
    id: "w1g6",
    topic: "Security & Compliance",
    case: null,
    type: "single",
    text: "An auditor requires a complete record of every read and write to objects in your sensitive Cloud Storage buckets, in addition to the administrative configuration changes that Google Cloud already records automatically. You must ensure these data-plane accesses are captured from now on. What should you do?",
    options: {
      A: "Enable Data Access audit logs for Cloud Storage in the IAM audit configuration, because Admin Activity logs are always on but Data Access logs are turned off by default",
      B: "Rely on the Admin Activity audit logs that Google Cloud enables automatically, since they already record the data-plane object reads and writes along with administrative changes",
      C: "Create a Cloud Logging sink that exports the existing logs to BigQuery, which will then begin capturing the object reads and writes that the auditor needs once the sink is active",
      D: "Grant the auditor the Private Logs Viewer IAM role so that they can read the object access records that are already collected by default across all of the Cloud Storage buckets"
    },
    correct: ["A"],
    why: {
      A: "Admin Activity audit logs are always enabled, but Data Access audit logs that record data-plane reads and writes are disabled by default and must be turned on in the IAM audit configuration, serving the Security pillar.",
      B: "Admin Activity logs capture configuration changes only; they do not record data-plane reads and writes, so relying on them leaves the object accesses uncaptured.",
      C: "A logging sink only routes logs that are already being generated; it cannot create Data Access entries that were never enabled in the first place.",
      D: "Granting a viewer role controls who can read logs but does not cause Data Access logs to be produced, so there would still be no object-access records to view."
    }
  },
  {
    id: "w1g7",
    topic: "Identity & Governance",
    case: null,
    type: "single",
    text: "You manage 40 projects scattered directly under the organization node. A new regulation applies one identical set of IAM grants and Organization Policies to the 12 projects that process regulated data, and you want to apply and maintain that governance in one place with the least ongoing effort as more projects are added. What should you do?",
    options: {
      A: "Create a folder for the regulated projects, move those 12 projects into it, and apply the IAM grants and Organization Policies once at the folder so that they inherit down to each project",
      B: "Apply the same IAM grants and Organization Policies individually to each of the 12 regulated projects, and repeat that configuration by hand whenever a new regulated project is later added",
      C: "Apply the regulated IAM grants and Organization Policies at the organization node so that all 40 of the projects inherit the identical governance from that single top-level configuration point",
      D: "Assign a shared resource label to the 12 regulated projects and attach the IAM grants and Organization Policies to that label so that every project carrying the label inherits the governance"
    },
    correct: ["A"],
    why: {
      A: "A folder groups the regulated projects so IAM and Organization Policy set once at the folder inherit top-down to every project inside it, giving one place to manage governance as projects are added, serving the Operational Excellence pillar.",
      B: "Configuring each project separately duplicates work, drifts out of sync over time, and must be redone for every new regulated project, which is the opposite of least ongoing effort.",
      C: "Applying the governance at the organization node forces it onto all 40 projects, including the 28 that are not regulated, over-restricting resources that should be left unaffected.",
      D: "Labels organize and bill resources but are not a policy attachment point; IAM and Organization Policy bind to the hierarchy, not to a label, so nothing would inherit."
    }
  },
  // ------------------------------------------------ database selection
  {
    id: "w1d1",
    topic: "Databases & Storage",
    case: null,
    type: "single",
    text: "A payments company is launching a global ledger that must present a single relational schema with strong consistency to users on five continents, sustain tens of thousands of writes per second, and scale horizontally without manual sharding as volume grows. Which Google Cloud database best meets these requirements?",
    options: {
      A: "Cloud Spanner, which scales writes horizontally across regions while preserving relational schemas and external strong consistency.",
      B: "Cloud SQL for PostgreSQL with cross-region read replicas to spread load and a larger primary instance for the write throughput.",
      C: "AlloyDB for PostgreSQL with its columnar engine enabled and read pool instances placed on each continent for global reach.",
      D: "BigQuery with a well-clustered schema so the relational ledger absorbs the high write rate and serves queries worldwide."
    },
    correct: ["A"],
    why: {
      A: "Cloud Spanner is the only Google Cloud service combining relational schemas, synchronous global strong consistency, and horizontal write scaling without sharding (Reliability and Performance Optimization pillar).",
      B: "Cloud SQL read replicas only scale reads; the single primary caps write throughput and cannot shard writes across regions.",
      C: "AlloyDB read pools serve reads and its cross-region replicas are asynchronous, so global writes are not strongly consistent.",
      D: "BigQuery is an analytical warehouse optimized for scan-heavy reads, not the high-rate transactional writes a ledger requires."
    }
  },
  {
    id: "w1d2",
    topic: "Databases & Storage",
    case: null,
    type: "single",
    text: "An industrial IoT platform stores several petabytes of time-series telemetry and must serve single-digit-millisecond lookups by a device-and-timestamp key while sustaining very high write throughput. Relational joins across records are not required. Which storage service is the best fit?",
    options: {
      A: "Cloud Bigtable, a wide-column NoSQL store built for petabyte time-series data with millisecond key lookups and heavy write throughput.",
      B: "BigQuery, using partitioned and clustered tables so the petabyte telemetry is scanned quickly whenever a single device key is queried.",
      C: "Cloud Spanner, whose relational tables and secondary indexes hold the telemetry and return the rows for any given device key on demand.",
      D: "Firestore, whose document model and composite indexes store the per-device telemetry and return each device's latest readings quickly."
    },
    correct: ["A"],
    why: {
      A: "Cloud Bigtable is purpose-built for petabyte-scale time-series with single-digit-millisecond key lookups and very high write throughput (Performance Optimization pillar).",
      B: "BigQuery is a scan-oriented warehouse; per-key point lookups incur query latency and cost far above Bigtable's millisecond reads.",
      C: "Cloud Spanner adds relational overhead and cost that is unnecessary here and cannot match Bigtable's throughput-per-dollar at petabyte scale.",
      D: "Firestore caps per-document write rates and is not designed for petabyte time-series ingestion at this sustained volume."
    }
  },
  {
    id: "w1d3",
    topic: "Data & Analytics",
    case: null,
    type: "single",
    text: "Analysts need to run ad-hoc SQL over five years of historical sales, joining billions of rows for reporting and BI dashboards, with no servers to manage and no impact on the production transactional database. Which service should the architect choose?",
    options: {
      A: "BigQuery, a serverless data warehouse that runs ad-hoc SQL and large joins over the historical data without provisioning or managing servers.",
      B: "Cloud Spanner, running the analytical joins on read-only replicas so the reporting workload stays isolated from the production write traffic.",
      C: "AlloyDB for PostgreSQL, whose columnar engine accelerates the analytical scans while the same cluster keeps serving the transactional load.",
      D: "Cloud SQL read replicas, pointing the BI dashboards at the replicas so the heavy analytical queries stay off the primary transactional node."
    },
    correct: ["A"],
    why: {
      A: "BigQuery is the serverless analytics warehouse for ad-hoc SQL and large joins over historical data, fully isolated from OLTP systems (Performance Optimization and Cost Optimization pillar).",
      B: "Cloud Spanner is tuned for transactional workloads; large analytical scans are costly on it and it is not a data warehouse.",
      C: "AlloyDB's columnar engine helps some analytics, but co-locating heavy reporting on the transactional cluster risks contention at this scale.",
      D: "Cloud SQL replicas are still row-oriented OLTP engines that scan billions of rows inefficiently and cap out well below warehouse scale."
    }
  },
  {
    id: "w1d4",
    topic: "Databases & Storage",
    case: null,
    type: "single",
    text: "A mobile app needs a backend for user profiles whose fields vary per user, with real-time synchronization and offline support on the client, scaling to millions of users. Relational joins and complex cross-profile transactions are not needed. Which database fits best?",
    options: {
      A: "Firestore, a document database with flexible schemas, client SDKs, and real-time offline synchronization that scales to millions of users.",
      B: "Cloud SQL for MySQL, adding nullable columns for the varying profile fields and a client cache layer to approximate offline access on devices.",
      C: "Cloud Bigtable, storing each user profile as a wide-column row and adding a mobile sync service in front to push the updates to app clients.",
      D: "Cloud Spanner, using a flexible key-value column per profile and building a change-stream pipeline to synchronize updates to the mobile clients."
    },
    correct: ["A"],
    why: {
      A: "Firestore natively provides flexible document schemas, real-time listeners, and offline sync SDKs for mobile clients at scale (Performance Optimization and Operational Excellence pillar).",
      B: "Cloud SQL enforces a fixed relational schema and has no native mobile offline-sync or real-time client SDK for this use case.",
      C: "Cloud Bigtable has no client offline-sync SDK and would require building the entire real-time synchronization layer yourself.",
      D: "Cloud Spanner is relational with fixed schemas and no offline mobile SDK, making it overkill and a poor synchronization fit here."
    }
  },
  {
    id: "w1d5",
    topic: "Data & Analytics",
    case: null,
    type: "single",
    text: "A logistics firm is fitting 25,000 delivery vans with GPS trackers that emit a position every two seconds, but the vans routinely pass through tunnels and rural dead zones, so connectivity drops frequently. The receiving infrastructure must absorb reconnection bursts and tolerate devices that come back after gaps. Which ingestion design should you choose?",
    options: {
      A: "Have each tracker hold a persistent connection to a Compute Engine instance that writes the incoming positions into a custom application.",
      B: "Have trackers poll for connectivity to Cloud SQL and insert the buffered positions on a regular interval into a per-vehicle table row.",
      C: "Have trackers poll for connectivity to Pub/Sub and publish their buffered positions on reconnect to a single shared topic for the fleet.",
      D: "Have trackers keep a persistent connection to an App Engine app behind Cloud Endpoints that ingests positions and writes them to Datastore."
    },
    correct: ["C"],
    why: {
      A: "A persistent connection to Compute Engine breaks whenever a van loses signal and drops the buffered readings during the outage gap.",
      B: "Cloud SQL is a regional relational database whose connection limits and write rate are exceeded by thousands of reconnecting trackers.",
      C: "Pub/Sub is a serverless messaging service that absorbs the reconnection bursts and buffers events for downstream consumers to process (Reliability pillar).",
      D: "A persistent App Engine connection likewise fails during dead zones, and Datastore is not tuned for this high-rate streaming ingestion."
    }
  },
  {
    id: "w1d6",
    topic: "Data & Analytics",
    case: null,
    type: "multi",
    pick: 2,
    text: "A ride-sharing startup needs two data stores: an operational store for driver and rider profiles with per-user flexible fields, real-time updates, and mobile offline sync; and a warehouse for ad-hoc SQL analytics over years of trip history for BI. Which two services should the architect choose? (Choose two)",
    options: {
      A: "Firestore for the flexible-schema profile store with real-time mobile sync and offline support for the app clients.",
      B: "BigQuery for the serverless analytics warehouse running ad-hoc SQL and joins over years of the historical trip data.",
      C: "Cloud SQL for MySQL serving both the profile store and the historical trip analytics from its cross-region read replicas.",
      D: "Cloud Bigtable for the ad-hoc SQL trip analytics, relying on its wide-column tables and secondary indexes for reporting.",
      E: "Memorystore for Redis acting as the durable system of record for all of the driver and rider profile records."
    },
    correct: ["A", "B"],
    why: {
      A: "Firestore delivers flexible per-user schemas with real-time and offline mobile sync for the operational profile store (Performance Optimization pillar).",
      B: "BigQuery is the serverless warehouse for ad-hoc SQL and large joins over years of historical trip data (Cost Optimization pillar).",
      C: "Cloud SQL uses a fixed schema and cannot serve mobile offline sync, and it does not scale to warehouse-size analytics.",
      D: "Cloud Bigtable has no ad-hoc SQL interface and no join support, so it cannot serve the BI analytics requirement.",
      E: "Memorystore for Redis is a volatile in-memory cache, not a durable system of record for the profile data."
    }
  },
  // ------------------------------------------------ economics & modernization
  {
    id: "w1m1",
    topic: "Cost & Optimization",
    case: null,
    type: "single",
    text: "A retailer runs a steady 24/7 baseline of Compute Engine capacity for its core services, plus large, unpredictable seasonal traffic spikes served by a stateless, fault-tolerant web tier. Finance wants the lowest possible compute bill without risking availability during the spikes. What should the architect do?",
    options: {
      A: "Cover the steady 24/7 baseline with a 1-year resource-based committed use discount, and absorb the unpredictable spikes with autoscaling onto Spot VMs.",
      B: "Purchase a 3-year resource-based commitment sized to the highest historical spike, so that every seasonal burst is served from deeply discounted committed capacity all year long.",
      C: "Move the entire platform, including the always-on baseline services, onto Spot VMs so that every bit of compute is billed at the deepest possible discount at all times.",
      D: "Keep every tier on standard on-demand virtual machines and rely only on sustained use discounts, which accrue automatically once instances run most of the month."
    },
    correct: ["A"],
    why: {
      A: "Sizing a resource-based CUD to only the always-on baseline locks a deep committed discount on capacity you use continuously, while autoscaling the stateless peak layer onto Spot VMs pays bottom-of-market rates for bursts you cannot forecast — squarely the Cost Optimization pillar.",
      B: "A 3-year commitment sized to the peak keeps paying for the highest spike around the clock, so the discounted capacity sits idle between bursts and costs more than it saves.",
      C: "Spot VMs can be reclaimed at any time, so running the always-on baseline on them risks interrupting core services; the deepest rate is worthless if the baseline cannot stay available.",
      D: "Sustained use discounts alone leave the predictable baseline paying near on-demand rates, forgoing the far larger savings a committed use discount would lock in for 24/7 usage."
    }
  },
  {
    id: "w1m2",
    topic: "Cost & Optimization",
    case: null,
    type: "single",
    text: "A platform team runs forty stateful development and test VMs that are needed only about eight hours a day on weekdays and must keep their disk state between sessions. Leadership wants to minimize what these machines cost. Which approach fits best?",
    options: {
      A: "Attach instance schedules that stop the VMs after hours and on weekends and start them each morning, so they bill only for the roughly forty hours of weekly use.",
      B: "Buy 1-year resource-based committed use discounts for all forty VMs, since their weekday working-hours pattern makes the capacity need predictable enough to commit to.",
      C: "Convert the fleet to Spot VMs so the development machines always run at the steepest discount, accepting that Compute Engine may reclaim them during working hours.",
      D: "Leave the VMs running continuously and let sustained use discounts cut the rate automatically, since that reward grows the longer each instance stays on all month."
    },
    correct: ["A"],
    why: {
      A: "Because the VMs sit idle roughly 128 of every 168 hours, scheduling them to stop nights and weekends means you pay only for actual use, the most direct lever of the Cost Optimization pillar for part-time workloads.",
      B: "A commitment bills for its committed capacity 24/7, so buying CUDs for machines used only about forty hours a week pays for far more time than the fleet ever runs.",
      C: "Spot VMs can be reclaimed mid-session and are meant for fault-tolerant work, so they would interrupt the stateful developer sessions during the exact working hours the team needs them.",
      D: "Running the VMs continuously to chase sustained use discounts adds far more idle hours than the modest automatic rebate saves, raising the bill rather than lowering it."
    }
  },
  {
    id: "w1m3",
    topic: "App Modernization",
    case: null,
    type: "single",
    text: "A bank's customer portal is one large monolithic application. The architects want to move it to a microservices model efficiently while keeping disruption to daily banking operations to a minimum. Which migration approach should they take?",
    options: {
      A: "Refactor the entire monolith into its complete set of microservices in one single coordinated effort, and deploy the finished replacement system in one planned production cutover.",
      B: "Incrementally carve individual features out of the monolith and replace them with microservices in phases, shifting traffic to each service only after it is verified.",
      C: "Build a complete replacement made of microservices alongside the untouched monolith, and switch all customers over at once when the new system is entirely finished.",
      D: "Rehost the existing monolith on Compute Engine unchanged and turn on autoscaling, so it can grow under heavier load without being decomposed into separate services."
    },
    correct: ["B"],
    why: {
      A: "A single big-bang rewrite of the whole monolith is the highest-risk path, concentrating every change into one cutover that is hard to test incrementally and disruptive to the business if it fails.",
      B: "Replacing features one at a time (the strangler-fig approach) lets each microservice be tested and take live traffic before the next is built, minimizing risk and business disruption — serving the Operational Excellence and Reliability pillars.",
      C: "Building a full parallel replacement duplicates the entire system and delays any value until the very end, and the eventual single switchover carries the same big-bang risk it was meant to avoid.",
      D: "Rehosting the monolith on Compute Engine with autoscaling only scales the existing monolith; it never decomposes it into microservices, so it does not meet the modernization goal at all."
    }
  },
  {
    id: "w1m4",
    topic: "App Modernization",
    case: null,
    type: "single",
    text: "After a team split an application into dozens of microservices on GKE, the security group reports that service-to-service traffic is unencrypted, and developers cannot see which call hop is adding latency. What should the architect implement?",
    options: {
      A: "Deploy Cloud Service Mesh, which transparently enforces mutual TLS between services and emits uniform telemetry so teams can trace latency across each service-to-service call.",
      B: "Add VPC firewall rules between the node pools so that only approved services can reach each other and unexpected cross-service traffic is blocked at the network layer.",
      C: "Put an API gateway in front of the cluster to authenticate external callers and centralize logging of the requests that enter the microservices from outside the mesh.",
      D: "Recombine the chatty services back into one deployment so calls stay in-process, removing the encryption and tracing gaps that only appear once traffic crosses the network."
    },
    correct: ["A"],
    why: {
      A: "Cloud Service Mesh injects sidecars that enforce mutual TLS between services and emit consistent latency and traffic telemetry with no application changes, closing both the encryption and observability gaps — the Security, Privacy and Compliance and Operational Excellence pillars.",
      B: "VPC firewall rules only permit or deny connections; they neither encrypt in-transit traffic nor produce the per-hop latency traces the developers are missing.",
      C: "An API gateway secures and logs north-south traffic entering the cluster, but the flagged problem is unencrypted, untraced east-west traffic between the services inside it.",
      D: "Merging the services back into a monolith discards the modernization already done and trades the network problem for the very coupling the team deliberately moved away from."
    }
  },
  {
    id: "w1m5",
    topic: "Networking & Hybrid",
    case: null,
    type: "single",
    text: "A manufacturer must keep its latency-sensitive, regulated order-processing backend in its on-premises data center beside the factory systems, while moving the public web and presentation tier to Google Cloud for elastic scale. Which hybrid pattern fits best?",
    options: {
      A: "Adopt the tiered hybrid pattern, placing the frontend presentation tier in Google Cloud while the latency-sensitive backend tier stays on-premises, joined by a private link.",
      B: "Adopt the cloud bursting pattern so the on-premises backend carries the normal load and overflows only its peak demand into Google Cloud when local capacity is exhausted.",
      C: "Adopt the partitioned multicloud pattern, spreading the application's components across two separate public cloud providers so it never depends on any single provider.",
      D: "Adopt the business continuity pattern, replicating the whole backend into Google Cloud purely as a standby that is activated only if the primary environment ever fails."
    },
    correct: ["A"],
    why: {
      A: "The tiered hybrid pattern keeps the latency-sensitive, regulated backend on-premises next to the factory systems while the elastic frontend runs in Google Cloud, matching each tier to its best environment — the Performance Optimization and Reliability pillars.",
      B: "Cloud bursting is for overflowing peak demand into the cloud; here the backend must stay on-premises for latency and compliance, not spill over when it is busy.",
      C: "Partitioned multicloud splits components across two public clouds; the requirement is to keep one tier on-premises, not to run across a second cloud provider.",
      D: "The business continuity pattern builds a passive standby for failover; it does not serve the live frontend from the cloud while the backend runs on-premises."
    }
  },
  {
    id: "w1m6",
    topic: "Cost & Optimization",
    case: null,
    type: "multi",
    pick: 2,
    text: "A SaaS company runs a stable, always-on production fleet on Compute Engine that monitoring shows is significantly over-provisioned. Finance wants a lower monthly bill with no reduction in availability. Which two actions should the architect take? (Choose two)",
    options: {
      A: "Apply the machine-type rightsizing recommendations from the Recommender so each over-provisioned instance is resized down to the capacity it genuinely uses day to day.",
      B: "Commit the steady baseline to compute flexible committed use discounts, which cut the rate on that always-on usage across machine families for a one- or three-year term.",
      C: "Move the production database and its always-on nodes onto Spot VMs so that the core fleet runs at the very deepest discount that Compute Engine is able to offer.",
      D: "Buy 3-year resource-based commitments for a legacy service that the published roadmap clearly states will be fully decommissioned within roughly the next twelve months anyway.",
      E: "Manually enroll the whole fleet in sustained use discounts through a purchase order, since that particular rebate only applies once you sign up for it each month."
    },
    correct: ["A", "B"],
    why: {
      A: "Rightsizing over-provisioned instances to the capacity they actually use cuts spend immediately with no availability trade-off, a core move of the Cost Optimization pillar.",
      B: "Committing the always-on baseline to compute flexible CUDs lowers the rate on steady usage across machine families for a 1- or 3-year term without touching availability — also serving the Cost Optimization pillar.",
      C: "Spot VMs can be reclaimed at any moment, so placing a production database and its always-on nodes on them would violate the stated no-reduction-in-availability requirement.",
      D: "A 3-year commitment on a service being decommissioned within twelve months would keep billing long after the workload is gone, wasting money rather than saving it.",
      E: "Sustained use discounts apply automatically as usage accrues; there is no purchase order or monthly sign-up, so this option describes a mechanism that does not exist."
    }
  }
];
