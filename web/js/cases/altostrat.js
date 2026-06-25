// Altostrat Media - questions grounded in case requirements; distractors are real GCP near-misses balanced for equal length so only architecture judgment selects the key.

export const ALTOSTRAT_QUESTIONS = [
  {
    id: "alt1",
    topic: "Compute & Containers",
    case: "Altostrat Media",
    type: "single",
    text: "Altostrat needs one centralized management platform that governs scalable Kubernetes BOTH on-premises and in the cloud, with consistent policy across every cluster. What should you do?",
    options: {
      A: "Run GKE Autopilot in the cloud and a separate kubeadm cluster on-prem, keeping each platform team responsible for its own policy",
      B: "Use Cloud Run for cloud workloads and a standalone GKE Standard cluster on-prem, wiring them together with a shared Cloud Load Balancing tier",
      C: "Register cloud GKE and Google Distributed Cloud on-prem clusters into a GKE Enterprise fleet, governed by Config Sync and Policy Controller",
      D: "Deploy GKE Standard in the cloud and rely on Anthos Service Mesh alone to push the same configuration outward to every on-prem cluster node"
    },
    correct: ["C"],
    why: {
      A: "Two unrelated clusters with team-by-team policy gives no single control plane and lets configuration drift, missing the centralized-management requirement.",
      B: "Cloud Run is not Kubernetes and a lone GKE cluster on-prem leaves no shared governance layer across the two environments.",
      C: "A GKE Enterprise fleet with Config Sync and Policy Controller spans cloud and Google Distributed Cloud clusters from one place with consistent GitOps policy, serving the Operational Excellence pillar.",
      D: "Cloud Service Mesh handles traffic and security, not GitOps configuration or fleet-wide policy enforcement across hybrid clusters."
    }
  },
  {
    id: "alt2",
    topic: "SRE & Operations",
    case: "Altostrat Media",
    type: "single",
    text: "Altostrat wants safe, repeatable, auditable rollouts of container images to GKE, with progressive promotion, approvals, and fast rollbacks. Which managed pipeline should you build?",
    options: {
      A: "Cloud Build builds and pushes images to Artifact Registry, then a custom GitHub Actions job runs kubectl set image against each GKE cluster in turn",
      B: "Cloud Build produces images, and a Cloud Scheduler trigger calls a Cloud Run function that applies the newest manifest to production on every commit",
      C: "Jenkins on Compute Engine builds the images, stores them in Artifact Registry, and a Config Sync repo reconciles them straight into the production cluster",
      D: "Cloud Build builds and pushes to Artifact Registry, then Cloud Deploy orchestrates progressive rollouts, approvals, and one-click rollbacks to GKE"
    },
    correct: ["D"],
    why: {
      A: "Hand-rolled kubectl in CI gives no promotion gates, approval steps, or managed rollback, so releases stay risky and hard to audit.",
      B: "A scheduler-driven function pushing straight to production skips staging promotion and provides no controlled rollback path.",
      C: "Jenkins plus Config Sync can deploy but offers no built-in canary promotion, approval workflow, or release-aware rollback semantics.",
      D: "Cloud Build for CI plus Cloud Deploy for managed delivery gives serverless builds, progressive rollouts, approvals, and one-click rollbacks, advancing the Operational Excellence pillar."
    }
  },
  {
    id: "alt3",
    topic: "Networking & Hybrid",
    case: "Altostrat Media",
    type: "single",
    text: "Altostrat must ingest large, sustained volumes of media from its on-prem data center over secure, high-performance hybrid connectivity with predictable bandwidth. What should you implement?",
    options: {
      A: "Provision Dedicated Interconnect for consistent high bandwidth off the public internet, then run HA VPN over it to add IPsec encryption in transit",
      B: "Deploy redundant HA VPN tunnels over the public internet, scaling tunnel count up and down as ingestion volume rises to reach the bandwidth target",
      C: "Order Partner Interconnect through a service provider and send all media as plaintext, trusting the provider circuit to keep the data private end to end",
      D: "Set up Cross-Cloud Interconnect from the on-prem facility to the Google network so media flows over a private, encrypted high-throughput path inbound"
    },
    correct: ["A"],
    why: {
      A: "Dedicated Interconnect delivers consistent high bandwidth off the public internet and HA VPN over it adds IPsec encryption, serving the Performance Optimization and Security pillars.",
      B: "HA VPN over the internet is capped by tunnel throughput and shares the congested public path, so it cannot sustain bulk media ingestion predictably.",
      C: "Partner Interconnect is valid for capacity but sending plaintext leaves data unencrypted, failing the secure requirement.",
      D: "Cross-Cloud Interconnect links Google to another cloud provider, not an on-prem data center, so it does not fit this hybrid ingestion path."
    }
  },
  {
    id: "alt4",
    topic: "Cost & Optimization",
    case: "Altostrat Media",
    type: "single",
    text: "Altostrat's media library keeps growing and its access patterns are unpredictable; you must cut Cloud Storage cost while keeping high availability and avoiding surprise fees. What is best?",
    options: {
      A: "Apply Object Lifecycle Management rules that demote objects to Coldline after thirty days and to Archive after ninety days across the whole bucket",
      B: "Move the bulk of the library to Archive storage immediately to lock in the lowest per-gigabyte price, paying retrieval fees only when content is needed",
      C: "Keep all media in Standard storage and offset the spend with Committed Use Discounts plus a custom script that deletes objects older than one year",
      D: "Enable Autoclass on the bucket so objects shift between storage classes by access pattern, with no retrieval or class-transition fees applied"
    },
    correct: ["D"],
    why: {
      A: "Fixed age-based lifecycle rules misjudge unpredictable access, charging retrieval fees and latency when demoted objects are read again.",
      B: "Day-one Archive storage incurs steep retrieval cost and latency every time growing, frequently re-published media is accessed.",
      C: "Standard-only storage keeps cold media at the priciest tier and Committed Use Discounts do not apply to Cloud Storage class pricing.",
      D: "Autoclass transitions objects by last-access time with no retrieval or transition charges, ideal for unpredictable patterns and serving the Cost Optimization pillar."
    }
  },
  {
    id: "alt5",
    topic: "AI & ML",
    case: "Altostrat Media",
    type: "multi",
    pick: 2,
    text: "Altostrat must EXTRACT rich metadata from media using NLP and computer vision AND automatically GENERATE concise summaries of diverse audio, video, and text. Which TWO managed services fit? (Choose two.)",
    options: {
      A: "Vision API to label individual still frames sampled from each video, treating the per-frame tags as the complete metadata index for the asset",
      B: "Video Intelligence API to detect labels, shots, objects, and transcribed speech, producing rich automated metadata across the video library",
      C: "Cloud Natural Language to classify transcripts and AutoML Vision to tag frames, combining both outputs as the managed summarization layer",
      D: "Speech-to-Text to transcribe audio and then keyword frequency counts over the transcript to assemble the concise summaries of each asset",
      E: "Gemini on Vertex AI to generate concise multimodal summaries spanning the audio, video, and text content in the media catalog"
    },
    correct: ["B", "E"],
    why: {
      A: "Sampling still frames with Vision API misses motion, shots, and speech, so it cannot deliver full video metadata on its own.",
      B: "Video Intelligence API extracts labels, shots, objects, and transcribed speech as managed metadata without training infrastructure, serving Operational Excellence.",
      C: "Natural Language and AutoML Vision classify and tag but neither generates the natural-language summaries the requirement asks for.",
      D: "Speech-to-Text plus keyword counts yields term lists, not coherent summaries, and ignores the visual content entirely.",
      E: "Gemini on Vertex AI is a managed multimodal model purpose-built to summarize diverse media, meeting summarization under the Performance Optimization pillar."
    }
  },
  {
    id: "alt6",
    topic: "Security & Compliance",
    case: "Altostrat Media",
    type: "single",
    text: "Altostrat needs AI-powered detection of harmful content across BOTH uploaded media AND the platform's generative AI request/response flow, with configurable, auditable enforcement. What should you do?",
    options: {
      A: "Run Sensitive Data Protection to redact PII in every upload and rely on the base LLM's own built-in safety filters to police each generated chatbot reply",
      B: "Use Vision SafeSearch for images and a static keyword blocklist applied to both media transcripts and the chatbot output before any of it is shown to users",
      C: "Use Vision SafeSearch and Video Intelligence explicit-content detection on media, plus Model Armor to screen harmful and prompt-injection content in the GenAI flow",
      D: "Use Video Intelligence explicit-content detection on media and route every model prompt through Sensitive Data Protection inspection templates as the screening step"
    },
    correct: ["C"],
    why: {
      A: "Sensitive Data Protection handles PII, not harmful imagery, and base-model safety alone is neither configurable nor auditable for the GenAI flow.",
      B: "A keyword blocklist is trivially bypassed and cannot screen video or model-generated responses for harmful or injected content.",
      C: "SafeSearch and Video Intelligence flag explicit media while Model Armor screens harmful content and prompt injection in the LLM flow, giving layered detection for the Security, Privacy and Compliance pillar.",
      D: "Sensitive Data Protection finds and masks PII but does not detect jailbreaks, prompt injection, or harmful generative responses."
    }
  },
  {
    id: "alt7",
    topic: "AI & ML",
    case: "Altostrat Media",
    type: "single",
    text: "Altostrat must ensure its AI systems are auditable and that individual model decisions can be explained, with drift and lineage tracked over time. Which capabilities should you build in?",
    options: {
      A: "Stream all prediction requests and responses to Cloud Logging and build BigQuery dashboards over the logs as the system of record for model behavior",
      B: "Vertex Explainable AI for per-feature attributions plus Vertex AI Model Monitoring and Model Registry versioning to track drift, skew, and lineage over time",
      C: "Register every model in Vertex AI Model Registry and rely on its version history alone to explain why each prediction was produced when audited",
      D: "Enable Vertex AI Model Monitoring to alert on feature drift and treat those drift alerts as the explanation for each individual decision the model makes"
    },
    correct: ["B"],
    why: {
      A: "Request and response logs show what was predicted but not why, so they cannot attribute features or detect distribution drift.",
      B: "Explainable AI surfaces per-feature attributions while Model Monitoring and Model Registry track drift, skew, and version lineage, delivering the auditability the Security, Privacy and Compliance pillar requires.",
      C: "Model Registry versions artifacts but provides no per-prediction explanation or drift detection on its own.",
      D: "Model Monitoring flags drift at the dataset level and never explains an individual prediction's reasoning."
    }
  },
  {
    id: "alt8",
    topic: "AI & ML",
    case: "Altostrat Media",
    type: "single",
    text: "Altostrat wants 24/7 natural-language self-service support whose answers stay grounded in its own media catalog and BigQuery data rather than the model's general knowledge. Which design is best?",
    options: {
      A: "Build a Conversational Agent in Vertex AI Agent Builder grounded on a data store over the media catalog and BigQuery using RAG for accurate self-service",
      B: "Build a Dialogflow ES virtual agent with hand-authored intents and entities mapped to a fixed set of frequently asked support questions and replies",
      C: "Call Gemini directly from a Cloud Run service and inject recent chat turns into the prompt so the model improvises answers about the catalog each time",
      D: "Index the catalog into Vertex AI Vector Search and let a Cloud Function return the nearest text chunks verbatim to the user without a conversational layer"
    },
    correct: ["A"],
    why: {
      A: "A Vertex AI Agent Builder Conversational Agent grounded on a data store over the catalog and BigQuery uses RAG for always-on, accurate self-service, serving the Reliability and Performance Optimization pillars.",
      B: "Dialogflow ES intents handle scripted flows but cannot ground open-ended answers in the evolving catalog and BigQuery data.",
      C: "Prompting Gemini with chat history but no retrieval grounding invites hallucination about Altostrat's specific content.",
      D: "Raw nearest-chunk results lack conversational understanding and personalization, falling short of the natural-language support requirement."
    }
  }
];
