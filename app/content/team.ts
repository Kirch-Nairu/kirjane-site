export interface TeamMember {
  id: string;
  index: string;
  name: string;
  role: string;
  secondaryRole?: string;
  discipline: string;
  isFounder?: boolean;
  summaryPlaceholder: string;
  quote: string;
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
      "Architects the core backend engines, security boundaries, and database kernels behind Salryn, Scoryn, and our custom enterprise platforms. Ensures every system we ship is fast, secure, and built to last.",
    quote: "Software only matters if the foundation underneath it never compromises.",
    avatarCode: "KR",
    accentTone: "#95C159",
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
      "Brings professional accounting rigor to Kirjane's executive direction. Ensures that every business management system we build handles ledgers, cash flow, and financial reporting with real-world accuracy.",
    quote: "Technology should give business owners clarity over their numbers, not more guesswork.",
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
      "Works directly with business owners and institutions to translate daily operational bottlenecks and accounting requirements into practical software solutions.",
    quote: "Every business has its own rhythm—our job is to build around how your people actually work.",
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
      "Leads developer operations and delivery workflows across Kirjane Labs—keeping engineering teams coordinated, code quality high, and client rollouts smooth.",
    quote: "Reliable delivery comes from disciplined workflows and clear accountability.",
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
      "Manages automated build pipelines, server reliability, and web hosting infrastructure so client websites and enterprise platforms stay fast and online 24/7.",
    quote: "Every release should be tested, repeatable, and ready for production traffic.",
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
      "Shapes how Kirjane Labs communicates with businesses and communities—translating complex technical milestones into clear, engaging stories.",
    quote: "Great engineering deserves clear, human storytelling.",
    avatarCode: "JS",
    accentTone: "#95C159",
  },
  {
    id: "ace",
    index: "07",
    name: "Ace",
    role: "Market Research Specialist",
    discipline: "Industry Discovery · User Research · Product Fit",
    summaryPlaceholder:
      "Studies local and regional industries—from cafes and retail stores to municipal offices—so our Salryn flavors and custom tools solve the right problems.",
    quote: "The best features come from listening closely to the people on the ground.",
    avatarCode: "AC",
    accentTone: "#75B95B",
  },
];
