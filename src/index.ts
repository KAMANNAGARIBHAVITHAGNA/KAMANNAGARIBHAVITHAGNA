import { fetchGitHubStats } from './fetcher';
import { generateContinuousWorld, writeSvg } from './generator';

async function main() {
  console.log('Fetching GitHub Stats...');
  const stats = await fetchGitHubStats();
  
  console.log('Generating Continuous Game World...');
  writeSvg('angry-dev-world.svg', generateContinuousWorld(stats));
  
  console.log('Successfully generated the massive continuous world profile asset!');
}

main().catch(console.error);
