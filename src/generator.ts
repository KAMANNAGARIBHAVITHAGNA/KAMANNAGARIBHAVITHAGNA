import * as fs from 'fs';
import * as path from 'path';
import { UserStats } from './fetcher';

const W = 1200;
const H = 400;

export function getBackgroundImage(gridName: string): string {
  const jpgPath = path.join(process.cwd(), 'assets', 'backgrounds', `${gridName}.jpg`);
  
  if (fs.existsSync(jpgPath)) {
    const b64 = fs.readFileSync(jpgPath).toString('base64');
    return `<image href="data:image/jpeg;base64,${b64}" width="${W}" height="${H}" preserveAspectRatio="xMidYMid slice" />`;
  }
  return `<rect width="${W}" height="${H}" fill="#111" />`; // Fallback
}

const getCommonStyles = () => `
  <defs>
    <style>
      @import url('https://fonts.googleapis.com/css2?family=VT323&amp;display=swap');
      .text-title { font-family: 'VT323', monospace; font-size: 40px; fill: #ef4444; text-anchor: middle; filter: drop-shadow(0 0 5px #ef4444); }
      .text-body { font-family: 'VT323', monospace; font-size: 28px; fill: #4ade80; filter: drop-shadow(0 0 3px #22c55e); }
      .text-repo { font-family: 'VT323', monospace; font-size: 24px; fill: #facc15; filter: drop-shadow(0 0 5px #ca8a04); }
      .text-small { font-family: 'VT323', monospace; font-size: 20px; fill: #94a3b8; }
      @keyframes blink { 0%, 100% { opacity: 1; } 50% { opacity: 0; } }
      .blink { animation: blink 2s infinite; }
      @keyframes float { 0%, 100% { transform: translateY(0); } 50% { transform: translateY(-10px); } }
      .float { animation: float 4s infinite ease-in-out; transform-origin: center; }
    </style>
    <filter id="darken"><feColorMatrix type="matrix" values="0.3 0 0 0 0  0 0.3 0 0 0  0 0 0.3 0 0  0 0 0 0.6 0"/></filter>
  </defs>
`;

export function writeSvg(filename: string, content: string) {
  const dir = path.join(process.cwd(), 'assets', 'generated');
  if (!fs.existsSync(dir)) fs.mkdirSync(dir, { recursive: true });
  fs.writeFileSync(path.join(dir, filename), content);
}

// GRID 1: HERO & CLEARANCE (Background: Painted Wall)
export function generateGrid1(stats: UserStats): string {
  const renderLight = (x: number, y: number, color: string, delay: number) => `
    <circle cx="${x}" cy="${y}" r="8" fill="${color}" filter="url(#glow-${color.replace('#', '')})">
      <animate attributeName="opacity" values="0.2; 1; 0.2" dur="${1.5 + Math.random()}s" begin="${delay}s" repeatCount="indefinite" />
    </circle>
  `;

  return `
    <svg width="${W}" height="${H}" viewBox="0 0 ${W} ${H}" xmlns="http://www.w3.org/2000/svg">
      ${getCommonStyles()}
      <defs>
        <filter id="glow-ff0000"><feGaussianBlur stdDeviation="6" result="coloredBlur"/><feMerge><feMergeNode in="coloredBlur"/><feMergeNode in="SourceGraphic"/></feMerge></filter>
        <filter id="glow-00ff00"><feGaussianBlur stdDeviation="6" result="coloredBlur"/><feMerge><feMergeNode in="coloredBlur"/><feMergeNode in="SourceGraphic"/></feMerge></filter>
        <filter id="glow-0000ff"><feGaussianBlur stdDeviation="6" result="coloredBlur"/><feMerge><feMergeNode in="coloredBlur"/><feMergeNode in="SourceGraphic"/></feMerge></filter>
        <filter id="glow-ffff00"><feGaussianBlur stdDeviation="6" result="coloredBlur"/><feMerge><feMergeNode in="coloredBlur"/><feMergeNode in="SourceGraphic"/></feMerge></filter>
      </defs>
      ${getBackgroundImage('grid01')}
      
      <!-- Animated Lights over the image bulbs -->
      <!-- Top Row -->
      ${renderLight(115, 65, '#ff0000', 0)}
      ${renderLight(300, 85, '#0000ff', 0.5)}
      ${renderLight(385, 95, '#00ff00', 1.2)}
      ${renderLight(520, 70, '#ffff00', 0.2)}
      ${renderLight(655, 85, '#ffff00', 0.8)}
      ${renderLight(815, 95, '#ff0000', 0.1)}
      ${renderLight(940, 105, '#0000ff', 0.6)}
      ${renderLight(1100, 85, '#ffff00', 1.5)}
      ${renderLight(1160, 80, '#ff0000', 0.3)}

      <!-- Middle Row -->
      ${renderLight(95, 195, '#ffff00', 0.7)}
      ${renderLight(270, 200, '#00ff00', 1.1)}
      ${renderLight(370, 210, '#ff0000', 0.4)}
      ${renderLight(510, 215, '#0000ff', 0.9)}
      ${renderLight(630, 220, '#ffff00', 1.3)}
      ${renderLight(795, 215, '#0000ff', 0.2)}
      ${renderLight(905, 220, '#ffff00', 0.8)}
      ${renderLight(1115, 205, '#ff0000', 0.5)}

      <!-- Bottom Row -->
      ${renderLight(165, 305, '#ffff00', 1.4)}
      ${renderLight(300, 315, '#0000ff', 0.3)}
      ${renderLight(515, 315, '#ff0000', 0.6)}
      ${renderLight(675, 320, '#00ff00', 1.0)}
      ${renderLight(815, 315, '#ffff00', 0.1)}
      ${renderLight(945, 325, '#ff0000', 1.2)}
      ${renderLight(1075, 320, '#00ff00', 0.4)}
      ${renderLight(1140, 310, '#ff0000', 0.9)}
    </svg>
  `;
}

// GRID 2: TOTAL DATA / COMMITS (Background: Demogorgon in Fire)
export function generateGrid2(stats: UserStats): string {
  const repos = stats.topRepos.slice(0, 4);
  
  const renderFloatingRepo = (x: number, y: number, repo: any, delay: number, rotation: number) => `
    <g transform="translate(${x}, ${y}) rotate(${rotation})" style="animation: float 4s ease-in-out infinite ${delay}s">
      <rect x="-85" y="-35" width="170" height="70" fill="rgba(69, 10, 10, 0.7)" stroke="#ef4444" stroke-width="2" style="filter: drop-shadow(0 0 8px #ef4444);" rx="5" />
      <text x="0" y="5" class="text-repo" fill="#fca5a5" text-anchor="middle" font-size="22" style="text-shadow: 0 0 5px #ef4444;">${repo.name}</text>
      <text x="0" y="25" class="text-small" fill="#fef08a" text-anchor="middle" font-size="16">⭐ ${repo.stars}</text>
    </g>
  `;

  return `
    <svg width="${W}" height="${H}" viewBox="0 0 ${W} ${H}" xmlns="http://www.w3.org/2000/svg">
      ${getCommonStyles()}
      ${getBackgroundImage('grid02')}
      
      <!-- Repos floating from the hand (Hand is around x=480, y=320) -->
      ${repos[1] ? renderFloatingRepo(360, 220, repos[1], 0, -15) : ''}
      ${repos[2] ? renderFloatingRepo(420, 130, repos[2], 0.5, -5) : ''}
      ${repos[3] ? renderFloatingRepo(540, 110, repos[3], 1.2, 5) : ''}
      ${repos[0] ? renderFloatingRepo(620, 190, repos[0], 0.8, 15) : ''}
    </svg>
  `;
}

// GRID 3: TOP REPOSITORIES (Background: Group Looking Down)
export function generateGrid3(stats: UserStats): string {
  return `
    <svg width="${W}" height="${H}" viewBox="0 0 ${W} ${H}" xmlns="http://www.w3.org/2000/svg">
      ${getCommonStyles()}
      ${getBackgroundImage('grid03')}
    </svg>
  `;
}

// GRID 4: MORE REPOSITORIES (Background: Hawkins Van Jumping)
export function generateGrid4(stats: UserStats): string {
  return `
    <svg width="${W}" height="${H}" viewBox="0 0 ${W} ${H}" xmlns="http://www.w3.org/2000/svg">
      ${getCommonStyles()}
      ${getBackgroundImage('grid04')}
    </svg>
  `;
}



// GRID 8: CONTACT (Background: Steve Harrington)
export function generateGrid8(): string {
  return `
    <svg width="${W}" height="${H}" viewBox="0 0 ${W} ${H}" xmlns="http://www.w3.org/2000/svg">
      ${getCommonStyles()}
      ${getBackgroundImage('grid08')}
    </svg>
  `;
}
