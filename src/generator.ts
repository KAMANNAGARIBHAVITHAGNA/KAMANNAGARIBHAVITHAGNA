import fs from 'fs';
import path from 'path';
import { UserStats } from './fetcher';

// PREMIUM UI DESIGN SYSTEM
const colors = {
  bg: '#0B1121',
  bgPanel: '#1E293B',
  bgDark: '#020617',
  accentBlue: '#38BDF8',
  accentGold: '#FBBF24',
  accentRed: '#EF4444',
  accentGreen: '#10B981',
  textMain: '#F8FAFC',
  textMuted: '#94A3B8',
  border: '#334155',
};

const getCommonStyles = () => `
  <defs>
    <!-- Gradients for Premium Look -->
    <linearGradient id="panelGrad" x1="0" y1="0" x2="0" y2="1">
      <stop offset="0%" stop-color="${colors.bgPanel}" />
      <stop offset="100%" stop-color="#0F172A" />
    </linearGradient>
    <linearGradient id="goldGrad" x1="0" y1="0" x2="1" y2="1">
      <stop offset="0%" stop-color="#FCD34D" />
      <stop offset="100%" stop-color="#D97706" />
    </linearGradient>
    <linearGradient id="blueGrad" x1="0" y1="0" x2="1" y2="1">
      <stop offset="0%" stop-color="#7DD3FC" />
      <stop offset="100%" stop-color="#0284C7" />
    </linearGradient>
    <linearGradient id="redGrad" x1="0" y1="0" x2="1" y2="1">
      <stop offset="0%" stop-color="#FCA5A5" />
      <stop offset="100%" stop-color="#B91C1C" />
    </linearGradient>
    
    <filter id="glowGold" x="-20%" y="-20%" width="140%" height="140%">
      <feGaussianBlur stdDeviation="4" result="blur" />
      <feComposite in="SourceGraphic" in2="blur" operator="over" />
    </filter>
    
    <filter id="glowBlue" x="-20%" y="-20%" width="140%" height="140%">
      <feGaussianBlur stdDeviation="4" result="blur" />
      <feComponentTransfer in="blur" result="glow">
        <feFuncA type="linear" slope="0.5"/>
      </feComponentTransfer>
      <feComposite in="SourceGraphic" in2="glow" operator="over" />
    </filter>
  </defs>
  <style>
    @import url('https://fonts.googleapis.com/css2?family=Press+Start+2P&amp;display=swap');
    
    text {
      font-family: 'Press Start 2P', cursive;
      fill: ${colors.textMain};
    }
    
    .title { font-size: 20px; fill: ${colors.accentGold}; letter-spacing: 2px; }
    .subtitle { font-size: 10px; fill: ${colors.textMuted}; }
    .label { font-size: 8px; fill: ${colors.accentBlue}; }
    .value { font-size: 16px; fill: ${colors.textMain}; }
    .value-huge { font-size: 32px; fill: ${colors.textMain}; }
    
    .panel { fill: url(#panelGrad); stroke: ${colors.border}; stroke-width: 2px; }
    
    @keyframes pulse {
      0%, 100% { opacity: 1; }
      50% { opacity: 0.5; }
    }
    @keyframes dash {
      to { stroke-dashoffset: -20; }
    }
    @keyframes float {
      0%, 100% { transform: translateY(0); }
      50% { transform: translateY(-4px); }
    }
    
    .animate-pulse { animation: pulse 2s infinite; }
    .animate-dash { animation: dash 1s linear infinite; }
    .animate-float { animation: float 3s ease-in-out infinite; }
  </style>
`;

const renderUIBox = (x: number, y: number, w: number, h: number, title?: string) => `
  <g transform="translate(${x}, ${y})">
    <rect width="${w}" height="${h}" class="panel" rx="4" />
    <rect x="2" y="2" width="${w-4}" height="${h-4}" fill="none" stroke="#FFFFFF" stroke-opacity="0.05" stroke-width="1" rx="2" />
    ${title ? `
      <rect x="10" y="-8" width="${title.length * 12 + 20}" height="16" fill="${colors.bg}" />
      <text x="20" y="2" font-size="10" fill="${colors.accentGold}">[ ${title} ]</text>
    ` : ''}
  </g>
`;

const renderServerFortress = (x: number, y: number) => `
  <g transform="translate(${x}, ${y})">
    <!-- Server Rack Bases -->
    <rect x="0" y="60" width="160" height="40" fill="#1E293B" stroke="${colors.accentBlue}" stroke-width="2" />
    <rect x="10" y="0" width="40" height="60" fill="#0F172A" stroke="${colors.accentBlue}" stroke-width="2" />
    <rect x="110" y="20" width="40" height="40" fill="#0F172A" stroke="${colors.accentBlue}" stroke-width="2" />
    
    <!-- Code Blocks / DB Cylinders -->
    <path d="M 60 40 L 100 40 L 100 60 L 60 60 Z" fill="#334155" stroke="${colors.accentBlue}" stroke-width="2" />
    <ellipse cx="80" cy="40" rx="20" ry="5" fill="#475569" stroke="${colors.accentBlue}" stroke-width="2" />
    
    <!-- Lights -->
    <circle cx="20" cy="15" r="2" fill="${colors.accentRed}" class="animate-pulse" />
    <circle cx="30" cy="15" r="2" fill="${colors.accentGreen}" />
    <circle cx="120" cy="35" r="2" fill="${colors.accentGold}" />
    <circle cx="130" cy="35" r="2" fill="${colors.accentGreen}" />
    
    <!-- Glitching Bugs -->
    <text x="70" y="30" font-size="10" fill="${colors.accentRed}" font-family="monospace">&lt;ERR&gt;</text>
    <rect x="20" y="80" width="12" height="12" fill="${colors.accentRed}" />
    <rect x="23" y="83" width="6" height="2" fill="#000" />
    
    <rect x="120" y="80" width="12" height="12" fill="${colors.accentRed}" />
    <rect x="123" y="83" width="6" height="2" fill="#000" />
  </g>
`;

const renderAIMascot = (x: number, y: number) => `
  <g transform="translate(${x}, ${y})" class="animate-float">
    <!-- Core Sphere -->
    <circle cx="0" cy="0" r="15" fill="url(#blueGrad)" stroke="${colors.accentBlue}" stroke-width="2" filter="url(#glowBlue)" />
    <!-- Visor -->
    <rect x="-10" y="-4" width="20" height="6" rx="2" fill="#000" />
    <rect x="-6" y="-2" width="12" height="2" fill="${colors.accentBlue}" class="animate-pulse" />
    <!-- Energy Rings -->
    <path d="M -25 0 A 25 10 0 0 0 25 0" fill="none" stroke="${colors.accentBlue}" stroke-width="2" stroke-dasharray="4,2" />
  </g>
`;

export function generateHeroScene(): string {
  const W = 1000, H = 300;
  return `
    <svg width="${W}" height="${H}" viewBox="0 0 ${W} ${H}" xmlns="http://www.w3.org/2000/svg">
      ${getCommonStyles()}
      <rect width="${W}" height="${H}" fill="${colors.bg}" />
      
      <!-- Grid Background -->
      <pattern id="grid" width="40" height="40" patternUnits="userSpaceOnUse">
        <path d="M 40 0 L 0 0 0 40" fill="none" stroke="#FFFFFF" stroke-opacity="0.03" stroke-width="1"/>
      </pattern>
      <rect width="${W}" height="${H}" fill="url(#grid)" />

      <!-- Cinematic Title -->
      <text x="500" y="50" class="title" text-anchor="middle" filter="url(#glowGold)">ANGRY DEV</text>
      <text x="500" y="70" class="subtitle" text-anchor="middle">DEVELOPER VS BUGS: PRODUCTION DEPLOYMENT</text>
      
      <!-- Scene Bounds -->
      <rect x="20" y="90" width="960" height="190" fill="none" stroke="${colors.border}" stroke-width="2" />
      <rect x="22" y="92" width="956" height="186" fill="none" stroke="#FFFFFF" stroke-opacity="0.05" stroke-width="1" />

      <!-- High Tech Slingshot -->
      <g transform="translate(150, 200)">
        <path d="M -10 60 L -10 0 L -30 -30 M -10 0 L 10 -30" fill="none" stroke="${colors.textMuted}" stroke-width="8" stroke-linecap="square" />
        <path d="M -10 60 L -10 0 L -30 -30 M -10 0 L 10 -30" fill="none" stroke="${colors.accentBlue}" stroke-width="2" />
        <!-- Energy Band -->
        <path d="M -30 -30 L -80 -10 L 10 -30" fill="none" stroke="${colors.accentBlue}" stroke-width="2" filter="url(#glowBlue)" />
      </g>

      <!-- Mascot -->
      ${renderAIMascot(70, 190)}

      <!-- Trajectory Arc -->
      <path d="M 90 190 Q 300 50 650 180" fill="none" stroke="${colors.accentBlue}" stroke-width="2" stroke-dasharray="10,10" class="animate-dash" opacity="0.6" />
      
      <!-- Target Fortress -->
      ${renderServerFortress(750, 150)}
      
      <!-- Scanning HUD Overlay -->
      <path d="M 700 130 L 730 130 L 730 160" fill="none" stroke="${colors.accentRed}" stroke-width="2" />
      <path d="M 950 130 L 920 130 L 920 160" fill="none" stroke="${colors.accentRed}" stroke-width="2" />
      <path d="M 700 270 L 730 270 L 730 240" fill="none" stroke="${colors.accentRed}" stroke-width="2" />
      <path d="M 950 270 L 920 270 L 920 240" fill="none" stroke="${colors.accentRed}" stroke-width="2" />
      <text x="825" y="125" class="label" fill="${colors.accentRed}" text-anchor="middle">TARGET LOCKED: CRITICAL BUGS</text>
    </svg>
  `;
}

export function generateHudScene(stats: UserStats): string {
  const W = 1000, H = 150;
  return `
    <svg width="${W}" height="${H}" viewBox="0 0 ${W} ${H}" xmlns="http://www.w3.org/2000/svg">
      ${getCommonStyles()}
      <rect width="${W}" height="${H}" fill="${colors.bg}" />
      
      ${renderUIBox(20, 20, 960, 110, 'LIVE SCOREBOARD')}
      
      <g transform="translate(60, 60)">
        <text x="0" y="0" class="label">PLAYER PROFILE</text>
        <text x="0" y="25" class="value">${stats.name.toUpperCase()}</text>
        <text x="0" y="45" class="subtitle">AI ENGINEER</text>
      </g>
      
      <rect x="350" y="40" width="2" height="70" fill="${colors.border}" />
      
      <g transform="translate(420, 60)">
        <text x="0" y="0" class="label">CONTRIBUTIONS</text>
        <text x="0" y="35" class="value-huge" fill="${colors.accentGold}">${stats.totalCommits}</text>
        <text x="0" y="55" class="subtitle">ALL TIME SCORE</text>
      </g>
      
      <g transform="translate(620, 60)">
        <text x="0" y="0" class="label">STARS COLLECTED</text>
        <text x="0" y="35" class="value-huge" fill="${colors.accentBlue}">${stats.totalStars}</text>
        <text x="0" y="55" class="subtitle">REPO COINS</text>
      </g>
      
      <g transform="translate(820, 60)">
        <text x="0" y="0" class="label">REPOSITORIES</text>
        <text x="0" y="35" class="value-huge" fill="${colors.accentGreen}">${stats.publicRepos}</text>
        <text x="0" y="55" class="subtitle">CAMPAIGN LEVEL</text>
      </g>
    </svg>
  `;
}

export function generateCampaignScene(): string {
  const W = 1000, H = 300;
  const missions = [
    { id: 'M-01', name: 'MOBILEHUB STORE', diff: 3, tech: 'REACT, NODE, TS' },
    { id: 'M-02', name: 'SPITCH ASSISTANT', diff: 4, tech: 'PYTHON, FastAPI, AI' },
    { id: 'M-03', name: 'HOPE TRAVEL', diff: 2, tech: 'NEXT.JS, TAILWIND' },
    { id: 'M-04', name: 'AGRI-INTEL AI', diff: 5, tech: 'PYTHON, TF, GCP' },
  ];
  
  let missionUI = '';
  missions.forEach((m, i) => {
    const y = 50 + (i * 55);
    let stars = '';
    for(let s=0; s<5; s++) {
      stars += `<path d="M ${s*15} 0 L ${s*15+4} 10 L ${s*15+14} 10 L ${s*15+6} 16 L ${s*15+9} 26 L ${s*15} 20 L ${s*15-9} 26 L ${s*15-6} 16 L ${s*15-14} 10 L ${s*15-4} 10 Z" fill="${s < m.diff ? colors.accentGold : colors.border}" transform="scale(0.5) translate(0, -5)" />`;
    }
    
    missionUI += `
      <rect x="40" y="${y}" width="920" height="45" fill="${colors.bgDark}" stroke="${colors.border}" stroke-width="1" />
      <rect x="40" y="${y}" width="4" height="45" fill="${colors.accentBlue}" />
      
      <text x="60" y="${y + 27}" class="label" fill="${colors.textMuted}">${m.id}</text>
      <text x="140" y="${y + 27}" class="value">${m.name}</text>
      
      <text x="500" y="${y + 27}" class="label">TECH:</text>
      <text x="550" y="${y + 27}" class="subtitle" fill="${colors.accentGreen}">${m.tech}</text>
      
      <g transform="translate(800, ${y + 24})">
        ${stars}
      </g>
      <text x="900" y="${y + 27}" class="label" fill="${colors.accentGold}">[ CLEARED ]</text>
    `;
  });

  return `
    <svg width="${W}" height="${H}" viewBox="0 0 ${W} ${H}" xmlns="http://www.w3.org/2000/svg">
      ${getCommonStyles()}
      <rect width="${W}" height="${H}" fill="${colors.bg}" />
      ${renderUIBox(20, 20, 960, 260, 'PROJECT CAMPAIGN - COMPLETED MISSIONS')}
      ${missionUI}
    </svg>
  `;
}

export function generateArsenalScene(): string {
  const W = 1000, H = 250;
  const skills = [
    { name: 'PYTHON', role: 'HEAVY ARTILLERY' },
    { name: 'MACHINE LEARNING', role: 'TARGET PREDICTION' },
    { name: 'TENSORFLOW', role: 'NEURAL BARRAGE' },
    { name: 'FASTAPI', role: 'RAPID FIRE API' },
    { name: 'REACT', role: 'COMPONENT SPLIT' },
    { name: 'NEXT.JS', role: 'SERVER RENDER BEAM' },
    { name: 'TYPESCRIPT', role: 'STATIC TYPING SHIELD' },
    { name: 'SQL', role: 'DATA EXTRACTION' }
  ];

  let slots = '';
  skills.forEach((skill, i) => {
    const row = Math.floor(i / 4);
    const col = i % 4;
    const x = 40 + (col * 230);
    const y = 60 + (row * 80);
    
    slots += `
      <g transform="translate(${x}, ${y})">
        <rect width="210" height="60" fill="${colors.bgDark}" stroke="${colors.border}" stroke-width="2" rx="2" />
        <rect x="0" y="0" width="20" height="60" fill="${colors.border}" rx="2" />
        <text x="30" y="25" class="label" fill="${colors.accentGold}">${skill.name}</text>
        <text x="30" y="45" class="subtitle">${skill.role}</text>
      </g>
    `;
  });

  return `
    <svg width="${W}" height="${H}" viewBox="0 0 ${W} ${H}" xmlns="http://www.w3.org/2000/svg">
      ${getCommonStyles()}
      <rect width="${W}" height="${H}" fill="${colors.bg}" />
      ${renderUIBox(20, 20, 960, 210, 'SKILL ARSENAL & ABILITIES')}
      ${slots}
    </svg>
  `;
}

export function generateBossScene(): string {
  const W = 1000, H = 300;
  return `
    <svg width="${W}" height="${H}" viewBox="0 0 ${W} ${H}" xmlns="http://www.w3.org/2000/svg">
      ${getCommonStyles()}
      <rect width="${W}" height="${H}" fill="${colors.bg}" />
      
      <!-- Warning Background -->
      <rect width="${W}" height="${H}" fill="${colors.accentRed}" opacity="0.05" class="animate-pulse" />
      
      ${renderUIBox(20, 20, 960, 260, 'FINAL BOSS ENCOUNTER')}

      <!-- Boss Health Bar -->
      <g transform="translate(100, 60)">
        <text x="400" y="-10" class="label" text-anchor="middle" fill="${colors.accentRed}">BOSS: GATE 2027 FORTRESS [HP: 9999/9999]</text>
        <rect width="800" height="20" fill="#000" stroke="${colors.border}" stroke-width="2" />
        <rect x="2" y="2" width="796" height="16" fill="url(#redGrad)" />
      </g>

      <!-- The Boss Architecture (Stylized) -->
      <g transform="translate(300, 120)">
        <!-- Core Structure -->
        <path d="M 100 130 L 150 20 L 250 20 L 300 130 Z" fill="#0F172A" stroke="${colors.accentRed}" stroke-width="3" />
        <rect x="180" y="40" width="40" height="40" rx="20" fill="#000" stroke="${colors.accentRed}" stroke-width="2" />
        <!-- Glowing Eye -->
        <circle cx="200" cy="60" r="10" fill="${colors.accentRed}" class="animate-pulse" />
        
        <!-- Energy Pillars -->
        <rect x="40" y="60" width="30" height="90" fill="#1E293B" stroke="${colors.accentRed}" stroke-width="2" />
        <rect x="330" y="60" width="30" height="90" fill="#1E293B" stroke="${colors.accentRed}" stroke-width="2" />
        
        <!-- Lightning Arcs -->
        <path d="M 55 60 L 150 40 M 345 60 L 250 40" stroke="${colors.accentBlue}" stroke-width="2" class="animate-dash" stroke-dasharray="10,20" opacity="0.7" />
      </g>
    </svg>
  `;
}

export function generateAchievementsScene(): string {
  const W = 1000, H = 200;
  const trophies = ['AI ENGINEER', 'FULL STACK DEV', 'OPEN SOURCE', 'GOOGLE GENAI'];
  
  let layout = '';
  trophies.forEach((t, i) => {
    const x = 120 + (i * 220);
    layout += `
      <g transform="translate(${x}, 90)">
        <path d="M -30 0 L 30 0 L 20 40 L -20 40 Z" fill="url(#goldGrad)" stroke="#B45309" stroke-width="2" filter="url(#glowGold)" />
        <path d="M -20 40 L 20 40 L 10 50 L -10 50 Z" fill="#D97706" />
        
        <rect x="-60" y="60" width="120" height="20" fill="${colors.bgDark}" stroke="${colors.border}" stroke-width="1" />
        <text x="0" y="74" class="label" text-anchor="middle">${t}</text>
      </g>
    `;
  });

  return `
    <svg width="${W}" height="${H}" viewBox="0 0 ${W} ${H}" xmlns="http://www.w3.org/2000/svg">
      ${getCommonStyles()}
      <rect width="${W}" height="${H}" fill="${colors.bg}" />
      ${renderUIBox(20, 20, 960, 160, 'ACHIEVEMENTS UNLOCKED')}
      ${layout}
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
