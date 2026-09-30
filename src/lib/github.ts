import "server-only";

import { featuredRepoNames, profile } from "@/data/portfolio";

const API_URL = "https://api.github.com";
const REVALIDATE_SECONDS = 60 * 60;

export interface Repository {
  name: string;
  description: string | null;
  url: string;
  language: string | null;
  stars: number;
  pushedAt: string;
}

export interface GitHubSummary {
  publicRepos: number | null;
  recentRepos: Repository[];
}

interface ApiUser {
  public_repos: number;
}

interface ApiRepository {
  name: string;
  description: string | null;
  html_url: string;
  language: string | null;
  stargazers_count: number;
  pushed_at: string;
  fork: boolean;
  archived: boolean;
}

async function fetchGitHub<T>(path: string): Promise<T | null> {
  const headers: HeadersInit = {
    Accept: "application/vnd.github+json",
    "X-GitHub-Api-Version": "2022-11-28",
  };
  // Optional: raises the rate limit from 60 to 5,000 requests per hour.
  if (process.env.GITHUB_TOKEN) headers.Authorization = `Bearer ${process.env.GITHUB_TOKEN}`;

  try {
    const response = await fetch(`${API_URL}${path}`, {
      headers,
      next: { revalidate: REVALIDATE_SECONDS },
    });
    if (!response.ok) {
      console.error(`GitHub API ${path} responded with ${response.status}`);
      return null;
    }
    return (await response.json()) as T;
  } catch (error) {
    console.error(`GitHub API ${path} request failed`, error);
    return null;
  }
}

/** Live GitHub stats and latest non-featured repositories. Never throws; falls back to empty data. */
export async function getGitHubSummary(limit = 6): Promise<GitHubSummary> {
  const username = profile.githubUsername;
  const [user, repos] = await Promise.all([
    fetchGitHub<ApiUser>(`/users/${username}`),
    fetchGitHub<ApiRepository[]>(`/users/${username}/repos?sort=pushed&per_page=100`),
  ]);

  const excluded = new Set(featuredRepoNames.map((name) => name.toLowerCase()));
  const recentRepos = (repos ?? [])
    .filter((repo) => !repo.fork && !repo.archived && !excluded.has(repo.name.toLowerCase()))
    .slice(0, limit)
    .map((repo): Repository => ({
      name: repo.name,
      description: repo.description,
      url: repo.html_url,
      language: repo.language,
      stars: repo.stargazers_count,
      pushedAt: repo.pushed_at,
    }));

  return { publicRepos: user?.public_repos ?? null, recentRepos };
}
