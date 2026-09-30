import { ArrowUpRight, Mail } from "lucide-react";

import { Reveal } from "@/components/motion/Reveal";
import { RevealText } from "@/components/motion/RevealText";
import { GitHubIcon, LinkedInIcon } from "@/components/ui/BrandIcons";
import { Section } from "@/components/ui/Section";
import { SectionEyebrow } from "@/components/ui/SectionHeader";
import { profile } from "@/data/portfolio";

import styles from "./Contact.module.css";
import { ContactForm } from "./ContactForm";

interface SocialLink {
  label: string;
  href: string;
  icon: React.ReactNode;
}

function getSocialLinks(): SocialLink[] {
  const links: SocialLink[] = [
    {
      label: "GitHub",
      href: `https://github.com/${profile.githubUsername}`,
      icon: <GitHubIcon size={16} />,
    },
  ];
  if (profile.linkedin) {
    links.push({ label: "LinkedIn", href: profile.linkedin, icon: <LinkedInIcon size={16} /> });
  }
  if (profile.email) {
    links.push({
      label: "Email",
      href: `mailto:${profile.email}`,
      icon: <Mail size={16} aria-hidden="true" />,
    });
  }
  return links;
}

export function Contact() {
  const socials = getSocialLinks();

  return (
    <Section id="contact-me" labelledBy="contact-title" className={styles.section}>
      <SectionEyebrow index={6} label="Contact me" />

      <div className={styles.grid}>
        <div>
          <RevealText
            id="contact-title"
            as="h2"
            className={styles.title}
            text="Let's build"
            accent="something."
          />
          <Reveal delay={0.2}>
            <p className={styles.lead}>
              Have a project, a role, or just an idea? I&apos;d love to hear about it. The best work
              starts with a conversation.
            </p>
            <ul className={styles.socials}>
              {socials.map((link) => (
                <li key={link.label}>
                  <a
                    href={link.href}
                    target={link.href.startsWith("mailto:") ? undefined : "_blank"}
                    rel="noopener noreferrer"
                  >
                    {link.icon}
                    {link.label}
                    <ArrowUpRight size={14} aria-hidden="true" />
                  </a>
                </li>
              ))}
            </ul>
          </Reveal>
        </div>

        <Reveal delay={0.15} className={styles.formPanel}>
          <div className={styles.formHeading}>
            <span>Have a project in mind?</span>
            <span>
              Let&apos;s talk <b aria-hidden="true">●</b>
            </span>
          </div>
          <ContactForm />
        </Reveal>
      </div>
    </Section>
  );
}
