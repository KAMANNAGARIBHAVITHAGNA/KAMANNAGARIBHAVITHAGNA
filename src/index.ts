import { fetchGitHubStats } from './fetcher';
import { generateHeroScene, generateTerminalScene, generatePartyScene, generatePortalScene, writeSvg } from './generator';
import { generateEvidenceScene, generateMapScene, generateBossScene, generateClockScene } from './generator2';
import { generateReposScene, generateRadarScene, generateArcadeScene, generateEscapeScene } from './generator3';

async function main() {
  console.log('Fetching Data (Classified)...');
  const stats = await fetchGitHubStats();
  
  console.log('Generating Upside Down Assets...');
  
  writeSvg('grid01-hero.svg', generateHeroScene(stats));
  writeSvg('grid02-terminal.svg', generateTerminalScene(stats));
  writeSvg('grid03-party.svg', generatePartyScene());
  writeSvg('grid04-portal.svg', generatePortalScene(stats));
  
  writeSvg('grid05-evidence.svg', generateEvidenceScene());
  writeSvg('grid06-map.svg', generateMapScene());
  writeSvg('grid07-boss.svg', generateBossScene());
  writeSvg('grid08-clock.svg', generateClockScene());
  
  writeSvg('grid09-repos.svg', generateReposScene());
  writeSvg('grid10-radar.svg', generateRadarScene());
  writeSvg('grid11-arcade.svg', generateArcadeScene());
  writeSvg('grid12-escape.svg', generateEscapeScene());

  console.log('Successfully generated the Stranger Things profile assets!');
}

main().catch(console.error);
