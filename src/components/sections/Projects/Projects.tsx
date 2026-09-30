import { ArrowUpRight, ExternalLink, Star } from "lucide-react";

import { Reveal } from "@/components/motion/Reveal";
import { TiltCard } from "@/components/motion/TiltCard";
import { GitHubIcon } from "@/components/ui/BrandIcons";
import { Section } from "@/components/ui/Section";
import { SectionHeader } from "@/components/ui/SectionHeader";
import { sectionNumber } from "@/data/navigation";
import { profile, projects, type Project } from "@/data/portfolio";
import type { Repository } from "@/lib/github";

import { ProjectArt } from "./ProjectArt";
import styles from "./Projects.module.css";

interface ProjectsProps {
  recentRepos: Repository[];
}

const dateFormatter = new Intl.DateTimeFormat("en", { month: "short", year: "numeric" });

export function Projects({ recentRepos }: ProjectsProps) {
  return (
    <Section id="projects" labelledBy="projects-title">
      <SectionHeader
        index={sectionNumber("projects")}
        eyebrow="Selected projects"
        title="Work that"
        accent="speaks."
        caption="Real products, built end to end."
        titleId="projects-title"
      />

      <ul className={styles.grid}>
        {projects.map((project, index) => (
          <Reveal as="li" key={project.title} delay={(index % 2) * 0.12} className={styles.item}>
            <ProjectCard project={project} index={index} />
          </Reveal>
        ))}
      </ul>

      {recentRepos.length > 0 && <RecentRepos repos={recentRepos} />}
    </Section>
  );
}

function ProjectCard({ project, index }: { project: Project; index: number }) {
  return (
    <TiltCard className={styles.card}>
      <ProjectArt variant={project.art} />
      <div className={styles.info}>
        <p className={styles.meta}>
          <span>
            {String(index + 1).padStart(2, "0")} / {project.category}
          </span>
        </p>
        <h3>{project.title}</h3>
        <p className={styles.description}>{project.description}</p>
        <div className={styles.footer}>
          <ul className={styles.tags} aria-label="Technologies used">
            {project.tags.map((tag) => (
              <li key={tag}>{tag}</li>
            ))}
          </ul>
          <div className={styles.links}>
            {project.liveUrl && (
              <a
                href={project.liveUrl}
                target="_blank"
                rel="noopener noreferrer"
                aria-label={`Open ${project.title} live site`}
              >
                <ExternalLink size={17} aria-hidden="true" />
              </a>
            )}
            <a
              href={project.repo}
              target="_blank"
              rel="noopener noreferrer"
              aria-label={`View ${project.title} source on GitHub`}
            >
              <GitHubIcon size={17} />
            </a>
          </div>
        </div>
      </div>
    </TiltCard>
  );
}

function RecentRepos({ repos }: { repos: Repository[] }) {
  return (
    <div className={styles.recent}>
      <Reveal className={styles.recentHeader} distance={16}>
        <h3>Latest on GitHub</h3>
        <a
          href={`https://github.com/${profile.githubUsername}`}
          target="_blank"
          rel="noopener noreferrer"
        >
          @{profile.githubUsername} <ArrowUpRight size={14} aria-hidden="true" />
        </a>
      </Reveal>
      <ul className={styles.repoList}>
        {repos.map((repo, index) => (
          <Reveal as="li" key={repo.name} delay={index * 0.05} distance={20}>
            <a href={repo.url} target="_blank" rel="noopener noreferrer" className={styles.repo}>
              <span className={styles.repoName}>{repo.name}</span>
              <span className={styles.repoDescription}>
                {repo.description ?? "No description yet."}
              </span>
              <span className={styles.repoMeta}>
                {repo.language && <span>{repo.language}</span>}
                {repo.stars > 0 && (
                  <span>
                    <Star size={12} aria-hidden="true" /> {repo.stars}
                  </span>
                )}
                <time dateTime={repo.pushedAt}>
                  {dateFormatter.format(new Date(repo.pushedAt))}
                </time>
              </span>
              <ArrowUpRight className={styles.repoArrow} size={18} aria-hidden="true" />
            </a>
          </Reveal>
        ))}
      </ul>
    </div>
  );
}
