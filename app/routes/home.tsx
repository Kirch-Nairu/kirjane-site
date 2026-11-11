import { HeroScene } from "../components/sections/home/HeroScene";
import { StatementOfPractice } from "../components/sections/home/StatementOfPractice";
import { CapabilityChapters } from "../components/sections/home/CapabilityChapters";
import { FeaturedWork } from "../components/sections/home/FeaturedWork";
import { ProcessPreview } from "../components/sections/home/ProcessPreview";
import { TeamPreview } from "../components/sections/home/TeamPreview";
import { ContactClose } from "../components/sections/home/ContactClose";

export function meta() {
  return [
    {
      title: "Kirjane Labs — Complex Work. Clear Systems. | Bohol, Philippines",
    },
    {
      name: "description",
      content:
        "Kirjane Labs (Kirjane IT Solutions) in Bohol, Philippines engineers custom business software, institutional platforms, backend systems, and infrastructure designed around how organizations actually operate.",
    },
  ];
}

export default function Home() {
  return (
    <>
      {/* Act 01: Signature Opening Stage (0-100svh adaptive) */}
      <HeroScene />

      {/* Act 02: Statement of Practice */}
      <StatementOfPractice />

      {/* Act 03: Capabilities in Three Chapters */}
      <CapabilityChapters />

      {/* Act 04: Selected Work & Evidence */}
      <FeaturedWork />

      {/* Act 05: Five-Stage Approach Preview */}
      <ProcessPreview />

      {/* Act 06: The People & Disciplines */}
      <TeamPreview />

      {/* Act 07: Project Consultation & Contact Close */}
      <ContactClose />
    </>
  );
}
