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

export const salrynKernelModules = [
  {
    code: "Accounting Core",
    name: "Balanced Financial Ledger",
    detail: "Every sale, expense, and stock movement automatically updates your books.",
  },
  {
    code: "Inventory Engine",
    name: "Real-Time Stock & Purchasing",
    detail: "Track stock across branches, warehouses, and suppliers without manual spreadsheets.",
  },
  {
    code: "Staff Access",
    name: "Role-Based Permissions",
    detail: "Separate views and approvals for cashiers, shift managers, and business owners.",
  },
  {
    code: "Daily Insights",
    name: "Instant Sales & Margin Reports",
    detail: "Clear end-of-day cash summaries, profit margins, and best-selling items.",
  },
];

export const salrynFlavors: SalrynFlavor[] = [
  {
    id: "cafe",
    code: "Cafe & F&B",
    name: "Salryn Cafe & Restaurant",
    industry: "Cafes, Restaurants & Bakeries",
    tagline: "Fast counter ordering, table tabs, and automatic ingredient tracking.",
    description:
      "Designed for busy food and beverage teams. Cashiers take orders in seconds, kitchen staff see tickets immediately, and every cup or plate automatically deducts raw ingredients from your stock.",
    modules: [
      "Fast drink & modifier POS screen",
      "Recipe & raw ingredient deduction",
      "Dine-in tables, takeout & open tabs",
      "End-of-shift cash drawer count",
    ],
    placeholderNote: "Includes POS register, kitchen queue, and recipe stock setup.",
  },
  {
    id: "gen-merch",
    code: "Retail & Trading",
    name: "Salryn General Merchandise",
    industry: "Grocery, Mini-Marts & Wholesale Retail",
    tagline: "Barcode scanning, wholesale/retail pricing, and supplier purchase orders.",
    description:
      "Built for stores managing thousands of items. Scan barcodes at checkout, switch between retail and wholesale prices automatically, and track stock across multiple bodegas or branches.",
    modules: [
      "Instant barcode & item lookup",
      "Piece, pack, box & wholesale pricing",
      "Supplier purchase orders & receiving",
      "Branch-to-branch stock transfers",
    ],
    placeholderNote: "Supports barcode scanners, receipt printers, and multi-warehouse ledgers.",
  },
  {
    id: "hardware",
    code: "Hardware & Supply",
    name: "Salryn Hardware & Construction",
    industry: "Hardware Stores & Construction Supply",
    tagline: "Project quotations, unit conversions, contractor credit, and delivery slips.",
    description:
      "Turn customer price quotes into official invoices in one click. Easily handle bulk-to-retail unit conversions, track contractor credit balances, and print yard delivery dispatches.",
    modules: [
      "One-click quote to invoice",
      "Bulk & fractional unit conversions",
      "Customer credit limits & receivables",
      "Delivery dispatch & pickup tracking",
    ],
    placeholderNote: "Tailored for hardware counters, lumber yards, and depot dispatch.",
  },
  {
    id: "pharmacy",
    code: "Pharmacy & Health",
    name: "Salryn Pharmacy & Wellness",
    industry: "Pharmacies, Clinics & Medical Supply",
    tagline: "Batch and expiry date tracking with fast generic-to-brand lookup.",
    description:
      "Keep your shelves safe and compliant. Automatically sell earliest-expiring stock first (FEFO), search medicines by generic or brand name, and apply statutory discounts accurately.",
    modules: [
      "Batch lot & expiry date alerts",
      "Generic and brand name cross-search",
      "Senior Citizen & PWD discount calculation",
      "Daily inventory & compliance logs",
    ],
    placeholderNote: "Built for fast counter dispensing and strict expiry monitoring.",
  },
  {
    id: "services",
    code: "Services & Shops",
    name: "Salryn Service & Job Orders",
    industry: "Repair Centers, Salons, Clinics & Studios",
    tagline: "Track client job orders, staff commissions, and service packages.",
    description:
      "Manage work from customer check-in to final payment. Combine service labor with parts used, calculate technician or staff commissions automatically, and keep complete client history.",
    modules: [
      "Job order & status tracking",
      "Automatic staff commission splits",
      "Combined parts & labor billing",
      "Customer service history records",
    ],
    placeholderNote: "Ideal for service businesses combining appointments, labor, and products.",
  },
  {
    id: "enterprise",
    code: "Custom Enterprise",
    name: "Salryn Custom Enterprise",
    industry: "Multi-Branch & Specialized Organizations",
    tagline: "The Salryn core system customized for your unique business rules.",
    description:
      "Have a workflow that standard software can't handle? We customize Salryn around your exact forms, approval chains, and reporting needs—while keeping its proven accounting and inventory core.",
    modules: [
      "Custom workflow & approval modules",
      "Head-office multi-branch consolidation",
      "Cloud or local on-premise setup",
      "Dedicated onboarding & team training",
    ],
    placeholderNote: "Configured directly with our engineering and accounting leads.",
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
