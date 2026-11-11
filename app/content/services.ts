export interface ServiceArea {
  number: string;
  tag: string;
  title: string;
  description: string;
  question: string;
  focus: string[];
  isCoreStrength?: boolean;
}

export const services: ServiceArea[] = [
  {
    number: "01",
    tag: "Core Strength · Backend & Databases",
    title: "Backend Architecture & Enterprise Systems",
    description:
      "Great software starts underneath the screen. Because our founding team combines systems engineers and accountants, we build backend databases, APIs, and financial logic that stay accurate and fast as your business grows.",
    question: "How do we keep your records, transactions, and daily operations accurate at all times?",
    focus: [
      "Reliable APIs & database design",
      "Accounting-ready transaction records",
      "Multi-branch & office synchronization",
      "High-load performance & stability",
    ],
    isCoreStrength: true,
  },
  {
    number: "02",
    tag: "Core Strength · Security & Control",
    title: "Application Security & Staff Permissions",
    description:
      "Not everyone in an organization should see or edit the same data. We build clear role-based permissions, activity logs, and secure access rules directly into your system.",
    question: "Who can view, approve, or change sensitive records—and how is it tracked?",
    focus: [
      "Role-based staff & manager permissions",
      "Clear activity & approval audit logs",
      "Protected login & session security",
      "Safe data backup & recovery",
    ],
    isCoreStrength: true,
  },
  {
    number: "03",
    tag: "Core Strength · Cloud & Web Hosting",
    title: "Cloud Operations & Managed Web Hosting",
    description:
      "You shouldn't have to worry about servers going down or updates breaking your site. We handle cloud setup, automated deployments, security updates, and fast web hosting for your business.",
    question: "How do we keep your website and business applications online, fast, and backed up?",
    focus: [
      "Managed web & application hosting",
      "Automated updates & release checks",
      "Cloud server setup & monitoring",
      "Scheduled backups & uptime care",
    ],
    isCoreStrength: true,
  },
  {
    number: "04",
    tag: "Custom Build · Web & Internal Tools",
    title: "Tailored Systems & Custom Websites",
    description:
      "When off-the-shelf software doesn't fit how your team works, we design and build custom internal systems, municipal platforms, and modern websites tailored to your exact workflow.",
    question: "What everyday tasks can we simplify for your staff and customers?",
    focus: [
      "Custom internal & intra-office platforms",
      "Modern company & product websites",
      "Paper-to-digital workflow automation",
      "Mobile-friendly web applications",
    ],
  },
];
