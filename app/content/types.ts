export type ApprovalState = "approved" | "needs-review" | "omit";

export type DeliveryState =
  | "demonstration"
  | "pilot"
  | "development"
  | "delivered"
  | "production";

export interface Evidence {
  sourceLabel: string;
  sourceUrl?: string;
  checkedAt?: string;
  approval: ApprovalState;
}

export interface MediaAsset {
  src: string;
  alt: string;
  credit?: string;
  publishApproved: boolean;
  width?: number;
  height?: number;
}

export interface ProjectCaseStudy {
  id: string;
  slug: "salryn" | "scoryn" | "talibon";
  number: string;
  category: string;
  title: string;
  subtitle: string;
  summary: string;
  problem: string;
  solution: string;
  outcome?: string;
  deliveryState: DeliveryState;
  statusBadge: string;
  architectureHighlights: string[];
  evidence: Evidence[];
  media?: MediaAsset[];
  demonstrationLabel?: string;
}

export interface ServiceArea {
  id: string;
  number: string;
  tag: string;
  title: string;
  headline: string;
  description: string;
  problemSolved: string;
  capabilities: string[];
  deliverables: string[];
  isCoreStrength?: boolean;
}

export interface TeamMember {
  id: string;
  index: string;
  name: string;
  role: string;
  secondaryRole?: string;
  discipline: string;
  isFounder?: boolean;
  summary: string;
  avatarCode: string;
  accentTone: string;
  verifiedTitle: string;
}

export interface ProcessStage {
  id: string;
  number: string;
  name: string;
  phase: string;
  title: string;
  detail: string;
  deliverable: string;
  whyItMatters: string;
  verificationCheck: string;
}

export interface CompanyInfo {
  brandName: string;
  legalName: string;
  motto: string;
  tagline: string;
  location: string;
  email: string;
  facebook: string;
  facebookUrl: string;
  logos: {
    chameleonColor: string;
    chameleonGreen: string;
    chameleonWhite: string;
    officialLogo: string;
    logoWhite: string;
    logoGreen: string;
    mark: string;
  };
  statementOfPractice: string;
  supportingLine: string;
}
