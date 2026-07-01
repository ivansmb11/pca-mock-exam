Preparing for Your
Professional Cloud
Architect Journey

Introduction

Who am I and what’s
my role here?

Week 1 topics

Exam Overview

Technical intro

1

2

3

[optional] Cloud Skills
Boost Demo

Professional Cloud
Architect

A  Google  Cloud  Certified  Professional  Cloud  Architect  is

able  to  leverage  Google  Cloud  technologies  to  design,

develop,  and  manage  robust,  secure,  scalable,  efficient,

cost-effective,  highly  available,  and  flexible  solutions  that

drive business objectives. The Professional Cloud Architect

should  be  proficient  in  enterprise  cloud  strategy,  solution

design,  workload  migration  approaches,  deployment  and

orchestration,  optimization,  and  architectural  best

practices. This individual is also experienced with common

open-source

technologies  and  software  development

methodologies

for  designing  multi-tiered  distributed

applications  across

legacy,  multi-cloud,  or  hybrid

environments.

PCA Exam High-level Overview

-
-
-

80h-150h+ to prepare. Consistency is the key!
PCA = “A mile wide and an inch deep” (at least in most cases)
Exam structure:

50-60 questions / 2h for the exam. English language only (no additional time for non-native speakers).
-
- Multiple-choice theoretical questions, but asking about “real-world” challenges. Most with a single correct

answer, some with more (you will know how many). Get a feeling by doing a sample test.
In a lot of cases, you will need to choose BEST answer from 2-4 which are technically correct.
~25% (~12-15) of questions are based on Case Studies.

-
-
- NO labs, NO hands-on exercises on the exam (but essential when preparing!).

-

It’s not clear what is the percentage needed to pass (aim at 85+% accuracy for practise questions).

-

but don’t leave any questions unanswered (no negative points).

- Can be taken online or at a testing center.
- Certificate is valid for 2 years.

-

If you fail, retake policy is: 14 days / 60 days / 1 year (separate voucher needed for each attempt)

Don’t have your own exam strategy? Use mine:

● When looking at a question, use elimination technique (get rid of the “obvious” wrong answers).
● Handle the easier questions first (aim at ~1.5 min per question) and mark the rest for review.

Exam question example
Notice the business context!

Your company wants to track whether
someone is present in a meeting room
reserved for a scheduled meeting. There
are 1000 meeting rooms across 5 offices
on 3 continents. Each room is equipped
with a motion sensor that reports its status
every second. You want to support the
data ingestion needs of this sensor
network. The receiving infrastructure
needs to account for the possibility that
the devices may have inconsistent
connectivity.

Which solution would
you choose?

A. Have each device create a persistent connection to a

Compute Engine instance and write messages to a custom
application.

B. Have devices poll for connectivity to Cloud SQL and insert

the latest messages on a regular interval to a device
specific table.

C. Have devices poll for connectivity to Pub/Sub and publish
the latest messages on a regular interval to a shared topic
for all devices.

D. Have devices create a persistent connection to an App
Engine application fronted by Cloud Endpoints, which
ingest messages and write them to Datastore.

Case studies

● ~25% of the questions (~12-15) on the certification

exam will refer to a case study.

● 4 case studies available for analysis before the

exam (NO NEW CASE CASE STUDIES ON THE

EXAM!):

○ Altostrat Media

○ Cymbal Retail

○ EHR Healthcare - the only “old” case study

○ KnightMotives Automotive

● You will have access to a full case study during the

exam (but it’s not the best time to start analysis…)

● We shall have a high-level discussion (with

sample questions) on each of the case studies

during our meetings (weeks 3-6)

Case study - sample question

For this question, refer to the EHR Healthcare case study.

In the past, configuration errors put public IP addresses on backend servers that should not have been
accessible from the Internet. You need to ensure that no one can put external IP addresses on backend
Compute Engine instances and that external IP addresses can only be configured on frontend Compute
Engine instances. What should you do?

A. Revoke the compute.networkAdmin role from all users in the project with front end instances.

B. Create an Identity and Access Management (IAM) policy that maps the IT staff to the
compute.networkAdmin role for the organization.

C.  Create a custom Identity and Access Management (IAM) role named GCE_FRONTEND with the
compute.addresses.create permission.

D. Create an Organizational Policy with a constraint to allow external IP addresses only on the frontend
Compute Engine instances.

If you happen to fail (hope not!), you shall get a report

New exam version
live Oct 30th 2025

"The upcoming version of the Professional Cloud Architect exam highlights the Google

Cloud Well-Architected Framework as a key requirement for this role. The

framework's pillars (operational excellence, security, reliability, performance

optimization, cost optimization, and sustainability) are implicitly and explicitly woven

throughout the exam objectives. The exam also includes new case studies that allow

cloud architects to demonstrate their ability to use Google Cloud's generative AI

technology to realize business value."

Tip: use GCP Free Trial 300USD (*) and Free Tier
It will help you be curious :)

90-day, $300 Free Trial

* To complete your Free Trial signup, you must provide a credit card or other payment
method to set up a Cloud Billing account and verify your identity. Don't worry, setting up a
Cloud Billing account does not enable us to charge you. You are not charged unless you
explicitly enable billing by upgrading your Cloud Billing account to a paid account.

Google Skills Demo

Let’s start the technical part!

Opex vs Capex

● CAPEX Vs OPEX - Fundamentals of Cloud #shorts - YouTube

● Capex:

○ Traditional, “on-premises” approach. Eg. build a datacenter, but hardware and licenses,

amortize over time (years)

○ An organization purchases computing capacity upfront and uses it over time.
○ Easy, but usually not flexible.

● Opex:

○ Cloud-native approach. Eg. spin up a storage service and use it as needed

(decommission after few days; resize when needed; stop outside of business hours)
○ Based on pay-as-you-go approach, with no upfront payments. Resources and services

are available on-demand, often billed based on per-second usage fees.

○ Harder to predict costs (and spend fluctuates each month), but you gain a ton of

flexibility (has effects on sizing, time to deliver etc).

Exam Tip: Despite Opex is the cloud-native approach, there are ways to cost-optimize workloads
by committing to long-term (1-3 years) usage, this leaning towards Capex model a bit.

SQL vs noSQL

SQL (aka ‘Relational’)

NoSQL (aka ‘Non-relational’)

“traditional” table-based RDBMSes

key-value, wide column, document

Strongly typed, fixed schemas

Almost all ACID-compliant

Dynamic schemas

Mostly BASE

Considerable percentage of logic can be done in
database

Most of logic needs to be offloaded to application
layer

Default choice for most monoliths

Suitable for some microservices

performance capped at some point (vertical
scaling only, plus sharding, offloading read-only
etc)

Processing nodes often separate from storage
nodes (if network is fast enough)

In GCP: Cloud SQL, Cloud Spanner
Outside of GCP: MySQL, Oracle, PostgreSQL,
Microsoft SQL Server.

In GCP: Firestore, Bigtable
Outside of GCP: MongoDB, Redis, Cassandra,
HBase, CouchDB

OLTP vs OLAP

OLTransactionalP

OLAnalyticalP

For processing data in transaction-oriented
apps

Multi-dimensional, analytical queries used in
BI, reporting, data mining etc

Large amounts of transactions

Large volume of data

A mix of Inserts, Updates, Deletes on individual
records.

Loading data from source + selects. Optimized
for high throughput reads on large number of
records

Tables are normalized

ACID & (mostly) SQL

Tables are not normalized

SQL (sometimes NoSQL)

Cloud SQL, Cloud Spanner

BigQuery

Exam Tip: Here you’ll find a GREAT Decision tree for database choices on AWS, Microsoft Azure,
Google Cloud Platform, and cloud-agnostic

Exam Tip: Get swift in choosing an optimal approach based on business and technical requirements..

Hybrid vs multicloud

Exam Tip: Have a look at the most common hybrid and multicloud patterns.

Microservices - evolution

Mainframe

Monolith

Microservices

Microservices - evolution

Business Hours

Maintenance Windows

24/7

Microservices - advantages

●

●

●

●

●

The microservices can be independently tested and deployed. The smaller the unit of deployment, the
easier the deployment.

They can be implemented in different languages and frameworks. For each microservice, you're free to
choose the best technology for its particular use case.

They can be managed by different teams. The boundary between microservices makes it easier to dedicate
a team to one or several microservices.

By moving to microservices, you loosen the dependencies between the teams. Each team has to care only
about the APIs of the microservices they are dependent on. The team doesn't need to think about how
those microservices are implemented, about their release cycles, and so on.

You can more easily design for failure. By having clear boundaries between services, it's easier to determine
what to do if a service is down.

Microservices - disadvantages

●

●

●

●

Because a microservice-based app is a network of different services that often interact in ways
that are not obvious, the overall complexity of the system tends to grow.

Unlike the internals of a monolith, microservices communicate over a network. In some
circumstances, this can be seen as a security concern. Istio solves this problem by automatically
encrypting the traffic between microservices.

It can be hard to achieve the same level of performance as with a monolithic approach because
of latencies between services.

The behavior of your system isn't caused by a single service, but by many of them and by their
interactions. Because of this, understanding how your system behaves in production (its
observability) is harder. Istio is a solution to this problem as well.

Diagnostic Question Discussion

You want to re-architect a
monolithic application so that it
follows a microservices model.
You want to accomplish this
efficiently while minimizing the
impact of this change to the
business.

A. Deploy the application to Compute Engine and turn on autoscaling.

B. Replace the application’s features with appropriate microservices in phases.

C. Refactor the monolithic application with appropriate microservices in a single effort and

deploy it.

D. Build a new application with the appropriate microservices separate from the monolith and

Which approach should you take?

replace it when it is complete

Diagnostic Question Discussion

You want to re-architect a
monolithic application so that it
follows a microservices model.
You want to accomplish this
efficiently while minimizing the
impact of this change to the
business.

A. Deploy the application to Compute Engine and turn on autoscaling.

B. Replace the application’s features with appropriate microservices in phases.

C. Refactor the monolithic application with appropriate microservices in a single effort and

deploy it.

D. Build a new application with the appropriate microservices separate from the monolith and

Which approach should you take?

replace it when it is complete

When transitioning from a monolithic application to a microservices architecture, it is generally best to do it incrementally,
rather than all at once. This allows you to break down the application into smaller, manageable pieces and make sure each
piece is functioning correctly before moving on to the next. It minimizes risk, allows for easier troubleshooting, and reduces
the impact on the business because you can gradually shift traffic to the new services as they are tested and deployed.

Controlling access

Authentication

Authorization

Auditing

Cloud Identity

Cloud IAM

Cloud Operations
Audit Logging &
Reports API

What is Cloud Identity?

Chrome
for Work

Apps

centrally manage users and groups who

● Cloud Identity is an Identity as a Service

(IDaaS) solution that allows you to

can access Google Cloud and Google

Workspace (formerly known as G Suite)

People

resources

Cloud Identity

● It is the same identity service that powers

Google Workspace and can also be used as

Devices

IdP for third-party applications (supports

SAML and LDAP applications)

Android
for Work

Google
Cloud

Two consoles for administration

Cloud Identity (admin.google.com)

Google Cloud

Managing Users, Groups, and Authentication

(console.cloud.google.com)

settings

Roles & Authorization for Google Cloud

Cloud Identity vs IAM

Cloud Identity

IAM

Identity as a Service (IDaaS) solution that centrally manages
users and groups. Often configured to federate identities
between Google and other identity providers (AD etc).

In Cloud Identity, you manage BOTH identities AND privileges
(via roles). However, it’s NOT GCP-specific…

Most important role: Super Admin (full access and manage
other Admins). Needed to configure GCP organization (= grant
Oganization Administrator role to others). NOT for daily use.
Should use MFA

Has a Free and Premium editions, each with different features.

Service that lets authorize who can take action on specific GCP
resources

With IAM, you manage privileges (via roles) only. Identities need
to be created in advance, in most cases: in Cloud Identity (with
the exception of Service Accounts).

Most important role: Organization Administrator. Designed to
manage day to day organization operations in GCP (= mostly
grant IAM roles to identities).

Exam Tips:
● Make sure to differentiate and know best practices of Super Admin (Cloud

Identity role) vs Organization Administrator (IAM Role)

● If you’d like to know how to create new GCP organization, see this guide.

Organization hierarchy helps
organize access control and
policy for resources

Folders provide for flexible hierarchy
of Projects

● Organization policy and access

control can be bound at any level
and flow downwards

example.com

Folder A

Folder B

project 1

project 2

project 3

project 4

project 5

Compute
Engine

Pub/Sub

Cloud
Storage

App
Engine

Cloud
Storage

Cloud
Bigtable

BigQuery

Know how to migrate projects across folders / orgs

Hierarchy inheritance

IAM policy

Top-down
inheritance

Additive only

n
o

i
t

i

a
z
n
a
g
r
O

s
r
e
d
o
F

l

s
t
c
e
o
r
P

j

s
e
c
r
u
o
s
e
R

Exam Tip: Watch out for IAM Deny policies!

Org Policy

Top-down
inheritance

Allows overrides

IAM policy pattern example

roles/browser → domain:example.org
all domain users should be able to see the hierarchy

roles/viewer → group:first-lvl-support@
support users should be able to view logs and VMs

e
c
n
a

t
i
r
e
h
n

i

roles/compute.admin → group:linux-os@
instance admins should manage resources

IaaS

Linux

Windows

roles/logging.logViewer → group:app-team-1@
app admins should view logs in dev

Prod

Dev

roles/storage.admin → serviceAccount:app1@
ad-hoc permissions on project or single resource

apache-prd-1 apache-prd-2

apache-dev-1 apache-dev-2

Organization policy pattern example

constraints/compute.vmExternalIpAccess → false
no VMs should be able to use external IPs

e
c
n
a

t
i
r
e
h
n

i

constraints/compute.vmExternalIpAccess → true
DMZ appliances should be able to use external IPs

Net

IaaS

DMZ

Linux

Windows

dmz-prd

dmz-dev

Most common Organization Policy constraints

Policy Constraint

Description

compute.vmExternalIpAccess

compute.trustedImageProjects

compute.skipDefaultNetworkCreation

iam.disableServiceAccountKeyCreation

gcp.resourceLocations

sql.restrictPublicIp

A list of project/zone/instance names that are allowed to have external IP addresses and deny all others. Attempts to
create any other VMs with an external IP address will fail.

A list of projects that contain trusted images that can be used as the basis for a VM and deny all others. Attempting to
instantiate a VM with an image from another project is denied.

Disables the creation of default VPC when creating a project. The default VPC uses auto mode subnetworks and
includes default firewall rules which are often incompatible with production deployments.

This boolean constraint disables the creation of service account external keys where this constraint is set to `True`.

This list constraint defines the set of locations where location-based GCP resources can be created. Policies for this
constraint can specify multi-regions such as asia and europe, regions such as us-east1 or europe-west1, or
individual zones such as europe-west1-b as allowed or denied locations.

This boolean constraint restricts configuring Public IP on Cloud SQL instances where this constraint is set to True.
This constraint is not retroactive, Cloud SQL instances with existing Public IP access will still work even after this
constraint is enforced.
By default, Public IP access is allowed to Cloud SQL instances.

sql.disableDefaultEncryptionCreation

Restrict default Google-managed encryption on Cloud SQL instances

compute.requireShieldedVm

This boolean constraint, when set to True, requires that all new Compute Engine VM instances use Shielded disk
images with Secure Boot, vTPM, and Integrity Monitoring options enabled. Secure Boot can be disabled after
creation, if desired. Shielded VM features add verifiable integrity and exfiltration resistance to your VMs.

Organization Policy vs IAM Policy

Organization Policies

IAM Policies

Constraints that allow you to:

● Limit resource sharing based on domain.
● Limit the usage of Identity and Access Management

service accounts.

● Restrict the physical location of newly created

resources.

Focuses on “what”. Allows to set restrictions on
specific resources to determine how they can be
configured

Effectively they’re bindings which specify what access
should be granted to principal on resources.

Focuses on “who”. Let’s you authorize who can take
action on specific resources based on permissions

Can be set on different levels (org, folder, project),
propagate down but lower-level policy overwrites a
higher-level one.

Effective IAM Policy on each level is a SUM of all
privileges (* with an exception of “deny policies”, which
are not covered on the exam as of Q1 ‘23)

Both should be used as part of a security posture! It’s NOT one or the other.

Make sure to…
Enjoy the journey as much
as the destination!

