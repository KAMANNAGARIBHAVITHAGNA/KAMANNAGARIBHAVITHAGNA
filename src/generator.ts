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

// GRID 1: HERO & CLEARANCE (Background: Kids on Bikes)
export function generateGrid1(stats: UserStats): string {
  return `
    <svg width="${W}" height="${H}" viewBox="0 0 ${W} ${H}" xmlns="http://www.w3.org/2000/svg">
      ${getCommonStyles()}
      ${getBackgroundImage('grid01')}
      
      <!-- Overlay box -->
      <g transform="translate(50, 50)">
        <rect width="500" height="200" fill="rgba(0,0,0,0.7)" stroke="#ef4444" stroke-width="3" rx="10" />
        <text x="250" y="50" class="text-title">KAMANNAGARI BHAVITHAGNA</text>
        <text x="30" y="100" class="text-body">> CLASSIFICATION: AI/ML ENGINEER</text>
        <text x="30" y="140" class="text-body">> CLEARANCE LEVEL: AI-07</text>
        <text x="30" y="180" class="text-body">> TARGET: GATE 2027<tspan class="blink">_</tspan></text>
      </g>
    </svg>
  `;
}

// GRID 2: TOTAL DATA / COMMITS (Background: Demogorgon in Fire)
export function generateGrid2(stats: UserStats): string {
  return `
    <svg width="${W}" height="${H}" viewBox="0 0 ${W} ${H}" xmlns="http://www.w3.org/2000/svg">
      ${getCommonStyles()}
      ${getBackgroundImage('grid02')}
      <rect width="${W}" height="${H}" fill="rgba(0,0,0,0.4)" />
      
      <g transform="translate(700, 100)">
        <rect width="400" height="150" fill="rgba(20,0,0,0.8)" stroke="#ef4444" stroke-width="4" rx="10" />
        <text x="200" y="50" class="text-title">SYSTEM DATA LEAK</text>
        <text x="200" y="100" class="text-repo" text-anchor="middle" font-size="40">${stats.totalCommits}+ COMMITS DETECTED</text>
      </g>
    </svg>
  `;
}

// GRID 3: TOP REPOSITORIES (Background: Group Looking Down)
export function generateGrid3(stats: UserStats): string {
  const repos = stats.topRepos.slice(0, 3);
  const renderRepo = (x: number, y: number, repo: any) => `
    <g transform="translate(${x}, ${y})" class="float">
      <rect width="300" height="100" fill="rgba(0,0,0,0.8)" stroke="#facc15" stroke-width="2" />
      <text x="150" y="40" class="text-repo" text-anchor="middle">${repo.name.substring(0,20)}</text>
      <text x="150" y="70" class="text-small" text-anchor="middle">⭐ ${repo.stars} | 🍴 ${repo.forks}</text>
    </g>
  `;
  return `
    <svg width="${W}" height="${H}" viewBox="0 0 ${W} ${H}" xmlns="http://www.w3.org/2000/svg">
      ${getCommonStyles()}
      ${getBackgroundImage('grid03')}
      <text x="600" y="70" class="text-title" style="font-size: 60px;">CLASSIFIED EXPERIMENTS</text>
      ${repos[0] ? renderRepo(100, 120, repos[0]) : ''}
      ${repos[1] ? renderRepo(450, 120, repos[1]) : ''}
      ${repos[2] ? renderRepo(800, 120, repos[2]) : ''}
    </svg>
  `;
}

// GRID 4: MORE REPOSITORIES (Background: Hawkins Van Jumping)
export function generateGrid4(stats: UserStats): string {
  const repos = stats.topRepos.slice(3, 6);
  const renderRepo = (x: number, y: number, repo: any) => `
    <g transform="translate(${x}, ${y})" class="float">
      <rect width="280" height="80" fill="rgba(0,0,0,0.7)" stroke="#3b82f6" stroke-width="2" />
      <text x="140" y="35" class="text-repo" fill="#60a5fa" text-anchor="middle">${repo.name.substring(0,18)}</text>
      <text x="140" y="60" class="text-small" text-anchor="middle">⭐ ${repo.stars}</text>
    </g>
  `;
  return `
    <svg width="${W}" height="${H}" viewBox="0 0 ${W} ${H}" xmlns="http://www.w3.org/2000/svg">
      ${getCommonStyles()}
      ${getBackgroundImage('grid04')}
      ${repos[0] ? renderRepo(800, 50, repos[0]) : ''}
      ${repos[1] ? renderRepo(850, 150, repos[1]) : ''}
      ${repos[2] ? renderRepo(800, 250, repos[2]) : ''}
    </svg>
  `;
}

// GRID 5: SKILLS & FRAMEWORKS (Background: Mind Flayer over School)
export function generateGrid5(stats: UserStats): string {
  const langs = Object.keys(stats.languages).slice(0, 5);
  return `
    <svg width="${W}" height="${H}" viewBox="0 0 ${W} ${H}" xmlns="http://www.w3.org/2000/svg">
      ${getCommonStyles()}
      ${getBackgroundImage('grid05')}
      <g transform="translate(50, 250)">
        <rect width="1100" height="100" fill="rgba(0,0,0,0.8)" stroke="#ef4444" stroke-width="3" />
        <text x="550" y="40" class="text-title" style="font-size: 30px;">DETECTED ANOMALIES (LANGUAGES):</text>
        <text x="550" y="80" class="text-body" fill="#facc15" text-anchor="middle">
          ${langs.join(' // ')}
        </text>
      </g>
    </svg>
  `;
}

// GRID 6: THE MISSION (Background: Mind Flayer Upside Down)
export function generateGrid6(): string {
  return `
    <svg width="${W}" height="${H}" viewBox="0 0 ${W} ${H}" xmlns="http://www.w3.org/2000/svg">
      ${getCommonStyles()}
      ${getBackgroundImage('grid06')}
      <g transform="translate(400, 150)">
        <rect width="400" height="150" fill="rgba(0,0,0,0.8)" stroke="#3b82f6" stroke-width="2" />
        <text x="200" y="50" class="text-title" fill="#60a5fa">CURRENT DIRECTIVE</text>
        <text x="200" y="90" class="text-body" text-anchor="middle">PREPARING FOR</text>
        <text x="200" y="130" class="text-title" fill="#ef4444">GATE 2027</text>
      </g>
    </svg>
  `;
}

// GRID 7: AI/ML FOCUS (Background: Demogorgon Jumping)
export function generateGrid7(): string {
  return `
    <svg width="${W}" height="${H}" viewBox="0 0 ${W} ${H}" xmlns="http://www.w3.org/2000/svg">
      ${getCommonStyles()}
      ${getBackgroundImage('grid07')}
      <g transform="translate(100, 50)">
        <rect width="350" height="200" fill="rgba(0,0,0,0.7)" stroke="#22c55e" stroke-width="2" />
        <text x="175" y="40" class="text-title" fill="#4ade80">SPECIALIZATIONS</text>
        <text x="30" y="90" class="text-body">> MACHINE LEARNING</text>
        <text x="30" y="130" class="text-body">> DEEP LEARNING (RAG)</text>
        <text x="30" y="170" class="text-body">> PYTHON / TENSORFLOW</text>
      </g>
    </svg>
  `;
}

// GRID 8: CONTACT (Background: Steve Harrington)
export function generateGrid8(): string {
  return `
    <svg width="${W}" height="${H}" viewBox="0 0 ${W} ${H}" xmlns="http://www.w3.org/2000/svg">
      ${getCommonStyles()}
      ${getBackgroundImage('grid08')}
      <g transform="translate(700, 150)">
        <rect width="450" height="150" fill="rgba(0,0,0,0.8)" stroke="#ef4444" stroke-width="3" />
        <text x="225" y="50" class="text-title">ESTABLISH CONNECTION</text>
        <text x="30" y="100" class="text-body">> LOCATION: HAWKINS / BENGALURU</text>
        <text x="30" y="140" class="text-body">> STATUS: READY FOR BATTLE<tspan class="blink">_</tspan></text>
      </g>
    </svg>
  `;
}
