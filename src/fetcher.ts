export interface UserStats {
  name: string;
  totalCommits: number;
  totalStars: number;
  publicRepos: number;
  followers: number;
  cgpa: number;
}

export async function fetchGitHubStats(): Promise<UserStats> {
  // Mock data representing the classified user file
  return {
    name: "KAMANNAGARI BHAVITHAGNA",
    totalCommits: 825,
    totalStars: 42,
    publicRepos: 18,
    followers: 1,
    cgpa: 8.22
  };
}
