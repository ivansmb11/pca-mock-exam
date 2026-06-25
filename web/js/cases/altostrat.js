// Altostrat Media - questions grounded in case requirements, mapped to GCP managed services and the Well-Architected Framework.

export const ALTOSTRAT_QUESTIONS = [
  {
    id: "alt1",
    topic: "Compute & Containers",
    case: "Altostrat Media",
    type: "single",
    text: "To modernize CI/CD for containerized deployments with a CENTRALIZED management platform and provide scalable Kubernetes BOTH on-prem and in the cloud, which approach best fits Altostrat?",
    options: {
      A: "Adopt GKE Enterprise, register cloud and Google Distributed Cloud (on-prem) clusters into a fleet, and govern them with Config Sync (GitOps) and Policy Controller from one place",
      B: "Run a self-managed Kubernetes cluster on Compute Engine VMs in each environment and synchronize manifests with custom shell scripts over SSH",
      C: "Keep each cluster independent and have each team apply its own kubectl manifests with no shared source of truth",
      D: "Migrate every workload to Cloud Run and drop Kubernetes entirely so there is nothing to manage across environments"
    },
    correct: ["A"],
    why: {
      A: "GKE Enterprise fleets with Config Sync and Policy Controller give one centralized control plane and consistent GitOps policy across cloud and Google Distributed Cloud on-prem clusters, serving the Operational Excellence pillar.",
      B: "Self-managed Kubernetes on raw VMs with SSH scripts reintroduces the undifferentiated operational burden Altostrat wants to remove and lacks centralized governance.",
      C: "Independent clusters with no shared source of truth cause configuration drift and contradict the centralized-management requirement.",
      D: "Cloud Run cannot satisfy the explicit requirement for scalable Kubernetes environments running on-premises."
    }
  },
  {
    id: "alt2",
    topic: "SRE & Operations",
    case: "Altostrat Media",
    type: "single",
    text: "To modernize the container delivery pipeline itself with safe, repeatable rollouts to GKE, which managed combination should Altostrat use?",
    options: {
      A: "Trigger ad-hoc kubectl apply commands from a developer laptop whenever a new image is ready",
      B: "Use Cloud Build to build and push images to Artifact Registry, then Cloud Deploy to orchestrate progressive rollouts, approvals, and one-click rollbacks to GKE",
      C: "Schedule a nightly Compute Engine cron job that pulls the latest image tag and restarts every pod",
      D: "Store build artifacts in a Cloud Storage bucket and have each cluster poll the bucket for new binaries"
    },
    correct: ["B"],
    why: {
      A: "Ad-hoc kubectl from a laptop is unauditable, error-prone, and offers no controlled promotion or rollback, the opposite of a modern pipeline.",
      B: "Cloud Build for CI plus Cloud Deploy for managed continuous delivery gives serverless builds, Artifact Registry storage, progressive rollouts, approvals, and rollbacks, advancing the Operational Excellence pillar.",
      C: "A nightly cron restart is not a release pipeline, gives no promotion gates or rollback, and risks deploying broken images blindly.",
      D: "Buckets store artifacts but provide no build, promotion, approval, or rollback orchestration for containerized delivery."
    }
  },
  {
    id: "alt3",
    topic: "Networking & Hybrid",
    case: "Altostrat Media",
    type: "single",
    text: "To meet the need for SECURE, high-performance HYBRID connectivity for ingesting large volumes of media from on-prem systems, what should Altostrat implement?",
    options: {
      A: "Expose an internet-facing load balancer and upload media over public HTTPS from the on-prem data center",
      B: "Provision Dedicated Interconnect for high, predictable bandwidth and layer HA VPN over Cloud Interconnect to add IPsec encryption in transit",
      C: "Set up a single Classic VPN tunnel over the public internet as the only path for all ingestion traffic",
      D: "Use Cloud NAT so on-prem hosts can reach Google APIs through outbound internet egress"
    },
    correct: ["B"],
    why: {
      A: "Public HTTPS uploads ride the open internet with variable throughput and a broad attack surface, failing the high-performance and secure requirements for bulk media ingestion.",
      B: "Dedicated Interconnect delivers consistent high bandwidth off the public internet and HA VPN over Cloud Interconnect adds IPsec encryption with a 99.99% SLA, serving the Performance Optimization and Security pillars.",
      C: "A single Classic VPN tunnel has limited throughput, no 99.99% SLA, and no redundancy for sustained large-scale ingestion.",
      D: "Cloud NAT only enables outbound internet egress and does not provide private, high-bandwidth hybrid connectivity for inbound data ingestion."
    }
  },
  {
    id: "alt4",
    topic: "Cost & Optimization",
    case: "Altostrat Media",
    type: "single",
    text: "To optimize Cloud Storage costs for a growing media library whose access patterns are unpredictable, while keeping high availability, what is the best choice?",
    options: {
      A: "Enable Autoclass on the bucket so objects move between storage classes automatically based on access, with no retrieval or class-transition fees",
      B: "Manually inspect each object monthly and run gsutil to reclassify cold files one by one",
      C: "Place the entire library in Archive storage on day one to guarantee the lowest per-GB price",
      D: "Keep everything in Standard storage permanently and rely only on Committed Use Discounts to lower the bill"
    },
    correct: ["A"],
    why: {
      A: "Autoclass automatically transitions objects by last-access time with no retrieval or transition charges, which is ideal for unpredictable patterns and directly serves the Cost Optimization pillar while keeping availability.",
      B: "Manual monthly reclassification at scale is operationally costly, error-prone, and cannot keep pace with a growing library.",
      C: "Putting active media in Archive from day one incurs high retrieval fees and latency whenever content is accessed or re-published.",
      D: "Standard-only storage leaves rarely accessed media at the most expensive rate, and CUDs do not apply to Cloud Storage class pricing."
    }
  },
  {
    id: "alt5",
    topic: "AI & ML",
    case: "Altostrat Media",
    type: "multi",
    pick: 2,
    text: "To EXTRACT rich metadata from media using NLP and computer vision and to automatically GENERATE concise summaries of diverse media, which TWO managed services best fit? (Choose two.)",
    options: {
      A: "Video Intelligence API to detect labels, shots, objects, and spoken content for rich automated metadata from video assets",
      B: "Gemini on Vertex AI to generate concise multimodal summaries of audio, video, and text content",
      C: "A self-trained CNN deployed on a single Compute Engine VM that the team maintains and scales by hand",
      D: "Cloud SQL full-text search run over filenames to approximate content metadata",
      E: "Memorystore for Redis as the primary engine that produces the natural-language summaries"
    },
    correct: ["A", "B"],
    why: {
      A: "Video Intelligence API is a managed model that extracts labels, shots, objects, and transcribed speech, delivering rich metadata without training infrastructure and serving Operational Excellence.",
      B: "Gemini on Vertex AI is a managed multimodal LLM purpose-built to summarize diverse audio, video, and text media, meeting the summarization requirement under the Performance Optimization pillar.",
      C: "A hand-maintained CNN on one VM reintroduces training and scaling toil and contradicts the preference for managed AI services.",
      D: "Searching filenames in Cloud SQL inspects no media content and cannot produce NLP or computer-vision metadata.",
      E: "Memorystore is an in-memory cache and cannot generate natural-language summaries of media."
    }
  },
  {
    id: "alt6",
    topic: "Security & Compliance",
    case: "Altostrat Media",
    type: "single",
    text: "To design AI-powered DETECTION of harmful content across both uploaded media and the platform's generative AI responses, which approach should Altostrat take?",
    options: {
      A: "Rely solely on human moderators to review every asset and every chatbot reply before it is shown",
      B: "Use Vision SafeSearch and Video Intelligence explicit-content detection to screen media, and Model Armor to filter harmful, unsafe, or prompt-injection content in the GenAI request/response flow",
      C: "Write a static keyword blocklist in application code and reject any text containing a banned word",
      D: "Trust the base LLM's built-in safety alone and apply no additional screening to user-generated media"
    },
    correct: ["B"],
    why: {
      A: "Manual-only review cannot scale to a vast, growing media library or to 24/7 real-time chatbot traffic.",
      B: "Vision SafeSearch and Video Intelligence flag explicit imagery/video while Model Armor screens harmful content, jailbreaks, and prompt injection in the LLM flow, giving layered detection that serves the Security, Privacy and Compliance pillar.",
      C: "A static keyword blocklist is easily bypassed, ignores images and video, and produces high false positives and negatives.",
      D: "Relying only on base-model safety leaves user-uploaded media unscreened and provides no configurable enforcement or auditability."
    }
  },
  {
    id: "alt7",
    topic: "AI & ML",
    case: "Altostrat Media",
    type: "single",
    text: "To ensure Altostrat's AI systems are AUDITABLE and that their decisions can be EXPLAINED, which capabilities should be built in?",
    options: {
      A: "Vertex Explainable AI for feature attributions plus Vertex AI Model Monitoring (and Model Registry versioning) to track drift, skew, and lineage over time",
      B: "Export only the final prediction labels to a spreadsheet and discard the input features and model versions",
      C: "Manually screenshot a few predictions each quarter as the sole evidence of model behavior",
      D: "Disable all logging on the prediction endpoints to reduce storage costs and simplify operations"
    },
    correct: ["A"],
    why: {
      A: "Vertex Explainable AI surfaces per-feature attributions while Model Monitoring and Model Registry track drift, skew, and version lineage, delivering the explainability and auditability the Security, Privacy and Compliance pillar requires.",
      B: "Keeping only final labels destroys the inputs, attributions, and versions needed to explain or audit any decision.",
      C: "Quarterly screenshots are not systematic evidence and cannot explain individual predictions or detect model degradation.",
      D: "Disabling logging removes the audit trail entirely, directly defeating the auditability requirement."
    }
  },
  {
    id: "alt8",
    topic: "AI & ML",
    case: "Altostrat Media",
    type: "single",
    text: "To enable natural-language interaction with 24/7 support through an advanced chatbot whose answers stay grounded in Altostrat's own content, which design is best?",
    options: {
      A: "Build a Conversational Agent in Vertex AI Agent Builder grounded on a data store over the media catalog and BigQuery (RAG) for accurate, personalized, self-service answers",
      B: "Deploy a stateless FAQ page with a fixed list of canned questions and answers and no language understanding",
      C: "Call a raw LLM with no grounding so every answer is generated purely from the model's training data",
      D: "Staff a human-only contact center to answer all user questions around the clock"
    },
    correct: ["A"],
    why: {
      A: "Vertex AI Agent Builder Conversational Agents with a grounded data store (RAG over the catalog and BigQuery) deliver natural-language, always-on, accurate self-service answers, serving the Reliability and Performance Optimization pillars.",
      B: "A static FAQ has no natural-language understanding and cannot handle the personalized, conversational support Altostrat requires.",
      C: "An ungrounded LLM will hallucinate and cannot reliably answer questions about Altostrat's specific catalog or user context.",
      D: "A human-only center cannot scale to 24/7 self-service across a large audience and contradicts the automation goal."
    }
  }
];
