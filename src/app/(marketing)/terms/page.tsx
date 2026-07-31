import type { Metadata } from "next";

import { LegalDocument } from "@/components/marketing/legal-document";

export const metadata: Metadata = {
  title: "Terms of Service",
  description: "The terms that govern use of Verdikt.",
};

export default function TermsPage() {
  return (
    <LegalDocument
      title="Terms of Service"
      updated="July 31, 2026"
      intro="These terms govern your use of Verdikt. By creating an account or running a verdict, you agree to them."
      sections={[
        {
          heading: "The service",
          body: [
            "Verdikt decodes a vehicle identification number (VIN) and synthesizes available history, valuation, and risk data into a report, including AI-generated analysis and estimates.",
          ],
        },
        {
          heading: "Verdicts are advisory, not guarantees",
          body: [
            "A Verdikt report — including its score, repair predictions, price estimates, and Buy/Consider/Avoid call — is generated from third-party data sources and AI analysis. It is intended to inform your decision, not replace an independent inspection. We do not guarantee the completeness or accuracy of underlying source data, and we are not liable for decisions made based on a report.",
          ],
        },
        {
          heading: "Your account",
          body: [
            [
              "You're responsible for the activity that happens under your account and for keeping your credentials secure.",
              "You must be legally able to enter into these terms to create an account.",
              "We may suspend or terminate accounts used to abuse the service, including automated scraping or reselling reports.",
            ],
          ],
        },
        {
          heading: "Acceptable use",
          body: [
            "You agree not to use Verdikt to violate any law, to circumvent usage limits, to attempt to extract or reverse-engineer the underlying models or scoring logic, or to submit VINs you don't have a legitimate reason to look up.",
          ],
        },
        {
          heading: "Plans and billing",
          body: [
            "Paid plans renew automatically until canceled. You can cancel at any time from Settings; access continues through the end of the current billing period. Fees are non-refundable except where required by law.",
          ],
        },
        {
          heading: "Intellectual property",
          body: [
            "Verdikt and its scoring methodology are our property. The report generated for a specific VIN is yours to use for your own personal or business purpose — you may not resell raw report data as a competing data feed.",
          ],
        },
        {
          heading: "Limitation of liability",
          body: [
            "Verdikt is provided “as is.” To the maximum extent permitted by law, we are not liable for indirect, incidental, or consequential damages arising from use of the service, including decisions made based on a verdict.",
          ],
        },
        {
          heading: "Changes",
          body: [
            "We may update these terms as the product evolves. Material changes will be posted here with an updated date, and where required, communicated directly.",
          ],
        },
        {
          heading: "Contact",
          body: [
            "Questions about these terms can be sent to legal@verdikt.app.",
          ],
        },
      ]}
    />
  );
}
