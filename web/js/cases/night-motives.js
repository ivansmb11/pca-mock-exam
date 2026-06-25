// Night Motives Automotive — THEME-BASED (no official PDF); questions mapped to
// GCP managed services and the Well-Architected Framework.
export const NIGHT_MOTIVES_QUESTIONS = [
  { id:"nma1", topic:"Data & Analytics", case:"Night Motives Automotive", type:"single",
    text:"To meet the requirement for scalable, decoupled ingestion of millions of telemetry messages from vehicles with intermittent connectivity, which GCP service should be the entry point that decouples producers from downstream processing?",
    options:{
      A:"Cloud Pub/Sub, used as a globally scalable, fully managed message bus that buffers bursts and decouples ingestion from processing.",
      B:"A fleet of Compute Engine VMs running a self-managed Kafka cluster that vehicles connect to directly.",
      C:"Cloud SQL, with each vehicle inserting telemetry rows over a direct database connection.",
      D:"Cloud Storage, with each vehicle uploading a file per telemetry message via signed URLs."},
    correct:["A"],
    why:{
      A:"Pub/Sub is serverless, auto-scales to millions of messages, buffers reconnection bursts, and decouples producers from consumers, serving the Reliability and Performance Optimization pillars.",
      B:"Self-managed Kafka on VMs adds heavy operational toil and scaling burden, contradicting the prefer-managed best practice.",
      C:"Cloud SQL is a relational OLTP database that cannot absorb millions of high-frequency writes and would become a tight coupling bottleneck.",
      D:"One object upload per message creates enormous overhead and offers no streaming decoupling for real-time processing."} },

  { id:"nma2", topic:"Data & Analytics", case:"Night Motives Automotive", type:"single",
    text:"To meet the requirement for low-latency time-series storage that supports fast per-vehicle reads and range queries over billions of telemetry points, which storage choice and key design is best?",
    options:{
      A:"BigQuery, using one streaming insert per reading and scanning the full table for each per-vehicle lookup.",
      B:"Cloud Bigtable, with a row key combining vehicle ID and a reversed or padded timestamp to enable fast point and range scans.",
      C:"Firestore, storing each reading as a document in a single collection keyed by an auto-generated ID.",
      D:"Cloud Storage, writing one JSON object per reading partitioned by date prefix."},
    correct:["B"],
    why:{
      A:"BigQuery is an analytics warehouse, not a low-latency operational store, and full scans for single-vehicle lookups are slow and costly.",
      B:"Bigtable delivers single-digit-millisecond reads at massive scale, and a vehicle-ID-plus-timestamp row key keeps a vehicle's readings contiguous for efficient range scans, serving Performance Optimization.",
      C:"Firestore is not optimized for high-frequency time-series ingestion at this volume and an auto-ID key prevents efficient range queries.",
      D:"Cloud Storage cannot serve low-latency point or range reads for real-time per-vehicle dashboards."} },

  { id:"nma3", topic:"Data & Analytics", case:"Night Motives Automotive", type:"single",
    text:"To meet the requirement for real-time stream processing with windowed aggregations and anomaly detection that correctly handles late and out-of-order telemetry, which approach should you choose?",
    options:{
      A:"Schedule an hourly batch job in BigQuery that aggregates whatever data has arrived so far.",
      B:"Run Dataflow streaming pipelines built on Apache Beam, using event-time windows and watermarks to handle late and out-of-order data.",
      C:"Trigger a Cloud Function per message that writes a running counter to a single Memorystore key.",
      D:"Use a cron job on a Compute Engine VM that polls Pub/Sub every minute and computes aggregates in memory."},
    correct:["B"],
    why:{
      A:"Hourly batch aggregation is not real time and cannot meet low-latency anomaly-detection needs.",
      B:"Dataflow is a managed, autoscaling Beam runner whose event-time windowing and watermarks correctly process late and out-of-order data, serving Reliability and Operational Excellence.",
      C:"Per-message Cloud Functions with a shared Memorystore counter cannot express windowing or late-data semantics and create contention.",
      D:"A polling VM is self-managed, not autoscaling, and lacks proper watermark-based handling of late or out-of-order events."} },

  { id:"nma4", topic:"Compute & Containers", case:"Night Motives Automotive", type:"single",
    text:"To meet the requirement for edge computing that runs ML inference at depots with low latency and offline operation while staying centrally managed and consistent with the cloud, what should you deploy?",
    options:{
      A:"Google Distributed Cloud (Edge) clusters at depots, managed centrally through GKE Enterprise fleets for consistent config and workload delivery.",
      B:"A single large Compute Engine VM per depot that staff patch and update manually.",
      C:"Cloud Run services in a central region that depots call over the public internet for every inference.",
      D:"Standalone Kubernetes installed by hand on depot servers with no central fleet management."},
    correct:["A"],
    why:{
      A:"Google Distributed Cloud Edge runs containerized inference locally for low latency and offline operation, and GKE Enterprise fleets manage all clusters consistently from the cloud, serving Operational Excellence and Reliability.",
      B:"Manually patched per-depot VMs create configuration drift and operational toil with no central management.",
      C:"Calling a central region over the internet fails the low-latency and offline-operation requirements when connectivity drops.",
      D:"Hand-rolled standalone Kubernetes lacks the centralized fleet management needed for consistency at scale."} },

  { id:"nma5", topic:"Security & Compliance", case:"Night Motives Automotive", type:"multi", pick:2,
    text:"To meet the requirement for secure device-to-cloud communication and strong data governance for telemetry, which two practices should you adopt? (Choose two.)",
    options:{
      A:"Authenticate each vehicle with its own credential or certificate and grant publish access only to its designated Pub/Sub topic via least-privilege IAM.",
      B:"Embed one shared static API key in every vehicle's firmware so all vehicles use the same credential.",
      C:"Protect telemetry data stores and pipelines with VPC Service Controls and encrypt data with customer-managed encryption keys (CMEK).",
      D:"Make the Pub/Sub topic and Bigtable instance publicly accessible to simplify depot connectivity.",
      E:"Disable Cloud Audit Logs on the data services to reduce logging cost."},
    correct:["A","C"],
    why:{
      A:"Per-device credentials with least-privilege IAM ensure a compromised vehicle cannot impersonate others or access data beyond its scope, serving Security, Privacy and Compliance.",
      B:"A shared static key means one leak compromises the entire fleet and prevents per-device revocation.",
      C:"VPC Service Controls reduce exfiltration risk by perimeter and CMEK gives governance control over encryption keys, serving Security, Privacy and Compliance.",
      D:"Publicly exposing Pub/Sub and Bigtable removes access controls and invites data theft.",
      E:"Disabling audit logs eliminates the traceability that governance and incident response depend on."} },

  { id:"nma6", topic:"AI & ML", case:"Night Motives Automotive", type:"single",
    text:"To meet the requirement for predictive maintenance using ML on historical plus streaming telemetry, with managed training, deployment, and lifecycle management, which combination is the best fit?",
    options:{
      A:"Hand-code a maintenance heuristic in a Cloud Function and hard-tune thresholds by trial and error.",
      B:"Train models with BigQuery ML and Vertex AI on telemetry in BigQuery, then deploy to a managed Vertex AI endpoint for online predictions with monitoring.",
      C:"Export telemetry to spreadsheets and have analysts manually flag vehicles likely to fail.",
      D:"Run a static rules engine on a self-managed VM that never retrains as new failure data arrives."},
    correct:["B"],
    why:{
      A:"Hand-tuned heuristics in a Cloud Function are brittle, do not learn from data, and ignore the ML requirement.",
      B:"BigQuery ML and Vertex AI provide managed training on historical and streaming telemetry plus managed endpoints, monitoring, and retraining, serving Operational Excellence and Performance Optimization.",
      C:"Manual spreadsheet flagging does not scale to a large fleet and is not a real ML solution.",
      D:"A static rules engine that never retrains degrades as patterns change and is self-managed toil."} },

  { id:"nma7", topic:"Data & Analytics", case:"Night Motives Automotive", type:"single",
    text:"To meet the requirement for real-time analytics dashboards that let fleet managers explore fresh fleet-wide KPIs with sub-second, high-concurrency queries, which solution should you build?",
    options:{
      A:"Stream telemetry into BigQuery and serve dashboards through Looker or Looker Studio accelerated by BigQuery BI Engine.",
      B:"Have every dashboard run direct point reads against the operational Bigtable instance on each page refresh.",
      C:"Export nightly CSV files from BigQuery and email static charts to fleet managers each morning.",
      D:"Build a custom dashboard server on Compute Engine that re-scans the full raw telemetry table for every widget."},
    correct:["A"],
    why:{
      A:"Streaming into BigQuery with Looker or Looker Studio and BI Engine gives fresh data plus in-memory, sub-second, high-concurrency analytics, serving Performance Optimization and Operational Excellence.",
      B:"Bigtable is the operational store for per-vehicle reads, not for ad hoc fleet-wide analytical aggregations across many managers.",
      C:"Nightly CSV emails are not real time and cannot support interactive exploration.",
      D:"Re-scanning raw telemetry per widget on a self-managed server is slow, costly, and operationally heavy."} },

  { id:"nma8", topic:"Cost & Optimization", case:"Night Motives Automotive", type:"single",
    text:"To meet the requirement to reduce operational cost while scaling with a growing fleet, which design choice best optimizes cost without sacrificing the workload's needs?",
    options:{
      A:"Permanently overprovision fixed-size Compute Engine and database clusters sized for peak plus a large safety margin.",
      B:"Favor serverless and autoscaling managed services such as Pub/Sub and Dataflow, and tier storage by moving cold telemetry to lower-cost classes while keeping hot data in Bigtable.",
      C:"Keep all telemetry forever in Bigtable at full node count regardless of how rarely older data is read.",
      D:"Run continuous maximum-size Dataflow jobs at all times so capacity is always available even when traffic is low."},
    correct:["B"],
    why:{
      A:"Permanent peak-plus-margin overprovisioning wastes spend during the frequent off-peak periods.",
      B:"Serverless and autoscaling services match cost to actual load and tiering cold data to cheaper storage cuts spend while hot data stays fast in Bigtable, serving Cost Optimization.",
      C:"Retaining all data on full Bigtable nodes forever pays premium operational-store cost for rarely read history.",
      D:"Always-on maximum-size Dataflow jobs pay for idle capacity and defeat autoscaling cost savings."} }
];
