// Night Motives Automotive — THEME-BASED (no official PDF); questions mapped to
// GCP managed services and the Well-Architected Framework.
export const NIGHT_MOTIVES_QUESTIONS = [
  { id:"nma1", topic:"Data & Analytics", case:"Night Motives Automotive", type:"single",
    text:"Millions of vehicles with intermittent connectivity must push telemetry into a decoupled entry point that buffers reconnection bursts and absorbs global scale without producers waiting on downstream processing. Which ingestion service should be the entry point?",
    options:{
      A:"Pub/Sub Lite, with a regional zone and pre-provisioned throughput and storage capacity sized for the partitions each vehicle group writes to.",
      B:"Pub/Sub, as a global managed message bus that auto-scales to absorb bursts and decouples vehicle producers from the downstream stream processors.",
      C:"Eventarc, routing each vehicle event through provider triggers to the downstream processors using CloudEvents delivery and filtering on the message attributes.",
      D:"Kafka on Compute Engine, with a managed instance group of brokers that the vehicles connect to directly for partitioned, ordered, replayable ingestion."},
    correct:["B"],
    why:{
      A:"Pub/Sub Lite requires you to pre-provision capacity per zone, which removes the elastic burst buffering this intermittent fleet needs.",
      B:"Pub/Sub auto-scales to millions of messages, buffers reconnection bursts, and decouples producers from consumers, serving the Reliability pillar.",
      C:"Eventarc is an event-routing layer over Pub/Sub for triggering services, not a high-volume device ingestion front door itself.",
      D:"Self-managed Kafka on Compute Engine pushes broker scaling and patching toil onto the team, contradicting the prefer-managed practice."} },

  { id:"nma2", topic:"Data & Analytics", case:"Night Motives Automotive", type:"single",
    text:"You need a low-latency operational store for billions of telemetry points that serves single-digit-millisecond per-vehicle reads and contiguous time-range scans for a vehicle. Which store and key design best fits this access pattern?",
    options:{
      A:"Bigtable, with a row key of vehicle ID plus a reversed timestamp so a vehicle's readings stay contiguous for fast point and range scans.",
      B:"Firestore, writing each reading as a document in a per-vehicle subcollection and querying the most recent readings ordered by their timestamp field.",
      C:"Spanner, partitioning rows by vehicle and ordering by timestamp so a vehicle's recent readings stay together for indexed range queries at scale.",
      D:"BigQuery, streaming each reading into a date-partitioned table and clustering by vehicle so per-vehicle range lookups read only matching blocks."},
    correct:["A"],
    why:{
      A:"Bigtable gives single-digit-millisecond reads and a vehicle-plus-timestamp key keeps readings contiguous for range scans, serving Performance Optimization.",
      B:"Firestore is not built for sustained high-frequency time-series ingestion at this volume and its query model adds latency at scale.",
      C:"Spanner is a strongly consistent relational store whose per-write cost and design do not match this firehose of high-frequency time-series points.",
      D:"BigQuery is an analytics warehouse whose query latency cannot serve the real-time per-vehicle point reads the dashboards require."} },

  { id:"nma3", topic:"Data & Analytics", case:"Night Motives Automotive", type:"single",
    text:"Streaming telemetry arrives late and out of order, yet you must compute windowed aggregations and anomaly detection in near real time while correctly attributing each reading to the time it actually occurred. Which approach should you choose?",
    options:{
      A:"Dataproc Spark Streaming on an autoscaling cluster, applying micro-batch processing-time windows that recompute aggregates as new partitions of data land.",
      B:"Dataflow on Apache Beam, using event-time windows and watermarks so late and out-of-order readings land in their correct windows as they arrive.",
      C:"A scheduled BigQuery query running every few minutes that aggregates whatever telemetry has been streamed into the table since the previous scheduled run.",
      D:"Cloud Functions triggered per message that update windowed counters keyed by time bucket in Memorystore and emit an alert when a threshold is crossed."},
    correct:["B"],
    why:{
      A:"Dataproc Spark Streaming leans on processing-time micro-batches and lacks the native watermark semantics needed for correct late-data attribution.",
      B:"Dataflow's event-time windowing and watermarks place late and out-of-order data in correct windows on a managed autoscaling runner, serving Reliability.",
      C:"A scheduled BigQuery query is periodic batch, so it cannot meet near-real-time latency or reason about event-time correctly.",
      D:"Per-message Cloud Functions over a shared Memorystore key cannot express watermark-based windowing and create write contention at fleet scale."} },

  { id:"nma4", topic:"Compute & Containers", case:"Night Motives Automotive", type:"single",
    text:"Depots must run ML inference locally with low latency and keep operating when the link to the cloud drops, while the platform team needs one consistent way to push config and workloads to every depot from the cloud. What should you deploy?",
    options:{
      A:"Cloud Run services in a central region behind a global load balancer that each depot calls per inference, scaling to zero between depot request bursts.",
      B:"Compute Engine inference VMs at each depot in a regional managed instance group, autohealed and updated through a rolling instance-template deployment.",
      C:"Standalone Kubernetes installed on each depot's own servers, with a GitOps controller pulling manifests so every cluster converges to one declared inference workload set.",
      D:"Google Distributed Cloud connected clusters at depots, managed through GKE Enterprise fleets for consistent config and workloads delivered from the cloud."},
    correct:["D"],
    why:{
      A:"Calling a central Cloud Run region per inference fails the low-latency and offline-operation requirements whenever depot connectivity drops.",
      B:"Per-depot Compute Engine VMs run no fleet control plane, so config drifts and there is no single consistent cloud-managed delivery path.",
      C:"Hand-rolled standalone Kubernetes with only GitOps lacks the centralized fleet management and policy enforcement this estate needs.",
      D:"Google Distributed Cloud runs inference locally for low latency and offline use while GKE Enterprise fleets manage all clusters, serving Operational Excellence."} },

  { id:"nma5", topic:"Security & Compliance", case:"Night Motives Automotive", type:"multi", pick:2,
    text:"Device-to-cloud telemetry must be secured so a single compromised vehicle cannot impersonate others or reach data beyond its scope, and the telemetry stores must meet strong governance over access and encryption. Which two practices should you adopt? (Choose two.)",
    options:{
      A:"Give each vehicle its own certificate and grant publish rights only to its designated Pub/Sub topic through least-privilege IAM bindings per device identity.",
      B:"Issue one shared API key embedded in every vehicle's firmware so all vehicles authenticate identically and the fleet can be onboarded with a single rotation.",
      C:"Place telemetry stores and pipelines inside a VPC Service Controls perimeter and encrypt the data with customer-managed encryption keys for governance control.",
      D:"Expose the Pub/Sub topic and the Bigtable instance with broad public access so depots and partners can connect without managing network paths or service-account credentials.",
      E:"Turn off Cloud Audit Logs on the telemetry data services so the high-volume ingestion path does not generate logging cost or admin-activity log volume."},
    correct:["A","C"],
    why:{
      A:"Per-device certificates with least-privilege IAM stop a compromised vehicle from impersonating others or reaching other data, serving Security and Compliance.",
      B:"One shared firmware key means a single leak compromises the whole fleet and blocks per-device revocation, which is the opposite of the requirement.",
      C:"VPC Service Controls limit exfiltration by perimeter and CMEK gives governance over encryption keys, serving Security, Privacy and Compliance.",
      D:"Public exposure of Pub/Sub and Bigtable strips access controls and directly invites telemetry theft and tampering.",
      E:"Disabling audit logs removes the traceability that governance, compliance, and incident response all depend on."} },

  { id:"nma6", topic:"AI & ML", case:"Night Motives Automotive", type:"single",
    text:"For predictive maintenance you must train on historical telemetry already in BigQuery, where data scientists need rapid iteration in SQL but the team also wants managed serving, monitoring, and retraining as new failure data arrives. Which combination best fits?",
    options:{
      A:"Vertex AI AutoML to train tabular models directly from the telemetry, then deploy each model version to an endpoint with monitoring and retrain it on a fixed weekly schedule.",
      B:"Vertex AI custom training in containers on telemetry exported from BigQuery, deployed to an endpoint with monitoring and a managed pipeline for retraining.",
      C:"BigQuery ML to train where the telemetry lives, then register and deploy to a Vertex AI endpoint with model monitoring and pipeline-driven retraining over time.",
      D:"A Cloud Function scoring readings against thresholds tuned from historical telemetry, with a scheduled job recomputing the thresholds as new failures occur."},
    correct:["C"],
    why:{
      A:"AutoML trades away the SQL-native rapid iteration the data scientists want and adds training time without a clear fit gain here.",
      B:"Custom training is heavier than needed when the data is in BigQuery and SQL iteration plus standard model types already satisfy the requirement.",
      C:"BigQuery ML trains where the data lives for fast SQL iteration and exports to a Vertex AI endpoint for managed serving and retraining, serving Operational Excellence.",
      D:"A threshold Cloud Function is a hand-tuned heuristic, not a learned model, so it ignores the ML predictive-maintenance requirement."} },

  { id:"nma7", topic:"Data & Analytics", case:"Night Motives Automotive", type:"single",
    text:"Fleet managers need dashboards that explore fresh fleet-wide KPIs interactively, with sub-second response under high concurrency over telemetry that is being streamed in continuously. Which solution should you build?",
    options:{
      A:"Stream telemetry into BigQuery and serve dashboards via Looker on BigQuery accelerated by BI Engine for sub-second high-concurrency analytical queries.",
      B:"Point the dashboards directly at the operational Bigtable instance and run per-vehicle reads on each refresh, aggregating across vehicles in the dashboard layer.",
      C:"Schedule nightly BigQuery exports to CSV and load them into a spreadsheet dashboard so fleet managers review the prior day's KPIs each morning across regions.",
      D:"Run a custom analytics server on Compute Engine that re-scans the raw telemetry tables per widget and caches the rendered charts behind a load balancer."},
    correct:["A"],
    why:{
      A:"Streaming into BigQuery with Looker and BI Engine gives fresh data and in-memory sub-second high-concurrency analytics, serving Performance Optimization.",
      B:"Bigtable serves per-vehicle operational reads, not ad hoc fleet-wide aggregations across many concurrent managers.",
      C:"Nightly CSV exports are batch and stale, so they cannot support interactive exploration of fresh KPIs.",
      D:"Re-scanning raw telemetry per widget on a self-managed server is slow, costly, and adds operational toil at scale."} },

  { id:"nma8", topic:"Cost & Optimization", case:"Night Motives Automotive", type:"single",
    text:"Telemetry traffic is highly variable and the fleet keeps growing, so leadership wants to cut spend without hurting the workload's latency or reliability. Which design choice best optimizes cost while still meeting the workload's needs?",
    options:{
      A:"Run Dataflow at a fixed maximum worker count at all times so streaming capacity is always ready, and keep all telemetry on full Bigtable nodes for fast reads.",
      B:"Favor autoscaling managed services for ingestion and processing, and tier telemetry so hot data stays in Bigtable while cold history moves to cheaper storage.",
      C:"Provision Compute Engine and database clusters at peak size plus a safety margin, and commit to that capacity long term to lock in committed-use discounts.",
      D:"Keep all telemetry in Bigtable indefinitely at the full node count, and add more read replicas as the fleet grows so that historical queries never compete with live reads."},
    correct:["B"],
    why:{
      A:"Always-on maximum Dataflow plus full Bigtable nodes pays for idle capacity and defeats autoscaling savings during off-peak periods.",
      B:"Autoscaling services match cost to load and tiering cold data to cheaper storage cuts spend while hot data stays fast, serving Cost Optimization.",
      C:"Peak-plus-margin provisioning wastes spend during frequent off-peak periods even with committed-use discounts applied.",
      D:"Holding all data on full Bigtable nodes forever pays premium operational-store cost for rarely read history."} }
];
