import type { ServiceArea } from "./types";

export const services: ServiceArea[] = [
  {
    id: "backend-architecture",
    number: "01",
    tag: "Core Engineering · Architecture",
    title: "Backend Architecture & Database Engineering",
    headline: "Foundations engineered for high-concurrency, data integrity, and financial precision.",
    description:
      "We design and build secure API backends, high-performance database schemas, and transactional logic. Because our leadership pairs software engineers with certified accountants, every system is constructed with balanced ledger integrity and strict auditability from day one.",
    problemSolved:
      "Prevents database performance bottlenecks, synchronization drift across branches, and catastrophic bookkeeping discrepancies.",
    capabilities: [
      "High-speed REST and GraphQL backend services",
      "Transactional double-entry database schemas",
      "Multi-branch replication and off-line fallback sync",
      "High-throughput caching, query optimization, and indexing",
    ],
    deliverables: [
      "Production-ready backend API codebases",
      "Documented schema diagrams and data dictionaries",
      "Migration strategies and automated regression tests",
      "Automated database backup routines",
    ],
    isCoreStrength: true,
  },
  {
    id: "security-permissions",
    number: "02",
    tag: "Governance · Access Control",
    title: "Application Security & Role-Based Permissions",
    headline: "Granular access boundaries, cryptographically secured sessions, and immutable audit logs.",
    description:
      "Enterprise software requires strict boundaries between what cashiers, floor managers, accounting staff, and executives can view and execute. We construct fine-grained role-based access control (RBAC) mechanisms that prevent unauthorized access and maintain full traceability.",
    problemSolved:
      "Eliminates internal data leaks, privilege escalation, untracked cash drawer overrides, and unauthorized balance adjustments.",
    capabilities: [
      "Role-based access control (RBAC) and attribute policies",
      "Cryptographically verified session handling",
      "Immutable activity audit trails and supervisor overrides",
      "Two-factor authentication and credential hardening",
    ],
    deliverables: [
      "Permission matrices and authorization policies",
      "Audit log inspection interfaces",
      "Security audit checklists and vulnerability remediation",
    ],
    isCoreStrength: true,
  },
  {
    id: "cloud-hosting",
    number: "03",
    tag: "Operations · Reliability",
    title: "Cloud Operations, CI/CD & Managed Hosting",
    headline: "Automated delivery pipelines, server hardening, and high-availability hosting.",
    description:
      "Software requires reliable infrastructure to stay fast and secure. We manage cloud deployments, automated testing pipelines, reverse proxy configurations, and scheduled backups so business applications remain resilient 24/7.",
    problemSolved:
      "Stops unexpected downtime, failed manual updates, slow server response times, and catastrophic data loss from unverified backups.",
    capabilities: [
      "Automated CI/CD build, lint, and deployment pipelines",
      "Nginx, Docker, and Linux server hardening",
      "Automated database snapshots and offsite replication",
      "Uptime monitoring, TLS certificates, and alerting",
    ],
    deliverables: [
      "Configured container environments and deployment manifests",
      "Automated CI/CD workflows with test suites",
      "24/7 uptime monitoring dashboards and incident procedures",
    ],
    isCoreStrength: true,
  },
  {
    id: "custom-systems",
    number: "04",
    tag: "Bespoke · Institutional & Web",
    title: "Custom Business Systems & Corporate Websites",
    headline: "Purpose-built internal software and high-craft corporate web experiences.",
    description:
      "When commercial off-the-shelf packages do not align with an organization's specific approval chains or brand presentation, we design and build bespoke software—from municipal workflow portals to distinctive corporate web platforms.",
    problemSolved:
      "Replaces brittle spreadsheets, disorganized paperwork, and generic website templates with tailored, maintainable systems.",
    capabilities: [
      "Inter-departmental routing and document management systems",
      "Tailored internal operational dashboards and portals",
      "Accessible, responsive corporate web platforms (React, Vite, SSR)",
      "High-performance design systems and component libraries",
    ],
    deliverables: [
      "Custom responsive web applications with semantic markup",
      "Staff onboarding documentation and workflow guides",
      "Source-controlled repositories with automated build pipelines",
    ],
  },
];
