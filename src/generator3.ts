import { UserStats } from './fetcher';
import { getBackgroundImage } from './generator';

const W = 1200;
const H = 400;

// 9. UPSIDE DOWN REPOSITORIES
export function generateReposScene(): string {
  const renderRepo = (x: number, y: number, name: string) => `
    <g transform="translate(${x}, ${y})">
      <animateTransform attributeName="transform" type="translate" values="${x},${y}; ${x},${y-15}; ${x},${y}" dur="${Math.random()*2+2}s" repeatCount="indefinite" />
      <rect x="-100" y="-40" width="200" height="80" fill="#0f172a" stroke="#ef4444" stroke-width="2" />
      <text x="0" y="-5" font-family="'VT323', monospace" font-size="20" fill="#f87171" text-anchor="middle">${name}</text>
      <!-- Vine wrapping -->
      <path d="M -100 -20 Q 0 -60 100 0 Q 50 40 -100 20" fill="none" stroke="#7f1d1d" stroke-width="5" />
    </g>
  `;
  return `
    <svg width="${W}" height="${H}" viewBox="0 0 ${W} ${H}" xmlns="http://www.w3.org/2000/svg">
      <rect width="${W}" height="${H}" fill="#000" />
      ${getBackgroundImage('grid09')}
      <!-- Big vines in background -->
      <path d="M 0 0 Q 300 200 600 0 T 1200 100" fill="none" stroke="#450a0a" stroke-width="20" />
      <path d="M 0 400 Q 300 100 600 400 T 1200 200" fill="none" stroke="#450a0a" stroke-width="25" />
      
      ${renderRepo(250, 150, 'Machine Learning')}
      ${renderRepo(600, 250, 'React Apps')}
      ${renderRepo(950, 120, 'Data Science')}
    </svg>
  `;
}

// 10. SKILLS RADAR MATRIX
export function generateRadarScene(): string {
  return `
    <svg width="${W}" height="${H}" viewBox="0 0 ${W} ${H}" xmlns="http://www.w3.org/2000/svg">
      <rect width="${W}" height="${H}" fill="#064e3b" />
      ${getBackgroundImage('grid10')}
      <rect width="${W}" height="${H}" fill="#000" opacity="0.8" />
      
      <g transform="translate(600, 200)">
        <circle cx="0" cy="0" r="150" fill="none" stroke="#22c55e" stroke-width="2" />
        <circle cx="0" cy="0" r="100" fill="none" stroke="#22c55e" stroke-width="1" opacity="0.5" />
        <circle cx="0" cy="0" r="50" fill="none" stroke="#22c55e" stroke-width="1" opacity="0.5" />
        
        <!-- Radar Sweep -->
        <path d="M 0 0 L 150 0 A 150 150 0 0 1 0 150 Z" fill="#22c55e" opacity="0.2">
          <animateTransform attributeName="transform" type="rotate" values="0; 360" dur="4s" repeatCount="indefinite" />
        </path>
        
        <!-- Axes -->
        <line x1="-150" y1="0" x2="150" y2="0" stroke="#22c55e" stroke-width="1" opacity="0.5" />
        <line x1="0" y1="-150" x2="0" y2="150" stroke="#22c55e" stroke-width="1" opacity="0.5" />
        <line x1="-106" y1="-106" x2="106" y2="106" stroke="#22c55e" stroke-width="1" opacity="0.5" />
        <line x1="-106" y1="106" x2="106" y2="-106" stroke="#22c55e" stroke-width="1" opacity="0.5" />
        
        <!-- Data Polygon -->
        <polygon points="0,-120 80,-80 140,0 60,60 0,110 -100,50 -130,-40 -70,-90" fill="#22c55e" opacity="0.4" stroke="#4ade80" stroke-width="2" />
        
        <!-- Labels -->
        <text x="0" y="-170" font-family="'VT323', monospace" font-size="20" fill="#4ade80" text-anchor="middle">PYTHON</text>
        <text x="170" y="0" font-family="'VT323', monospace" font-size="20" fill="#4ade80" alignment-baseline="middle">ML/DL</text>
        <text x="0" y="180" font-family="'VT323', monospace" font-size="20" fill="#4ade80" text-anchor="middle">REACT</text>
        <text x="-170" y="0" font-family="'VT323', monospace" font-size="20" fill="#4ade80" text-anchor="end" alignment-baseline="middle">TENSORFLOW</text>
      </g>
    </svg>
  `;
}

// 11. ARCADE ACHIEVEMENT WALL
export function generateArcadeScene(): string {
  const renderArcade = (x: number, y: number, color: string, title: string) => `
    <g transform="translate(${x}, ${y})">
      <rect x="-60" y="-100" width="120" height="200" fill="#111" stroke="#333" stroke-width="4" />
      <rect x="-50" y="-80" width="100" height="80" fill="#000" stroke="${color}" stroke-width="2" />
      <!-- Screen glow -->
      <rect x="-50" y="-80" width="100" height="80" fill="${color}" opacity="0.2">
        <animate attributeName="opacity" values="0.1; 0.3; 0.1" dur="2s" repeatCount="indefinite" />
      </rect>
      <text x="0" y="-40" font-family="'VT323', monospace" font-size="20" fill="${color}" text-anchor="middle">${title}</text>
      <rect x="-60" y="40" width="120" height="20" fill="#222" />
      <!-- Joystick & Buttons -->
      <circle cx="-20" cy="50" r="5" fill="#ef4444" />
      <circle cx="20" cy="50" r="4" fill="#3b82f6" />
      <circle cx="40" cy="50" r="4" fill="#3b82f6" />
    </g>
  `;
  return `
    <svg width="${W}" height="${H}" viewBox="0 0 ${W} ${H}" xmlns="http://www.w3.org/2000/svg">
      <rect width="${W}" height="${H}" fill="#0f172a" />
      ${getBackgroundImage('grid11')}
      <path d="M 0 300 L 1200 300" stroke="#f472b6" stroke-width="2" opacity="0.5" />
      <rect y="300" width="${W}" height="100" fill="#1e1b4b" />
      
      ${renderArcade(200, 250, '#22c55e', 'HACKATHON')}
      ${renderArcade(450, 250, '#ef4444', 'OPEN SOURCE')}
      ${renderArcade(700, 250, '#3b82f6', 'AI MODELS')}
      ${renderArcade(950, 250, '#eab308', 'RESEARCH')}
    </svg>
  `;
}

// 12. ESCAPE SUNSET
export function generateEscapeScene(): string {
  return `
    <svg width="${W}" height="${H}" viewBox="0 0 ${W} ${H}" xmlns="http://www.w3.org/2000/svg">
      <defs>
        <linearGradient id="sunset" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stop-color="#7c2d12" />
          <stop offset="50%" stop-color="#ea580c" />
          <stop offset="100%" stop-color="#fcd34d" />
        </linearGradient>
      </defs>
      <rect width="${W}" height="${H}" fill="url(#sunset)" />
      ${getBackgroundImage('grid12')}
      
      <!-- Sun -->
      <circle cx="600" cy="200" r="100" fill="#fef08a" opacity="0.8" />
      <!-- Scanlines over sun -->
      <rect x="500" y="100" width="200" height="200" fill="url(#scanlines)" />

      <!-- Endless Road -->
      <path d="M 600 200 L 1200 400 L 0 400 Z" fill="#111827" />
      <path d="M 600 200 L 1200 400 L 0 400 Z" fill="url(#scanlines)" opacity="0.5" />
      
      <!-- Center line -->
      <path d="M 600 200 L 600 400" stroke="#fcd34d" stroke-width="4" stroke-dasharray="10 10" />

      <!-- Bike Silhouette (animated scale to look like it's driving away) -->
      <g transform="translate(600, 300)">
        <animateTransform attributeName="transform" type="scale" values="1; 0.2" dur="10s" repeatCount="indefinite" />
        <circle cx="-20" cy="0" r="15" fill="none" stroke="#000" stroke-width="2" />
        <circle cx="20" cy="0" r="15" fill="none" stroke="#000" stroke-width="2" />
        <path d="M -20 0 L 0 -20 L 20 0 M 0 -20 L -10 -40 L -20 -40 M 0 -20 L -5 -40" fill="none" stroke="#000" stroke-width="3" />
        <circle cx="-10" cy="-45" r="10" fill="#000" />
        <rect x="-25" y="-35" width="10" height="15" fill="#000" /> <!-- Laptop backpack -->
      </g>

      <!-- Terminal Text overlay -->
      <foreignObject x="0" y="320" width="${W}" height="80">
        <div xmlns="http://www.w3.org/1999/xhtml" style="font-family: 'VT323', monospace; color: #4ade80; font-size: 24px; text-align: center; width: 100%;">
          <div style="background: rgba(0,0,0,0.7); display: inline-block; padding: 10px;">
            > SYSTEM ONLINE. THE JOURNEY CONTINUES.<br/>
            > SEE YOU IN THE NEXT COMMIT.<span style="animation: flicker 1s infinite;">_</span>
          </div>
        </div>
      </foreignObject>
    </svg>
  `;
}
