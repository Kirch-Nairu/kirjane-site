import type { ProcessStage } from "./types";

export const processStages: ProcessStage[] = [
  {
    id: "discover",
    number: "01",
    name: "Discover",
    phase: "Field Investigation & Workflow Mapping",
    title: "Mapping the Real Operational Bottleneck",
    detail:
      "Before architecting database models or drafting code, we inspect how your personnel execute their duties daily—shadowing cashiers, inventory managers, municipal clerks, and accounting staff to observe where data latency, manual double-entry, and communication friction occur.",
    deliverable: "Operational workflow map, bottleneck diagnosis, and technical feasibility scope.",
    whyItMatters:
      "Building software without understanding ground-level realities produces tools that personnel actively bypass. We engineer around actual work habits.",
    verificationCheck: "Personnel workflow validation and scope agreement.",
  },
  {
    id: "define",
    number: "02",
    name: "Define",
    phase: "Systems Architecture & Financial Rules",
    title: "Establishing Data Schemas & Business Rules",
    detail:
      "Together with our accountant co-founders, we formulate exact financial rules, authorization matrices, database schema relationships, and security perimeters. We determine how every transaction impacts the general ledger and who holds approval authority.",
    deliverable: "Database entity schemas, RBAC permission matrix, and API contract specifications.",
    whyItMatters:
      "Prevents costly architectural refactoring later by locking in deterministic accounting equations and strict permission hierarchies early.",
    verificationCheck: "Schema sign-off and role boundary matrix verification.",
  },
  {
    id: "build",
    number: "03",
    name: "Build",
    phase: "Iterative Engineering & Core Integration",
    title: "Engineering the Backend Kernel & Clean Interfaces",
    detail:
      "We implement the backend database engines, business logic, and API endpoints alongside responsive, high-contrast user interfaces designed for rapid keyboard and touch input. Modules are committed with unit and integration tests.",
    deliverable: "Functional software release with automated test suites and operational staging environment.",
    whyItMatters:
      "Ensures the system performs with sub-second responsiveness even under peak shift concurrency, without freezing or losing in-flight state.",
    verificationCheck: "Automated test suite passing and staging deployment verification.",
  },
  {
    id: "verify",
    number: "04",
    name: "Verify",
    phase: "Rigorous Staging, Edge-Cases & Security Audits",
    title: "Validating Under Peak Scenarios & Real Data",
    detail:
      "We subject the system to rigorous operational stress tests: simulating network drops, power interrupts, unexpected concurrent sales spikes, void overrides, and edge-case double-entries. We verify that balances remain zero-drift under all conditions.",
    deliverable: "End-to-end verification audit, discrepancy log report, and security boundary review.",
    whyItMatters:
      "Commercial and government operations cannot tolerate silent data corruption. Failures must be detected and prevented before production.",
    verificationCheck: "Zero-drift ledger balance audit and stress test pass.",
  },
  {
    id: "support",
    number: "05",
    name: "Support",
    phase: "Deployment, Training & Continuous Reliability",
    title: "Production Handover, Staff Training & Ongoing Care",
    detail:
      "We coordinate production rollout, configure local or cloud hardware, onboard team members through hands-on guided sessions, and establish automated monitoring with automated database backups and versioned releases.",
    deliverable: "Live production deployment, staff operational guide, automated backup schedule, and support channel.",
    whyItMatters:
      "A software deployment is only successful when operational staff use it effortlessly every day and know immediate support is standing by.",
    verificationCheck: "Live operational sign-off and active automated backup verification.",
  },
];
