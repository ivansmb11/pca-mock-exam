// Cymbal Retail - questions grounded in case requirements, mapped to current GCP managed services and the Well-Architected Framework.

export const CYMBAL_QUESTIONS = [
  {
    id: "cym1",
    topic: "Migration & Modernization",
    case: "Cymbal Retail",
    type: "single",
    text: "Cymbal must move its on-prem MySQL and Microsoft SQL Server instances to managed Google Cloud databases while keeping cutover downtime minimal. Which approach best meets this requirement?",
    options: {
      A: "Use Datastream to stream both engines into BigQuery, then point the storefront at BigQuery as its new transactional backend after cutover.",
      B: "Use Database Migration Service for a snapshot plus continuous replication into Cloud SQL for MySQL and Cloud SQL for SQL Server.",
      C: "Use Storage Transfer Service to copy nightly database dumps into Cloud Storage and reload them into fresh Cloud SQL instances daily.",
      D: "Use a Dataflow batch job to export full table extracts and bulk-load them into Cloud SQL during one extended maintenance window."
    },
    correct: ["B"],
    why: {
      A: "BigQuery is an analytics warehouse and cannot serve the relational transactional reads and writes the storefront depends on.",
      B: "Database Migration Service runs a serverless snapshot plus continuous CDC into the matching managed Cloud SQL engines for near-zero downtime (Operational Excellence and Reliability).",
      C: "Reloading dumps daily leaves long replication gaps and forces an outage on every reload rather than continuous catch-up.",
      D: "A one-shot bulk export forces a long maintenance window instead of the continuous replication a low-downtime cutover needs."
    }
  },
  {
    id: "cym2",
    topic: "Data & Analytics",
    case: "Cymbal Retail",
    type: "single",
    text: "Cymbal's MongoDB document data must land in a fully managed Google Cloud database that keeps existing MongoDB application code working, using change data capture so cutover downtime stays low. Which approach should the architect choose?",
    options: {
      A: "Move the documents into Memorystore for Redis and replicate ongoing changes with its built-in MongoDB change-stream connector.",
      B: "Migrate to Cloud SQL for PostgreSQL and replicate the ongoing writes with Database Migration Service until the cutover completes.",
      C: "Stand up self-managed MongoDB on Compute Engine and replicate writes with a scheduled mongodump and mongorestore job pair.",
      D: "Migrate to Firestore with MongoDB compatibility, using Datastream change data capture to replicate ongoing writes until cutover."
    },
    correct: ["D"],
    why: {
      A: "Memorystore for Redis is a volatile cache, not a durable document system of record, and has no MongoDB change-stream connector.",
      B: "Cloud SQL for PostgreSQL is relational and would force rewriting the document queries the MongoDB code relies on.",
      C: "Self-managed MongoDB keeps the patching and HA burden, and dump-restore jobs cannot provide continuous low-downtime CDC.",
      D: "Firestore with MongoDB compatibility keeps existing MongoDB code working while Datastream gives serverless CDC for a low-downtime cutover (Operational Excellence and Reliability)."
    }
  },
  {
    id: "cym3",
    topic: "AI & ML",
    case: "Cymbal Retail",
    type: "single",
    text: "For Attribute Generation, Cymbal must derive structured product attributes from supplier titles, descriptions, and images so they align with the existing catalog taxonomy. Which managed approach best fits?",
    options: {
      A: "Use a multimodal Gemini model on Vertex AI, prompted with the taxonomy, to extract aligned attributes from supplier text and images.",
      B: "Use Cloud Natural Language entity and category analysis on each supplier title and product description to tag the catalog attributes.",
      C: "Use the Cloud Vision API to label the supplier images and map each returned label onto the existing catalog attribute fields.",
      D: "Use AutoML to train one tabular classifier per sub-vertical on the past listings to predict the relevant catalog attributes for new items."
    },
    correct: ["A"],
    why: {
      A: "A multimodal Gemini model reads both text and images and can be prompted with the taxonomy to emit aligned structured attributes (Performance Optimization and Operational Excellence).",
      B: "Cloud Natural Language reads text only, so it cannot interpret the supplier images the requirement explicitly includes.",
      C: "Cloud Vision labels images only and ignores the supplier text, missing attributes carried in titles and descriptions.",
      D: "Training a model per sub-vertical is slow and costly to maintain when a managed foundation model already covers the task."
    }
  },
  {
    id: "cym4",
    topic: "AI & ML",
    case: "Cymbal Retail",
    type: "single",
    text: "Image Generation and Enhancement requires creating color variations from a base product image, replacing backgrounds, adjusting product color, and adding text overlays. Which Google Cloud capability should the architect select?",
    options: {
      A: "Use the Cloud Vision API to detect objects and colors so the team knows which regions of each product photo to edit manually by hand.",
      B: "Use a Dataflow pipeline to recolor, recompose, and overlay text on the existing images at scale across the product catalog.",
      C: "Use Imagen on Vertex AI for generative image variation and mask-based editing like background replacement and color changes.",
      D: "Use Cloud CDN to cache transformed product images at the edge so each requested variation is delivered quickly to shoppers."
    },
    correct: ["C"],
    why: {
      A: "Cloud Vision only analyzes existing images and generates no new variations or background replacements.",
      B: "Dataflow can transform pixels mechanically but cannot generate new colorways or replace backgrounds with generative AI.",
      C: "Imagen on Vertex AI is the managed generative image model for variation, masked background and color edits, and overlays (Performance Optimization).",
      D: "Cloud CDN only caches and delivers existing images and creates no new variations of its own."
    }
  },
  {
    id: "cym5",
    topic: "AI & ML",
    case: "Cymbal Retail",
    type: "single",
    text: "To Automate Product Discovery, Cymbal needs to process natural-language shopper requests on its website and app and return highly relevant products through personalized, guided conversations. Which Google Cloud service is the best fit?",
    options: {
      A: "Run BigQuery vector embeddings over the catalog and return the nearest matching products for each natural-language shopper query.",
      B: "Self-host Elasticsearch on GKE with a semantic plugin and rank the catalog results for each shopper request by relevance score.",
      C: "Use Conversational Agents (Dialogflow CX) flows to interpret shopper intent and look up the matching products in the catalog database.",
      D: "Use Cloud SQL full-text search across product names and descriptions to return matches for each natural-language shopper query.",
      E: "Use Vertex AI Search for commerce with its Conversational Commerce agent for retail-tuned, personalized natural-language search."
    },
    correct: ["E"],
    why: {
      A: "BigQuery vector search is an analytics pattern with batch latency and no retail ranking or guided conversation for live shoppers.",
      B: "Self-hosted Elasticsearch adds operational overhead and still lacks the retail-tuned personalization and guided dialogue Cymbal needs.",
      C: "Dialogflow CX handles dialogue but is not a retail relevance engine, so product ranking quality would fall short.",
      D: "Cloud SQL full-text search has no retail ranking, personalization, or conversational understanding for shopper discovery.",
      E: "Vertex AI Search for commerce is purpose-built for retail relevance and its Conversational Commerce agent delivers personalized guided discovery as a managed service (Performance Optimization and Operational Excellence)."
    }
  },
  {
    id: "cym6",
    topic: "Compute & Containers",
    case: "Cymbal Retail",
    type: "single",
    text: "Scalability and Performance requires the storefront on GKE to absorb holiday traffic spikes without degrading the shopper experience while still controlling cost the rest of the year. Which GKE configuration best delivers this?",
    options: {
      A: "Provision a fixed pool sized for peak and keep every node running all year so capacity is always ready for the next spike.",
      B: "Combine the Horizontal Pod Autoscaler with cluster autoscaler and node auto-provisioning so pods and nodes scale on demand.",
      C: "Schedule a cron job to scale node pools up before each known holiday window and scale them back down once the window has passed.",
      D: "Run the storefront on one large Compute Engine VM and resize its machine type vertically whenever traffic begins to climb at peak times."
    },
    correct: ["B"],
    why: {
      A: "Sizing statically for peak wastes money in normal periods and still caps out if demand exceeds the fixed pool.",
      B: "HPA scales pods, cluster autoscaler adds nodes for pending pods, and node auto-provisioning right-sizes pools, scaling elastically then contracting to save cost (Reliability and Cost Optimization).",
      C: "Scheduled scaling only handles known windows and misses unplanned surges, degrading the experience until the next cron run.",
      D: "A single VM is a scaling and availability bottleneck and cannot match an autoscaling GKE cluster's elasticity."
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
      B: "Front all of the global traffic with one regional external network load balancer placed close to the data center region.",
      C: "Attach Google Cloud Armor to the load balancer for managed DDoS protection and WAF rules during the peak events.",
      D: "Deploy a self-managed NGINX caching proxy fleet on Compute Engine managed instance groups in front of the origin.",
      E: "Move TLS termination off the edge and onto the backend storefront pods to lower CPU usage on the global load balancer."
    },
    correct: ["A", "C"],
    why: {
      A: "Cloud CDN on the global external Application Load Balancer caches content at Google's edge, cutting latency and offloading the origin during spikes (Performance Optimization and Cost Optimization).",
      B: "A single regional load balancer cannot serve a global audience with low latency and is a single point of failure.",
      C: "Google Cloud Armor adds managed DDoS defense and WAF policies that keep the storefront available and secure under peak or attack traffic (Reliability and Security).",
      D: "A self-managed proxy fleet reintroduces the operational burden that managed Cloud CDN removes.",
      E: "Pushing TLS to backend pods adds origin load and weakens edge protection rather than relieving the storefront."
    }
  },
  {
    id: "cym8",
    topic: "Security & Compliance",
    case: "Cymbal Retail",
    type: "multi",
    pick: 2,
    text: "Data Security and Compliance means all customer data and virtual-agent interactions must be handled securely and meet industry regulations. Which TWO practices best satisfy this on Google Cloud?",
    options: {
      A: "Store credentials and API keys in the application source and rotate them on each release so services authenticate without delay.",
      B: "Use Sensitive Data Protection to discover and de-identify sensitive customer data before it is stored or sent to the AI models.",
      C: "Grant the broad Editor role to every service account so launch is not blocked by missing permissions during the rollout.",
      D: "Keep credentials and API keys in Secret Manager and grant access only through least-privilege IAM roles scoped per service.",
      E: "Export the full customer table to a shared Cloud Storage bucket so associates can review records during HITL approval steps."
    },
    correct: ["B", "D"],
    why: {
      A: "Embedding keys in source exposes secrets in version control and is a serious security violation regardless of rotation.",
      B: "Sensitive Data Protection inspects and de-identifies PII before storage or model use, meeting privacy and compliance obligations (Security, Privacy and Compliance).",
      C: "The Editor role grants far more access than any service needs and breaks the least-privilege principle.",
      D: "Secret Manager plus least-privilege IAM keeps credentials out of code and limits blast radius if an identity is compromised (Security, Privacy and Compliance).",
      E: "Exporting the full table to a shared bucket leaks regulated data and bypasses scoped access controls."
    }
  }
];
