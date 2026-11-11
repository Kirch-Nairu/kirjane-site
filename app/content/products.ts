export type SalrynReadinessStatus =
  | "Implemented Core"
  | "Piloted"
  | "In-Development"
  | "Proposed"
  | "Custom Deployment";

export interface SalrynFlavor {
  id: string;
  code: string;
  name: string;
  industry: string;
  tagline: string;
  description: string;
  readinessStatus: SalrynReadinessStatus;
  statusBadge: string;
  readinessDetail: string;
  modules: {
    name: string;
    status: SalrynReadinessStatus;
  }[];
  placeholderNote: string;
}

export const salrynKernelModules = [
  {
    code: "Accounting Core",
    name: "Balanced Financial Ledger",
    status: "Implemented Core" as SalrynReadinessStatus,
    detail: "Every sale, expense, and stock adjustment automatically updates your double-entry books.",
  },
  {
    code: "Inventory Engine",
    name: "Real-Time Stock & Purchasing",
    status: "Implemented Core" as SalrynReadinessStatus,
    detail: "Track multi-unit stock levels, receive supplier orders, and maintain cost-of-goods records.",
  },
  {
    code: "Staff Access",
    name: "Role-Based Permissions",
    status: "Implemented Core" as SalrynReadinessStatus,
    detail: "Separate views, cashier drawer limits, and approval controls for cashiers, managers, and owners.",
  },
  {
    code: "Daily Insights",
    name: "Instant Sales & Margin Reports",
    status: "Implemented Core" as SalrynReadinessStatus,
    detail: "Clear end-of-day cash reconciliation, gross profit margins, and sales summaries by shift.",
  },
];

export const salrynFlavors: SalrynFlavor[] = [
  {
    id: "cafe",
    code: "Cafe & F&B",
    name: "Salryn Cafe & Restaurant",
    industry: "Cafes, Restaurants & Bakeries",
    tagline: "Front-counter ordering, drink modifiers, and shift cash drawer counts.",
    description:
      "Piloted in food and beverage environments. Cashiers enter orders and modifiers quickly, calculate end-of-shift cash drawer totals, and review daily sales totals without manual tallying.",
    readinessStatus: "Piloted",
    statusBadge: "Piloted Configuration",
    readinessDetail:
      "Piloted in local food and beverage workflows: front-counter order entry, drink modifier tickets, and daily cash drawer reconciliation are tested. Kitchen queue and automatic raw recipe deductions are currently in development.",
    modules: [
      { name: "Fast counter order & modifier entry", status: "Piloted" },
      { name: "End-of-shift cash drawer count", status: "Piloted" },
      { name: "Dine-in, takeout & open tabs", status: "In-Development" },
      { name: "Recipe & raw ingredient stock deduction", status: "In-Development" },
    ],
    placeholderNote:
      "Piloted configuration: Counter order taking and cash drawer reconciliation verified in local food and beverage settings.",
  },
  {
    id: "gen-merch",
    code: "Retail & Trading",
    name: "Salryn General Merchandise",
    industry: "Grocery, Mini-Marts & Wholesale Retail",
    tagline: "Barcode lookup, piece/pack retail pricing, and supplier purchase orders.",
    description:
      "Piloted for retail stores managing multiple product lines. Look up items by barcode or keyword, apply piece vs. wholesale price tiers, and record supplier purchase deliveries.",
    readinessStatus: "Piloted",
    statusBadge: "Piloted Configuration",
    readinessDetail:
      "Piloted configuration: Tested with barcode scanning, retail/pack pricing tiers, and supplier purchase order logging in retail settings. Multi-warehouse automated branch sync is currently under active development.",
    modules: [
      { name: "Instant barcode & item lookup", status: "Piloted" },
      { name: "Piece, pack & wholesale price tiers", status: "Piloted" },
      { name: "Supplier purchase orders & receiving", status: "Piloted" },
      { name: "Branch-to-branch multi-warehouse sync", status: "In-Development" },
    ],
    placeholderNote:
      "Piloted configuration: Barcode checkout and supplier receiving verified; multi-warehouse sync in active development.",
  },
  {
    id: "hardware",
    code: "Hardware & Supply",
    name: "Salryn Hardware & Construction",
    industry: "Hardware Stores & Construction Supply",
    tagline: "Project quotations, unit conversions, and customer credit ledger.",
    description:
      "Currently under active development for hardware and building supply counters. Converts customer quotations into invoices, tracks bulk-to-unit conversions, and monitors customer receivable balances.",
    readinessStatus: "In-Development",
    statusBadge: "In-Development",
    readinessDetail:
      "In-Development configuration: Quotation-to-invoice data models and fractional unit conversions (bags, pieces, lengths) are built in our staging environment; depot delivery dispatch is currently in design review.",
    modules: [
      { name: "Quotation to sales invoice conversion", status: "In-Development" },
      { name: "Bulk & fractional unit conversions", status: "In-Development" },
      { name: "Customer credit limits & receivables", status: "In-Development" },
      { name: "Yard delivery dispatch tracking", status: "Proposed" },
    ],
    placeholderNote:
      "In-Development configuration: Data schema and accounting logic established; currently staging quote-to-invoice workflows.",
  },
  {
    id: "pharmacy",
    code: "Pharmacy & Health",
    name: "Salryn Pharmacy & Wellness",
    industry: "Pharmacies, Clinics & Medical Supply",
    tagline: "Batch lot tracking, generic lookup, and statutory discount handling.",
    description:
      "In development for community pharmacies and medical dispensaries. Built around earliest-expiry batch management (FEFO), generic-to-brand cross-reference, and statutory Senior Citizen/PWD deductions.",
    readinessStatus: "In-Development",
    statusBadge: "In-Development",
    readinessDetail:
      "In-Development configuration: FEFO lot tracking tables and statutory discount calculation algorithms are under development; regulatory reporting export templates are scheduled for subsequent iterations.",
    modules: [
      { name: "Batch lot & earliest-expiry (FEFO) alerts", status: "In-Development" },
      { name: "Generic and brand name cross-lookup", status: "In-Development" },
      { name: "Senior Citizen & PWD discount computation", status: "In-Development" },
      { name: "Statutory inventory compliance reports", status: "Proposed" },
    ],
    placeholderNote:
      "In-Development configuration: FEFO batch tracking and statutory discount logic in active development.",
  },
  {
    id: "services",
    code: "Services & Shops",
    name: "Salryn Service & Job Orders",
    industry: "Repair Centers, Salons, Clinics & Studios",
    tagline: "Track customer job orders, technician labor, and service billing.",
    description:
      "Proposed architecture designed for service businesses combining labor and inventory parts. Structures customer check-in, technician assignment, and combined invoicing.",
    readinessStatus: "Proposed",
    statusBadge: "Proposed Configuration",
    readinessDetail:
      "Proposed configuration: Workflow architecture and data models are defined; awaiting initial pilot deployment partner before release.",
    modules: [
      { name: "Job order intake & repair status tracking", status: "Proposed" },
      { name: "Combined parts & labor invoice billing", status: "Proposed" },
      { name: "Technician & staff commission splits", status: "Proposed" },
      { name: "Customer equipment service history", status: "Proposed" },
    ],
    placeholderNote:
      "Proposed configuration: Workflow models documented; open for tailored pilot deployment.",
  },
  {
    id: "enterprise",
    code: "Custom Enterprise",
    name: "Salryn Custom Enterprise",
    industry: "Multi-Branch & Specialized Organizations",
    tagline: "The Salryn core ledger configured around your organization's unique workflows.",
    description:
      "Custom deployment option for organizations with specialized requirements. We adapt the proven accounting and inventory core around your specific approval hierarchy, forms, and reporting lines.",
    readinessStatus: "Custom Deployment",
    statusBadge: "Custom Deployment",
    readinessDetail:
      "Custom deployment: Implemented on a project-by-project basis directly with our engineering and accounting leads, utilizing the validated Salryn core kernel.",
    modules: [
      { name: "Custom workflow & approval hierarchies", status: "Custom Deployment" },
      { name: "Head-office multi-branch ledger consolidation", status: "In-Development" },
      { name: "Dedicated cloud hosting or on-premise installation", status: "Implemented Core" },
      { name: "Hands-on staff onboarding & accounting setup", status: "Custom Deployment" },
    ],
    placeholderNote:
      "Custom deployment: Configured directly with Kirjane Labs engineering and accounting leads.",
  },
];

export const scorynRecognitions = [
  {
    code: "Featured Tabulation",
    title: "Miss Poblacion Occidental",
    shortName: "Miss Pob Oc",
    role: "Automated Live Judging & Tabulation",
    detail:
      "Live score syncing from judges' terminals to the central tabulation desk without manual spreadsheet re-encoding.",
  },
  {
    code: "Featured Tabulation",
    title: "Mister Valencia",
    shortName: "Mister Valencia",
    role: "Automated Live Judging & Tabulation",
    detail:
      "Round-by-round rankings, weighted criteria computation, and structured tie-breaker handling.",
  },
  {
    code: "Featured Tabulation",
    title: "Miss Lila",
    shortName: "Miss Lila",
    role: "Automated Live Judging & Tabulation",
    detail:
      "Automated score calculation with print-ready audit sheets for event organizers and judging panels.",
  },
];
