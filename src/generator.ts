import fs from 'fs';
import path from 'path';
import { UserStats } from './fetcher';

const W = 1200;
const H = 400;

// === STRANGER THINGS STYLES ===
const getCommonStyles = () => `
  <defs>
    <!-- Fonts -->
    <style>
      @import url('https://fonts.googleapis.com/css2?family=VT323&amp;display=swap');
      /* Benguiat alternative for Stranger Things title font */
      @import url('https://fonts.googleapis.com/css2?family=IM+Fell+English:ital@0;1&amp;display=swap');

      .st-font { font-family: 'IM Fell English', serif; font-size: 80px; fill: #ff0000; letter-spacing: 5px; }
      .crt-font { font-family: 'VT323', monospace; font-size: 24px; fill: #22c55e; }
      .crt-bright { fill: #4ade80; text-shadow: 0 0 5px #4ade80; }
      
      .neon-text { font-family: 'VT323', monospace; font-size: 32px; fill: #fb923c; text-shadow: 0 0 10px #fb923c, 0 0 20px #ea580c; }
      .white-text { fill: #ffffff; }

      @keyframes flicker {
        0%, 19%, 21%, 23%, 25%, 54%, 56%, 100% { opacity: 1; }
        20%, 24%, 55% { opacity: 0; }
      }
      .animate-flicker { animation: flicker 3s infinite; }

      @keyframes float {
        0%, 100% { transform: translateY(0px); }
        50% { transform: translateY(-10px); }
      }
      .animate-float { animation: float 4s ease-in-out infinite; }
      
      @keyframes scanline {
        0% { transform: translateY(-400px); }
        100% { transform: translateY(400px); }
      }
      .animate-scanline { animation: scanline 4s linear infinite; }
      
      @keyframes type {
        from { width: 0; }
        to { width: 100%; }
      }
      .typing {
        overflow: hidden;
        white-space: nowrap;
        animation: type 4s steps(40, end);
      }
    </style>

    <!-- Filters & Gradients -->
    <filter id="glow-red" x="-20%" y="-20%" width="140%" height="140%">
      <feGaussianBlur stdDeviation="5" result="blur" />
      <feMerge>
        <feMergeNode in="blur"/>
        <feMergeNode in="SourceGraphic"/>
      </feMerge>
    </filter>
    <filter id="glow-green" x="-20%" y="-20%" width="140%" height="140%">
      <feGaussianBlur stdDeviation="3" result="blur" />
      <feMerge>
        <feMergeNode in="blur"/>
        <feMergeNode in="SourceGraphic"/>
      </feMerge>
    </filter>
    
    <linearGradient id="upsideDownGrad" x1="0" y1="0" x2="0" y2="1">
      <stop offset="0%" stop-color="#050510" />
      <stop offset="50%" stop-color="#100515" />
      <stop offset="100%" stop-color="#2a0000" />
    </linearGradient>

    <!-- CRT Scanline Pattern -->
    <pattern id="scanlines" width="4" height="4" patternUnits="userSpaceOnUse">
      <rect width="4" height="2" fill="#000" opacity="0.3" />
    </pattern>
    <!-- Corkboard Pattern -->
    <pattern id="cork" width="100" height="100" patternUnits="userSpaceOnUse">
      <rect width="100" height="100" fill="#c19a6b" />
      <circle cx="20" cy="20" r="2" fill="#8c6239" opacity="0.5"/>
      <circle cx="70" cy="80" r="3" fill="#8c6239" opacity="0.5"/>
      <circle cx="50" cy="40" r="1.5" fill="#8c6239" opacity="0.5"/>
      <circle cx="90" cy="10" r="2" fill="#8c6239" opacity="0.5"/>
    </pattern>
  </defs>
`;

const renderSpores = (count: number) => {
  let spores = '';
  for(let i=0; i<count; i++) {
    const x = Math.random() * W;
    const y = Math.random() * H;
    const r = Math.random() * 2 + 1;
    const dur = Math.random() * 5 + 3;
    const delay = Math.random() * 5;
    spores += `<circle cx="${x}" cy="${y}" r="${r}" fill="#fff" opacity="0.6">
      <animateTransform attributeName="transform" type="translate" values="0,0; ${Math.random()*40-20},${Math.random()*-50-20}; 0,0" dur="${dur}s" begin="${delay}s" repeatCount="indefinite" />
      <animate attributeName="opacity" values="0; 0.8; 0" dur="${dur}s" begin="${delay}s" repeatCount="indefinite" />
    </circle>`;
  }
  return spores;
};

// 1. HERO - ALPHABET WALL
export function generateHeroScene(stats: UserStats): string {
  const letters = "KAMANNAGARI BHAVITHAGNA".split('');
  let lights = '';
  const colors = ['#ef4444', '#3b82f6', '#eab308', '#22c55e', '#a855f7'];
  
  let currentX = 150;
  let currentY = 150;
  
  letters.forEach((char, i) => {
    if (char === ' ') {
      currentX = 200;
      currentY += 100;
      return;
    }
    const color = colors[i % colors.length];
    const delay = Math.random() * 2;
    // Letter
    lights += `<text x="${currentX}" y="${currentY}" font-family="sans-serif" font-weight="bold" font-size="40" fill="#000" opacity="0.7">${char}</text>`;
    // Bulb
    lights += `
      <g transform="translate(${currentX + 15}, ${currentY - 45})">
        <path d="M 0 0 L 0 10" stroke="#333" stroke-width="2"/>
        <ellipse cx="0" cy="15" rx="8" ry="12" fill="${color}" filter="url(#glow-red)">
          <animate attributeName="opacity" values="0.2; 1; 0.2" dur="${Math.random() * 2 + 1}s" begin="${delay}s" repeatCount="indefinite" />
        </ellipse>
      </g>
    `;
    currentX += 80;
  });

  return `
    <svg width="${W}" height="${H}" viewBox="0 0 ${W} ${H}" xmlns="http://www.w3.org/2000/svg">
      ${getCommonStyles()}
      <!-- Vintage Wallpaper Background -->
      <rect width="${W}" height="${H}" fill="#78350f" />
      <rect width="${W}" height="${H}" fill="#000" opacity="0.6" />
      <path d="M 0 50 Q 600 150 1200 50 M 0 150 Q 600 250 1200 150 M 0 250 Q 600 350 1200 250" fill="none" stroke="#111" stroke-width="5" />
      
      <!-- String Wire -->
      <path d="M 0 120 Q 600 180 1200 120" fill="none" stroke="#111" stroke-width="3" />
      <path d="M 0 220 Q 600 280 1200 220" fill="none" stroke="#111" stroke-width="3" />
      
      ${lights}
      ${renderSpores(40)}
      
      <!-- Typing Effect Text -->
      <foreignObject x="50" y="320" width="1100" height="50">
        <div xmlns="http://www.w3.org/1999/xhtml" style="font-family: 'VT323', monospace; color: #fff; font-size: 24px; text-shadow: 0 0 10px #ff0000;">
          <div class="typing">HELLO FRIENDS. I AM KAMANNAGARI BHAVITHAGNA. AI ENGINEER. THE UPSIDE DOWN IS JUST ANOTHER DATASET.</div>
        </div>
      </foreignObject>
      
      <!-- Demogorgon Shadow -->
      <g opacity="0">
        <animate attributeName="opacity" values="0; 0; 0; 0; 0; 0.8; 0; 0; 0" dur="15s" repeatCount="indefinite" />
        <path d="M 900 400 L 950 200 L 930 150 L 960 100 L 1000 150 L 980 200 L 1050 400 Z" fill="#000" filter="url(#glow-red)" />
      </g>
    </svg>
  `;
}

// 2. HAWKINS LAB DATABASE (CRT)
export function generateTerminalScene(stats: UserStats): string {
  return `
    <svg width="${W}" height="${H}" viewBox="0 0 ${W} ${H}" xmlns="http://www.w3.org/2000/svg">
      ${getCommonStyles()}
      <rect width="${W}" height="${H}" fill="#052e16" />
      <rect width="${W}" height="${H}" fill="url(#scanlines)" />
      
      <!-- Screen glow -->
      <radialGradient id="screen-glow" cx="50%" cy="50%" r="50%">
        <stop offset="0%" stop-color="#22c55e" stop-opacity="0.1"/>
        <stop offset="100%" stop-color="#000" stop-opacity="0.8"/>
      </radialGradient>
      <rect width="${W}" height="${H}" fill="url(#screen-glow)" />

      <g class="crt-font" transform="translate(50, 50)">
        <text x="0" y="0">HAWKINS NATIONAL LABORATORY</text>
        <text x="0" y="20">CLASSIFIED ASSET DATABASE v4.0.1</text>
        <text x="0" y="60">========================================</text>
        
        <text x="0" y="100" class="crt-bright">> ASSET_NAME : KAMANNAGARI BHAVITHAGNA</text>
        <text x="0" y="140">> CLEARANCE  : LEVEL AI-07</text>
        <text x="0" y="180">> LOCATION   : DAYANANDA SAGAR UNIVERSITY</text>
        <text x="0" y="220">> MAJOR      : CSE (AI &amp; ML) [CGPA: ${stats.cgpa}]</text>
        
        <text x="0" y="280">KNOWN SKILLS:</text>
        <text x="0" y="310">[+] PYTHON       [+] MACHINE LEARNING</text>
        <text x="0" y="340">[+] TENSORFLOW   [+] DEEP LEARNING (RAG)</text>
      </g>
      
      <!-- Blinking Cursor -->
      <rect x="50" y="360" width="15" height="20" fill="#4ade80">
        <animate attributeName="opacity" values="1; 0; 1" dur="1s" repeatCount="indefinite" />
      </rect>
    </svg>
  `;
}

// 3. THE PARTY
export function generatePartyScene(): string {
  // Simple pixel art silhouettes
  const renderPixelChar = (x: number, y: number, color: string, name: string) => `
    <g transform="translate(${x}, ${y})" class="animate-float">
      <rect x="-20" y="-80" width="40" height="40" fill="#ffccaa" /> <!-- Head -->
      <rect x="-30" y="-40" width="60" height="60" fill="${color}" /> <!-- Body -->
      <rect x="-20" y="20" width="15" height="40" fill="#333" /> <!-- Leg L -->
      <rect x="5" y="20" width="15" height="40" fill="#333" /> <!-- Leg R -->
      <text x="0" y="80" class="crt-font" fill="#fff" text-anchor="middle" font-size="20">${name}</text>
    </g>
  `;
  return `
    <svg width="${W}" height="${H}" viewBox="0 0 ${W} ${H}" xmlns="http://www.w3.org/2000/svg">
      ${getCommonStyles()}
      <rect width="${W}" height="${H}" fill="url(#upsideDownGrad)" />
      
      <!-- Ground -->
      <rect y="300" width="${W}" height="100" fill="#111" />
      <path d="M 0 300 L 1200 300" stroke="#ff0000" stroke-width="4" filter="url(#glow-red)" />
      
      ${renderSpores(30)}
      
      ${renderPixelChar(200, 240, '#ef4444', 'PYTHON')}
      ${renderPixelChar(400, 240, '#3b82f6', 'ML/DL')}
      ${renderPixelChar(600, 240, '#eab308', 'REACT')}
      ${renderPixelChar(800, 240, '#22c55e', 'DATA SCI')}
      ${renderPixelChar(1000, 240, '#a855f7', 'TF')}
    </svg>
  `;
}

// 4. UPSIDE DOWN PORTAL
export function generatePortalScene(stats: UserStats): string {
  let dots = '';
  for(let i=0; i<100; i++) {
    const x = 600 + (Math.random()*400-200);
    const y = 200 + (Math.random()*300-150);
    const color = Math.random() > 0.5 ? '#22c55e' : '#fff'; // green commits
    dots += `<rect x="${x}" y="${y}" width="10" height="10" fill="${color}" opacity="0.8">
      <animateTransform attributeName="transform" type="translate" values="0,0; ${Math.random()*200-100},${Math.random()*-200-50}" dur="${Math.random()*3+2}s" repeatCount="indefinite" />
      <animate attributeName="opacity" values="0.8; 0" dur="${Math.random()*3+2}s" repeatCount="indefinite" />
    </rect>`;
  }

  return `
    <svg width="${W}" height="${H}" viewBox="0 0 ${W} ${H}" xmlns="http://www.w3.org/2000/svg">
      ${getCommonStyles()}
      <rect width="${W}" height="${H}" fill="#000" />
      <g filter="url(#glow-red)">
        <ellipse cx="600" cy="200" rx="300" ry="150" fill="none" stroke="#ff0000" stroke-width="20">
          <animateTransform attributeName="transform" type="rotate" values="0 600 200; 360 600 200" dur="10s" repeatCount="indefinite" />
        </ellipse>
        <ellipse cx="600" cy="200" rx="280" ry="130" fill="none" stroke="#ff4444" stroke-width="10">
          <animateTransform attributeName="transform" type="rotate" values="360 600 200; 0 600 200" dur="8s" repeatCount="indefinite" />
        </ellipse>
      </g>
      <!-- Commits emerging -->
      ${dots}
      <text x="600" y="380" class="st-font" fill="#fff" font-size="40" text-anchor="middle" filter="url(#glow-red)">THE GATE ( ${stats.totalCommits} COMMITS )</text>
    </svg>
  `;
}

// Write a helper to write them to file
export function writeSvg(filename: string, content: string) {
  const dir = path.join(process.cwd(), 'assets', 'generated');
  if (!fs.existsSync(dir)) {
    fs.mkdirSync(dir, { recursive: true });
  }
  fs.writeFileSync(path.join(dir, filename), content.trim());
}
