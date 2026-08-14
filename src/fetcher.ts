import axios from 'axios';
import * as dotenv from 'dotenv';

dotenv.config();

const GITHUB_TOKEN = process.env.GITHUB_TOKEN;
const USERNAME = 'KAMANNAGARIBHAVITHAGNA';

const axiosInstance = axios.create({
  baseURL: 'https://api.github.com',
  headers: {
    Authorization: GITHUB_TOKEN ? `Bearer ${GITHUB_TOKEN}` : '',
    Accept: 'application/vnd.github.v3+json',
  },
});

export interface UserStats {
  name: string;
  followers: number;
  publicRepos: number;
  totalStars: number;
  totalCommits: number; // Note: Real commits require GraphQL, mocking for this example if needed
}

export async function fetchGitHubStats(): Promise<UserStats> {
  try {
    // 1. Fetch User Data
    const userRes = await axiosInstance.get(`/users/${USERNAME}`);
    
    // 2. Fetch Repos to calculate stars
    // Using per_page=100 to get a good chunk of repos
    const reposRes = await axiosInstance.get(`/users/${USERNAME}/repos?per_page=100`);
    
    let totalStars = 0;
    reposRes.data.forEach((repo: any) => {
      totalStars += repo.stargazers_count;
    });

    // In a full implementation, we'd use GraphQL to get total contributions/commits accurately.
    // For this profile generator, we will synthesize a 'totalCommits' based on repos/activity if GraphQL isn't available.
    // Or we use a fixed retro-style score if the token is missing.
    
    return {
      name: userRes.data.name || USERNAME,
      followers: userRes.data.followers,
      publicRepos: userRes.data.public_repos,
      totalStars: totalStars,
      totalCommits: userRes.data.public_repos * 42, // Mocked for retro aesthetic if no GraphQL
    };
  } catch (error) {
    console.error('Error fetching GitHub stats:', error);
    // Return fallback stats so the generator doesn't break
    return {
      name: 'K. Bhavithagna',
      followers: 99,
      publicRepos: 15,
      totalStars: 42,
      totalCommits: 1337,
    };
  }
}
