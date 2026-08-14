import fs from 'fs';
import path from 'path';
import { UserStats } from './fetcher';

// Define the retro color palette
const colors = {
  bg: '#0B1020',
  primary: '#FF6B35',
  secondary: '#FFB703',
  accent: '#3A86FF',
  success: '#06D6A0',
  danger: '#EF476F',
  text: '#FFFFFF',
  panel: '#111827',
  border: '#334155'
};

// Common CSS for the SVGs to ensure retro pixel fonts and animations
const getCommonStyles = () => `
  <style>
    @import url('https://fonts.googleapis.com/css2?family=Press+Start+2P&amp;display=swap');
    
    .pixel-text {
      font-family: 'Press Start 2P', monospace;
      fill: ${colors.text};
    }
    .title {
      font-size: 24px;
      fill: ${colors.primary};
    }
    .subtitle {
      font-size: 14px;
      fill: ${colors.secondary};
    }
    .stat-label {
      font-size: 10px;
      fill: #94A3B8;
    }
    .stat-value {
      font-size: 16px;
      fill: ${colors.success};
    }
    
    /* Animations */
    @keyframes float {
      0%, 100% { transform: translateY(0); }
      50% { transform: translateY(-10px); }
    }
    @keyframes pulse {
      0%, 100% { opacity: 1; }
      50% { opacity: 0.5; }
    }
    @keyframes slideBg {
      from { background-position: 0 0; }
      to { background-position: 100% 0; }
    }
    
    .animate-float { animation: float 3s ease-in-out infinite; }
    .animate-pulse { animation: pulse 2s steps(2, start) infinite; }
  </style>
`;

export function generateHeroBanner(stats: UserStats): string {
  return `
    <svg width="800" height="300" viewBox="0 0 800 300" xmlns="http://www.w3.org/2000/svg">
      ${getCommonStyles()}
      <defs>
        <pattern id="grid" width="40" height="40" patternUnits="userSpaceOnUse">
          <rect width="40" height="40" fill="${colors.bg}" />
          <path d="M 40 0 L 0 0 0 40" fill="none" stroke="${colors.panel}" stroke-width="2"/>
        </pattern>
      </defs>
      
      <rect width="800" height="300" fill="url(#grid)" />
      
      <!-- Animated Clouds (Simple pixel art representation) -->
      <g class="animate-float" style="animation-duration: 8s; opacity: 0.5;">
        <rect x="100" y="50" width="60" height="20" fill="white" />
        <rect x="120" y="30" width="40" height="20" fill="white" />
        <rect x="80" y="70" width="100" height="20" fill="white" />
      </g>
      
      <g class="animate-float" style="animation-duration: 6s; animation-delay: 2s; opacity: 0.3;">
        <rect x="600" y="80" width="80" height="20" fill="white" />
        <rect x="620" y="60" width="40" height="20" fill="white" />
        <rect x="580" y="100" width="120" height="20" fill="white" />
      </g>

      <!-- Logo & Title -->
      <text x="400" y="120" class="pixel-text title" text-anchor="middle" font-size="36" filter="drop-shadow(4px 4px 0px #CC4A18)">
        ANGRY DEV
      </text>
      
      <text x="400" y="160" class="pixel-text subtitle" text-anchor="middle">
        DEVELOPER VS BUGS
      </text>

      <!-- Player Info Bar -->
      <g transform="translate(150, 220)">
        <rect width="500" height="40" rx="5" fill="${colors.panel}" stroke="${colors.border}" stroke-width="4" />
        <text x="20" y="27" class="pixel-text" font-size="12">LVL 19: AI ENGINEER</text>
        
        <!-- EXP Bar -->
        <rect x="250" y="12" width="230" height="16" fill="${colors.bg}" />
        <rect x="250" y="12" width="180" height="16" fill="${colors.success}" />
        <text x="260" y="24" class="pixel-text" font-size="10" fill="${colors.bg}">EXP: 75%</text>
      </g>
      
      <!-- Click Start prompt -->
      <text x="400" y="290" class="pixel-text animate-pulse" text-anchor="middle" font-size="10" fill="${colors.accent}">
        INSERT COIN TO CONTINUE...
      </text>
    </svg>
  `;
}

export function generateHeroStats(stats: UserStats): string {
  return `
    <svg width="800" height="200" viewBox="0 0 800 200" xmlns="http://www.w3.org/2000/svg">
      ${getCommonStyles()}
      <rect width="800" height="200" fill="${colors.bg}" />
      
      <rect x="20" y="20" width="760" height="160" fill="${colors.panel}" stroke="${colors.border}" stroke-width="4" />
      
      <text x="50" y="60" class="pixel-text title">PLAYER STATS</text>
      
      <g transform="translate(50, 100)">
        <!-- Followers -->
        <rect x="0" y="0" width="150" height="60" fill="${colors.bg}" stroke="${colors.border}" stroke-width="2" />
        <text x="10" y="25" class="pixel-text stat-label">FOLLOWERS</text>
        <text x="10" y="45" class="pixel-text stat-value">${stats.followers}</text>

        <!-- Repos -->
        <rect x="170" y="0" width="150" height="60" fill="${colors.bg}" stroke="${colors.border}" stroke-width="2" />
        <text x="180" y="25" class="pixel-text stat-label">REPOSITORIES</text>
        <text x="180" y="45" class="pixel-text stat-value" fill="${colors.accent}">${stats.publicRepos}</text>

        <!-- Stars -->
        <rect x="340" y="0" width="150" height="60" fill="${colors.bg}" stroke="${colors.border}" stroke-width="2" />
        <text x="350" y="25" class="pixel-text stat-label">STARS EARNED</text>
        <text x="350" y="45" class="pixel-text stat-value" fill="${colors.secondary}">${stats.totalStars}</text>

        <!-- Commits -->
        <rect x="510" y="0" width="150" height="60" fill="${colors.bg}" stroke="${colors.border}" stroke-width="2" />
        <text x="520" y="25" class="pixel-text stat-label">COMMITS</text>
        <text x="520" y="45" class="pixel-text stat-value" fill="${colors.danger}">${stats.totalCommits}</text>
      </g>
    </svg>
  `;
}

export function generatePowerups(): string {
  const skills = [
    { name: 'PYTHON', level: 99, color: '#3A86FF' },
    { name: 'MACHINE LEARNING', level: 95, color: '#FFB703' },
    { name: 'REACT', level: 92, color: '#06D6A0' },
    { name: 'NEXT.JS', level: 90, color: '#FFFFFF' },
    { name: 'FASTAPI', level: 90, color: '#06D6A0' },
    { name: 'POSTGRESQL', level: 88, color: '#3A86FF' }
  ];

  let skillBars = '';
  skills.forEach((skill, i) => {
    const y = 80 + (i * 35);
    const barWidth = (skill.level / 100) * 400;
    
    skillBars += `
      <text x="50" y="${y + 12}" class="pixel-text" font-size="10">${skill.name}</text>
      <rect x="250" y="${y}" width="400" height="15" fill="${colors.bg}" stroke="${colors.border}" stroke-width="2" />
      <rect x="252" y="${y + 2}" width="${barWidth - 4}" height="11" fill="${skill.color}" />
      <text x="670" y="${y + 12}" class="pixel-text" font-size="10" fill="${colors.secondary}">LV${skill.level}</text>
    `;
  });

  return `
    <svg width="800" height="320" viewBox="0 0 800 320" xmlns="http://www.w3.org/2000/svg">
      ${getCommonStyles()}
      <rect width="800" height="320" fill="${colors.bg}" />
      <rect x="20" y="20" width="760" height="280" fill="${colors.panel}" stroke="${colors.border}" stroke-width="4" />
      
      <text x="50" y="60" class="pixel-text title" fill="${colors.accent}">EQUIPPED SKILLS</text>
      
      ${skillBars}
    </svg>
  `;
}

export function generateWorldMap(): string {
  // Simple representation of map nodes
  return `
    <svg width="800" height="250" viewBox="0 0 800 250" xmlns="http://www.w3.org/2000/svg">
      ${getCommonStyles()}
      <rect width="800" height="250" fill="${colors.bg}" />
      
      <text x="400" y="40" class="pixel-text title" text-anchor="middle">WORLD SELECT</text>

      <!-- Map Routes -->
      <path d="M 120 120 L 280 160 L 480 100 L 680 150" fill="none" stroke="${colors.border}" stroke-width="4" stroke-dasharray="8,8" />
      
      <!-- Nodes -->
      <g transform="translate(120, 120)">
        <circle r="20" fill="${colors.success}" stroke="white" stroke-width="4" />
        <text y="40" class="pixel-text" font-size="10" text-anchor="middle">W1: MobileHub</text>
      </g>
      
      <g transform="translate(280, 160)">
        <circle r="20" fill="${colors.success}" stroke="white" stroke-width="4" />
        <text y="40" class="pixel-text" font-size="10" text-anchor="middle">W2: Spitch Is.</text>
      </g>

      <g transform="translate(480, 100)">
        <circle r="20" fill="${colors.success}" stroke="white" stroke-width="4" />
        <text y="40" class="pixel-text" font-size="10" text-anchor="middle">W3: Sky City</text>
      </g>

      <g transform="translate(680, 150)" class="animate-pulse">
        <circle r="25" fill="${colors.danger}" stroke="white" stroke-width="4" />
        <text y="45" class="pixel-text" font-size="10" text-anchor="middle" fill="${colors.danger}">BOSS: GATE 2027</text>
      </g>
    </svg>
  `;
}

export function generateBossBattle(): string {
  return `
    <svg width="800" height="200" viewBox="0 0 800 200" xmlns="http://www.w3.org/2000/svg">
      ${getCommonStyles()}
      <rect width="800" height="200" fill="${colors.bg}" />
      
      <rect x="20" y="20" width="760" height="160" fill="${colors.panel}" stroke="${colors.border}" stroke-width="4" />
      
      <text x="400" y="60" class="pixel-text title" text-anchor="middle" fill="${colors.danger}">WARNING: FINAL BOSS APPROACHING</text>
      
      <!-- Boss Sprite Placeholder (Skull/Fortress) -->
      <g transform="translate(100, 80)">
        <rect x="10" y="10" width="60" height="60" fill="${colors.danger}" />
        <rect x="20" y="20" width="10" height="10" fill="white" />
        <rect x="50" y="20" width="10" height="10" fill="white" />
        <rect x="25" y="50" width="30" height="10" fill="white" />
      </g>
      
      <!-- Boss Info & Health -->
      <g transform="translate(200, 100)">
        <text x="0" y="0" class="pixel-text" font-size="14" fill="${colors.text}">GATE 2027 FORTRESS</text>
        <text x="0" y="20" class="pixel-text stat-label">HP:</text>
        
        <rect x="40" y="10" width="450" height="15" fill="${colors.bg}" stroke="${colors.border}" stroke-width="2" />
        <!-- Animated Health Bar -->
        <rect x="42" y="12" height="11" fill="${colors.danger}">
          <animate attributeName="width" values="446;200;446" dur="5s" repeatCount="indefinite" />
        </rect>
        <text x="510" y="20" class="pixel-text stat-label">PREPARING...</text>
      </g>
    </svg>
  `;
}

export function generateAchievements(): string {
  const achs = [
    { title: 'Google Cert', desc: 'Professional Data Engineer', done: true },
    { title: '15+ Projects', desc: 'Full Stack Built', done: true },
    { title: 'Hackathon', desc: '3x Winner', done: true },
    { title: 'Open Source', desc: '50+ PRs Merged', done: true },
  ];

  let items = '';
  achs.forEach((ach, i) => {
    const x = 50 + (i % 2) * 360;
    const y = 100 + Math.floor(i / 2) * 60;
    items += `
      <rect x="${x}" y="${y}" width="320" height="50" fill="${colors.bg}" stroke="${colors.border}" stroke-width="2" />
      <circle cx="${x + 25}" cy="${y + 25}" r="10" fill="${ach.done ? colors.success : colors.panel}" stroke="${colors.border}" stroke-width="2" />
      <text x="${x + 45}" y="${y + 20}" class="pixel-text" font-size="10" fill="${colors.text}">${ach.title}</text>
      <text x="${x + 45}" y="${y + 35}" class="pixel-text stat-label">${ach.desc}</text>
    `;
  });

  return `
    <svg width="800" height="260" viewBox="0 0 800 260" xmlns="http://www.w3.org/2000/svg">
      ${getCommonStyles()}
      <rect width="800" height="260" fill="${colors.bg}" />
      
      <rect x="20" y="20" width="760" height="220" fill="${colors.panel}" stroke="${colors.border}" stroke-width="4" />
      
      <text x="400" y="60" class="pixel-text title" text-anchor="middle" fill="${colors.secondary}">ACHIEVEMENTS UNLOCKED</text>
      
      ${items}
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
