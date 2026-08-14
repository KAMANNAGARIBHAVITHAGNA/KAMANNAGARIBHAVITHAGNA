import { fetchGitHubStats } from './fetcher';
import { 
  generateGrid1, 
  generateGrid2, 
  generateGrid3, 
  generateGrid4, 
  generateGrid8, 
  writeSvg 
} from './generator';

async function main() {
  console.log('Fetching Data (Classified)...');
  const stats = await fetchGitHubStats();
  
  console.log('Generating Authentic Pixel Art Assets...');
  
  writeSvg('grid01-hero.svg', generateGrid1(stats));
  writeSvg('grid02-commits.svg', generateGrid2(stats));
  writeSvg('grid03-repos1.svg', generateGrid3(stats));
  writeSvg('grid04-repos2.svg', generateGrid4(stats));
  writeSvg('grid08-contact.svg', generateGrid8());

  console.log('Successfully embedded original images and generated SVGs!');
}

main().catch(console.error);
