export interface ServiceArea {
  number: string;
  tag: string;
  title: string;
  description: string;
  question: string;
  focus: string[];
  isCoreStrength?: boolean;
}

export interface SalrynFlavor {
  id: string;
  code: string;
  name: string;
  industry: string;
  tagline: string;
  description: string;
  modules: string[];
  placeholderNote: string;
}

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

export interface TeamMember {
  id: string;
  index: string;
  name: string;
  role: string;
  secondaryRole?: string;
  discipline: string;
  isFounder?: boolean;
  summaryPlaceholder: string;
  avatarCode: string;
}

export const services: ServiceArea[] = [
  {
    number: "01",
    tag: "CORE SPECIALTY // BACKEND & ARCHITECTURE",
    title: "Enterprise Backend & Mission-Critical Systems",
    description:
      "We excel where software matters most: underneath the interface. High-integrity APIs, deterministic state workflows, financial/accounting ledger precision, and fault-tolerant data architectures.",
    question: "What invariants and business rules must never break under load?",
    focus: [
      "High-reliability APIs & domain kernels",
      "Accounting-grade ledger & transaction integrity",
      "Complex multi-branch & institutional workflows",
      "Database modeling & concurrency control",
    ],
    isCoreStrength: true,
  },
  {
    number: "02",
    tag: "CORE SPECIALTY // SECURITY & GOVERNANCE",
    title: "Application Security & Access Governance",
    description:
      "Security engineered into the boundary, not bolted on after launch. Granular role-based permissions, tamper-evident audit trails, hardened authentication, and strict authority isolation.",
    question: "Who has authority to mutate state, and how is every action verified?",
    focus: [
      "Granular RBAC & authority boundaries",
      "Tamper-evident operational audit logs",
      "Hardened API & session security",
      "Zero-trust data lifecycle protection",
    ],
    isCoreStrength: true,
  },
  {
    number: "03",
    tag: "CORE SPECIALTY // INFRASTRUCTURE & HOSTING",
    title: "Cloud Ops, CI/CD & Managed Web Hosting",
    description:
      "End-to-end infrastructure ownership. Automated verification pipelines, resilient cloud deployments, proactive monitoring, and managed high-availability web hosting for organizations that need dependable uptime.",
    question: "How is your system deployed, monitored, backed up, and kept fast every day?",
    focus: [
      "Managed web & application hosting",
      "Automated CI/CD & release verification gates",
      "Cloud infrastructure provisioning & scaling",
      "Backup, recovery & operational telemetry",
    ],
    isCoreStrength: true,
  },
  {
    number: "04",
    tag: "CUSTOM DELIVERY // WEB & PLATFORMS",
    title: "Tailored Systems & Custom Websites",
    description:
      "From bespoke internal operational platforms and government intra-office systems to high-craft custom websites engineered around your exact brand and organizational workflow.",
    question: "How should the interface serve the people doing the actual work?",
    focus: [
      "Tailored enterprise & intra-office portals",
      "High-craft custom corporate & product websites",
      "Legacy workflow modernization & automation",
      "Cross-device responsive web applications",
    ],
  },
];

export const salrynKernelModules = [
  { code: "KRN-01", name: "Unified Ledger & Accounting Core", detail: "Double-entry-ready financial tracking designed with CPA co-founders." },
  { code: "KRN-02", name: "Multi-Branch Inventory Engine", detail: "Real-time stock movement, procurement handoffs, and audit trails." },
  { code: "KRN-03", name: "Role & Authority Matrix (RBAC)", detail: "Strict operational boundaries across cashiers, managers, and auditors." },
  { code: "KRN-04", name: "Executive Telemetry & Reporting", detail: "Instant daily closeouts, margin analysis, and branch consolidation." },
];

export const salrynFlavors: SalrynFlavor[] = [
  {
    id: "cafe",
    code: "FLV // 01",
    name: "Salryn Cafe & F&B",
    industry: "Cafes, Restaurants & Food Service",
    tagline: "High-speed counter & table operations with recipe-level stock control.",
    description:
      "Built for fast-moving food and beverage teams. Connects front-of-house POS orders directly to kitchen queues, modifier pricing, recipe ingredient depletion, and shift cash reconciliation.",
    modules: [
      "Modifier & variant POS terminal",
      "Recipe BOM & raw ingredient depletion",
      "Table, dine-in, takeout & tab management",
      "Shift drawer & Z-reading reconciliation",
    ],
    placeholderNote: "[PLACEHOLDER: Insert Salryn Cafe POS & Kitchen UI preview / deployment metrics]",
  },
  {
    id: "gen-merch",
    code: "FLV // 02",
    name: "Salryn General Merchandise",
    industry: "Retail, Supermarkets & General Trading",
    tagline: "High-SKU velocity, barcode scanning, and wholesale-to-retail tiering.",
    description:
      "Engineered for high-volume merchandise operations handling thousands of SKUs, multi-unit pricing (piece, pack, box, case), supplier purchase orders, and stock transfers.",
    modules: [
      "High-speed barcode & SKU lookup",
      "Retail, wholesale & member price tiers",
      "Supplier PO, receiving & payables",
      "Multi-warehouse stock transfer ledger",
    ],
    placeholderNote: "[PLACEHOLDER: Insert Salryn Gen Merch inventory & barcode terminal preview]",
  },
  {
    id: "hardware",
    code: "FLV // 03",
    name: "Salryn Hardware & Supply",
    industry: "Construction, Hardware & Industrial Supply",
    tagline: "Complex unit conversions, contractor credit accounts, and delivery dispatch.",
    description:
      "Handles fractional and bulk unit conversions, project quotations that convert cleanly into invoices, customer credit limits, and partial delivery tracking.",
    modules: [
      "Dimensional & bulk unit conversions",
      "Quotation-to-invoice workflow",
      "Contractor receivables & credit limits",
      "Yard & delivery dispatch slips",
    ],
    placeholderNote: "[PLACEHOLDER: Insert Salryn Hardware quotation & dispatch module preview]",
  },
  {
    id: "pharmacy",
    code: "FLV // 04",
    name: "Salryn Pharmacy & Wellness",
    industry: "Pharmacies, Clinics & Medical Supply",
    tagline: "Lot/batch traceability, expiry enforcement, and fast counter dispensing.",
    description:
      "Protects inventory compliance with strict FEFO (First-Expired, First-Out) lot tracking, generic/brand cross-referencing, senior/PWD discount computation, and regulatory logs.",
    modules: [
      "Batch, lot & FEFO expiry alerts",
      "Generic-to-brand active lookup",
      "Statutory discount & tax compliance",
      "Controlled stock audit reporting",
    ],
    placeholderNote: "[PLACEHOLDER: Insert Salryn Pharmacy FEFO & compliance view]",
  },
  {
    id: "services",
    code: "FLV // 05",
    name: "Salryn Service & Booking",
    industry: "Service Centers, Salons, Studios & Agencies",
    tagline: "Job-order lifecycle, technician commissions, and recurring billing.",
    description:
      "Tracks work from client intake and cost estimation through technician assignment, parts consumption, automated commission splits, and final settlement.",
    modules: [
      "Job order & service ticket pipeline",
      "Staff & specialist commission engine",
      "Parts + labor bundled billing",
      "Client history & retention records",
    ],
    placeholderNote: "[PLACEHOLDER: Insert Salryn Service job-order board preview]",
  },
  {
    id: "enterprise",
    code: "FLV // 06",
    name: "Salryn Custom Enterprise",
    industry: "Bespoke Organizational & Multi-Entity Operations",
    tagline: "The Salryn kernel tailored to your organization's proprietary workflow.",
    description:
      "When off-the-shelf software forces your team into workarounds, we mount custom domain modules directly onto the battle-tested Salryn kernel.",
    modules: [
      "Custom domain state machines",
      "ERP / third-party API bridges",
      "On-premise, hybrid, or dedicated cloud",
      "Dedicated SLA & engineering support",
    ],
    placeholderNote: "[PLACEHOLDER: Insert custom enterprise architecture topology]",
  },
];

export const scorynRecognitions = [
  {
    code: "EVENT // 01",
    title: "Miss Poblacion Occidental",
    shortName: "Miss Pob Oc",
    role: "Official Automated Tabulation System",
    detail: "Real-time multi-judge scoring, locked round validation, and instant audited results.",
  },
  {
    code: "EVENT // 02",
    title: "Mister Valencia",
    shortName: "Mister Valencia",
    role: "Official Automated Tabulation System",
    detail: "Zero-latency live score aggregation across preliminary and final competition segments.",
  },
  {
    code: "EVENT // 03",
    title: "Miss Lila",
    shortName: "Miss Lila",
    role: "Official Automated Tabulation System",
    detail: "Deterministic rank computation, tie-break verification, and official print-ready audit sheets.",
  },
];

export const flagshipProjects: ProjectCaseStudy[] = [
  {
    id: "talibon-intra-office",
    number: "01",
    category: "INSTITUTIONAL & GOVERNMENT SYSTEMS",
    title: "Talibon Intra-Office System",
    subtitle: "Comprehensive intra-office workflow, document routing, and operational coordination platform.",
    summary:
      "A major institutional software deployment engineered to modernize inter-departmental workflows in Talibon. Designed with strict role-based authority, traceable document handoffs, status accountability, and dependable backend infrastructure.",
    architectureHighlights: [
      "Inter-departmental routing & state tracking",
      "Role-based access control & digital audit trail",
      "Centralized document & operational records",
      "High-reliability backend built for daily institutional load",
    ],
    recognitions: ["Flagship Institutional Deployment — Talibon"],
    statusBadge: "PRODUCTION // RECOGNIZED DEPLOYMENT",
    placeholderSlot: "[PLACEHOLDER: Authorized Talibon Intra-Office System interface preview & institutional case metrics]",
  },
  {
    id: "salryn-bms",
    number: "02",
    category: "FLAGSHIP PRODUCT ECOSYSTEM",
    title: "Salryn — The Business Kernel",
    subtitle: "Modular Business Management System adaptable to any industry vertical.",
    summary:
      "Engineered from the ground up by Kirjane's systems engineers and accountant co-founders. Salryn provides a single, rock-solid core kernel for accounting, inventory, permissions, and reporting—configured into industry-specific flavors (Cafe, General Merchandise, Hardware, Pharmacy, and more).",
    architectureHighlights: [
      "Shared accounting & inventory kernel",
      "Pluggable vertical 'Flavor' domain modules",
      "Offline-resilient & cloud-synchronized architectures",
      "Strict financial reconciliation & shift controls",
    ],
    recognitions: ["Multi-Vertical BMS Kernel (Cafe, Gen Merch, Retail, Enterprise)"],
    statusBadge: "FLAGSHIP PRODUCT // MULTI-FLAVOR",
    placeholderSlot: "[PLACEHOLDER: Salryn multi-flavor dashboard showcase & active deployment gallery]",
  },
  {
    id: "scoryn-tabulation",
    number: "03",
    category: "REAL-TIME EVENT & SCORING ENGINE",
    title: "Scoryn — Automated Tabulation",
    subtitle: "High-integrity real-time judging and automated tabulation platform.",
    summary:
      "Where manual spreadsheets introduce delay and human error under live event pressure, Scoryn delivers deterministic, real-time score synchronization across judges' terminals with instant audited rankings.",
    architectureHighlights: [
      "Real-time judge terminal synchronization",
      "Weighted criteria, round locking & tie-break rules",
      "Tamper-evident score logs & instant printable audit sheets",
      "Zero-downtime local/cloud event network architecture",
    ],
    recognitions: [
      "Featured in Miss Poblacion Occidental (Miss Pob Oc)",
      "Featured in Mister Valencia",
      "Featured in Miss Lila",
    ],
    statusBadge: "BATTLE-TESTED // LIVE EVENTS",
    placeholderSlot: "[PLACEHOLDER: Scoryn judge terminal UI & event recognition photography]",
  },
];

export const processSteps = [
  {
    number: "01",
    code: "GATE // DISCOVERY",
    title: "Contract-First Discovery",
    detail:
      "We never authorize code from vague symptoms alone. We map the real operational workflow, accounting rules, user roles, and edge cases into an explicit specification.",
    question: "What is the exact operational contract this system must fulfill?",
  },
  {
    number: "02",
    code: "GATE // INVARIANTS",
    title: "Architecture & Invariant Modeling",
    detail:
      "Before building, we define what must never break—financial balances, permission boundaries, data integrity, and audit trails—alongside the visual and system design.",
    question: "Which business invariants and security boundaries must hold under every condition?",
  },
  {
    number: "03",
    code: "GATE // EXECUTION",
    title: "Bounded Systems Engineering",
    detail:
      "Fast, disciplined implementation inside clean architectural boundaries. Backend services, database schemas, and responsive interfaces are built against the agreed contract.",
    question: "How do the backend kernel, security layer, and interface operate as one coherent system?",
  },
  {
    number: "04",
    code: "GATE // EVIDENCE",
    title: "Evidence-Led Verification",
    detail:
      "Passing a basic test is not enough. We validate real-world workflows, edge-case behavior, security permissions, and performance under realistic operational conditions.",
    question: "What concrete evidence proves the system works as required?",
  },
  {
    number: "05",
    code: "GATE // OPERATIONS",
    title: "Controlled Promotion & Cloud Ops",
    detail:
      "Deliberate production release backed by CI/CD pipelines, managed web/cloud hosting, monitoring, and structured team handover.",
    question: "How is the system hosted, protected, and evolved long after launch?",
  },
];

export const teamMembers: TeamMember[] = [
  {
    id: "kirch",
    index: "01",
    name: "Kirch",
    role: "Founder, CTO & Head of Engineering",
    secondaryRole: "Kirjane Labs Tech Lead",
    discipline: "Systems Architecture · Backend · Security · Engineering Doctrine",
    isFounder: true,
    summaryPlaceholder:
      "[PLACEHOLDER: Bio & portrait — Leads systems architecture, backend kernel engineering, security governance, and technical direction across all Kirjane products and enterprise deployments.]",
    avatarCode: "KR // CTO",
  },
  {
    id: "paul",
    index: "02",
    name: "Paul",
    role: "Co-Founder & Chief Executive Officer (CEO)",
    secondaryRole: "Accountant",
    discipline: "Executive Leadership · Financial Governance · Accounting Systems",
    isFounder: true,
    summaryPlaceholder:
      "[PLACEHOLDER: Bio & portrait — Co-founder and Accountant driving executive strategy, organizational governance, and accounting-grade precision across Kirjane's business software.]",
    avatarCode: "PL // CEO",
  },
  {
    id: "james-karl",
    index: "03",
    name: "James Karl",
    role: "Co-Founder & Business Lead",
    secondaryRole: "Accountant",
    discipline: "Commercial Strategy · Enterprise Alignment · Financial Operations",
    isFounder: true,
    summaryPlaceholder:
      "[PLACEHOLDER: Bio & portrait — Co-founder and Accountant leading business development, client operational discovery, and financial workflow modeling.]",
    avatarCode: "JK // BIZ",
  },
  {
    id: "siris",
    index: "04",
    name: "Siris",
    role: "Co-Founder & Developer Operations Lead",
    secondaryRole: "Co-Founder",
    discipline: "Developer Operations · Delivery Orchestration · Systems Reliability",
    isFounder: true,
    summaryPlaceholder:
      "[PLACEHOLDER: Bio & portrait — Co-founder overseeing developer operations, engineering velocity, and operational readiness across project deliveries.]",
    avatarCode: "SR // DEVOPS",
  },
  {
    id: "kurt",
    index: "05",
    name: "Kurt",
    role: "CI/CD & DevOps Engineer",
    discipline: "Deployment Pipelines · Build Automation · Infrastructure & Web Delivery",
    summaryPlaceholder:
      "[PLACEHOLDER: Bio & portrait — Manages continuous integration, automated release verification pipelines, deployment infrastructure, and web engineering.]",
    avatarCode: "KT // CICD",
  },
  {
    id: "jesse",
    index: "06",
    name: "Jesse",
    role: "Social Media Manager",
    discipline: "Brand Communications · Digital Presence · Community Engagement",
    summaryPlaceholder:
      "[PLACEHOLDER: Bio & portrait — Shapes Kirjane's public communications, product storytelling, and digital presence across social channels.]",
    avatarCode: "JS // COMM",
  },
  {
    id: "ace",
    index: "07",
    name: "Ace",
    role: "Market Research Specialist",
    discipline: "Industry Vertical Analysis · Market Discovery · Product Fit",
    summaryPlaceholder:
      "[PLACEHOLDER: Bio & portrait — Conducts industry vertical research and operational discovery to align Salryn flavors and custom systems with real market needs.]",
    avatarCode: "AC // RES",
  },
];
