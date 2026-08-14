export interface UserStats {
  name: string;
  totalCommits: number;
  totalStars: number;
  publicRepos: number;
  followers: number;
  cgpa: number;
  topRepos: { name: string; stars: number; forks: number }[];
  languages: { [key: string]: number };
}

export async function fetchGitHubStats(): Promise<UserStats> {
  return {
    name: "KAMANNAGARI BHAVITHAGNA",
    totalCommits: 825,
    totalStars: 42,
    publicRepos: 18,
    followers: 1,
    cgpa: 8.22,
    topRepos: [
      { name: "Hope-Travel", stars: 12, forks: 4 },
      { name: "Agri-Intel", stars: 8, forks: 2 },
      { name: "Portfolio", stars: 6, forks: 1 },
      { name: "ML-Models", stars: 5, forks: 1 },
      { name: "React-Projects", stars: 4, forks: 0 },
      { name: "Data-Science", stars: 2, forks: 0 }
    ],
    languages: {
      "Python": 1,
      "TypeScript": 1,
      "JavaScript": 1,
      "HTML": 1,
      "CSS": 1
    }
  };
}
