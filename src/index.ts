import { fetchGitHubStats } from './fetcher';
import {
  generateHeroBanner,
  generateProjectWorlds,
  generatePowerups,
  generateWorldMap,
  generateBossBattle,
  generateAchievements,
  writeSvg
} from './generator';

async function main() {
  console.log('Fetching GitHub Stats...');
  const stats = await fetchGitHubStats();
  
  console.log('Generating Hero Banner...');
  writeSvg('hero-banner.svg', generateHeroBanner(stats));
  
  console.log('Generating Project Worlds...');
  writeSvg('project-worlds.svg', generateProjectWorlds());
  
  console.log('Generating Powerups...');
  writeSvg('powerups.svg', generatePowerups());
  
  console.log('Generating World Map...');
  writeSvg('world-map.svg', generateWorldMap());
  
  console.log('Generating Boss Battle...');
  writeSvg('boss-battle.svg', generateBossBattle());
  
  console.log('Generating Achievements...');
  writeSvg('achievement-board.svg', generateAchievements());
  
  console.log('Successfully generated all immersive dynamic profile assets!');
}

main().catch(console.error);
