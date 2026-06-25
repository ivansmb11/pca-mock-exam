// Cymbal Retail - questions grounded in case requirements, mapped to GCP managed services and the Well-Architected Framework.

export const CYMBAL_QUESTIONS = [
  {
    id: "cym1",
    topic: "Migration & Modernization",
    case: "Cymbal Retail",
    type: "single",
    text: "To modernize Cymbal's databases, the team must move its on-prem MySQL and Microsoft SQL Server instances to managed Google Cloud services with minimal downtime. Which approach best meets this requirement?",
    options: {
      A: "Use Database Migration Service to perform continuous, near-zero-downtime migrations into Cloud SQL for MySQL and Cloud SQL for SQL Server.",
      B: "Export both databases to CSV files, copy them to Cloud Storage, and load them into BigQuery during a weekend maintenance window.",
      C: "Lift-and-shift both database engines onto self-managed Compute Engine VMs and patch them manually.",
      D: "Re-platform both databases onto Bigtable to gain a fully managed NoSQL store."
    },
    correct: ["A"],
    why: {
      A: "Database Migration Service is serverless and supports MySQL and SQL Server with an initial snapshot plus continuous replication, giving near-zero downtime into the matching managed Cloud SQL engines (Reliability and Operational Excellence).",
      B: "BigQuery is an analytics warehouse, not a transactional replacement, and a CSV bulk load forces a long outage instead of continuous replication.",
      C: "Self-managed VMs keep the operational burden of patching, backups, and HA that managed services should remove.",
      D: "Bigtable is a wide-column NoSQL store that cannot serve relational MySQL or SQL Server workloads without a full application rewrite."
    }
  },
  {
    id: "cym2",
    topic: "Data & Analytics",
    case: "Cymbal Retail",
    type: "single",
    text: "Cymbal's MongoDB document data must move to a fully managed Google Cloud database while preserving existing MongoDB application code, and the cutover should use ongoing change data capture to limit downtime. Which combination should the architect choose?",
    options: {
      A: "Migrate to Cloud SQL for PostgreSQL and rewrite all document queries as relational joins.",
      B: "Migrate to Firestore with MongoDB compatibility, using Datastream change data capture to replicate ongoing writes until cutover.",
      C: "Store the documents as JSON files in Cloud Storage and query them with the gsutil command line.",
      D: "Migrate the documents into Memorystore for Redis to keep them in memory."
    },
    correct: ["B"],
    why: {
      A: "Forcing document data into a relational schema requires a costly rewrite and abandons the MongoDB compatibility Cymbal wants to keep.",
      B: "Firestore with MongoDB compatibility is serverless and lets existing MongoDB code keep working, while Datastream provides serverless CDC for a low-downtime cutover (Operational Excellence and Reliability).",
      C: "Cloud Storage holds objects, not a queryable operational document database, so application read and write patterns would break.",
      D: "Memorystore for Redis is a volatile cache, not a durable system of record for the product catalog documents."
    }
  },
  {
    id: "cym3",
    topic: "AI & ML",
    case: "Cymbal Retail",
    type: "single",
    text: "For the Attribute Generation requirement, Cymbal must automatically derive structured product attributes from supplier titles, descriptions, and images so they align with the existing catalog taxonomy. Which managed service best fits?",
    options: {
      A: "Train a custom convolutional neural network from scratch on Compute Engine GPUs for every product sub-vertical.",
      B: "Use Cloud Natural Language entity analysis alone to tag each supplier description.",
      C: "Use a multimodal Gemini model on Vertex AI, prompted with the catalog schema, to extract attributes from supplier text and images.",
      D: "Apply a fixed set of regular expressions in a Cloud Run service to parse supplier titles."
    },
    correct: ["C"],
    why: {
      A: "Building and maintaining bespoke models per sub-vertical is slow and expensive when a managed foundation model already handles the task.",
      B: "Cloud Natural Language reads text only and cannot interpret the supplier images that the requirement explicitly includes.",
      C: "A multimodal Gemini model on Vertex AI reads both text and images and can be prompted with Cymbal's taxonomy to emit aligned structured attributes (Performance Optimization and Operational Excellence).",
      D: "Regex cannot generalize across a huge, varied catalog or interpret images, so accuracy and consistency would suffer."
    }
  },
  {
    id: "cym4",
    topic: "AI & ML",
    case: "Cymbal Retail",
    type: "single",
    text: "The Image Generation and Enhancement requirement calls for creating color variations from a base product image, replacing backgrounds, adjusting product color, and adding text overlays. Which Google Cloud capability should the architect select?",
    options: {
      A: "Imagen on Vertex AI, using its image generation and editing features such as masked background replacement and image variation.",
      B: "Cloud Vision API label detection to read what is already in each product photo.",
      C: "A Dataflow pipeline that resizes and compresses the existing images.",
      D: "Cloud CDN to cache the supplier-provided images closer to shoppers."
    },
    correct: ["A"],
    why: {
      A: "Imagen on Vertex AI is the managed generative image model that supports variations, background and color edits via masking, and overlays, matching every part of the requirement (Performance Optimization).",
      B: "Cloud Vision only analyzes existing images and cannot generate new variations or edit backgrounds.",
      C: "Dataflow can transform pixels mechanically but cannot generate new colorways or replace backgrounds with generative AI.",
      D: "Cloud CDN only caches and delivers images; it creates nothing new."
    }
  },
  {
    id: "cym5",
    topic: "AI & ML",
    case: "Cymbal Retail",
    type: "single",
    text: "To Automate Product Discovery, Cymbal needs to process natural-language shopper requests on its website and app and return highly relevant products, with personalized guided conversations. Which Google Cloud service is the best fit?",
    options: {
      A: "Build a keyword index in Elasticsearch on GKE and rank results by exact string match.",
      B: "Use Vertex AI Search for commerce with its Conversational Commerce agent for retail-tuned, natural-language product discovery.",
      C: "Run a BigQuery LIKE query against the product table for each shopper search.",
      D: "Expose the relational catalog through Cloud SQL full-text search."
    },
    correct: ["B"],
    why: {
      A: "Self-managed Elasticsearch adds operational overhead and keyword matching alone misses the semantic, personalized retail relevance Cymbal needs.",
      B: "Vertex AI Search for commerce is purpose-built for retail relevance and its Conversational Commerce agent handles natural-language, personalized guided discovery as a managed service (Performance Optimization and Operational Excellence).",
      C: "A BigQuery LIKE scan is an analytics pattern with poor latency and no relevance ranking for live shopper search.",
      D: "Cloud SQL full-text search lacks the retail-tuned ranking, personalization, and conversational understanding required."
    }
  },
  {
    id: "cym6",
    topic: "Compute & Containers",
    case: "Cymbal Retail",
    type: "single",
    text: "The Scalability and Performance requirement says the storefront on GKE must absorb holiday traffic spikes without degrading the user experience. Which GKE configuration best delivers elastic scaling while controlling cost?",
    options: {
      A: "Provision a large fixed number of nodes sized for peak and leave them running all year.",
      B: "Use only manual kubectl scale commands during holiday periods.",
      C: "Combine the Horizontal Pod Autoscaler with cluster autoscaler and node auto-provisioning so pods and nodes scale with demand.",
      D: "Move the storefront to a single large Compute Engine VM and scale it vertically at peak."
    },
    correct: ["C"],
    why: {
      A: "Statically sizing for peak wastes money during normal traffic and still risks running out of headroom beyond the fixed cap.",
      B: "Manual scaling is error-prone and slow, so sudden spikes degrade the experience before an operator reacts.",
      C: "HPA scales pods on demand, cluster autoscaler adds nodes when pods are pending, and node auto-provisioning creates right-sized node pools, giving elastic scaling that contracts to save cost (Reliability and Cost Optimization).",
      D: "A single VM is a scaling and availability bottleneck and cannot match the elasticity of an autoscaling GKE cluster."
    }
  },
  {
    id: "cym7",
    topic: "Networking & Hybrid",
    case: "Cymbal Retail",
    type: "multi",
    pick: 2,
    text: "Beyond compute autoscaling, Cymbal wants its global storefront to stay fast and protected during peak events while reducing origin load. Which TWO managed Google Cloud services should the architect add at the edge?",
    options: {
      A: "Enable Cloud CDN on the global external Application Load Balancer to cache catalog content near shoppers worldwide.",
      B: "Attach Google Cloud Armor to the load balancer for DDoS protection and WAF rules during high-traffic events.",
      C: "Place a single regional network load balancer in one region to front all global traffic.",
      D: "Run a self-managed NGINX reverse proxy fleet on Compute Engine for caching.",
      E: "Disable TLS termination at the edge to lower CPU usage on the load balancer."
    },
    correct: ["A", "B"],
    why: {
      A: "Cloud CDN on the global external Application Load Balancer caches content at Google's edge, cutting latency and offloading the origin during spikes (Performance Optimization and Cost Optimization).",
      B: "Google Cloud Armor provides managed DDoS defense and WAF policies that keep the storefront available and secure under peak or attack traffic (Reliability and Security).",
      C: "A single regional load balancer cannot serve a global audience with low latency and becomes a single point of failure.",
      D: "A self-managed proxy fleet reintroduces the operational burden that managed Cloud CDN removes.",
      E: "Disabling TLS termination weakens security and breaks encrypted shopper sessions, violating data protection goals."
    }
  },
  {
    id: "cym8",
    topic: "Security & Compliance",
    case: "Cymbal Retail",
    type: "multi",
    pick: 2,
    text: "The Data Security and Compliance requirement means all customer data and virtual-agent interactions must be handled securely and meet industry regulations. Which TWO practices best satisfy this on Google Cloud?",
    options: {
      A: "Use Sensitive Data Protection (Cloud DLP) to discover and de-identify sensitive customer data before it is stored or sent to AI models.",
      B: "Store database credentials and API keys in Secret Manager and grant access through least-privilege IAM roles.",
      C: "Embed API keys directly in the web application source code so services can authenticate quickly.",
      D: "Grant the broad Editor role to every service account to avoid permission errors during launch.",
      E: "Email exports of the full customer table to associates for manual HITL review."
    },
    correct: ["A", "B"],
    why: {
      A: "Sensitive Data Protection inspects and de-identifies PII before storage or model use, meeting privacy and compliance obligations (Security, Privacy and Compliance).",
      B: "Secret Manager plus least-privilege IAM keeps credentials out of code and limits blast radius if an identity is compromised (Security, Privacy and Compliance).",
      C: "Hardcoding keys in source code exposes secrets in version control and is a serious security violation.",
      D: "The Editor role grants far more access than needed and breaks the least-privilege principle.",
      E: "Emailing full customer exports leaks regulated data and bypasses secure access controls."
    }
  }
];
