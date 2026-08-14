import fs from 'fs';
import path from 'path';
import { UserStats } from './fetcher';

// Vibrant Game Palette
const colors = {
  skyStart: '#7dd3fc',
  skyEnd: '#38bdf8',
  grassTop: '#a3e635',
  grassSide: '#65a30d',
  woodLight: '#d97706',
  woodDark: '#92400e',
  stoneLight: '#94a3b8',
  stoneDark: '#475569',
  hudBg: 'rgba(0, 0, 0, 0.4)',
  white: '#ffffff',
  star: '#fbbf24',
  text: '#ffffff',
};

const getCommonStyles = () => `
  <style>
    @import url('https://fonts.googleapis.com/css2?family=Luckiest+Guy&amp;display=swap');
    
    .game-text {
      font-family: 'Luckiest Guy', cursive;
      fill: ${colors.text};
      letter-spacing: 1px;
    }
    
    .hud-text {
      font-family: 'Luckiest Guy', cursive;
      fill: ${colors.white};
      font-size: 16px;
      text-shadow: 2px 2px 0 #000;
    }
    
    .title-text {
      font-family: 'Luckiest Guy', cursive;
      font-size: 32px;
      fill: ${colors.white};
      text-shadow: 3px 3px 0 #000;
    }

    @keyframes cloudMove {
      from { transform: translateX(100%); }
      to { transform: translateX(-100%); }
    }
    
    @keyframes birdBounce {
      0%, 100% { transform: translateY(0) scale(1); }
      50% { transform: translateY(-3px) scale(1.02); }
    }
    
    @keyframes bugJiggle {
      0%, 100% { transform: rotate(0deg); }
      25% { transform: rotate(-5deg); }
      75% { transform: rotate(5deg); }
    }
    
    @keyframes siren {
      0%, 100% { fill: #ef4444; opacity: 0.8; }
      50% { fill: #fca5a5; opacity: 0.2; }
    }
    
    .animate-cloud { animation: cloudMove 20s linear infinite; }
    .animate-bird { animation: birdBounce 2s ease-in-out infinite; transform-origin: center; }
    .animate-bug { animation: bugJiggle 1s ease-in-out infinite; transform-origin: center; }
    .animate-siren { animation: siren 1s infinite; }
  </style>
`;

const getSkyBackground = (width: number, height: number, includeClouds = true) => `
  <defs>
    <linearGradient id="skyGrad" x1="0" y1="0" x2="0" y2="1">
      <stop offset="0%" stop-color="${colors.skyStart}" />
      <stop offset="100%" stop-color="${colors.skyEnd}" />
    </linearGradient>
  </defs>
  <rect width="${width}" height="${height}" fill="url(#skyGrad)" />
  ${includeClouds ? `
    <g class="animate-cloud" style="animation-duration: 30s; opacity: 0.8;">
      <path d="M50 40 Q70 20 90 40 Q110 30 120 50 Q130 70 90 70 L50 70 Q30 70 30 50 Q30 30 50 40 Z" fill="#ffffff"/>
      <path d="M600 80 Q620 60 640 80 Q660 70 670 90 Q680 110 640 110 L600 110 Q580 110 580 90 Q580 70 600 80 Z" fill="#ffffff" transform="scale(0.8)"/>
      <path d="M300 20 Q320 0 340 20 Q360 10 370 30 Q380 50 340 50 L300 50 Q280 50 280 30 Q280 10 300 20 Z" fill="#ffffff" transform="scale(1.2)"/>
    </g>
  ` : ''}
`;

const getGrassGround = (width: number, y: number, height: number) => `
  <rect x="0" y="${y}" width="${width}" height="${height}" fill="${colors.grassSide}" />
  <rect x="0" y="${y}" width="${width}" height="15" fill="${colors.grassTop}" />
  <!-- Grass tufts -->
  <path d="M 50 ${y} L 55 ${y-10} L 60 ${y} Z" fill="${colors.grassTop}" />
  <path d="M 150 ${y} L 155 ${y-15} L 165 ${y} Z" fill="${colors.grassTop}" />
  <path d="M 450 ${y} L 460 ${y-12} L 465 ${y} Z" fill="${colors.grassTop}" />
  <path d="M 700 ${y} L 705 ${y-8} L 710 ${y} Z" fill="${colors.grassTop}" />
`;

const getHUD = (stats: UserStats) => `
  <rect x="10" y="10" width="780" height="40" rx="20" fill="${colors.hudBg}" />
  <!-- Player -->
  <circle cx="30" cy="30" r="15" fill="#ef4444" stroke="#fff" stroke-width="2"/>
  <text x="55" y="36" class="hud-text">${stats.name.toUpperCase()}</text>
  
  <!-- Coins / Stars -->
  <circle cx="280" cy="30" r="10" fill="${colors.star}" stroke="#b45309" stroke-width="2"/>
  <text x="300" y="36" class="hud-text">STARS: ${stats.totalStars}</text>
  
  <!-- Score / Contributions -->
  <text x="450" y="36" class="hud-text">SCORE: ${stats.totalCommits}</text>
  
  <!-- Level / Repos -->
  <text x="650" y="36" class="hud-text">LVL ${stats.publicRepos}</text>
`;

export function generateHeroBanner(stats: UserStats): string {
  return `
    <svg width="800" height="300" viewBox="0 0 800 300" xmlns="http://www.w3.org/2000/svg">
      ${getCommonStyles()}
      ${getSkyBackground(800, 300)}
      ${getGrassGround(800, 220, 80)}
      ${getHUD(stats)}

      <!-- Giant Game Logo -->
      <g transform="translate(400, 100)">
        <text x="0" y="0" class="game-text" font-size="56" text-anchor="middle" fill="#ef4444" stroke="#ffffff" stroke-width="8" stroke-linejoin="round">ANGRY DEV</text>
        <text x="0" y="0" class="game-text" font-size="56" text-anchor="middle" fill="#ef4444">ANGRY DEV</text>
        <text x="0" y="30" class="game-text" font-size="20" text-anchor="middle" fill="#fbbf24" stroke="#000" stroke-width="3">DEVELOPER VS BUGS</text>
        <text x="0" y="30" class="game-text" font-size="20" text-anchor="middle" fill="#fbbf24">DEVELOPER VS BUGS</text>
      </g>

      <!-- Slingshot -->
      <g transform="translate(150, 150)">
        <rect x="0" y="0" width="10" height="70" fill="${colors.woodDark}" />
        <path d="M -20 -30 L 0 0 L 20 -30" fill="none" stroke="${colors.woodDark}" stroke-width="12" stroke-linejoin="round"/>
        <!-- Slingshot Band -->
        <path d="M -18 -30 L -40 -10 L 18 -30" fill="none" stroke="#451a03" stroke-width="6"/>
      </g>

      <!-- Python Bird -->
      <g transform="translate(100, 130)" class="animate-bird">
        <!-- Body -->
        <circle cx="10" cy="10" r="25" fill="#3b82f6" />
        <!-- Belly -->
        <circle cx="10" cy="20" r="15" fill="#93c5fd" />
        <!-- Eyes -->
        <circle cx="0" cy="0" r="8" fill="white" />
        <circle cx="20" cy="0" r="8" fill="white" />
        <circle cx="2" cy="0" r="3" fill="black" />
        <circle cx="22" cy="0" r="3" fill="black" />
        <!-- Eyebrows -->
        <rect x="-8" y="-12" width="15" height="4" fill="black" transform="rotate(15, -8, -12)" />
        <rect x="15" y="-10" width="15" height="4" fill="black" transform="rotate(-15, 15, -10)" />
        <!-- Beak -->
        <path d="M 5 5 L 25 5 L 15 15 Z" fill="#fbbf24" />
      </g>

      <!-- Bug Fortress -->
      <g transform="translate(550, 120)">
        <!-- Stone base -->
        <rect x="0" y="80" width="150" height="20" fill="${colors.stoneLight}" stroke="${colors.stoneDark}" stroke-width="2"/>
        <!-- Wood towers -->
        <rect x="20" y="0" width="20" height="80" fill="${colors.woodLight}" stroke="${colors.woodDark}" stroke-width="2"/>
        <rect x="110" y="20" width="20" height="60" fill="${colors.woodLight}" stroke="${colors.woodDark}" stroke-width="2"/>
        <!-- Glass/Ice block -->
        <rect x="40" y="60" width="70" height="20" fill="#bae6fd" stroke="#7dd3fc" stroke-width="2" opacity="0.8"/>
        <!-- Wood roof -->
        <rect x="10" y="-10" width="130" height="10" fill="${colors.woodLight}" stroke="${colors.woodDark}" stroke-width="2"/>
      </g>

      <!-- Bugs -->
      <g transform="translate(575, 100)" class="animate-bug">
        <circle cx="0" cy="0" r="15" fill="#84cc16" />
        <circle cx="-5" cy="-5" r="4" fill="white" />
        <circle cx="5" cy="-5" r="4" fill="white" />
        <circle cx="-4" cy="-5" r="1.5" fill="black" />
        <circle cx="6" cy="-5" r="1.5" fill="black" />
        <!-- Snout -->
        <ellipse cx="0" cy="5" rx="6" ry="4" fill="#65a30d" />
      </g>

      <g transform="translate(680, 130)" class="animate-bug" style="animation-delay: 0.5s">
        <circle cx="0" cy="0" r="12" fill="#84cc16" />
        <circle cx="-4" cy="-4" r="3" fill="white" />
        <circle cx="4" cy="-4" r="3" fill="white" />
        <circle cx="-3" cy="-4" r="1" fill="black" />
        <circle cx="5" cy="-4" r="1" fill="black" />
        <ellipse cx="0" cy="3" rx="4" ry="3" fill="#65a30d" />
      </g>
    </svg>
  `;
}

export function generateWorldMap(): string {
  return `
    <svg width="800" height="250" viewBox="0 0 800 250" xmlns="http://www.w3.org/2000/svg">
      ${getCommonStyles()}
      <rect width="800" height="250" fill="${colors.grassTop}" />
      
      <!-- Dirt Path -->
      <path d="M 0 150 Q 150 100 250 150 T 500 120 T 700 180 L 800 180 L 800 250 L 0 250 Z" fill="#d97706" opacity="0.5"/>
      <path d="M 0 160 Q 150 110 250 160 T 500 130 T 700 190" fill="none" stroke="#fef3c7" stroke-width="4" stroke-dasharray="10,10" opacity="0.8"/>

      <text x="400" y="40" class="title-text" text-anchor="middle">WORLD SELECT</text>

      <!-- Location Markers -->
      <g transform="translate(100, 160)">
        <rect x="-4" y="-30" width="8" height="30" fill="${colors.woodDark}" />
        <circle cx="0" cy="-35" r="15" fill="#ef4444" stroke="#fff" stroke-width="3" />
        <text y="-60" class="hud-text" text-anchor="middle" font-size="14">W1: MobileHub</text>
      </g>

      <g transform="translate(300, 160)">
        <rect x="-4" y="-30" width="8" height="30" fill="${colors.woodDark}" />
        <circle cx="0" cy="-35" r="15" fill="#3b82f6" stroke="#fff" stroke-width="3" />
        <text y="-60" class="hud-text" text-anchor="middle" font-size="14">W2: Spitch Is.</text>
      </g>

      <g transform="translate(500, 130)">
        <rect x="-4" y="-30" width="8" height="30" fill="${colors.woodDark}" />
        <circle cx="0" cy="-35" r="15" fill="#f59e0b" stroke="#fff" stroke-width="3" />
        <text y="-60" class="hud-text" text-anchor="middle" font-size="14">W3: Hope City</text>
      </g>

      <!-- Boss Node -->
      <g transform="translate(700, 190)" class="animate-bird">
        <rect x="-5" y="-40" width="10" height="40" fill="${colors.stoneDark}" />
        <path d="M 0 -70 L 25 -40 L -25 -40 Z" fill="#ef4444" stroke="#fff" stroke-width="3"/>
        <text y="-80" class="hud-text" text-anchor="middle" font-size="14" fill="#ef4444">BOSS</text>
      </g>
    </svg>
  `;
}

export function generatePowerups(): string {
  const birds = [
    { name: 'PYTHON', color1: '#3b82f6', color2: '#93c5fd', type: 'circle' },
    { name: 'ML', color1: '#f59e0b', color2: '#fde68a', type: 'triangle' },
    { name: 'REACT', color1: '#06b6d4', color2: '#67e8f9', type: 'circle' },
    { name: 'FASTAPI', color1: '#10b981', color2: '#6ee7b7', type: 'square' },
  ];

  let items = '';
  birds.forEach((bird, i) => {
    const x = 150 + (i * 160);
    let shape = '';
    
    if (bird.type === 'circle') {
      shape = `<circle cx="0" cy="0" r="25" fill="${bird.color1}" />
               <circle cx="0" cy="10" r="15" fill="${bird.color2}" />`;
    } else if (bird.type === 'triangle') {
      shape = `<path d="M 0 -25 L 25 20 L -25 20 Z" fill="${bird.color1}" />
               <path d="M 0 0 L 15 20 L -15 20 Z" fill="${bird.color2}" />`;
    } else {
      shape = `<rect x="-22" y="-22" width="44" height="44" rx="8" fill="${bird.color1}" />
               <rect x="-15" y="-5" width="30" height="25" rx="5" fill="${bird.color2}" />`;
    }

    items += `
      <g transform="translate(${x}, 150)">
        <!-- Podium -->
        <rect x="-30" y="30" width="60" height="20" fill="${colors.woodLight}" stroke="${colors.woodDark}" stroke-width="3" />
        
        <g class="animate-bird" style="animation-delay: ${i * 0.2}s">
          ${shape}
          <!-- Generic Eyes -->
          <circle cx="-8" cy="-5" r="5" fill="white" />
          <circle cx="8" cy="-5" r="5" fill="white" />
          <circle cx="-7" cy="-5" r="2" fill="black" />
          <circle cx="9" cy="-5" r="2" fill="black" />
          <path d="M -5 5 L 5 5 L 0 12 Z" fill="#fbbf24" />
        </g>
        
        <text y="75" class="hud-text" text-anchor="middle" font-size="14">${bird.name}</text>
      </g>
    `;
  });

  return `
    <svg width="800" height="250" viewBox="0 0 800 250" xmlns="http://www.w3.org/2000/svg">
      ${getCommonStyles()}
      ${getSkyBackground(800, 250, false)}
      ${getGrassGround(800, 200, 50)}
      
      <text x="400" y="50" class="title-text" text-anchor="middle">SKILL BIRDS</text>
      
      ${items}
    </svg>
  `;
}

export function generateProjectWorlds(): string {
  const projects = [
    { name: 'MobileHub', stars: 3 },
    { name: 'Spitch Is.', stars: 2 },
    { name: 'Hope Travel', stars: 3 },
    { name: 'AgriIntel', stars: 3 },
  ];

  let boards = '';
  projects.forEach((proj, i) => {
    const x = 110 + (i * 190);
    
    let starGroup = '';
    for(let s=0; s<3; s++) {
      const fill = s < proj.stars ? colors.star : '#475569';
      starGroup += `<path d="M ${s*30 - 30} 10 L ${s*30 - 25} 25 L ${s*30 - 10} 25 L ${s*30 - 20} 35 L ${s*30 - 15} 50 L ${s*30 - 30} 40 L ${s*30 - 45} 50 L ${s*30 - 40} 35 L ${s*30 - 50} 25 L ${s*30 - 35} 25 Z" fill="${fill}" transform="scale(0.8) translate(15, -10)"/>`;
    }

    boards += `
      <g transform="translate(${x}, 120)">
        <!-- Chains -->
        <rect x="-40" y="-80" width="4" height="40" fill="${colors.stoneLight}" />
        <rect x="36" y="-80" width="4" height="40" fill="${colors.stoneLight}" />
        <!-- Wood Board -->
        <rect x="-60" y="-40" width="120" height="90" rx="10" fill="${colors.woodLight}" stroke="${colors.woodDark}" stroke-width="4" />
        <rect x="-50" y="-30" width="100" height="70" rx="5" fill="#fef3c7" opacity="0.3" />
        
        <text y="-10" class="game-text" font-size="14" text-anchor="middle" fill="${colors.woodDark}">${proj.name}</text>
        <text y="35" class="game-text" font-size="12" text-anchor="middle" fill="#15803d">CLEARED!</text>
        
        <!-- Stars -->
        <g transform="translate(0, 0)">
          ${starGroup}
        </g>
      </g>
    `;
  });

  return `
    <svg width="800" height="250" viewBox="0 0 800 250" xmlns="http://www.w3.org/2000/svg">
      ${getCommonStyles()}
      <rect width="800" height="250" fill="${colors.woodDark}" />
      <!-- Planks texture -->
      <path d="M 0 50 L 800 50 M 0 100 L 800 100 M 0 150 L 800 150 M 0 200 L 800 200" stroke="#78350f" stroke-width="2" />
      
      <text x="400" y="50" class="title-text" text-anchor="middle">LEVEL COMPLETE</text>
      
      ${boards}
    </svg>
  `;
}

export function generateBossBattle(): string {
  return `
    <svg width="800" height="250" viewBox="0 0 800 250" xmlns="http://www.w3.org/2000/svg">
      ${getCommonStyles()}
      <!-- Stormy Sky -->
      <defs>
        <linearGradient id="stormGrad" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stop-color="#1e1b4b" />
          <stop offset="100%" stop-color="#4c1d95" />
        </linearGradient>
      </defs>
      <rect width="800" height="250" fill="url(#stormGrad)" />
      
      <!-- Warning Vignette -->
      <rect class="animate-siren" width="800" height="250" />
      
      ${getGrassGround(800, 200, 50)}

      <text x="400" y="50" class="title-text" text-anchor="middle" fill="#ef4444" stroke="#7f1d1d" stroke-width="4">FINAL BOSS: GATE 2027</text>
      <text x="400" y="50" class="title-text" text-anchor="middle" fill="#ef4444">FINAL BOSS: GATE 2027</text>

      <!-- Giant Fortress -->
      <g transform="translate(300, 100)">
        <rect x="0" y="20" width="200" height="80" fill="${colors.stoneDark}" stroke="#1e293b" stroke-width="4" />
        <!-- Battlements -->
        <rect x="0" y="0" width="30" height="20" fill="${colors.stoneDark}" />
        <rect x="56" y="0" width="30" height="20" fill="${colors.stoneDark}" />
        <rect x="112" y="0" width="30" height="20" fill="${colors.stoneDark}" />
        <rect x="170" y="0" width="30" height="20" fill="${colors.stoneDark}" />
        
        <!-- Big Boss Bug -->
        <circle cx="100" cy="50" r="30" fill="#84cc16" />
        <circle cx="85" cy="40" r="8" fill="white" />
        <circle cx="115" cy="40" r="8" fill="white" />
        <circle cx="85" cy="40" r="3" fill="#ef4444" />
        <circle cx="115" cy="40" r="3" fill="#ef4444" />
        <!-- Crown -->
        <path d="M 80 15 L 90 25 L 100 10 L 110 25 L 120 15 Z" fill="${colors.star}" />
      </g>

      <!-- Boss Health Bar -->
      <g transform="translate(150, 70)">
        <rect width="500" height="20" fill="#000" stroke="#fff" stroke-width="2" />
        <rect x="2" y="2" width="496" height="16" fill="#ef4444" />
      </g>
    </svg>
  `;
}

export function generateAchievements(): string {
  return `
    <svg width="800" height="150" viewBox="0 0 800 150" xmlns="http://www.w3.org/2000/svg">
      ${getCommonStyles()}
      <rect width="800" height="150" fill="${colors.stoneLight}" />
      
      <!-- Stone Shelf -->
      <rect x="0" y="100" width="800" height="30" fill="${colors.stoneDark}" />
      <rect x="0" y="130" width="800" height="20" fill="#334155" />

      <text x="400" y="40" class="title-text" text-anchor="middle">TROPHY ROOM</text>

      <g transform="translate(150, 60)">
        <!-- Gold Cup -->
        <path d="M -15 0 Q -30 0 -20 15 Q -10 20 0 20 L 0 40 L -15 40 L 15 40 L 0 40 L 0 20 Q 10 20 20 15 Q 30 0 15 0 Z" fill="${colors.star}" />
        <circle cx="0" cy="10" r="5" fill="#fef3c7" />
        <text y="-10" class="hud-text" text-anchor="middle" font-size="12">AI ENGINEER</text>
      </g>

      <g transform="translate(400, 60)">
        <!-- Medal -->
        <circle cx="0" cy="20" r="15" fill="#fbbf24" stroke="#d97706" stroke-width="2"/>
        <path d="M -10 -10 L 0 5 L 10 -10 Z" fill="#ef4444" />
        <text y="-10" class="hud-text" text-anchor="middle" font-size="12">FULL STACK</text>
      </g>

      <g transform="translate(650, 60)">
        <!-- Star Trophy -->
        <path d="M 0 0 L 10 15 L 25 15 L 12 25 L 17 40 L 0 30 L -17 40 L -12 25 L -25 15 L -10 15 Z" fill="${colors.star}" />
        <text y="-10" class="hud-text" text-anchor="middle" font-size="12">HACKATHON</text>
      </g>
    </svg>
  `;
}

// Function to write files
export function writeSvg(filename: string, content: string) {
  const dir = path.join(process.cwd(), 'assets', 'generated');
  if (!fs.existsSync(dir)) {
    fs.mkdirSync(dir, { recursive: true });
  }
  fs.writeFileSync(path.join(dir, filename), content.trim());
}
