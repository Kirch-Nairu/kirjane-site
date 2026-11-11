export interface TeamMember {
  id: string;
  index: string;
  name: string;
  role: string;
  secondaryRole?: string;
  discipline: string;
  isFounder?: boolean;
  summaryPlaceholder: string;
  focusHighlight: string;
  deliverables: [string, string, string];
  avatarCode: string;
  photoUrl?: string;
  accentTone: string;
}

export const teamMembers: TeamMember[] = [
  {
    id: "kirch",
    index: "01",
    name: "Kirch",
    role: "Founder, CTO & Head of Engineering",
    secondaryRole: "Kirjane Labs Tech Lead",
    discipline: "Backend Architecture · Security · Cloud Infrastructure · System Design",
    isFounder: true,
    summaryPlaceholder:
      "Architects the core backend engines, security boundaries, and database kernels behind Salryn, Scoryn, and custom institutional platforms.",
    focusHighlight:
      "Leads core systems architecture, database integrity, application security, and technical direction across Kirjane Labs.",
    deliverables: [
      "Core Backend & Database Kernels",
      "Security & Access Control Design",
      "Enterprise System Architecture",
    ],
    avatarCode: "KR",
    accentTone: "#92C056",
  },
  {
    id: "paul",
    index: "02",
    name: "Paul",
    role: "Co-Founder & Chief Executive Officer",
    secondaryRole: "Accountant",
    discipline: "Executive Strategy · Financial Governance · Accounting Systems",
    isFounder: true,
    summaryPlaceholder:
      "Combines executive leadership with accounting discipline so every business management system we build handles ledgers, cash flow, and reporting accurately.",
    focusHighlight:
      "Aligns software architecture with accounting standards, ledger rules, and long-term business governance.",
    deliverables: [
      "Accounting & Ledger Rules",
      "Executive Direction & Governance",
      "Financial Reporting Workflows",
    ],
    avatarCode: "PL",
    accentTone: "#7BC062",
  },
  {
    id: "james-karl",
    index: "03",
    name: "James Karl",
    role: "Co-Founder & Business Lead",
    secondaryRole: "Accountant",
    discipline: "Business Operations · Client Strategy · Financial Workflows",
    isFounder: true,
    summaryPlaceholder:
      "Works directly with business owners and institutions to translate daily operational bottlenecks and accounting requirements into practical software workflows.",
    focusHighlight:
      "Bridges client operations and financial controls so new systems fit how staff actually work at the counter and back office.",
    deliverables: [
      "Operational Workflow Mapping",
      "Client Onboarding & Strategy",
      "Internal Financial Controls",
    ],
    avatarCode: "JK",
    accentTone: "#5AA854",
  },
  {
    id: "siris",
    index: "04",
    name: "Siris",
    role: "Co-Founder & Developer Operations Lead",
    secondaryRole: "Co-Founder",
    discipline: "Developer Operations · Engineering Delivery · System Reliability",
    isFounder: true,
    summaryPlaceholder:
      "Leads developer operations and engineering coordination across Kirjane Labs—keeping code quality consistent, environments reproducible, and project delivery structured.",
    focusHighlight:
      "Oversees developer workflows, release readiness, and operational coordination from staging through deployment.",
    deliverables: [
      "Developer Operations & Tooling",
      "Release Coordination & QA",
      "Environment Standardization",
    ],
    avatarCode: "SR",
    accentTone: "#86C25E",
  },
  {
    id: "kurt",
    index: "05",
    name: "Kurt",
    role: "CI/CD & DevOps Engineer",
    discipline: "Automated Deployments · Cloud Hosting · Build & Release Pipelines",
    summaryPlaceholder:
      "Manages automated build pipelines, server provisioning, and web hosting infrastructure so client websites and business applications deploy cleanly and stay responsive.",
    focusHighlight:
      "Engineers repeatable CI/CD pipelines, container deployments, and managed cloud hosting environments.",
    deliverables: [
      "Automated CI/CD Pipelines",
      "Cloud Server Provisioning",
      "Managed Web & App Hosting",
    ],
    avatarCode: "KT",
    accentTone: "#68B458",
  },
  {
    id: "jesse",
    index: "06",
    name: "Jesse",
    role: "Social Media Manager",
    discipline: "Brand Presence · Digital Storytelling · Community & Client Reach",
    summaryPlaceholder:
      "Shapes how Kirjane Labs communicates with businesses and local communities—translating software launches and event partnerships into clear, accessible stories.",
    focusHighlight:
      "Directs public brand communication, product launch announcements, and community engagement across digital channels.",
    deliverables: [
      "Brand & Product Communication",
      "Digital Campaign Management",
      "Event & Partner Highlights",
    ],
    avatarCode: "JS",
    accentTone: "#92C056",
  },
  {
    id: "ace",
    index: "07",
    name: "Ace",
    role: "Market Research Specialist",
    discipline: "Industry Discovery · User Research · Product Fit",
    summaryPlaceholder:
      "Studies local and regional industries—from cafes and retail stores to municipal offices—so Salryn industry setups and custom tools solve real day-to-day problems.",
    focusHighlight:
      "Conducts field discovery and industry analysis to ground every Salryn flavor and custom build in real operational needs.",
    deliverables: [
      "Industry & Sector Discovery",
      "Frontline User Workflow Studies",
      "Salryn Flavor Requirements",
    ],
    avatarCode: "AC",
    accentTone: "#75B95B",
  },
];
