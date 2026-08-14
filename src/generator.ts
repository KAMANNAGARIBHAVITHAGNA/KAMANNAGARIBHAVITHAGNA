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
    
    <!-- Text Gradients -->
    <linearGradient id="textRed" x1="0" y1="0" x2="0" y2="1">
      <stop offset="0%" stop-color="#ff4b4b" />
      <stop offset="100%" stop-color="#c70000" />
    </linearGradient>
    <linearGradient id="textYellow" x1="0" y1="0" x2="0" y2="1">
      <stop offset="0%" stop-color="#ffdf00" />
      <stop offset="100%" stop-color="#d97706" />
    </linearGradient>
    <linearGradient id="textGreen" x1="0" y1="0" x2="0" y2="1">
      <stop offset="0%" stop-color="#70c427" />
      <stop offset="100%" stop-color="#387a0e" />
    </linearGradient>
    <linearGradient id="textBlue" x1="0" y1="0" x2="0" y2="1">
      <stop offset="0%" stop-color="#56b4f3" />
      <stop offset="100%" stop-color="#006eb8" />
    </linearGradient>
    
    <filter id="shadow" x="-20%" y="-20%" width="140%" height="140%">
      <feDropShadow dx="2" dy="4" stdDeviation="3" flood-opacity="0.3" />
    </filter>
    <filter id="blockShadow" x="-10%" y="-10%" width="120%" height="120%">
      <feDropShadow dx="1" dy="2" stdDeviation="1" flood-opacity="0.5" />
    </filter>
    <filter id="textShadow" x="-10%" y="-10%" width="120%" height="120%">
      <feDropShadow dx="3" dy="3" stdDeviation="0" flood-color="#000" />
    </filter>
    
    <pattern id="dirtTexture" width="60" height="60" patternUnits="userSpaceOnUse">
      <circle cx="10" cy="10" r="4" fill="#321603" opacity="0.8" />
      <circle cx="40" cy="25" r="6" fill="#321603" opacity="0.8" />
      <circle cx="20" cy="50" r="3" fill="#321603" opacity="0.8" />
      <circle cx="50" cy="55" r="5" fill="#321603" opacity="0.8" />
    </pattern>
  </defs>
  <style>
    @import url('https://fonts.googleapis.com/css2?family=Lilita+One&family=Luckiest+Guy&display=swap');
    text { font-family: 'Lilita One', sans-serif; }
    
    .hud-text { fill: #ffffff; font-size: 14px; font-weight: normal; }
    .hud-value { fill: #ffffff; font-size: 16px; font-weight: normal; }
    
    .hero-title { 
      font-family: 'Luckiest Guy', cursive;
      font-size: 52px; 
      fill: #ffffff;
      paint-order: stroke; 
      stroke: #000000; 
      stroke-width: 10px; 
      stroke-linejoin: round; 
      letter-spacing: 2px;
    }
    .hero-subtitle { 
      font-family: 'Luckiest Guy', cursive;
      font-size: 20px; 
      fill: #ffffff; 
      paint-order: stroke; 
      stroke: #000000; 
      stroke-width: 5px; 
      stroke-linejoin: round; 
    }
    
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
    <circle cx="0" cy="0" r="${r}" fill="#78ce12" stroke="#325a03" stroke-width="2" />
    <ellipse cx="0" cy="5" rx="9" ry="6" fill="#9df033" stroke="#325a03" stroke-width="1.5" />
    <circle cx="-3" cy="4" r="2" fill="#325a03" />
    <circle cx="3" cy="4" r="2" fill="#325a03" />
    <circle cx="-7" cy="-3" r="4" fill="#ffffff" stroke="#325a03" stroke-width="1" />
    <circle cx="-6" cy="-3" r="1.5" fill="#000" />
    <circle cx="7" cy="-3" r="4" fill="#ffffff" stroke="#325a03" stroke-width="1" />
    <circle cx="6" cy="-3" r="1.5" fill="#000" />
    
    ${isDev ? `
    <path d="M -18 0 C -18 -20 18 -20 18 0" fill="none" stroke="#333" stroke-width="3" />
    <rect x="-22" y="-5" width="6" height="12" rx="3" fill="#ff0000" />
    <rect x="16" y="-5" width="6" height="12" rx="3" fill="#ff0000" />
    ` : `
    <ellipse cx="0" cy="-14" rx="14" ry="4" fill="#fcdb9c" stroke="#a35712" stroke-width="1.5" />
    <path d="M -8 -15 C -8 -25 8 -25 8 -15 Z" fill="#fcdb9c" stroke="#a35712" stroke-width="1.5" />
    <path d="M -8 -16 Q 0 -13 8 -16" fill="none" stroke="#2b5ff" stroke-width="2" />
    `}
  </g>
`;

const renderSlingshot = (x: number, y: number) => `
  <g transform="translate(${x}, ${y})">
    <path d="M -15 -80 L -70 -50" stroke="#4a1803" stroke-width="8" stroke-linecap="round" />
    <path d="M 0 0 L 0 -50 L -20 -90 M 0 -50 L 20 -90" fill="none" stroke="#a35712" stroke-width="16" stroke-linecap="round" stroke-linejoin="round" />
    <path d="M 0 0 L 0 -50 L -20 -90 M 0 -50 L 20 -90" fill="none" stroke="#783c07" stroke-width="4" stroke-linecap="round" stroke-linejoin="round" opacity="0.5" />
    <path d="M -80 -60 Q -70 -40 -60 -60" fill="none" stroke="#783c07" stroke-width="14" stroke-linecap="round" />
    <path d="M 15 -80 L -65 -50" stroke="#4a1803" stroke-width="8" stroke-linecap="round" />
  </g>
`;

const renderDevBird = (x: number, y: number) => `
  <g transform="translate(${x}, ${y})">
    <ellipse cx="0" cy="0" rx="25" ry="30" fill="#ffffff" stroke="#000" stroke-width="2" />
    <circle cx="-15" cy="5" r="4" fill="#ffd500" opacity="0.6" />
    <circle cx="15" cy="5" r="4" fill="#ffd500" opacity="0.6" />
    <path d="M -20 15 Q 0 35 20 15 Q 0 30 -20 15 Z" fill="#e0e0e0" />
    <rect x="-18" y="-12" width="16" height="10" rx="2" fill="#333" stroke="#000" stroke-width="2" />
    <rect x="2" y="-12" width="16" height="10" rx="2" fill="#333" stroke="#000" stroke-width="2" />
    <path d="M -2 -7 L 2 -7" stroke="#000" stroke-width="2" />
    <path d="M -18 -7 L -25 -5 M 18 -7 L 25 -5" stroke="#000" stroke-width="2" />
    <path d="M -10 2 L 10 2 L 0 15 Z" fill="#ffb700" stroke="#000" stroke-width="2" />
    <path d="M -5 -30 C -15 -40 5 -45 5 -30 Z" fill="#000" />
    <path d="M 0 -30 C 15 -45 25 -35 10 -25 Z" fill="#000" />
    <text x="0" y="24" font-family="monospace" font-size="12" font-weight="bold" fill="#333" text-anchor="middle">&lt;/&gt;</text>
  </g>
`;

// GLOBAL DIMENSIONS
const W = 1200;
const H = 400; // Standardized grid size

export function generateSkyScene(stats: UserStats): string {
  return `
    <svg width="${W}" height="${H}" viewBox="0 0 ${W} ${H}" xmlns="http://www.w3.org/2000/svg">
      ${getCommonStyles()}
      <rect width="${W}" height="${H}" fill="url(#skyGrad)" />
      
      <!-- Fluffy Clouds -->
      ${renderCloud(150, 150, 1.2)}
      ${renderCloud(850, 100, 0.8)}
      ${renderCloud(1150, 80, 1.5)}

      <!-- Rolling Hills (Background) -->
      <path d="M 0 320 Q 200 250 400 320 T 800 320 T 1200 280 L 1200 400 L 0 400 Z" fill="url(#hillBack)" />
      <path d="M 0 350 Q 250 280 500 350 T 1000 320 T 1200 380 L 1200 400 L 0 400 Z" fill="url(#hillFront)" />
      
      <!-- Ground & Cliff -->
      ${renderDirtGrass(W, 360)}
      
      <!-- Left Cliff for Slingshot -->
      <path d="M 0 300 L 150 300 L 150 400 L 0 400 Z" fill="url(#dirtGrad)" />
      <path d="M 0 300 L 150 300 L 150 400 L 0 400 Z" fill="url(#dirtTexture)" />
      <path d="M 0 300 L 150 300 L 150 315 L 0 315 Z" fill="url(#grassGrad)" stroke="#2b5f07" stroke-width="2" />
      
      <!-- Right Fortress Platform -->
      <path d="M 900 320 L 1200 320 L 1200 400 L 900 400 Z" fill="url(#dirtGrad)" />
      <path d="M 900 320 L 1200 320 L 1200 400 L 900 400 Z" fill="url(#dirtTexture)" />
      <path d="M 900 320 L 1200 320 L 1200 335 L 900 335 Z" fill="url(#grassGrad)" stroke="#2b5f07" stroke-width="2" />
      
      <!-- Slingshot & Bird (Left, sitting firmly on the cliff) -->
      ${renderSlingshot(50, 300)}
      ${renderDevBird(10, 255)}

      <!-- Center Typography: Angry Birds Style -->
      <text x="600" y="200" class="hero-title" text-anchor="middle" filter="url(#textShadow)">KAMANNAGARI BHAVITHAGNA</text>
      <text x="600" y="240" class="hero-subtitle" text-anchor="middle" filter="url(#textShadow)">&gt; AI ENGINEER &amp; FULL STACK DEVELOPER &lt;</text>

      <!-- The Wood Fortress (Right Edge, sitting firmly on platform) -->
      <g transform="translate(1000, 320)">
        ${renderWoodBlock(0, -40, 40, 40)}
        ${renderWoodBlock(80, -40, 40, 40)}
        ${renderWoodBlock(40, -100, 120, 20)}
        ${renderBugPig(60, -20)}
        
        ${renderWoodBlock(40, -160, 20, 60)}
        ${renderWoodBlock(140, -160, 20, 60)}
        ${renderWoodBlock(40, -180, 120, 20)}
        ${renderBugPig(90, -120)}
      </g>

      <!-- Top HUD (Spread evenly) -->
      <g transform="translate(100, 30)" filter="url(#textShadow)">
        <text x="0" y="0" class="hud-label" text-anchor="middle">PLAYER</text>
        <text x="0" y="20" class="hud-value" text-anchor="middle">${stats.name.split(' ')[0].toUpperCase()}</text>
      </g>
      <g transform="translate(433, 30)" filter="url(#textShadow)">
        <text x="0" y="0" class="hud-label" text-anchor="middle">COINS</text>
        <text x="0" y="20" class="hud-value" text-anchor="middle">x${stats.totalStars}</text>
      </g>
      <g transform="translate(766, 30)" filter="url(#textShadow)">
        <text x="0" y="0" class="hud-label" text-anchor="middle">WORLD</text>
        <text x="0" y="20" class="hud-value" text-anchor="middle">${stats.publicRepos}-1</text>
      </g>
      <g transform="translate(1100, 30)" filter="url(#textShadow)">
        <text x="0" y="0" class="hud-label" text-anchor="middle">TIME</text>
        <text x="0" y="20" class="hud-value" text-anchor="middle">${new Date().getFullYear()}</text>
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
  return `
    <svg width="${W}" height="${H}" viewBox="0 0 ${W} ${H}" xmlns="http://www.w3.org/2000/svg">
      ${getCommonStyles()}
      <rect width="${W}" height="${H}" fill="url(#dirtGrad)" />
      <rect width="${W}" height="${H}" fill="url(#dirtTexture)" />
      
      <path d="M 0 0 C 300 300 900 300 1200 0 L 1200 400 L 0 400 Z" fill="url(#skyGrad)" />
      ${renderCloud(500, 100, 1)}
      
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
      <text x="600" y="80" class="hud-label" font-size="18" text-anchor="middle">SKILL ARSENAL FOUND</text>
      
      ${gems}
    </svg>
  `;
}

export function generateDungeonScene(): string {
  return `
    <svg width="${W}" height="${H}" viewBox="0 0 ${W} ${H}" xmlns="http://www.w3.org/2000/svg">
      ${getCommonStyles()}
      <rect width="${W}" height="${H}" fill="url(#dungeonGrad)" />
      
      <pattern id="stone" width="60" height="30" patternUnits="userSpaceOnUse">
        <rect width="60" height="30" fill="none" stroke="#111" stroke-width="2" />
        <rect width="30" height="15" fill="#1a1a1a" />
        <rect x="30" y="15" width="30" height="15" fill="#1a1a1a" />
      </pattern>
      <rect width="${W}" height="${H}" fill="url(#stone)" opacity="0.3" />

      <text x="600" y="80" class="hud-label" font-size="24" fill="#ff4444" text-anchor="middle">FINAL BOSS: GATE 2027</text>
      
      <g transform="translate(600, 300)">
        <rect x="-150" y="-50" width="300" height="50" fill="#222" stroke="#000" stroke-width="4" />
        <rect x="-100" y="-150" width="200" height="100" fill="#333" stroke="#000" stroke-width="4" />
        ${renderBugPig(0, -100, 50, true)}
        <rect x="-150" y="-200" width="300" height="20" fill="#000" stroke="#fff" stroke-width="2" />
        <rect x="-148" y="-198" width="296" height="16" fill="#ff0000" />
      </g>
      
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
