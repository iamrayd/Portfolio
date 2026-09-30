import { CursorGlow } from "@/components/effects/CursorGlow";
import { FallingWords } from "@/components/effects/FallingWords/FallingWords";
import { ScrollProgress } from "@/components/effects/ScrollProgress";
import { Footer } from "@/components/layout/Footer/Footer";
import { Header } from "@/components/layout/Header/Header";
import { ScrollBand } from "@/components/motion/ScrollBand";
import { MotionProviders } from "@/components/providers/MotionProviders";
import { About } from "@/components/sections/About/About";
import { Contact } from "@/components/sections/Contact/Contact";
import { Experiences } from "@/components/sections/Experiences/Experiences";
import { Hero } from "@/components/sections/Hero/Hero";
import { Projects } from "@/components/sections/Projects/Projects";
import { Testimonials } from "@/components/sections/Testimonials/Testimonials";
import { WhyHireMe } from "@/components/sections/WhyHireMe/WhyHireMe";
import { isSectionEnabled } from "@/data/navigation";
import { allTechnologies, profile } from "@/data/portfolio";
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
      <FallingWords words={allTechnologies} />
      <CursorGlow />
      <div className="grain" aria-hidden="true" />

      <Header />
      <main id="main">
        <Hero year={new Date().getFullYear()} />
        <WhyHireMe />
        <About publicRepos={github.publicRepos} />
        <ScrollBand words={profile.focus} />
        <Experiences />
        <Projects recentRepos={github.recentRepos} />
        {isSectionEnabled("testimonies") && <Testimonials />}
        <Contact />
      </main>
      <Footer />
    </MotionProviders>
  );
}
