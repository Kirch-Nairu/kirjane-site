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

export const flagshipProjects: ProjectCaseStudy[] = [
  {
    id: "talibon-intra-office",
    number: "01",
    category: "Government & Institutional Platform",
    title: "Talibon Intra-Office System",
    subtitle: "Paperless document routing, inter-office tracking, and workflow accountability.",
    summary:
      "Developed to modernize how departments coordinate daily records and approvals in Talibon. Instead of lost paper trails and manual follow-ups, staff can route documents between offices, see exact approval statuses in real time, and maintain a complete digital archive.",
    architectureHighlights: [
      "Fast document routing across municipal offices",
      "Real-time status tracking & receiving logs",
      "Role-based access for staff and department heads",
      "Dependable backend built for everyday office operations",
    ],
    recognitions: ["Flagship Institutional Deployment — Municipality of Talibon"],
    statusBadge: "Live Institutional System",
    placeholderSlot: "Deployed for municipal intra-office operations in Bohol.",
  },
  {
    id: "salryn-bms",
    number: "02",
    category: "Flagship Business Product",
    title: "Salryn — The Business Kernel",
    subtitle: "One reliable business management core tailored for cafes, retail, hardware, and more.",
    summary:
      "Co-designed by our systems engineers and accountant co-founders, Salryn combines POS checkout, real-time inventory, supplier purchasing, and automatic accounting in one clean system—configured specifically for your type of business.",
    architectureHighlights: [
      "Automatic double-entry accounting behind every sale",
      "Industry-tailored flavors (Cafe, Gen Merch, Hardware, Pharmacy)",
      "Multi-branch stock & sales consolidation",
      "Clear shift closeouts & daily profit summaries",
    ],
    recognitions: ["Powering Cafe, Retail, General Merchandise & Enterprise Operations"],
    statusBadge: "Flagship Product",
    placeholderSlot: "Available in industry-ready setups or custom enterprise builds.",
  },
  {
    id: "scoryn-tabulation",
    number: "03",
    category: "Live Event & Competition Software",
    title: "Scoryn — Automated Tabulation",
    subtitle: "Instant, error-free live judging and score tabulation for pageants and events.",
    summary:
      "During live events, manual calculator tallying and spreadsheet formulas cause costly delays and human error. Scoryn connects every judge's screen to a central scoring engine—calculating weighted scores, round lockouts, and final winners instantaneously.",
    architectureHighlights: [
      "Real-time score syncing from every judge's terminal",
      "Automatic weighted criteria & tie-break computation",
      "Locked rounds and print-ready official audit sheets",
      "Works reliably even on local venue networks",
    ],
    recognitions: [
      "Official Tabulation — Miss Poblacion Occidental (Miss Pob Oc)",
      "Official Tabulation — Mister Valencia",
      "Official Tabulation — Miss Lila",
    ],
    statusBadge: "Event-Proven Platform",
    placeholderSlot: "Available for municipal pageants, school competitions, and regional events.",
  },
];

export const processSteps = [
  {
    number: "01",
    code: "Step 1 · Understand",
    title: "Listen & Map the Real Workflow",
    detail:
      "We sit down with the people who actually do the work—cashiers, accountants, managers, or office staff—to understand what slows you down before we write a single line of code.",
    question: "How does your team work today, and where do errors or delays happen?",
  },
  {
    number: "02",
    code: "Step 2 · Blueprint",
    title: "Define the Rules & Numbers",
    detail:
      "Our engineers and accountants map out your exact business rules, staff permissions, and financial calculations so nothing is left to guesswork.",
    question: "Which numbers, approvals, and records must stay 100% accurate?",
  },
  {
    number: "03",
    code: "Step 3 · Build",
    title: "Engineer the System & Interface",
    detail:
      "We build a rock-solid backend database alongside a clean, easy-to-learn screen that your team can use confidently without weeks of complicated training.",
    question: "Is it fast, reliable, and simple for your staff to use every day?",
  },
  {
    number: "04",
    code: "Step 4 · Verify",
    title: "Test Against Real Scenarios",
    detail:
      "Before launch, we test the system against real daily transactions, edge cases, and permission checks to make sure it performs smoothly under pressure.",
    question: "Does every report, receipt, and workflow match your expectations?",
  },
  {
    number: "05",
    code: "Step 5 · Launch & Support",
    title: "Deploy, Host & Stand By Your Team",
    detail:
      "We handle cloud setup, web hosting, backups, and staff onboarding—and remain available as your technical partner as your organization grows.",
    question: "Who keeps your system fast, secure, and updated after launch? We do.",
  },
];
