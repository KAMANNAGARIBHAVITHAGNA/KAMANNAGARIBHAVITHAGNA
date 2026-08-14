import fs from 'fs';
import path from 'path';
import { UserStats } from './fetcher';

const colors = {
  star: '#fbbf24',
};

// Define complex vector styling and filters
const getDefs = () => `
  <defs>
    <!-- Sky Gradient -->
    <linearGradient id="skyGrad" x1="0" y1="0" x2="0" y2="1">
      <stop offset="0%" stop-color="#38bdf8" />
      <stop offset="100%" stop-color="#bae6fd" />
    </linearGradient>
    
    <!-- Stormy Sky Gradient -->
    <linearGradient id="stormGrad" x1="0" y1="0" x2="0" y2="1">
      <stop offset="0%" stop-color="#1e1b4b" />
      <stop offset="40%" stop-color="#312e81" />
      <stop offset="100%" stop-color="#4c1d95" />
    </linearGradient>
    
    <!-- Grass Gradient -->
    <linearGradient id="grassGrad" x1="0" y1="0" x2="0" y2="1">
      <stop offset="0%" stop-color="#84cc16" />
      <stop offset="100%" stop-color="#4d7c0f" />
    </linearGradient>

    <!-- Wood Texture Gradient -->
    <linearGradient id="woodGrad" x1="0" y1="0" x2="1" y2="0">
      <stop offset="0%" stop-color="#b45309" />
      <stop offset="50%" stop-color="#d97706" />
      <stop offset="100%" stop-color="#92400e" />
    </linearGradient>

    <!-- Stone Gradient -->
    <linearGradient id="stoneGrad" x1="0" y1="0" x2="0" y2="1">
      <stop offset="0%" stop-color="#94a3b8" />
      <stop offset="100%" stop-color="#475569" />
    </linearGradient>

    <!-- Shadow Filter -->
    <filter id="dropShadow" x="-20%" y="-20%" width="140%" height="140%">
      <feDropShadow dx="0" dy="4" stdDeviation="4" flood-opacity="0.3" />
    </filter>
    
    <filter id="glow" x="-20%" y="-20%" width="140%" height="140%">
      <feGaussianBlur stdDeviation="5" result="blur" />
      <feComposite in="SourceGraphic" in2="blur" operator="over" />
    </filter>
  </defs>
`;

const getCommonStyles = () => `
  ${getDefs()}
  <style>
    @import url('https://fonts.googleapis.com/css2?family=Lilita+One&amp;display=swap');
    
    text {
      font-family: 'Lilita One', sans-serif;
    }
    
    .hud-text {
      fill: #ffffff;
      font-size: 18px;
      paint-order: stroke;
      stroke: #000000;
      stroke-width: 4px;
      stroke-linecap: round;
      stroke-linejoin: round;
    }
    
    .title-text {
      fill: #ffffff;
      font-size: 40px;
      paint-order: stroke;
      stroke: #000000;
      stroke-width: 8px;
      stroke-linecap: round;
      stroke-linejoin: round;
    }

    @keyframes cloudDrift {
      0% { transform: translateX(100%); }
      100% { transform: translateX(-100%); }
    }
    
    @keyframes birdHover {
      0%, 100% { transform: translateY(0) rotate(0deg); }
      50% { transform: translateY(-5px) rotate(2deg); }
    }
    
    @keyframes bossHover {
      0%, 100% { transform: translateY(0); }
      50% { transform: translateY(-10px); }
    }

    @keyframes lightning {
      0%, 95%, 100% { opacity: 0; }
      96%, 98% { opacity: 1; }
      97% { opacity: 0.5; }
    }
    
    @keyframes alertBlink {
      0%, 100% { fill: #ef4444; opacity: 0.8; }
      50% { fill: #fca5a5; opacity: 0.2; }
    }

    .animate-cloud { animation: cloudDrift 40s linear infinite; }
    .animate-bird { animation: birdHover 2s ease-in-out infinite; }
    .animate-boss { animation: bossHover 3s ease-in-out infinite; }
    .animate-lightning { animation: lightning 5s infinite; }
    .animate-alert { animation: alertBlink 1s infinite; }
  </style>
`;

const getBackground = (stormy = false) => `
  <rect width="800" height="300" fill="url(#${stormy ? 'stormGrad' : 'skyGrad'})" />
  
  <!-- Distant Mountains -->
  <path d="M 0 300 L 150 150 L 300 300 Z" fill="${stormy ? '#312e81' : '#60a5fa'}" opacity="0.6" />
  <path d="M 200 300 L 400 100 L 600 300 Z" fill="${stormy ? '#1e1b4b' : '#93c5fd'}" opacity="0.5" />
  <path d="M 500 300 L 650 120 L 800 300 Z" fill="${stormy ? '#3730a3' : '#3b82f6'}" opacity="0.4" />
  
  <!-- Clouds -->
  <g class="animate-cloud" style="animation-duration: 45s;">
    <path d="M 100 80 Q 120 60 140 80 Q 160 70 170 90 Q 180 110 140 110 L 100 110 Q 80 110 80 90 Q 80 70 100 80 Z" fill="${stormy ? '#475569' : '#ffffff'}" opacity="0.8" />
  </g>
  <g class="animate-cloud" style="animation-duration: 35s; animation-delay: -15s;">
    <path d="M 600 60 Q 620 40 640 60 Q 660 50 670 70 Q 680 90 640 90 L 600 90 Q 580 90 580 70 Q 580 50 600 60 Z" fill="${stormy ? '#334155' : '#ffffff'}" opacity="0.6" transform="scale(1.5) translate(-200, -20)" />
  </g>

  <!-- Foreground Grass Hill -->
  <path d="M -50 300 Q 400 200 850 300 L 850 400 L -50 400 Z" fill="url(#grassGrad)" stroke="#166534" stroke-width="4" />
`;

const renderSlingshot = (x: number, y: number) => `
  <g transform="translate(${x}, ${y})">
    <!-- Back band -->
    <path d="M -25 -60 L -60 -20" stroke="#451a03" stroke-width="8" stroke-linecap="round" />
    
    <!-- Base Wood -->
    <path d="M 0 0 L 0 -40 L -25 -70 M 0 -40 L 25 -70" fill="none" stroke="url(#woodGrad)" stroke-width="16" stroke-linecap="round" stroke-linejoin="round" filter="url(#dropShadow)"/>
    <path d="M 0 0 L 0 -40 L -25 -70 M 0 -40 L 25 -70" fill="none" stroke="#78350f" stroke-width="16" stroke-linecap="round" stroke-linejoin="round" opacity="0.5"/>
    
    <!-- Pouch -->
    <path d="M -70 -30 Q -60 -10 -50 -30" fill="none" stroke="#78350f" stroke-width="12" stroke-linecap="round" />
    
    <!-- Front band -->
    <path d="M 25 -60 L -45 -20" stroke="#78350f" stroke-width="8" stroke-linecap="round" />
  </g>
`;

const renderDevBird = (x: number, y: number) => `
  <g transform="translate(${x}, ${y})" class="animate-bird">
    <!-- Body -->
    <circle cx="0" cy="0" r="30" fill="#ef4444" stroke="#7f1d1d" stroke-width="3" filter="url(#dropShadow)" />
    <!-- Belly -->
    <path d="M -25 15 Q 0 35 25 15 Q 0 40 -25 15 Z" fill="#fca5a5" />
    
    <!-- AI Goggles -->
    <rect x="-18" y="-15" width="36" height="14" rx="4" fill="#1e293b" stroke="#0f172a" stroke-width="2" />
    <circle cx="-9" cy="-8" r="4" fill="#38bdf8" />
    <circle cx="9" cy="-8" r="4" fill="#38bdf8" />
    <!-- Goggle Strap -->
    <path d="M -30 -8 L -18 -8 M 18 -8 L 30 -8" stroke="#1e293b" stroke-width="4" />
    
    <!-- Eyebrows -->
    <path d="M -16 -20 L -4 -16 L 4 -16 L 16 -20" fill="none" stroke="#000" stroke-width="5" stroke-linecap="round" stroke-linejoin="round" />
    
    <!-- Beak -->
    <path d="M -10 5 L 10 5 L 0 15 Z" fill="#fbbf24" stroke="#b45309" stroke-width="2" stroke-linejoin="round" />
    
    <!-- Code Symbol on Chest -->
    <text x="0" y="22" font-family="monospace" font-size="10" font-weight="bold" fill="#7f1d1d" text-anchor="middle">&lt;/&gt;</text>
    
    <!-- Feather tuft -->
    <path d="M -5 -30 Q 0 -45 10 -35 Q 0 -35 5 -30 Z" fill="#ef4444" stroke="#7f1d1d" stroke-width="2" />
  </g>
`;

const renderBug = (x: number, y: number) => `
  <g transform="translate(${x}, ${y})">
    <!-- Body -->
    <circle cx="0" cy="0" r="16" fill="#84cc16" stroke="#3f6212" stroke-width="2" filter="url(#dropShadow)" />
    <!-- Eyes -->
    <circle cx="-6" cy="-4" r="5" fill="#ffffff" />
    <circle cx="6" cy="-4" r="5" fill="#ffffff" />
    <circle cx="-6" cy="-4" r="2" fill="#000" />
    <circle cx="6" cy="-4" r="2" fill="#000" />
    <!-- Snout -->
    <ellipse cx="0" cy="6" rx="8" ry="5" fill="#65a30d" stroke="#3f6212" stroke-width="1.5" />
    <circle cx="-3" cy="5" r="1.5" fill="#3f6212" />
    <circle cx="3" cy="5" r="1.5" fill="#3f6212" />
  </g>
`;

const renderWoodBlock = (x: number, y: number, w: number, h: number) => `
  <rect x="${x}" y="${y}" width="${w}" height="${h}" fill="url(#woodGrad)" stroke="#78350f" stroke-width="3" filter="url(#dropShadow)" />
  <!-- Grain -->
  <path d="M ${x+5} ${y+5} Q ${x+w/2} ${y+h/2} ${x+w-5} ${y+h-5}" fill="none" stroke="#78350f" stroke-width="1" opacity="0.5" />
`;

const renderStoneBlock = (x: number, y: number, w: number, h: number) => `
  <rect x="${x}" y="${y}" width="${w}" height="${h}" fill="url(#stoneGrad)" stroke="#334155" stroke-width="3" rx="2" filter="url(#dropShadow)" />
`;

const renderServerRack = (x: number, y: number, w: number, h: number) => `
  <rect x="${x}" y="${y}" width="${w}" height="${h}" fill="#1e293b" stroke="#0f172a" stroke-width="3" filter="url(#dropShadow)" />
  <rect x="${x+4}" y="${y+4}" width="${w-8}" height="8" fill="#334155" />
  <circle cx="${x+10}" cy="${y+8}" r="2" fill="#10b981" />
  <circle cx="${x+16}" cy="${y+8}" r="2" fill="#10b981" />
  
  <rect x="${x+4}" y="${y+16}" width="${w-8}" height="8" fill="#334155" />
  <circle cx="${x+10}" cy="${y+20}" r="2" fill="#ef4444" />
  <circle cx="${x+16}" cy="${y+20}" r="2" fill="#10b981" />
`;

export function generateHeroBanner(stats: UserStats): string {
  return `
    <svg width="800" height="300" viewBox="0 0 800 300" xmlns="http://www.w3.org/2000/svg">
      ${getCommonStyles()}
      ${getBackground(false)}
      
      <!-- HUD -->
      <g transform="translate(20, 30)">
        <text x="0" y="0" class="hud-text">PLAYER: ${stats.name.toUpperCase()}</text>
        <text x="250" y="0" class="hud-text">SCORE: ${stats.totalCommits}</text>
        <text x="450" y="0" class="hud-text">COINS: ${stats.totalStars}</text>
        <text x="630" y="0" class="hud-text">LVL: AI ENG</text>
      </g>

      <!-- Trajectory Dots -->
      <g fill="#ffffff" opacity="0.6">
        <circle cx="160" cy="180" r="4" />
        <circle cx="210" cy="150" r="4" />
        <circle cx="270" cy="130" r="4" />
        <circle cx="340" cy="120" r="4" />
        <circle cx="410" cy="125" r="4" />
        <circle cx="480" cy="140" r="4" />
      </g>

      ${renderSlingshot(120, 240)}
      ${renderDevBird(70, 205)}

      <!-- Bug Fortress -->
      <g transform="translate(550, 60)">
        ${renderStoneBlock(0, 160, 140, 30)}
        ${renderWoodBlock(10, 80, 20, 80)}
        ${renderServerRack(110, 80, 20, 80)}
        ${renderStoneBlock(10, 60, 120, 20)}
        ${renderWoodBlock(50, 0, 40, 60)}
        
        ${renderBug(70, 145)}
        ${renderBug(70, 45)}
        ${renderBug(115, 145)}
      </g>
    </svg>
  `;
}

export function generateWorldMap(): string {
  return `
    <svg width="800" height="300" viewBox="0 0 800 300" xmlns="http://www.w3.org/2000/svg">
      ${getCommonStyles()}
      <!-- Map Base -->
      <rect width="800" height="300" fill="url(#grassGrad)" />
      
      <!-- Winding River -->
      <path d="M 0 50 Q 200 100 400 50 T 800 150 L 800 200 Q 600 100 400 150 T 0 100 Z" fill="#38bdf8" opacity="0.8" />
      
      <!-- Winding Path -->
      <path d="M 50 250 Q 250 150 400 250 T 750 100" fill="none" stroke="#d97706" stroke-width="20" stroke-linecap="round" filter="url(#dropShadow)" />
      <path d="M 50 250 Q 250 150 400 250 T 750 100" fill="none" stroke="#fef3c7" stroke-width="4" stroke-dasharray="10, 15" stroke-linecap="round" />

      <!-- Map Elements (Trees & Mountains) -->
      <path d="M 100 100 L 130 50 L 160 100 Z" fill="#065f46" filter="url(#dropShadow)" />
      <path d="M 120 110 L 140 70 L 160 110 Z" fill="#047857" filter="url(#dropShadow)" />
      <path d="M 600 280 L 650 200 L 700 280 Z" fill="#475569" filter="url(#dropShadow)" />
      
      <!-- Location 1 -->
      <g transform="translate(100, 240)">
        <circle cx="0" cy="0" r="25" fill="#fbbf24" stroke="#b45309" stroke-width="4" filter="url(#dropShadow)" />
        <text y="5" class="hud-text" text-anchor="middle" font-size="20">1</text>
        <rect x="-60" y="20" width="120" height="24" rx="4" fill="#1e293b" />
        <text y="37" class="hud-text" text-anchor="middle" font-size="14">MobileHub</text>
      </g>
      
      <!-- Location 2 -->
      <g transform="translate(300, 180)">
        <circle cx="0" cy="0" r="25" fill="#fbbf24" stroke="#b45309" stroke-width="4" filter="url(#dropShadow)" />
        <text y="5" class="hud-text" text-anchor="middle" font-size="20">2</text>
        <rect x="-60" y="20" width="120" height="24" rx="4" fill="#1e293b" />
        <text y="37" class="hud-text" text-anchor="middle" font-size="14">Spitch Is.</text>
      </g>
      
      <!-- Location 3 -->
      <g transform="translate(500, 250)">
        <circle cx="0" cy="0" r="25" fill="#fbbf24" stroke="#b45309" stroke-width="4" filter="url(#dropShadow)" />
        <text y="5" class="hud-text" text-anchor="middle" font-size="20">3</text>
        <rect x="-60" y="20" width="120" height="24" rx="4" fill="#1e293b" />
        <text y="37" class="hud-text" text-anchor="middle" font-size="14">Hope City</text>
      </g>
      
      <!-- Boss Location -->
      <g transform="translate(730, 90)">
        <path d="M -30 10 L 0 -30 L 30 10 Z" fill="#ef4444" stroke="#7f1d1d" stroke-width="4" filter="url(#dropShadow)" />
        <rect x="-60" y="20" width="120" height="24" rx="4" fill="#7f1d1d" />
        <text y="37" class="hud-text" text-anchor="middle" font-size="14">GATE 2027</text>
      </g>
      
      <!-- Player Marker (Angry Dev Bird Icon) -->
      <g transform="translate(300, 130)" class="animate-bird">
        <circle cx="0" cy="0" r="15" fill="#ef4444" stroke="#7f1d1d" stroke-width="3" filter="url(#dropShadow)" />
        <rect x="-9" y="-6" width="18" height="6" rx="2" fill="#1e293b" />
      </g>
    </svg>
  `;
}

export function generatePowerups(): string {
  // Renders distinct birds representing tech stack
  return `
    <svg width="800" height="250" viewBox="0 0 800 250" xmlns="http://www.w3.org/2000/svg">
      ${getCommonStyles()}
      ${getBackground(false)}
      
      <text x="400" y="50" class="title-text" text-anchor="middle">CHOOSE YOUR BIRD</text>
      
      <!-- Python Bird (Heavy Black Bird Style) -->
      <g transform="translate(150, 160)">
        <g class="animate-bird" style="animation-delay: 0s">
          <circle cx="0" cy="0" r="30" fill="#1e293b" stroke="#0f172a" stroke-width="3" filter="url(#dropShadow)" />
          <circle cx="0" cy="15" r="15" fill="#334155" />
          <path d="M -15 -5 L 15 -5 L 0 10 Z" fill="#fbbf24" stroke="#b45309" stroke-width="2" />
          <text y="5" class="hud-text" text-anchor="middle" font-size="10">PY</text>
        </g>
        <rect x="-50" y="40" width="100" height="24" rx="4" fill="#b45309" stroke="#78350f" stroke-width="2" />
        <text y="56" class="hud-text" text-anchor="middle" font-size="12">HEAVY DAMAGE</text>
      </g>

      <!-- ML Bird (Triangle Yellow Style) -->
      <g transform="translate(315, 160)">
        <g class="animate-bird" style="animation-delay: 0.2s">
          <path d="M -30 20 L 0 -30 L 30 20 Z" fill="#f59e0b" stroke="#b45309" stroke-width="3" filter="url(#dropShadow)" />
          <path d="M -15 -5 L 15 -5 L 0 10 Z" fill="#fbbf24" stroke="#b45309" stroke-width="2" />
          <text y="15" class="hud-text" text-anchor="middle" font-size="10">ML</text>
        </g>
        <rect x="-50" y="40" width="100" height="24" rx="4" fill="#b45309" stroke="#78350f" stroke-width="2" />
        <text y="56" class="hud-text" text-anchor="middle" font-size="12">TARGET PREDICT</text>
      </g>

      <!-- React Bird (Speed Blue Style) -->
      <g transform="translate(485, 160)">
        <g class="animate-bird" style="animation-delay: 0.4s">
          <circle cx="0" cy="0" r="25" fill="#38bdf8" stroke="#0284c7" stroke-width="3" filter="url(#dropShadow)" />
          <path d="M -10 -5 L 10 -5 L 0 10 Z" fill="#fbbf24" stroke="#b45309" stroke-width="2" />
          <text y="-10" class="hud-text" text-anchor="middle" font-size="10">RE</text>
        </g>
        <rect x="-50" y="40" width="100" height="24" rx="4" fill="#b45309" stroke="#78350f" stroke-width="2" />
        <text y="56" class="hud-text" text-anchor="middle" font-size="12">SPLIT ATTACK</text>
      </g>

      <!-- FastAPI Bird (White Style) -->
      <g transform="translate(650, 160)">
        <g class="animate-bird" style="animation-delay: 0.6s">
          <ellipse cx="0" cy="0" rx="30" ry="25" fill="#ffffff" stroke="#94a3b8" stroke-width="3" filter="url(#dropShadow)" />
          <path d="M -10 -5 L 10 -5 L 0 10 Z" fill="#fbbf24" stroke="#b45309" stroke-width="2" />
          <text y="-10" class="hud-text" text-anchor="middle" font-size="10" fill="#000" stroke="none">FAST</text>
        </g>
        <rect x="-50" y="40" width="100" height="24" rx="4" fill="#b45309" stroke="#78350f" stroke-width="2" />
        <text y="56" class="hud-text" text-anchor="middle" font-size="12">RAPID FIRE</text>
      </g>
    </svg>
  `;
}

export function generateProjectWorlds(): string {
  // Wood hanging scoreboards against a blurred background
  return `
    <svg width="800" height="250" viewBox="0 0 800 250" xmlns="http://www.w3.org/2000/svg">
      ${getCommonStyles()}
      <rect width="800" height="250" fill="#38bdf8" />
      <g opacity="0.3" filter="url(#glow)">
        ${renderStoneBlock(100, 100, 600, 150)}
        ${renderBug(400, 80)}
      </g>

      <text x="400" y="50" class="title-text" text-anchor="middle">LEVELS COMPLETED</text>

      ${[1, 2, 3, 4].map((i) => {
        const x = 50 + (i - 1) * 180;
        const names = ['MobileHub', 'Spitch', 'Hope Travel', 'AgriIntel'];
        return `
        <g transform="translate(${x}, 90)">
          <!-- Ropes -->
          <path d="M 20 -40 L 20 0 M 120 -40 L 120 0" stroke="#451a03" stroke-width="4" stroke-dasharray="2,2" />
          <!-- Board -->
          <rect x="0" y="0" width="140" height="120" rx="10" fill="url(#woodGrad)" stroke="#78350f" stroke-width="4" filter="url(#dropShadow)" />
          <!-- Paper -->
          <rect x="10" y="10" width="120" height="100" fill="#fef3c7" opacity="0.8" rx="4" />
          
          <text x="70" y="40" class="hud-text" fill="#78350f" stroke="none" text-anchor="middle" font-size="18">${names[i-1]}</text>
          
          <!-- Stars -->
          <g transform="translate(25, 60)">
            <!-- Star 1 -->
            <path d="M 15 0 L 20 10 L 30 10 L 22 18 L 25 28 L 15 22 L 5 28 L 8 18 L 0 10 L 10 10 Z" fill="${colors.star}" stroke="#b45309" stroke-width="1.5" />
            <!-- Star 2 -->
            <path d="M 45 -5 L 50 5 L 60 5 L 52 13 L 55 23 L 45 17 L 35 23 L 38 13 L 30 5 L 40 5 Z" fill="${colors.star}" stroke="#b45309" stroke-width="1.5" />
            <!-- Star 3 -->
            <path d="M 75 0 L 80 10 L 90 10 L 82 18 L 85 28 L 75 22 L 65 28 L 68 18 L 60 10 L 70 10 Z" fill="${colors.star}" stroke="#b45309" stroke-width="1.5" />
          </g>
          
          <text x="70" y="100" class="hud-text" fill="#ef4444" stroke="none" text-anchor="middle" font-size="14">CLEAR!</text>
        </g>
        `;
      }).join('')}
    </svg>
  `;
}

export function generateBossBattle(): string {
  return `
    <svg width="800" height="300" viewBox="0 0 800 300" xmlns="http://www.w3.org/2000/svg">
      ${getCommonStyles()}
      ${getBackground(true)}
      
      <!-- Lightning -->
      <path d="M 600 0 L 580 80 L 620 90 L 550 250" fill="none" stroke="#fde047" stroke-width="6" filter="url(#glow)" class="animate-lightning" />
      
      <!-- Red Alert Overlay -->
      <rect width="800" height="300" class="animate-alert" style="mix-blend-mode: overlay;" />

      <text x="400" y="50" class="title-text" fill="#ef4444" text-anchor="middle" filter="url(#glow)">FINAL BOSS: GATE 2027</text>

      <!-- Giant Fortress -->
      <g transform="translate(250, 150)">
        ${renderStoneBlock(0, 0, 300, 150)}
        <!-- Battlements -->
        ${renderStoneBlock(-20, -30, 40, 50)}
        ${renderStoneBlock(80, -30, 40, 50)}
        ${renderStoneBlock(180, -30, 40, 50)}
        ${renderStoneBlock(280, -30, 40, 50)}
        
        <!-- Danger signs -->
        <circle cx="150" cy="80" r="40" fill="#1e293b" />
        <path d="M 130 90 L 150 50 L 170 90 Z" fill="#ef4444" />
      </g>

      <!-- Giant Bug King -->
      <g transform="translate(400, 90)" class="animate-boss">
        <circle cx="0" cy="0" r="60" fill="#84cc16" stroke="#3f6212" stroke-width="4" filter="url(#dropShadow)" />
        <circle cx="-20" cy="-10" r="15" fill="#ffffff" />
        <circle cx="20" cy="-10" r="15" fill="#ffffff" />
        <circle cx="-20" cy="-10" r="5" fill="#ef4444" />
        <circle cx="20" cy="-10" r="5" fill="#ef4444" />
        <ellipse cx="0" cy="25" rx="25" ry="15" fill="#65a30d" stroke="#3f6212" stroke-width="3" />
        <path d="M -30 -60 L -10 -40 M 30 -60 L 10 -40" stroke="#3f6212" stroke-width="6" stroke-linecap="round" />
        <!-- Crown -->
        <path d="M -30 -60 L -40 -90 L -15 -75 L 0 -100 L 15 -75 L 40 -90 L 30 -60 Z" fill="${colors.star}" stroke="#b45309" stroke-width="3" />
      </g>

      <!-- Giant Boss Health Bar -->
      <g transform="translate(100, 70)">
        <rect width="600" height="24" rx="12" fill="#1e293b" stroke="#ffffff" stroke-width="3" filter="url(#dropShadow)" />
        <rect x="4" y="4" width="592" height="16" rx="8" fill="#ef4444" />
      </g>
    </svg>
  `;
}

export function generateAchievements(): string {
  // Real trophy items
  return `
    <svg width="800" height="200" viewBox="0 0 800 200" xmlns="http://www.w3.org/2000/svg">
      ${getCommonStyles()}
      <rect width="800" height="200" fill="url(#stoneGrad)" />
      
      <!-- Wood Shelf -->
      <rect x="0" y="120" width="800" height="40" fill="url(#woodGrad)" stroke="#78350f" stroke-width="4" filter="url(#dropShadow)" />
      
      <text x="400" y="50" class="title-text" text-anchor="middle">TROPHY ROOM</text>

      ${[
        { name: 'AI Engineer', type: 'cup' },
        { name: 'Full Stack', type: 'medal' },
        { name: 'Open Source', type: 'gem' },
        { name: 'GenAI Proj', type: 'cup' },
      ].map((ach, i) => {
        const x = 120 + i * 180;
        let trophy = '';
        if (ach.type === 'cup') {
          trophy = `<path d="M -25 0 Q -40 0 -30 20 Q -20 30 0 30 L 0 60 L -20 60 L 20 60 L 0 60 L 0 30 Q 20 30 30 20 Q 40 0 25 0 Z" fill="url(#woodGrad)" stroke="#78350f" stroke-width="2" filter="url(#dropShadow)" />
                    <path d="M -25 0 Q -40 0 -30 20 Q -20 30 0 30 L 0 60 L -20 60 L 20 60 L 0 60 L 0 30 Q 20 30 30 20 Q 40 0 25 0 Z" fill="${colors.star}" transform="scale(0.9) translate(0, -5)" />`;
        } else if (ach.type === 'medal') {
          trophy = `<path d="M -10 -40 L 10 -40 L 20 0 L -20 0 Z" fill="#ef4444" filter="url(#dropShadow)" />
                    <circle cx="0" cy="15" r="25" fill="${colors.star}" stroke="#b45309" stroke-width="4" filter="url(#dropShadow)" />`;
        } else {
          trophy = `<path d="M -20 -10 L 20 -10 L 30 10 L 0 40 L -30 10 Z" fill="#38bdf8" stroke="#0284c7" stroke-width="4" filter="url(#dropShadow)" />`;
        }
        return `
          <g transform="translate(${x}, 55)">
            ${trophy}
            <rect x="-60" y="80" width="120" height="20" rx="2" fill="#1e293b" />
            <text y="94" class="hud-text" font-size="12" text-anchor="middle">${ach.name}</text>
          </g>
        `;
      }).join('')}
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
