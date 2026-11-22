# Software Engineering Dictionary

## 🚀 DevOps

### Pipeline
- **Definition:** An automated process that defines a series of stages (e.g. build, test, deploy) that code changes go through to be delivered.
- **Example:** "The pipeline failed at the test stage, so nothing was deployed."
- **Related:** Continuous Integration (CI), Continuous Delivery, Continuous Deployment

### Continuous Integration (CI)
- **Definition:** The practice of frequently merging code changes into a shared branch, where each change is automatically built and tested. The goal is to detect errors and regressions early, when they are cheapest to fix.
- **Example:** "CI runs the unit tests on every pull request."
- **Related:** Pipeline, Continuous Delivery, Continuous Deployment

### Continuous Delivery
- **Definition:** The practice of automatically moving the artifacts built by CI through environments (e.g. testing, staging) so that every change is always ready to release. The final deployment to production is automated but requires a **manual approval**.
- **Example:** "We use continuous delivery: a release manager clicks approve to ship to production."
- **Related:** Continuous Integration (CI), Continuous Deployment, Pipeline
- **Not to be confused with:** Continuous Deployment, which removes the manual approval step.

### Continuous Deployment
- **Definition:** Like Continuous Delivery, but with **no manual approval**: every change that passes the pipeline is automatically deployed to production.
- **Example:** "With continuous deployment, a merged PR is live in production within minutes."
- **Related:** Continuous Delivery, Pipeline
- **Not to be confused with:** Continuous Delivery, which keeps a manual approval before production.

### Infrastructure as Code (IaC)
- **Definition:** Defining infrastructure (servers, networks, databases) in code files, usually declarative and stored in version control, so it can be provisioned and configured automatically, consistently and repeatably.
- **Example:** "Instead of clicking through the cloud console, we define the database in Terraform."
- **Related:** GitOps, Idempotence

### Idempotence
- **Definition:** The property of an operation that produces the same result no matter how many times it is performed.
- **Example:** "The deploy script is idempotent, so re-running it after a failure is safe."
- **Related:** Infrastructure as Code (IaC), Immutable
- **Not to be confused with:** Immutable. Idempotence is about an *action* being safe to repeat; immutability is about *data* that cannot change.

### Immutable
- **Definition:** Describes data, objects or infrastructure whose state cannot be changed after creation; changes are made by creating a new version instead.
- **Example:** "Container images are immutable: to change one, you build and tag a new image."
- **Related:** Idempotence, Container
- **Not to be confused with:** Idempotence.

### GitOps
- **Definition:** A set of practices where the desired state of a system (environment or cluster) is stored declaratively in Git, and an automated agent continuously reconciles the running system to match it. Most commonly used with Kubernetes (e.g. Argo CD, Flux).
- **Example:** "With GitOps, rolling back is just reverting a commit."
- **Related:** Infrastructure as Code (IaC), Reconciliation loop

### Rollback
- **Definition:** Returning a system to its previous known-good version after a bad release or change.
- **Example:** "Error rates spiked after the deploy, so we rolled back to yesterday's version."
- **Related:** Canary deployment, Blue-green deployment, Feature flag, MTTR
- **Not to be confused with:** Roll forward, which fixes the problem by shipping a new version instead of reverting.

### Canary deployment
- **Definition:** A release strategy where a new version is first rolled out to a small share of users or servers, monitored, and then gradually expanded if healthy (or rolled back if not).
- **Example:** "The canary got 5% of traffic for an hour before we rolled it out to everyone."
- **Related:** Blue-green deployment, Rollback, Feature flag, Blast radius
- **Not to be confused with:** Blue-green deployment, which switches all traffic at once between two full environments.

### Blue-green deployment
- **Definition:** A release strategy with two identical production environments: one (blue) serves live traffic while the new version is deployed to the other (green). Traffic is then switched to green all at once, and switching back is an instant rollback.
- **Example:** "With blue-green, rollback is just pointing the load balancer back to blue."
- **Related:** Canary deployment, Rollback, Load balancer
- **Not to be confused with:** Canary deployment, which shifts traffic gradually.

### Feature flag
- **Definition:** A configuration switch that turns a feature on or off at runtime without deploying new code, often for specific users or a percentage of traffic. Separates *deploying* code from *releasing* a feature.
- **Example:** "The new checkout is deployed but hidden behind a feature flag until marketing is ready."
- **Related:** Canary deployment, Rollback
- **Also known as:** Feature toggle.

### Flaky test
- **Definition:** An automated test that sometimes passes and sometimes fails on the same code, usually because of timing, ordering, shared state or external dependencies.
- **Example:** "The build is red again, but it's just that flaky login test; re-running it passes."
- **Related:** Continuous Integration (CI), Race condition

### Toil
- **Definition:** Manual, repetitive, automatable operational work that scales with the size of the service and brings no lasting value (a term from Google's SRE practice).
- **Example:** "Restarting the worker by hand every morning is toil; let's automate it."
- **Related:** Technical debt, On-call
- **Not to be confused with:** Technical debt, which is a cost built into the code or design rather than recurring manual work.

### Technical debt
- **Definition:** The future cost created by choosing quick or easy solutions now instead of better ones. Like financial debt, it accumulates "interest" in the form of extra maintenance, bugs and slower development.
- **Example:** "We skipped tests to hit the deadline, and now that technical debt slows down every change."
- **Related:** Toil
- **Not to be confused with:** Toil, which is recurring manual work rather than a cost built into the code or design.

## 🔭 Monitoring and Observability

### Reliability
- **Definition:** The ability of a system to perform its intended function correctly over a period of time. In practice it is often measured as the success rate: successful requests divided by total requests.
- **Example:** "Reliability dropped this week: 2% of checkout requests failed."
- **Related:** SLI, SLO, Availability

### Trace
- **Definition:** The end-to-end path of a **single request** as it travels through the services of a system, made up of one or more spans.
- **Example:** "The trace shows the request spent 800 ms waiting on the payments service."
- **Related:** Span, Metrics
- **Not to be confused with:** Span, which is one operation inside a trace.

### Span
- **Definition:** A single operation (unit of work) within a trace, with a name, start time, duration and metadata.
- **Example:** "The database query span took 600 ms of the 800 ms trace."
- **Related:** Trace
- **Not to be confused with:** Trace, which is the whole request path made of spans.

### Metrics
- **Definition:** Numeric measurements collected over time, i.e. a stream of timestamped values (e.g. CPU %, request rate, latency).
- **Example:** "The metrics show memory usage climbing steadily until the crash."
- **Related:** USE method, RED method, SLI

### Latency
- **Definition:** The time it takes to handle a single request or operation, from start to finish. Usually reported as percentiles (e.g. p50, p99) rather than averages.
- **Example:** "p99 latency is 2 seconds, so 1 in 100 users waits at least that long."
- **Related:** Throughput, Bottleneck, RED method
- **Not to be confused with:** Throughput. Latency is *how long one request takes*; throughput is *how many requests are handled per unit of time*.

### Throughput
- **Definition:** The amount of work a system handles per unit of time (e.g. requests per second, messages per minute).
- **Example:** "After adding workers, throughput went from 500 to 2,000 jobs per minute."
- **Related:** Latency, Bottleneck, Horizontal scaling
- **Not to be confused with:** Latency.

### Bottleneck
- **Definition:** The component that limits the performance or capacity of the whole system, so improving anything else has little effect.
- **Example:** "The database is the bottleneck; adding more web servers won't help."
- **Related:** Latency, Throughput, USE method, Single point of failure

### USE method (Utilization, Saturation, Errors)
- **Definition:** A monitoring methodology for **infrastructure resources** (CPU, memory, disk, network): for each resource, check its utilization, saturation and errors. Introduced by Brendan Gregg.
- **Example:** "Using USE, we found the disk was saturated even though CPU was low."
- **Related:** RED method, Metrics
- **Not to be confused with:** RED method, which focuses on services and requests.

### RED method (Rate, Errors, Duration)
- **Definition:** A monitoring methodology for **request-driven services**: for each service, track request rate, error rate and request duration. Introduced by Tom Wilkie.
- **Example:** "Our RED dashboard shows the API error rate spiked after the release."
- **Related:** USE method, Metrics
- **Not to be confused with:** USE method, which focuses on infrastructure resources.

### SLA (Service Level Agreement)
- **Definition:** A contractual agreement between a provider and its customers about the level of service, including penalties (e.g. refunds or credits) if it is not met.
- **Example:** "Our SLA promises 99.9% monthly uptime, or customers get service credits."
- **Related:** SLO, SLI
- **Not to be confused with:** SLO (internal target) or SLI (the measurement).

### SLO (Service Level Objective)
- **Definition:** An internal target for a service level, measured over a time window. It is usually stricter than the SLA.
- **Example:** "Our SLO is that 95% of requests complete in under 200 ms over 30 days."
- **Related:** SLA, SLI
- **Not to be confused with:** SLA (contract with penalties) or SLI (the measurement).

### SLI (Service Level Indicator)
- **Definition:** The actual measurement of a service level, usually calculated as `good_events / total_events`.
- **Example:** "The latency SLI is the share of requests that finished in under 200 ms."
- **Related:** SLO, SLA, Metrics
- **Not to be confused with:** SLO (the target) or SLA (the contract).

## 🚨 Incident Management

### On-call
- **Definition:** A rotation where an engineer is responsible, for a set period, for responding to alerts and incidents in production, including outside working hours.
- **Example:** "I'm on-call this week, so I'll get paged if the API goes down."
- **Related:** MTTR, Postmortem, Toil

### MTTR (Mean Time to Recovery)
- **Definition:** The average time it takes to restore service after an incident, from when it starts (or is detected) until it is resolved. Sometimes expanded as Mean Time to Repair/Resolve.
- **Example:** "Faster rollbacks cut our MTTR from an hour to ten minutes."
- **Related:** On-call, Rollback, Postmortem, Reliability

### Postmortem
- **Definition:** A written review after an incident describing what happened, its impact, the root cause(s) and follow-up actions to prevent it recurring. Usually **blameless**: it focuses on systems and processes, not on who made a mistake.
- **Example:** "The postmortem found that a missing alert delayed detection by 40 minutes."
- **Related:** On-call, MTTR, Blast radius
- **Also known as:** Incident review, retrospective.

## 🌐 Distributed Systems

### Consistency
- **Definition:** In the CAP theorem, every read receives the most recent write, so all nodes see the same data at the same time.
- **Example:** "For bank balances we need consistency, even if some requests have to fail."
- **Related:** Availability, Partition tolerance

### Availability
- **Definition:** In the CAP theorem, every request to a non-failing node receives a response, though it may not contain the most recent data.
- **Example:** "The product catalog favors availability: showing a slightly stale price is better than an error."
- **Related:** Consistency, Partition tolerance, Reliability

### Partition tolerance
- **Definition:** In the CAP theorem, the system keeps operating even when the network drops or delays messages between nodes. Since partitions can't be avoided in distributed systems, the real trade-off during a partition is between consistency and availability.
- **Example:** "When the link between data centers went down, the system stayed up thanks to partition tolerance."
- **Related:** Consistency, Availability

### Horizontal scaling
- **Definition:** Increasing capacity by adding more machines or instances that share the load (scaling *out*).
- **Example:** "During the sale we scaled horizontally from 3 to 12 API pods."
- **Related:** Vertical scaling, Load balancer, Throughput
- **Not to be confused with:** Vertical scaling, which makes a single machine bigger.

### Vertical scaling
- **Definition:** Increasing capacity by giving a single machine more resources, such as CPU or memory (scaling *up*). Simpler, but limited by the largest machine available and often requires a restart.
- **Example:** "We scaled the database vertically to a 64 GB instance."
- **Related:** Horizontal scaling, Bottleneck
- **Not to be confused with:** Horizontal scaling.

### Load balancer
- **Definition:** A component that distributes incoming requests across multiple instances of a service, and stops sending traffic to unhealthy ones.
- **Example:** "The load balancer spreads traffic across the three web servers."
- **Related:** Horizontal scaling, Blue-green deployment, Single point of failure

### Rate limiting
- **Definition:** Restricting how many requests a client can make in a given time window, to protect a service from overload or abuse. Excess requests are rejected (often with HTTP 429) or delayed.
- **Example:** "The API is rate limited to 100 requests per minute per key."
- **Related:** Throughput, Load balancer

### Caching
- **Definition:** Storing copies of frequently used data in a faster location (memory, CDN, browser) so later requests can be served without recomputing or refetching it. The main difficulty is keeping cached data from going stale (cache invalidation).
- **Example:** "We cache product pages in Redis, which cut database load in half."
- **Related:** Latency, Bottleneck, Consistency

### Single point of failure (SPOF)
- **Definition:** A component whose failure stops the whole system, because nothing else can take over its work.
- **Example:** "We have one database server with no replica, so it's a single point of failure."
- **Related:** Blast radius, Load balancer, Availability, Bottleneck

### Blast radius
- **Definition:** The extent of the impact when something fails or a bad change is released: how many users, services or regions are affected.
- **Example:** "Deploying region by region limits the blast radius of a bad release."
- **Related:** Canary deployment, Single point of failure, Postmortem

### Race condition
- **Definition:** A bug where the result depends on the unpredictable timing or order of concurrent operations, e.g. two processes updating the same data at the same time.
- **Example:** "Two users bought the last ticket because of a race condition in the stock check."
- **Related:** Flaky test, Consistency

## 👾 Kubernetes

### Container
- **Definition:** A regular process (or small group of processes) isolated from the rest of the host using Linux namespaces and cgroups, packaged with its dependencies as an image. Containers are not lightweight VMs: they share the host's kernel. Best used to ship and run artifacts, not as build environments.
- **Example:** "The app runs in a container, so it behaves the same on a laptop and in production."
- **Related:** Pod, Container runtime, Immutable

### Microservices
- **Definition:** An architecture where an application is split into small, independently deployable services, each owning one capability, that communicate via message brokers (e.g. RabbitMQ), RPC or REST APIs.
- **Example:** "Moving to microservices let the payments team deploy without waiting on the rest of the app."
- **Related:** Service mesh, Service discovery

### Workloads
- **Definition:** Kubernetes objects that manage and run your containers on the cluster (e.g. Deployment, StatefulSet, DaemonSet, Job).
- **Example:** "List all workloads in the namespace to see what is running."
- **Related:** Pod

### Pod
- **Definition:** The smallest deployable unit in Kubernetes: a group of one or more containers that share network and storage and are scheduled together as a single logical unit.
- **Example:** "The pod runs the app container plus a logging sidecar."
- **Related:** Container, Sidecar, Workloads

### Container runtime
- **Definition:** The software that actually runs containers on a host (e.g. containerd, CRI-O), including setting up their namespaces and cgroups. Kubernetes does not run containers itself; the kubelet delegates this to the runtime.
- **Example:** "The cluster uses containerd as its container runtime."
- **Related:** CRI, Container

### Control plane
- **Definition:** The Kubernetes components that manage the cluster's state and make global decisions: kube-apiserver, etcd, kube-scheduler and kube-controller-manager (plus cloud-controller-manager on cloud providers).
- **Example:** "If the control plane is down, running pods keep working but nothing new can be scheduled."
- **Related:** Reconciliation loop

### Reconciliation loop
- **Definition:** The pattern that Kubernetes controllers run continuously: observe the current state of a resource, compare it with the desired state, and act to close the difference.
- **Example:** "When a pod crashed, the reconciliation loop of the Deployment created a new one."
- **Related:** Control plane, GitOps

### Service mesh
- **Definition:** A dedicated infrastructure layer, separate from application code (typically sidecar proxies), that handles service-to-service communication and adds traffic management, reliability, observability and security uniformly across services. Examples: Istio, Linkerd.
- **Example:** "The service mesh adds mutual TLS between all services without changing their code."
- **Related:** Sidecar, Microservices, Service discovery

### Service discovery
- **Definition:** The mechanism that keeps track of the network locations (endpoints) of service instances so services can find each other as instances come and go.
- **Example:** "Thanks to service discovery, the frontend calls `orders` by name instead of a hard-coded IP."
- **Related:** Service mesh, Headless service

### Sidecar
- **Definition:** A design pattern where a helper container runs next to the main container in the same pod, sharing its network and storage, to add functionality such as proxying or logging (e.g. Envoy proxies).
- **Example:** "An Envoy sidecar handles retries so the app doesn't have to."
- **Related:** Pod, Service mesh

### Naked pod
- **Definition:** A pod created directly, not managed by a controller such as a Deployment, ReplicaSet or StatefulSet. It is not recreated or rescheduled if it fails or its node goes down.
- **Example:** "Avoid naked pods in production; use a Deployment so pods get replaced."
- **Related:** Pod, Workloads
- **Not to be confused with:** Static pod, which is managed by the kubelet from a local manifest.

### Static pod
- **Definition:** A pod managed directly by the kubelet on a specific node from a manifest file on that node, bypassing the API server's scheduling (kube-scheduler). Commonly used to run control plane components.
- **Example:** "On kubeadm clusters, the kube-apiserver runs as a static pod."
- **Related:** Pod, Control plane
- **Not to be confused with:** Naked pod.

### Headless service
- **Definition:** A Kubernetes Service with no cluster IP (`clusterIP: None`). kube-proxy does not load-balance it; instead DNS returns the IPs of the individual pods, so clients can reach each pod directly. Commonly used with StatefulSets (e.g. databases).
- **Example:** "The database uses a headless service so each replica has its own DNS name."
- **Related:** Service discovery

### CNI (Container Network Interface)
- **Definition:** A specification for network plugins (e.g. Calico, Cilium) that give pods network connectivity, including across nodes.
- **Example:** "We switched our CNI to Cilium to get network policies."
- **Related:** CSI, CRI

### CSI (Container Storage Interface)
- **Definition:** A standard that lets third-party storage systems expose block and file storage to Kubernetes workloads, including dynamic provisioning of volumes.
- **Example:** "The AWS EBS CSI driver creates volumes automatically when a pod requests storage."
- **Related:** CNI, CRI

### CRI (Container Runtime Interface)
- **Definition:** The gRPC API the kubelet uses to talk to container runtimes. After the scheduler assigns a pod to a node, that node's kubelet asks the runtime, via CRI, to create the pod's containers.
- **Example:** "Because of CRI, Kubernetes can use containerd or CRI-O interchangeably."
- **Related:** Container runtime, CNI, CSI

### Pod disruption
- **Definition:** Any event that terminates pods. It is **voluntary** when caused by an action (e.g. draining a node, deleting a pod, upgrades) and **involuntary** when caused by failures (e.g. node crash, out of resources).
- **Example:** "A PodDisruptionBudget keeps at least two replicas up during voluntary disruptions."
- **Related:** Eviction, Preemption

### Preemption
- **Definition:** When the scheduler terminates lower-priority pods so that a pending higher-priority pod can be scheduled on a node.
- **Example:** "The batch jobs were preempted to make room for the critical API pods."
- **Related:** Eviction, Pod disruption
- **Not to be confused with:** Eviction, which is driven by node resource pressure or an API request, not by priority scheduling.

### Eviction
- **Definition:** Terminating one or more pods on a node, either by the kubelet when the node runs low on resources (node-pressure eviction) or through the Eviction API (e.g. during `kubectl drain`).
- **Example:** "Pods were evicted because the node ran out of memory."
- **Related:** Preemption, Pod disruption
- **Not to be confused with:** Preemption.