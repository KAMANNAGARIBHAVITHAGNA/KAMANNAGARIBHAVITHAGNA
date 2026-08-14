import { fetchGitHubStats } from './fetcher';
import { 
  generateHeroScene, 
  generateHudScene, 
  generateCampaignScene, 
  generateArsenalScene, 
  generateBossScene, 
  generateAchievementsScene, 
  writeSvg 
} from './generator';

async function main() {
  console.log('Fetching GitHub Stats...');
  const stats = await fetchGitHubStats();
  
  console.log('Generating Premium UI Scenes...');
  writeSvg('hero.svg', generateHeroScene());
  writeSvg('hud.svg', generateHudScene(stats));
  writeSvg('campaign.svg', generateCampaignScene());
  writeSvg('arsenal.svg', generateArsenalScene());
  writeSvg('boss.svg', generateBossScene());
  writeSvg('achievements.svg', generateAchievementsScene());
  
  console.log('Successfully generated the premium AAA profile assets!');
}

main().catch(console.error);
