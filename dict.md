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

### Technical debt
- **Definition:** The future cost created by choosing quick or easy solutions now instead of better ones. Like financial debt, it accumulates "interest" in the form of extra maintenance, bugs and slower development.
- **Example:** "We skipped tests to hit the deadline, and now that technical debt slows down every change."

## 🌐 Distributed Systems (CAP theorem)

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
