export interface ServiceArea {
  number: string;
  tag: string;
  shortLabel: string;
  title: string;
  shortSummary: string;
  description: string;
  question: string;
  focus: string[];
  tags: [string, string, string];
  isCoreStrength?: boolean;
}

export const services: ServiceArea[] = [
  {
    number: "01",
    tag: "Core Strength · Backend & Databases",
    shortLabel: "Core Specialty",
    title: "Backend Architecture & Enterprise Systems",
    shortSummary:
      "Dependable APIs and accounting-ready databases co-designed by systems engineers and accountants.",
    description:
      "Strong software starts underneath the screen. Because our founding team combines systems engineers and accountants, we build backend databases, APIs, and financial logic that stay accurate and responsive as your organization grows.",
    question: "How do we keep your records, transactions, and daily operations accurate across teams?",
    focus: [
      "Structured APIs & relational database design",
      "Accounting-ready transaction & ledger records",
      "Multi-branch & inter-office synchronization",
      "Performance tuning for daily operational loads",
    ],
    tags: ["Balanced Ledgers", "Multi-Branch Sync", "Structured APIs"],
    isCoreStrength: true,
  },
  {
    number: "02",
    tag: "Core Strength · Security & Control",
    shortLabel: "Access & Audit",
    title: "Application Security & Staff Permissions",
    shortSummary:
      "Clear role boundaries, approval rules, and activity logs for cashiers, staff, managers, and owners.",
    description:
      "Not everyone in an organization should view or edit the same records. We build role-based permissions, approval workflows, and activity logs directly into the backend so sensitive actions remain controlled.",
    question: "Who can view, approve, or modify sensitive records—and how is each action recorded?",
    focus: [
      "Role-based staff, manager & executive permissions",
      "Activity & approval audit logs",
      "Protected authentication & session controls",
      "Structured data backup & recovery workflows",
    ],
    tags: ["Role-Based Control", "Approval Audit Logs", "Protected Sessions"],
    isCoreStrength: true,
  },
  {
    number: "03",
    tag: "Core Strength · Cloud & Web Hosting",
    shortLabel: "Infrastructure",
    title: "Cloud Operations & Managed Web Hosting",
    shortSummary:
      "Automated CI/CD release pipelines, cloud server provisioning, and managed web hosting.",
    description:
      "Your team shouldn't have to wrestle with server setup or broken deployments. We handle cloud provisioning, automated release checks, domain configuration, and managed web hosting for your websites and business applications.",
    question: "How do we deploy updates cleanly and keep your website or platform reliably hosted?",
    focus: [
      "Managed web & business application hosting",
      "Automated CI/CD build & release pipelines",
      "Cloud server provisioning & health checks",
      "Scheduled backup & maintenance workflows",
    ],
    tags: ["Managed Hosting", "Automated CI/CD", "Cloud Provisioning"],
    isCoreStrength: true,
  },
  {
    number: "04",
    tag: "Custom Build · Web & Internal Tools",
    shortLabel: "Bespoke Build",
    title: "Tailored Systems & Custom Websites",
    shortSummary:
      "Custom intra-office platforms, municipal workflow systems, and high-craft corporate websites.",
    description:
      "When off-the-shelf software doesn't match how your organization operates, we design and build custom internal platforms, document routing systems, and responsive websites tailored to your workflow.",
    question: "What manual paperwork or disconnected spreadsheets can we replace with one clean system?",
    focus: [
      "Custom internal & intra-office workflow platforms",
      "High-craft corporate & product websites",
      "Paper-to-digital routing & approval tools",
      "Responsive web applications for desktop & mobile",
    ],
    tags: ["Intra-Office Systems", "Custom Web Apps", "Corporate Websites"],
  },
];
