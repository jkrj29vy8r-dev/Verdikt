import type { Metadata } from "next";
import Link from "next/link";
import { Github, Mail, Twitter } from "lucide-react";
import type { LucideIcon } from "lucide-react";

import { siteConfig } from "@/config/site";
import { Section, SectionHeading } from "@/components/shared/section";
import { Spotlight } from "@/components/shared/spotlight";
import { Card, CardContent } from "@/components/ui/card";
import { Reveal, Stagger, StaggerItem } from "@/components/motion";
import { blurIn, scaleIn } from "@/lib/motion";

export const metadata: Metadata = {
  title: "Contact",
  description: "Get in touch with the Verdikt team.",
};

interface Channel {
  icon: LucideIcon;
  label: string;
  value: string;
  href: string;
  /** Social profiles open in a new tab; `mailto:` never does. */
  external?: boolean;
}

const CHANNELS: Channel[] = [
  {
    icon: Mail,
    label: "Email",
    value: "hello@verdikt.app",
    href: "mailto:hello@verdikt.app",
  },
  {
    icon: Twitter,
    label: "X",
    value: "@verdikt",
    href: siteConfig.links.twitter,
    external: true,
  },
  {
    icon: Github,
    label: "GitHub",
    value: "verdikt",
    href: siteConfig.links.github,
    external: true,
  },
];

/**
 * Contact — no fake form posting nowhere; three direct channels instead. A
 * request routed through `mailto:` or a real social profile is honest about
 * what happens when you click it, which a decorative form backed by no
 * endpoint is not.
 */
export default function ContactPage() {
  return (
    <Section container="narrow" className="pt-32 md:pt-40">
      <Reveal variants={blurIn} className="text-center">
        <SectionHeading
          eyebrow="Contact"
          title="Talk to us."
          description="Questions about a verdict, a partnership, or the product — pick whichever channel you'd actually use."
          align="center"
          className="mx-auto"
        />
      </Reveal>

      <Stagger className="mt-16 grid gap-5 sm:grid-cols-3">
        {CHANNELS.map((channel) => (
          <StaggerItem key={channel.label} variants={scaleIn}>
            <Card className="group hover-lift h-full">
              <Spotlight contentClassName="h-full">
                <CardContent className="flex h-full flex-col items-center gap-3 py-10 text-center">
                  <div className="grid size-11 place-items-center rounded-lg bg-primary/10 text-primary transition-transform duration-300 ease-out group-hover:scale-110 group-hover:-rotate-3">
                    <channel.icon className="size-5" />
                  </div>
                  <div>
                    <p className="text-sm font-medium">{channel.label}</p>
                    <Link
                      href={channel.href}
                      target={channel.external ? "_blank" : undefined}
                      rel={channel.external ? "noopener noreferrer" : undefined}
                      className="link-underline text-sm text-muted-foreground transition-colors hover:text-foreground"
                    >
                      {channel.value}
                    </Link>
                  </div>
                </CardContent>
              </Spotlight>
            </Card>
          </StaggerItem>
        ))}
      </Stagger>
    </Section>
  );
}
