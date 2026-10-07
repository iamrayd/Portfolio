import { CursorGlow } from "@/components/effects/CursorGlow";
import { ScrollProgress } from "@/components/effects/ScrollProgress";
import { Footer } from "@/components/layout/Footer/Footer";
import { Header } from "@/components/layout/Header/Header";
import { ScrollBand } from "@/components/motion/ScrollBand";
import { MotionProviders } from "@/components/providers/MotionProviders";
import { Contact } from "@/components/sections/Contact/Contact";
import { Experiences } from "@/components/sections/Experiences/Experiences";
import { Hero } from "@/components/sections/Hero/Hero";
import { Hobbies } from "@/components/sections/Hobbies/Hobbies";
import { Projects } from "@/components/sections/Projects/Projects";
import { Testimonials } from "@/components/sections/Testimonials/Testimonials";
import { Toolkit } from "@/components/sections/Toolkit/Toolkit";
import { WhyHireMe } from "@/components/sections/WhyHireMe/WhyHireMe";
import { isSectionEnabled } from "@/data/navigation";
import { profile } from "@/data/portfolio";
import { getGitHubSummary } from "@/lib/github";

// Rebuild the page at most once an hour so GitHub stats stay fresh.
export const revalidate = 3600;

export default async function HomePage() {
  const github = await getGitHubSummary();

  return (
    <MotionProviders>
      <a className="skip-link" href="#main">
        Skip to content
      </a>
      <ScrollProgress />
      <CursorGlow />
      <div className="grain" aria-hidden="true" />

      <Header />
      <main id="main">
        <Hero year={new Date().getFullYear()} />
        <ScrollBand words={profile.focus} />
        <Experiences />
        <Projects recentRepos={github.recentRepos} />
        <Toolkit publicRepos={github.publicRepos} />
        {isSectionEnabled("testimonies") && <Testimonials />}
        <WhyHireMe />
        {isSectionEnabled("hobbies") && <Hobbies />}
        <Contact />
      </main>
      <Footer />
    </MotionProviders>
  );
}
