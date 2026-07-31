import { Container } from "@/components/shared/container";

export interface LegalSection {
  heading: string;
  /** Each string renders as its own paragraph; an array of strings renders as
   * a bulleted list within the section. */
  body: (string | string[])[];
}

/**
 * LegalDocument — the shared reading layout for Privacy and Terms. A single
 * typographic treatment (measure-constrained column, consistent heading/list
 * rhythm) so the two legal pages read as one document family instead of each
 * hand-rolling its own prose styles.
 */
export function LegalDocument({
  title,
  updated,
  intro,
  sections,
}: {
  title: string;
  updated: string;
  intro: string;
  sections: LegalSection[];
}) {
  return (
    <Container width="narrow" className="py-24 md:py-32">
      <h1 className="text-3xl font-semibold tracking-tight md:text-4xl">
        {title}
      </h1>
      <p className="mt-3 text-sm text-muted-foreground">
        Last updated {updated}
      </p>
      <p className="mt-8 text-pretty text-muted-foreground">{intro}</p>

      <div className="mt-4 flex flex-col divide-y divide-border">
        {sections.map((section) => (
          <section key={section.heading} className="py-8">
            <h2 className="text-xl font-semibold tracking-tight">
              {section.heading}
            </h2>
            <div className="mt-3 flex flex-col gap-3">
              {section.body.map((block, i) =>
                Array.isArray(block) ? (
                  <ul
                    key={i}
                    className="flex flex-col gap-2 text-pretty text-muted-foreground"
                  >
                    {block.map((item) => (
                      <li key={item} className="flex gap-2.5">
                        <span aria-hidden className="text-primary">
                          &middot;
                        </span>
                        {item}
                      </li>
                    ))}
                  </ul>
                ) : (
                  <p key={i} className="text-pretty text-muted-foreground">
                    {block}
                  </p>
                ),
              )}
            </div>
          </section>
        ))}
      </div>
    </Container>
  );
}
