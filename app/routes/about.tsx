import { useState } from "react";
import { Link } from "react-router";
import { company } from "../content/company";
import { teamMembers } from "../content/team";
import { BrandMark } from "../components/base/BrandMark";
import styles from "./about.module.css";

export function meta() {
  return [
    {
      title: "About the Team & Leadership — Kirjane Labs",
    },
    {
      name: "description",
      content:
        "Meet the engineers, certified accountants, DevOps specialists, and researchers behind Kirjane Labs in Bohol, Philippines.",
    },
  ];
}

export default function About() {
  const [selectedMemberId, setSelectedMemberId] = useState(teamMembers[0].id);
  const selectedMember =
    teamMembers.find((m) => m.id === selectedMemberId) || teamMembers[0];

  return (
    <div className={styles.page}>
      {/* Editorial Header */}
      <header className={styles.header}>
        <div className={styles.container}>
          <span className={styles.kicker}>ORGANIZATIONAL PROFILE</span>
          <h1 className={styles.headline}>Where Systems Engineering Meets Financial Rigor</h1>
          <p className={styles.lead}>
            Kirjane Labs ({company.legalName}) is a software and infrastructure engineering firm
            based in Bohol, Philippines. We bridge the gap between technical software architecture
            and the exact accounting equations that govern enterprise survival.
          </p>

          <div className={styles.metaRow}>
            <div className={styles.metaBadge}>
              <span className={styles.badgeLabel}>HEADQUARTERS</span>
              <span className={styles.badgeValue}>{company.location}</span>
            </div>
            <div className={styles.metaBadge}>
              <span className={styles.badgeLabel}>ORGANIZATION</span>
              <span className={styles.badgeValue}>7 Core Engineering & Strategy Members</span>
            </div>
            <div className={styles.metaBadge}>
              <span className={styles.badgeLabel}>LEGAL ENTITY</span>
              <span className={styles.badgeValue}>{company.legalName}</span>
            </div>
          </div>
        </div>
      </header>

      {/* Founding Thesis */}
      <section className={styles.thesisSection}>
        <div className={styles.container}>
          <div className={styles.thesisGrid}>
            <div className={styles.thesisContent}>
              <span className={styles.thesisKicker}>FOUNDING CONTEXT</span>
              <h2 className={styles.thesisTitle}>The Rationale Behind Our Structure</h2>
              <div className={styles.thesisText}>
                <p>
                  Most enterprise software fails not from technical bugs, but from a fundamental
                  disconnect with how organizations actually manage money, stock, and personnel.
                  When developers build point-of-sale or inventory tools without deep accounting
                  domain knowledge, bookkeeping drift and reconciliation nightmares inevitably follow.
                </p>
                <p>
                  Kirjane was intentionally co-founded by software systems architects alongside
                  certified accountants. Every data model we draft, every transaction ledger we
                  commit, and every role permission we enforce is verified against standard double-entry
                  principles from the very first sprint.
                </p>
              </div>
            </div>

            <div className={styles.emblemCard}>
              <BrandMark variant="green" size={96} className={styles.cardEmblem} />
              <div className={styles.emblemDetails}>
                <span className={styles.motto}>{company.motto}</span>
                <span className={styles.mottoDesc}>
                  Adaptive precision: engineering systems that naturally fit real human operations.
                </span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 7-Member Team Gallery Stage */}
      <section className={styles.teamSection} aria-label="Team Members Gallery">
        <div className={styles.container}>
          <div className={styles.sectionHeader}>
            <span className={styles.teamKicker}>PERSONNEL & DISCIPLINES</span>
            <h2 className={styles.teamTitle}>The Seven Members of Kirjane Labs</h2>
            <p className={styles.teamLead}>
              Select any member below to review their specific responsibilities, technical
              disciplines, and engineering focus.
            </p>
          </div>

          {/* Desktop 50/50 Stage Layout */}
          <div className={styles.stageGrid}>
            {/* Left: Active Spotlight Showcase */}
            <div className={styles.spotlightCard}>
              <div className={styles.spotlightHeader}>
                <div
                  className={styles.spotlightAvatar}
                  style={{ borderColor: selectedMember.accentTone }}
                >
                  <span className={styles.spotlightInitials}>{selectedMember.avatarCode}</span>
                </div>
                <div>
                  <span className={styles.spotlightIndex}>
                    MEMBER {selectedMember.index} / 07
                  </span>
                  <h3 className={styles.spotlightName}>{selectedMember.name}</h3>
                  <span className={styles.spotlightRole}>{selectedMember.role}</span>
                </div>
              </div>

              <div className={styles.spotlightBody}>
                <div className={styles.infoGroup}>
                  <span className={styles.infoLabel}>TECHNICAL DISCIPLINES</span>
                  <p className={styles.infoText}>{selectedMember.discipline}</p>
                </div>

                <div className={styles.infoGroup}>
                  <span className={styles.infoLabel}>CORE RESPONSIBILITIES & FOCUS</span>
                  <p className={styles.infoText}>{selectedMember.summary}</p>
                </div>

                <div className={styles.verifiedNotice}>
                  <span className={styles.verifiedIcon} aria-hidden="true">✔</span>
                  <span>Verified Role: {selectedMember.verifiedTitle}</span>
                </div>
              </div>
            </div>

            {/* Right: Interactive Member Selector List */}
            <div className={styles.selectorList} role="tablist" aria-label="Team member selection">
              {teamMembers.map((member) => {
                const isSelected = member.id === selectedMemberId;
                return (
                  <button
                    key={member.id}
                    role="tab"
                    id={`team-tab-${member.id}`}
                    aria-selected={isSelected}
                    className={`${styles.selectorItem} ${isSelected ? styles.selectorItemActive : ""}`}
                    onClick={() => setSelectedMemberId(member.id)}
                  >
                    <span
                      className={styles.itemAvatar}
                      style={{ borderColor: member.accentTone }}
                    >
                      {member.avatarCode}
                    </span>
                    <div className={styles.itemInfo}>
                      <span className={styles.itemName}>{member.name}</span>
                      <span className={styles.itemRole}>{member.role}</span>
                    </div>
                    <span className={styles.itemIndex}>{member.index}</span>
                  </button>
                );
              })}
            </div>
          </div>
        </div>
      </section>

      {/* Direct Contact Close */}
      <section className={styles.contactBanner}>
        <div className={styles.container}>
          <div className={styles.bannerCard}>
            <div>
              <span className={styles.bannerKicker}>COLLABORATION</span>
              <h2 className={styles.bannerTitle}>Work directly with our founding engineering team.</h2>
              <p className={styles.bannerDesc}>
                We do not pass client requirements to outsourced third parties. Every line of code
                is authored and reviewed by our core roster in Bohol.
              </p>
            </div>
            <Link to="/contact" className={styles.bannerBtn}>
              <span>Get in Touch</span>
              <span aria-hidden="true">→</span>
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}
