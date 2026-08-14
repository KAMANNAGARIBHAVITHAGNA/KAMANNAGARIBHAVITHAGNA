import fs from 'fs';
import path from 'path';
import { UserStats } from './fetcher';

// VIBRANT 2D VECTOR ASSETS (Angry Birds Original Style)
const getCommonStyles = () => `
  <defs>
    <!-- Sky & Background Gradients -->
    <linearGradient id="skyGrad" x1="0" y1="0" x2="0" y2="1">
      <stop offset="0%" stop-color="#3ba3e8" />
      <stop offset="100%" stop-color="#56b4f3" />
    </linearGradient>
    <linearGradient id="hillBack" x1="0" y1="0" x2="0" y2="1">
      <stop offset="0%" stop-color="#fad66d" />
      <stop offset="100%" stop-color="#f5c249" />
    </linearGradient>
    <linearGradient id="hillFront" x1="0" y1="0" x2="0" y2="1">
      <stop offset="0%" stop-color="#f5c249" />
      <stop offset="100%" stop-color="#e9a421" />
    </linearGradient>
    <linearGradient id="dirtGrad" x1="0" y1="0" x2="0" y2="1">
      <stop offset="0%" stop-color="#462207" />
      <stop offset="100%" stop-color="#2c1402" />
    </linearGradient>
    <linearGradient id="grassGrad" x1="0" y1="0" x2="0" y2="1">
      <stop offset="0%" stop-color="#70c427" />
      <stop offset="100%" stop-color="#499517" />
    </linearGradient>
    <linearGradient id="woodGrad" x1="0" y1="0" x2="0" y2="1">
      <stop offset="0%" stop-color="#f3a950" />
      <stop offset="100%" stop-color="#c97116" />
    </linearGradient>
    <linearGradient id="undergroundGrad" x1="0" y1="0" x2="0" y2="1">
      <stop offset="0%" stop-color="#2c1402" />
      <stop offset="100%" stop-color="#140901" />
    </linearGradient>
    <linearGradient id="dungeonGrad" x1="0" y1="0" x2="0" y2="1">
      <stop offset="0%" stop-color="#140901" />
      <stop offset="100%" stop-color="#050200" />
    </linearGradient>
    
    <filter id="shadow" x="-20%" y="-20%" width="140%" height="140%">
      <feDropShadow dx="2" dy="4" stdDeviation="3" flood-opacity="0.3" />
    </filter>
    <filter id="blockShadow" x="-10%" y="-10%" width="120%" height="120%">
      <feDropShadow dx="1" dy="2" stdDeviation="1" flood-opacity="0.5" />
    </filter>
    
    <pattern id="dirtTexture" width="60" height="60" patternUnits="userSpaceOnUse">
      <circle cx="10" cy="10" r="4" fill="#321603" opacity="0.8" />
      <circle cx="40" cy="25" r="6" fill="#321603" opacity="0.8" />
      <circle cx="20" cy="50" r="3" fill="#321603" opacity="0.8" />
      <circle cx="50" cy="55" r="5" fill="#321603" opacity="0.8" />
    </pattern>
  </defs>
  <style>
    @import url('https://fonts.googleapis.com/css2?family=Lilita+One&amp;display=swap');
    text { font-family: 'Lilita One', sans-serif; }
    
    .hud-text { fill: #ffffff; font-size: 24px; paint-order: stroke; stroke: #000000; stroke-width: 6px; stroke-linecap: round; stroke-linejoin: round; }
    .hud-label { fill: #ffffff; font-size: 14px; font-family: Arial, sans-serif; font-weight: bold; }
    
    @keyframes bounce {
      0%, 100% { transform: translateY(0); }
      50% { transform: translateY(-5px); }
    }
    .animate-bounce { animation: bounce 2s ease-in-out infinite; }
  </style>
`;

const renderCloud = (x: number, y: number, scale = 1) => `
  <g transform="translate(${x}, ${y}) scale(${scale})">
    <path d="M 0 0 C -20 0 -40 -15 -40 -35 C -40 -60 -20 -70 0 -70 C 5 -90 35 -100 50 -80 C 70 -90 95 -75 95 -50 C 115 -45 125 -20 110 -5 C 120 10 105 25 85 20 C 70 35 30 35 15 20 Z" fill="#ffffff" />
    <circle cx="-15" cy="-35" r="5" fill="#e6f2fa" />
    <circle cx="15" cy="-55" r="8" fill="#e6f2fa" />
    <circle cx="65" cy="-30" r="6" fill="#e6f2fa" />
  </g>
`;

const renderSunflower = (x: number, y: number, scale = 1) => `
  <g transform="translate(${x}, ${y}) scale(${scale})">
    <!-- Stem -->
    <path d="M 0 0 Q 5 20 0 50" fill="none" stroke="#609819" stroke-width="4" />
    <path d="M 0 30 Q 15 25 20 15 Q 15 35 0 40" fill="#609819" />
    <!-- Petals -->
    <circle cx="0" cy="0" r="15" fill="#ffb700" />
    <path d="M 0 -15 L 5 -25 L 10 -15 Z" fill="#ffb700" />
    <path d="M 10 -10 L 22 -15 L 15 -5 Z" fill="#ffb700" />
    <path d="M 15 0 L 25 5 L 15 10 Z" fill="#ffb700" />
    <path d="M 10 10 L 20 20 L 5 15 Z" fill="#ffb700" />
    <path d="M 0 15 L -5 25 L -10 15 Z" fill="#ffb700" />
    <path d="M -10 10 L -22 15 L -15 5 Z" fill="#ffb700" />
    <path d="M -15 0 L -25 -5 L -15 -10 Z" fill="#ffb700" />
    <path d="M -10 -10 L -20 -20 L -5 -15 Z" fill="#ffb700" />
    <!-- Center -->
    <circle cx="0" cy="0" r="10" fill="#60370f" />
  </g>
`;

const renderDirtGrass = (w: number, y: number, isFlat = false) => {
  let path = `M 0 ${y} `;
  if (isFlat) {
    path += `L ${w} ${y} L ${w} ${y+500} L 0 ${y+500} Z`;
  } else {
    // Wavy grass top
    path += `Q 50 ${y-20} 150 ${y} T 350 ${y-10} T 550 ${y+10} T 750 ${y-15} T 1000 ${y} T 1200 ${y} L 1200 ${y+300} L 0 ${y+300} Z`;
  }
  
  return `
    <path d="${path}" fill="url(#dirtGrad)" />
    <path d="${path}" fill="url(#dirtTexture)" />
    <path d="${path.replace(/L \d+ \d+ L \d+ \d+ Z/, `L 1200 ${y+20} L 0 ${y+20} Z`)}" fill="url(#grassGrad)" stroke="#2b5f07" stroke-width="2" />
    
    <!-- White Flowers -->
    <g transform="translate(150, ${y+10})"><circle cx="0" cy="0" r="3" fill="#fff"/><circle cx="5" cy="0" r="3" fill="#fff"/><circle cx="2.5" cy="4" r="3" fill="#fff"/><circle cx="2.5" cy="2" r="2" fill="#ffd500"/></g>
    <g transform="translate(350, ${y+15})"><circle cx="0" cy="0" r="3" fill="#fff"/><circle cx="5" cy="0" r="3" fill="#fff"/><circle cx="2.5" cy="4" r="3" fill="#fff"/><circle cx="2.5" cy="2" r="2" fill="#ffd500"/></g>
    <g transform="translate(750, ${y+5})"><circle cx="0" cy="0" r="3" fill="#fff"/><circle cx="5" cy="0" r="3" fill="#fff"/><circle cx="2.5" cy="4" r="3" fill="#fff"/><circle cx="2.5" cy="2" r="2" fill="#ffd500"/></g>
  `;
};

const renderWoodBlock = (x: number, y: number, w: number, h: number) => `
  <g transform="translate(${x}, ${y})" filter="url(#blockShadow)">
    <rect width="${w}" height="${h}" fill="url(#woodGrad)" stroke="#783c07" stroke-width="2" />
    <rect x="2" y="2" width="${w-4}" height="${h-4}" fill="none" stroke="#fcdb9c" stroke-width="1" opacity="0.6" />
    <path d="M 4 4 L ${w-4} 4 M 4 12 L ${w-4} 12 M 4 20 L ${w-4} 20" stroke="#a35712" stroke-width="1" />
  </g>
`;

const renderBugPig = (x: number, y: number, r: number = 18, isDev = false) => `
  <g transform="translate(${x}, ${y})" class="animate-bounce">
    <!-- Green Pig Body -->
    <circle cx="0" cy="0" r="${r}" fill="#78ce12" stroke="#325a03" stroke-width="2" />
    <!-- Snout -->
    <ellipse cx="0" cy="5" rx="9" ry="6" fill="#9df033" stroke="#325a03" stroke-width="1.5" />
    <circle cx="-3" cy="4" r="2" fill="#325a03" />
    <circle cx="3" cy="4" r="2" fill="#325a03" />
    <!-- Eyes -->
    <circle cx="-7" cy="-3" r="4" fill="#ffffff" stroke="#325a03" stroke-width="1" />
    <circle cx="-6" cy="-3" r="1.5" fill="#000" />
    <circle cx="7" cy="-3" r="4" fill="#ffffff" stroke="#325a03" stroke-width="1" />
    <circle cx="6" cy="-3" r="1.5" fill="#000" />
    
    ${isDev ? `
    <!-- Bug Headphones -->
    <path d="M -18 0 C -18 -20 18 -20 18 0" fill="none" stroke="#333" stroke-width="3" />
    <rect x="-22" y="-5" width="6" height="12" rx="3" fill="#ff0000" />
    <rect x="16" y="-5" width="6" height="12" rx="3" fill="#ff0000" />
    ` : `
    <!-- Straw Hat -->
    <ellipse cx="0" cy="-14" rx="14" ry="4" fill="#fcdb9c" stroke="#a35712" stroke-width="1.5" />
    <path d="M -8 -15 C -8 -25 8 -25 8 -15 Z" fill="#fcdb9c" stroke="#a35712" stroke-width="1.5" />
    <path d="M -8 -16 Q 0 -13 8 -16" fill="none" stroke="#2b5ff" stroke-width="2" />
    `}
  </g>
`;

const renderSlingshot = (x: number, y: number) => `
  <g transform="translate(${x}, ${y})">
    <!-- Back Band -->
    <path d="M -15 -80 L -70 -50" stroke="#4a1803" stroke-width="8" stroke-linecap="round" />
    <!-- Base -->
    <path d="M 0 0 L 0 -50 L -20 -90 M 0 -50 L 20 -90" fill="none" stroke="#a35712" stroke-width="16" stroke-linecap="round" stroke-linejoin="round" />
    <path d="M 0 0 L 0 -50 L -20 -90 M 0 -50 L 20 -90" fill="none" stroke="#783c07" stroke-width="4" stroke-linecap="round" stroke-linejoin="round" opacity="0.5" />
    <!-- Pouch -->
    <path d="M -80 -60 Q -70 -40 -60 -60" fill="none" stroke="#783c07" stroke-width="14" stroke-linecap="round" />
    <!-- Front Band -->
    <path d="M 15 -80 L -65 -50" stroke="#4a1803" stroke-width="8" stroke-linecap="round" />
  </g>
`;

const renderDevBird = (x: number, y: number) => `
  <g transform="translate(${x}, ${y})">
    <!-- White Bird Body (like the screenshot) -->
    <ellipse cx="0" cy="0" rx="25" ry="30" fill="#ffffff" stroke="#000" stroke-width="2" />
    <!-- Yellow cheeks -->
    <circle cx="-15" cy="5" r="4" fill="#ffd500" opacity="0.6" />
    <circle cx="15" cy="5" r="4" fill="#ffd500" opacity="0.6" />
    <!-- Belly -->
    <path d="M -20 15 Q 0 35 20 15 Q 0 30 -20 15 Z" fill="#e0e0e0" />
    <!-- Dev Glasses -->
    <rect x="-18" y="-12" width="16" height="10" rx="2" fill="#333" stroke="#000" stroke-width="2" />
    <rect x="2" y="-12" width="16" height="10" rx="2" fill="#333" stroke="#000" stroke-width="2" />
    <path d="M -2 -7 L 2 -7" stroke="#000" stroke-width="2" />
    <path d="M -18 -7 L -25 -5 M 18 -7 L 25 -5" stroke="#000" stroke-width="2" />
    <!-- Beak -->
    <path d="M -10 2 L 10 2 L 0 15 Z" fill="#ffb700" stroke="#000" stroke-width="2" />
    <!-- Head Feathers -->
    <path d="M -5 -30 C -15 -40 5 -45 5 -30 Z" fill="#000" />
    <path d="M 0 -30 C 15 -45 25 -35 10 -25 Z" fill="#000" />
    <!-- </ > Logo on belly -->
    <text x="0" y="24" font-family="monospace" font-size="12" font-weight="bold" fill="#333" text-anchor="middle">&lt;/&gt;</text>
  </g>
`;

export function generateSkyScene(stats: UserStats): string {
  const W = 1200, H = 600;
  return `
    <svg width="${W}" height="${H}" viewBox="0 0 ${W} ${H}" xmlns="http://www.w3.org/2000/svg">
      ${getCommonStyles()}
      <rect width="${W}" height="${H}" fill="url(#skyGrad)" />
      
      <!-- Fluffy Clouds -->
      ${renderCloud(250, 150, 1.2)}
      ${renderCloud(800, 100, 0.8)}
      ${renderCloud(1100, 80, 1.5)}

      <!-- Rolling Hills (Background) -->
      <path d="M 0 450 Q 200 350 400 450 T 800 450 T 1200 400 L 1200 600 L 0 600 Z" fill="url(#hillBack)" />
      <path d="M 0 500 Q 250 420 500 500 T 1000 450 T 1200 550 L 1200 600 L 0 600 Z" fill="url(#hillFront)" />
      
      <!-- Sunflowers -->
      ${renderSunflower(150, 420, 0.8)}
      ${renderSunflower(350, 450, 1)}
      ${renderSunflower(500, 440, 0.7)}
      ${renderSunflower(750, 410, 0.9)}

      <!-- Ground & Cliff -->
      ${renderDirtGrass(W, 520)}
      <path d="M 0 350 L 100 350 L 100 600 L 0 600 Z" fill="url(#dirtGrad)" />
      <path d="M 0 350 L 100 350 L 100 600 L 0 600 Z" fill="url(#dirtTexture)" />
      <path d="M 0 350 L 100 350 L 100 370 L 0 370 Z" fill="url(#grassGrad)" stroke="#2b5f07" stroke-width="2" />
      
      <!-- Right Step Cliff -->
      <path d="M 950 400 L 1200 400 L 1200 600 L 950 600 Z" fill="url(#dirtGrad)" />
      <path d="M 950 400 L 1200 400 L 1200 600 L 950 600 Z" fill="url(#dirtTexture)" />
      <path d="M 950 400 L 1200 400 L 1200 420 L 950 420 Z" fill="url(#grassGrad)" stroke="#2b5f07" stroke-width="2" />
      <path d="M 1100 250 L 1200 250 L 1200 600 L 1100 600 Z" fill="url(#dirtGrad)" />
      <path d="M 1100 250 L 1200 250 L 1200 600 L 1100 600 Z" fill="url(#dirtTexture)" />
      <path d="M 1100 250 L 1200 250 L 1200 270 L 1100 270 Z" fill="url(#grassGrad)" stroke="#2b5f07" stroke-width="2" />
      ${renderSunflower(1150, 220, 0.8)}

      <!-- Slingshot & Bird -->
      ${renderSlingshot(50, 350)}
      ${renderDevBird(10, 305)}
      
      <!-- Trajectory Dots -->
      <g fill="#ffffff" opacity="0.8">
        <circle cx="80" cy="270" r="5" /><circle cx="160" cy="230" r="5" />
        <circle cx="260" cy="210" r="5" /><circle cx="370" cy="220" r="5" />
        <circle cx="480" cy="260" r="5" /><circle cx="580" cy="320" r="5" />
      </g>

      <!-- The Wood Fortress (Replica of screenshot) -->
      <g transform="translate(620, 520)">
        <!-- Layer 1 (Ground) -->
        ${renderWoodBlock(0, -40, 40, 40)}
        ${renderWoodBlock(80, -40, 40, 40)}
        ${renderWoodBlock(40, -100, 120, 20)} <!-- Horizontal plank -->
        ${renderBugPig(60, -20)}
        
        <!-- Layer 2 -->
        ${renderWoodBlock(40, -160, 20, 60)}
        ${renderWoodBlock(140, -160, 20, 60)}
        ${renderWoodBlock(40, -180, 120, 20)}
        ${renderBugPig(90, -120)}
        
        <!-- Layer 3 -->
        ${renderWoodBlock(60, -240, 20, 60)}
        ${renderWoodBlock(120, -240, 20, 60)}
        ${renderWoodBlock(60, -260, 80, 20)}
        ${renderBugPig(90, -200)}
        
        <!-- Layer 4 (Top) -->
        ${renderWoodBlock(80, -320, 20, 60)}
        ${renderBugPig(90, -280)}
      </g>
      
      <!-- Bugs on cliffs -->
      ${renderBugPig(1030, 380)}
      ${renderBugPig(1150, 230)}

      <!-- HUD -->
      <g transform="translate(20, 40)">
        <text x="0" y="0" class="hud-label">PLAYER</text>
        <text x="0" y="25" class="hud-text">${stats.name.toUpperCase()}</text>
      </g>
      <g transform="translate(450, 40)">
        <text x="0" y="0" class="hud-label">SCORE</text>
        <text x="0" y="25" class="hud-text">${stats.totalCommits * 100}</text>
      </g>
      <g transform="translate(650, 40)">
        <text x="0" y="0" class="hud-label">STARS</text>
        <text x="0" y="25" class="hud-text">${stats.totalStars}</text>
      </g>
      <g transform="translate(850, 40)">
        <text x="0" y="0" class="hud-label">LEVEL</text>
        <text x="0" y="25" class="hud-text">${stats.publicRepos}</text>
      </g>
    </svg>
  `;
}

const renderLevelSign = (x: number, y: number, name: string) => `
  <g transform="translate(${x}, ${y})" filter="url(#shadow)">
    <rect x="35" y="40" width="10" height="60" fill="#4a1803" />
    <rect x="0" y="0" width="160" height="50" fill="url(#woodGrad)" stroke="#783c07" stroke-width="4" rx="5" />
    <text x="80" y="22" font-size="12" fill="#fff" stroke="#4a1803" stroke-width="3" paint-order="stroke" text-anchor="middle">${name}</text>
    <g transform="translate(80, 38) scale(0.6)">
      <path d="M -30 0 L -25 15 L -10 15 L -20 25 L -15 40 L -30 30 L -45 40 L -40 25 L -50 15 L -35 15 Z" fill="#ffd500" stroke="#a35712" stroke-width="2" />
      <path d="M 0 -5 L 5 10 L 20 10 L 10 20 L 15 35 L 0 25 L -15 35 L -10 20 L -20 10 L -5 10 Z" fill="#ffd500" stroke="#a35712" stroke-width="2" />
      <path d="M 30 0 L 35 15 L 50 15 L 40 25 L 45 40 L 30 30 L 15 40 L 20 25 L 10 15 L 25 15 Z" fill="#ffd500" stroke="#a35712" stroke-width="2" />
    </g>
  </g>
`;

export function generateHillsScene(): string {
  const W = 1200, H = 400;
  return `
    <svg width="${W}" height="${H}" viewBox="0 0 ${W} ${H}" xmlns="http://www.w3.org/2000/svg">
      ${getCommonStyles()}
      <!-- Start with dirt from the previous level -->
      <rect width="${W}" height="${H}" fill="url(#dirtGrad)" />
      <rect width="${W}" height="${H}" fill="url(#dirtTexture)" />
      
      <!-- Valley Cutout revealing more sky -->
      <path d="M 0 0 C 300 300 900 300 1200 0 L 1200 400 L 0 400 Z" fill="url(#skyGrad)" />
      ${renderCloud(500, 100, 1)}
      
      <!-- Grassy Plateaus for Projects -->
      <path d="M 0 300 Q 200 250 400 350 L 0 400 Z" fill="url(#grassGrad)" stroke="#2b5f07" stroke-width="2" />
      ${renderLevelSign(100, 210, 'MOBILEHUB')}
      
      <path d="M 300 400 Q 500 280 700 400 Z" fill="url(#grassGrad)" stroke="#2b5f07" stroke-width="2" />
      ${renderLevelSign(420, 240, 'SPITCH ASSIST')}
      
      <path d="M 700 350 Q 900 250 1200 300 L 1200 400 L 700 400 Z" fill="url(#grassGrad)" stroke="#2b5f07" stroke-width="2" />
      ${renderLevelSign(850, 210, 'HOPE TRAVEL')}
      
      <path d="M 1000 400 Q 1100 320 1200 400 Z" fill="url(#grassGrad)" stroke="#2b5f07" stroke-width="2" />
      ${renderLevelSign(1020, 300, 'AGRI-INTEL')}
    </svg>
  `;
}

export function generateUndergroundScene(): string {
  const W = 1200, H = 400;
  const skills = ['PYTHON', 'REACT', 'FASTAPI', 'TYPESCRIPT', 'GEN-AI', 'TENSORFLOW', 'SQL'];
  
  let gems = '';
  skills.forEach((s, i) => {
    const x = 150 + (i * 140) + (Math.random() * 40 - 20);
    const y = 150 + (i % 2 === 0 ? 50 : 150);
    gems += `
      <g transform="translate(${x}, ${y})" filter="url(#shadow)">
        <polygon points="0,-20 20,0 0,20 -20,0" fill="#38bdf8" stroke="#0284c7" stroke-width="3" />
        <text x="0" y="40" font-size="14" fill="#fff" text-anchor="middle" font-family="monospace">${s}</text>
      </g>
    `;
  });

  return `
    <svg width="${W}" height="${H}" viewBox="0 0 ${W} ${H}" xmlns="http://www.w3.org/2000/svg">
      ${getCommonStyles()}
      <rect width="${W}" height="${H}" fill="url(#undergroundGrad)" />
      <rect width="${W}" height="${H}" fill="url(#dirtTexture)" opacity="0.4" />
      
      <!-- Rock formations -->
      <path d="M 0 100 Q 100 150 200 100 Q 300 50 400 150 T 800 100 T 1200 150 L 1200 0 L 0 0 Z" fill="#2c1402" stroke="#140901" stroke-width="4" />
      
      <text x="600" y="80" class="hud-text" text-anchor="middle">SKILL ARSENAL FOUND</text>
      
      ${gems}
    </svg>
  `;
}

export function generateDungeonScene(): string {
  const W = 1200, H = 400;
  return `
    <svg width="${W}" height="${H}" viewBox="0 0 ${W} ${H}" xmlns="http://www.w3.org/2000/svg">
      ${getCommonStyles()}
      <rect width="${W}" height="${H}" fill="url(#dungeonGrad)" />
      
      <!-- Stone Brick Background Pattern -->
      <pattern id="stone" width="60" height="30" patternUnits="userSpaceOnUse">
        <rect width="60" height="30" fill="none" stroke="#111" stroke-width="2" />
        <rect width="30" height="15" fill="#1a1a1a" />
        <rect x="30" y="15" width="30" height="15" fill="#1a1a1a" />
      </pattern>
      <rect width="${W}" height="${H}" fill="url(#stone)" opacity="0.3" />

      <text x="600" y="80" class="hud-text" fill="#ff4444" text-anchor="middle">FINAL BOSS: GATE 2027</text>
      
      <!-- Boss Throne -->
      <g transform="translate(600, 300)">
        <rect x="-150" y="-50" width="300" height="50" fill="#222" stroke="#000" stroke-width="4" />
        <rect x="-100" y="-150" width="200" height="100" fill="#333" stroke="#000" stroke-width="4" />
        <!-- Huge Bug Boss -->
        ${renderBugPig(0, -100, 50, true)}
        <!-- Health Bar -->
        <rect x="-150" y="-200" width="300" height="20" fill="#000" stroke="#fff" stroke-width="2" />
        <rect x="-148" y="-198" width="296" height="16" fill="#ff0000" />
      </g>
      
      <!-- Trophy Chests -->
      <g transform="translate(200, 300)">
        <path d="M -40 0 L 40 0 L 30 50 L -30 50 Z" fill="#b45309" stroke="#783c07" stroke-width="4" />
        <path d="M -40 0 C -40 -30 40 -30 40 0 Z" fill="#d97706" stroke="#783c07" stroke-width="4" />
        <circle cx="0" cy="0" r="6" fill="#fcdb9c" />
        <text x="0" y="70" font-size="12" fill="#fff" text-anchor="middle">AI ENGINEER</text>
      </g>
      <g transform="translate(1000, 300)">
        <path d="M -40 0 L 40 0 L 30 50 L -30 50 Z" fill="#b45309" stroke="#783c07" stroke-width="4" />
        <path d="M -40 0 C -40 -30 40 -30 40 0 Z" fill="#d97706" stroke="#783c07" stroke-width="4" />
        <circle cx="0" cy="0" r="6" fill="#fcdb9c" />
        <text x="0" y="70" font-size="12" fill="#fff" text-anchor="middle">FULL STACK</text>
      </g>
    </svg>
  `;
}

export function writeSvg(filename: string, content: string) {
  const dir = path.join(process.cwd(), 'assets', 'generated');
  if (!fs.existsSync(dir)) {
    fs.mkdirSync(dir, { recursive: true });
  }
  fs.writeFileSync(path.join(dir, filename), content.trim());
}
