export interface ProjectCaseStudy {
  id: string;
  number: string;
  category: string;
  title: string;
  subtitle: string;
  summary: string;
  architectureHighlights: string[];
  recognitions?: string[];
  statusBadge: string;
  placeholderSlot: string;
}

export interface ProcessStepItem {
  number: string;
  code: string;
  shortTitle: string;
  title: string;
  detail: string;
  question: string;
  phaseTag: string;
  deliverable: string;
  nodes: [string, string, string];
  metricLabel: string;
  metricValue: string;
}

export const flagshipProjects: ProjectCaseStudy[] = [
  {
    id: "talibon-intra-office",
    number: "01",
    category: "Government & Institutional Platform",
    title: "Talibon Intra-Office System",
    subtitle: "Paperless document routing, inter-office tracking, and workflow accountability.",
    summary:
      "Developed to modernize how departments coordinate daily records and approvals in Talibon. Instead of lost paper trails and manual follow-ups, staff route documents between offices, check approval statuses, and maintain an organized digital record.",
    architectureHighlights: [
      "Structured document routing across municipal offices",
      "Status tracking & receiving logs across departments",
      "Role-based access for staff and department heads",
      "Dependable backend built for daily office operations",
    ],
    recognitions: ["Institutional System Development — Municipality of Talibon"],
    statusBadge: "Institutional Project",
    placeholderSlot: "Developed for municipal intra-office workflow operations in Talibon, Bohol.",
  },
  {
    id: "salryn-bms",
    number: "02",
    category: "Flagship Business Product",
    title: "Salryn — The Business Kernel",
    subtitle: "One reliable business management core tailored for cafes, retail, hardware, and more.",
    summary:
      "Co-designed by our systems engineers and accountant co-founders, Salryn combines POS checkout, inventory tracking, supplier purchasing, and automatic accounting in one unified system—configured for your specific industry.",
    architectureHighlights: [
      "Automatic double-entry accounting behind every sale",
      "Industry-tailored flavors (Cafe, Gen Merch, Hardware, Pharmacy, Services)",
      "Multi-branch stock & sales consolidation",
      "Clear shift closeouts & daily margin summaries",
    ],
    recognitions: ["Built for Cafe, Retail, General Merchandise, Hardware & Custom Operations"],
    statusBadge: "Flagship Product",
    placeholderSlot: "Available in industry-tailored setups or custom enterprise configurations.",
  },
  {
    id: "scoryn-tabulation",
    number: "03",
    category: "Live Event & Competition Software",
    title: "Scoryn — Automated Tabulation",
    subtitle: "Fast, structured live judging and score tabulation for pageants and events.",
    summary:
      "During live events, manual calculator tallying and spreadsheet formulas cause delays and encoding mistakes. Scoryn connects judges' terminals to a central scoring engine—computing weighted criteria, round rankings, and audit sheets automatically.",
    architectureHighlights: [
      "Live score syncing from judges' terminals",
      "Automatic weighted criteria & tie-break computation",
      "Locked rounds and print-ready official audit sheets",
      "Operates reliably over local venue networks",
    ],
    recognitions: [
      "Featured Tabulation — Miss Poblacion Occidental (Miss Pob Oc)",
      "Featured Tabulation — Mister Valencia",
      "Featured Tabulation — Miss Lila",
    ],
    statusBadge: "Event-Featured Platform",
    placeholderSlot: "Available for municipal pageants, school competitions, and regional events.",
  },
];

export const processSteps: ProcessStepItem[] = [
  {
    number: "01",
    code: "Stage 01 · Understand",
    shortTitle: "Understand",
    title: "Listen & Map the Real Workflow",
    detail:
      "We sit down with the people who actually do the work—cashiers, accountants, managers, or office staff—to trace how information moves and where bottlenecks happen before writing code.",
    question: "How does your team operate today, and where do manual delays or errors occur?",
    phaseTag: "Workflow Discovery",
    deliverable: "Operational Workflow Map",
    nodes: ["Frontline Counter & Office Flow", "Department Hand-offs", "Bottleneck & Risk Review"],
    metricLabel: "Discovery Focus",
    metricValue: "Real Staff Workflows",
  },
  {
    number: "02",
    code: "Stage 02 · Blueprint",
    shortTitle: "Blueprint",
    title: "Define the Rules & Numbers",
    detail:
      "Our systems engineers and accountants map out your business rules, role permissions, and financial calculations together so your database schema reflects real accounting logic.",
    question: "Which numbers, approvals, and records need strict validation at every step?",
    phaseTag: "Accounting & Data Schema",
    deliverable: "Ledger & Permission Blueprint",
    nodes: ["Double-Entry Ledger Rules", "Role Permission Matrix", "Relational Data Schema"],
    metricLabel: "Co-Designed By",
    metricValue: "Engineers + Accountants",
  },
  {
    number: "03",
    code: "Stage 03 · Build",
    shortTitle: "Build",
    title: "Engineer the System & Interface",
    detail:
      "We build the backend database, APIs, and security rules alongside a clean, straightforward interface that your staff can learn and use comfortably every day.",
    question: "Is the system responsive underneath and intuitive for daily staff use?",
    phaseTag: "Core Engineering",
    deliverable: "Backend Kernel & Application UI",
    nodes: ["Structured API & Database Core", "Role-Guarded Endpoints", "Clean Operational Interface"],
    metricLabel: "Engineering Focus",
    metricValue: "Backend + Usability",
  },
  {
    number: "04",
    code: "Stage 04 · Verify",
    shortTitle: "Verify",
    title: "Test Against Real Scenarios",
    detail:
      "Before launch, we run the system through realistic daily transactions, edge cases, and permission checks to confirm reports, receipts, and workflows behave as expected.",
    question: "Do the reports, calculations, and role restrictions hold up under real scenarios?",
    phaseTag: "Scenario Verification",
    deliverable: "Transaction & Access Review",
    nodes: ["Ledger Balance Verification", "Role Boundary Checks", "Workflow Scenario Testing"],
    metricLabel: "Verification Standard",
    metricValue: "Scenario-Tested",
  },
  {
    number: "05",
    code: "Stage 05 · Launch & Support",
    shortTitle: "Launch & Host",
    title: "Deploy, Host & Stand By Your Team",
    detail:
      "We handle cloud deployment, managed web hosting, backup configuration, and staff onboarding—remaining your technical partner in Bohol as your operations evolve.",
    question: "How is the system deployed, hosted, and supported as your organization grows?",
    phaseTag: "Cloud & Managed Hosting",
    deliverable: "Production Release & Hosting",
    nodes: ["Automated CI/CD Deployment", "Managed Web & App Hosting", "Staff Onboarding & Handover"],
    metricLabel: "Bohol Engineering Team",
    metricValue: "Direct Local Partnership",
  },
];
