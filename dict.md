## 🚀 DevOps

* **Pipeline**

An automated process that defines a series of stages or steps to build, test and deploy SW solutions.

* **Continuous Integration (CI)**

The process of merging code changes, testing them, and building resulting artifacts, as early in the application lifecycle as possible. The intention is to detect any potential issues in the development phase, since this minimizes the effort and cost involved in fixing them. 
Automated tests validate that code changes haven't introduced errors or regression issues.

* **Continuous Delivery/Deployment (CD)**

The process of automated deployment of artifacts built as part of CI, making them available to their consumers. 
CD automates progression of these artifacts through different environments, such as testing, staging, and production. 

For Continuous Delivery the final step (deployment to production) typically needs **manual approval** as a safeguard even though the deployment itself is automated, on the other hand Continuous Deployment **removes the manual approval** safeguard so successful changes automatically deploy to production.

* **Infrastructure as Code (IaC)**

IaC defines infrastructure components such as servers, network devices, and databases by using code. 
Such code typically resides in a VCS (Version control system), and the use of declarative code to represent infra
facilitates automated provisioning and configuration, enhancing efficiency, consistency, and scalability.

* **Idempotence**

The characteristic of an action where the outcome is always the same, regardless of the number of times the action is performed. 

* **Immutable**

Data or objects whose state cannot be altered after they are created.

* **GitOps** 

Set of practices that require the desired state of the system (environment or cluster) to be stored in Git, using a declarative specification and it mainly focuses on managing Kubernetes.

## 🔭 Monitoring and Observability

* **Reliability**

In its simplest form, reliability means the number of successful requests relative to the total number of requests.

* **Trace**

Path taken by a **single request** (sequence of operations that form a unique transaction) as it propagates through the system.

* **Span**

Represents a single operation (unit of work) within a trace.

* **Metrics**

Numeric measurement over time, basically stream of timestamped values (CPU %, request rate, latency)

* **USE** (Utilisation Saturation and Error)

Monitoring methodology centered on infrastructure (introduced by Brendan Gregg).

* **RED** (Rate Errors Duration)

Monitoring methodology centered on applications, specifically on request tracking (introduced by Tom Wilkie).

* **SLA**

Agreement, contractual obligation between stakeholders and clients which involves penalties

* **SLO**

Objective, a target (measured over a period of time) for a desired goal e.g. availability, 95% of requests should be under 200ms

* **SLI**

Measurement, indicator calculated as the `number_of_good_events/total_no_of_events`.

* **Technical debt**

SW concept where prioritizing short-term/quick-and-dirty fixes, provides immediate speed, but creates "interest" in the future in the form of increased maintenance, bugs, and slower development speed.

## 🌐 Distributed Systems (CAP theorem)

* **Consistency**

All nodes have the same data at the same time (every read returns the most recent write).

* **Availability**

Every request to a non-failing node gets a response (though it may not contain the latest data).

* **Partition tolerance**

The system keeps operating even when the network drops or delays messages between nodes.


## 👾 Kubernetes

* **Containers**

Are Unix processes not "lightweight VMs". Remember to use containers to Ship artifacts, not build environments. A container typically runs as a single Unix process, it is just a fancy way to run a process [personal rant post](https://www.linkedin.com/posts/dejanualex_docker-cloudnative-activity-7287919862868234240-CzaO?utm_source=share&utm_medium=member_desktop&rcm=ACoAABZqV5AB__lXgyfzWeVKKToHa0fuguJBspw)

*  **Microservices** 

Self-contained and “independent” services decoupled from each other that can communicate between them via Brokers (eg. RabbitMQ), Remote Procedure Calls (RPC), or REST APIs.

* **Workloads**

Objects you use to manage and run your containers on the Kubernetes cluster.

* **Pod** 

Textbook definition is that the pod represents the smallest deployable units of computing that you can create and manage in Kubernetes, and in layman's terms a pod is a collection of one or more containers that we can treat as a single logical unit for our service.

* **Container runtime** 

Kubernetes doesn’t know how to run containers it relies on the container runtime for running and managing containers on a host system i.e. setting up namespaces and cgroups for containers.

* **Control Plane**

Kubernetes orchestration layer, comprised of multiple components: kube-apiserver, etcd, kube-scheduler, kube-controller-manager.

* **Reconciliation loop**

The core component that maintains the desired state for watched resources, by enabling the adjusting of the current state in order to match the desired state.

* **Service mesh**

Dedicated infrastructure layer, separate from the application code (typically sidecar proxies), which handles service-to-service communication, e.g. Istio, Linkerd.
Service meshes manage traffic (communication) between services and adding reliability, observability, and security features uniformly across all services.

* **Service Discovery**

Service discovery process keeps track of apps (instances) within the network so they can find one another when needed. A service discovery tool keeps track of the various nodes or endpoints that make up a service.

* **Sidecar**

Design pattern in which two coupled containers share the same pod, more exactly they share the pod’s filesystem, and network namespaces, e.g. Envoy proxies.

* **Naked pod** 

A pod not bound to a replication controller. Naked pods will not be rescheduled in the event of node failure.

* **Static pod** 

A pod managed directly by the kubelet daemon on a specific node. Static pods allow a pod to run as soon as the kubelet is brought up bypassing the kube-scheduler.

* **Headless service**

A service that doesn’t have the clusterIP address allocated, kube-proxy does not handle these Services.

* **CNI** (Container Network Interface) 

Specification that defines how network plugins should interact with container runtimes, basically it connects pods across nodes.

* **CSI** (Container Storage Interface) 

Standard for exposing arbitrary block and file storage systems to containerized workloads in Kubernetes, thus allowing third-party storage systems/vendors to integrate with Kubernetes by enabling dynamic storage provisioning.

* **CRI** (Container Runtime Interface)

Kubernetes contacts kubelet to launch a pod, subsequently the kubelet communicates with different container runtimes via CRI (using gRPC API calls)

* **Pod Disruption**

The process of terminating Pods either voluntarily or involuntarily.

* **Preemption**

The process of terminating Pods with LOWER Priority so that Pods with HIGHER Priority can schedule on Nodes.

* **Eviction**

The process of terminating one or more Pods on Nodes.
