import type { Metadata } from "next";
import { LegalDocShell } from "@/components/LegalDocShell";
import {
  opcAgreementSections,
  opcAgreementTitle,
} from "@/content/opc-agreement";

export const metadata: Metadata = {
  title: `${opcAgreementTitle} - 百万职场`,
  description: opcAgreementTitle,
};

export default function OpcAgreementPage() {
  return (
    <LegalDocShell title={opcAgreementTitle} updatedAt="2026年9月">
      {opcAgreementSections.map((section) => (
        <section key={section.title}>
          <h2 className="mb-2 text-base font-semibold text-[var(--color-text)]">
            {section.title}
          </h2>
          <div className="space-y-2">
            {section.paragraphs.map((paragraph, index) => (
              <p key={`${section.title}-${index}`}>{paragraph}</p>
            ))}
          </div>
        </section>
      ))}
    </LegalDocShell>
  );
}
