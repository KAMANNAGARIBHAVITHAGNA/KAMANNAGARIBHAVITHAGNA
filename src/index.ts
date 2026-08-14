import { fetchGitHubStats } from './fetcher';
import { 
  generateSkyScene, 
  generateHillsScene, 
  generateUndergroundScene, 
  generateDungeonScene, 
  writeSvg 
} from './generator';

async function main() {
  console.log('Fetching GitHub Stats...');
  const stats = await fetchGitHubStats();
  
  console.log('Generating Vibrant 2D Vector Scenes...');
  writeSvg('sky-launch.svg', generateSkyScene(stats));
  writeSvg('rolling-hills.svg', generateHillsScene());
  writeSvg('underground-arsenal.svg', generateUndergroundScene());
  writeSvg('dungeon-boss.svg', generateDungeonScene());
  
  console.log('Successfully generated the vibrant Angry Dev profile assets!');
}

main().catch(console.error);
