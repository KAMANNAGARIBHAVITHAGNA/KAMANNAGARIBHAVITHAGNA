import { UserStats } from './fetcher';

const W = 1200;
const H = 400;
const stFont = `font-family: 'IM Fell English', serif;`;
const crtFont = `font-family: 'VT323', monospace;`;

// 5. MISSION BOARD (Evidence Wall)
export function generateEvidenceScene(): string {
  const renderPhoto = (x: number, y: number, name: string, rot: number) => `
    <g transform="translate(${x}, ${y}) rotate(${rot})">
      <rect x="0" y="0" width="160" height="180" fill="#f8f9fa" stroke="#e5e7eb" stroke-width="2" filter="drop-shadow(3px 5px 4px rgba(0,0,0,0.4))" />
      <rect x="10" y="10" width="140" height="120" fill="#111827" />
      <text x="80" y="70" font-family="'VT323', monospace" font-size="24" fill="#ef4444" text-anchor="middle" font-weight="bold">TOP SECRET</text>
      <text x="80" y="160" font-family="sans-serif" font-size="16" fill="#374151" text-anchor="middle" font-weight="bold">${name}</text>
      <!-- Red string pin -->
      <circle cx="80" cy="5" r="5" fill="#ef4444" />
    </g>
  `;
  return `
    <svg width="${W}" height="${H}" viewBox="0 0 ${W} ${H}" xmlns="http://www.w3.org/2000/svg">
      <rect width="${W}" height="${H}" fill="#c19a6b" />
      <!-- Strings -->
      <path d="M 280 105 L 480 205 L 780 155 L 980 255 L 280 105" fill="none" stroke="#ef4444" stroke-width="3" opacity="0.8" />
      
      ${renderPhoto(200, 100, 'AGRI-INTEL', -5)}
      ${renderPhoto(400, 200, 'HOPE TRAVEL', 8)}
      ${renderPhoto(700, 150, 'SPITCH AI', -3)}
      ${renderPhoto(900, 250, 'RUNA GEN', 5)}
    </svg>
  `;
}

// 6. HAWKINS MAP
export function generateMapScene(): string {
  return `
    <svg width="${W}" height="${H}" viewBox="0 0 ${W} ${H}" xmlns="http://www.w3.org/2000/svg">
      <rect width="${W}" height="${H}" fill="#0f172a" />
      <!-- Roads -->
      <path d="M 0 300 Q 300 300 500 200 T 900 100 L 1200 100" fill="none" stroke="#334155" stroke-width="20" />
      <path d="M 0 300 Q 300 300 500 200 T 900 100 L 1200 100" fill="none" stroke="#eab308" stroke-width="2" stroke-dasharray="10 10" />
      
      <!-- Locations -->
      <circle cx="100" cy="300" r="10" fill="#3b82f6" />
      <text x="100" y="280" font-family="sans-serif" fill="#fff" font-size="14" text-anchor="middle">HAROHALLI</text>
      
      <circle cx="500" cy="200" r="10" fill="#ef4444" />
      <text x="500" y="180" font-family="sans-serif" fill="#fff" font-size="14" text-anchor="middle">BANGALORE HQ</text>
      
      <circle cx="900" cy="100" r="15" fill="#a855f7">
        <animate attributeName="r" values="15; 20; 15" dur="2s" repeatCount="indefinite" />
      </circle>
      <text x="900" y="70" font-family="sans-serif" fill="#ff0000" font-weight="bold" font-size="16" text-anchor="middle">GATE FORTRESS</text>

      <!-- Bike Blip -->
      <circle cx="0" cy="0" r="5" fill="#fff" filter="drop-shadow(0 0 5px #fff)">
        <animateMotion dur="10s" repeatCount="indefinite" path="M 0 300 Q 300 300 500 200 T 900 100 L 1200 100" />
      </circle>
    </svg>
  `;
}

// 7. DEMOGORGON BOSS
export function generateBossScene(): string {
  return `
    <svg width="${W}" height="${H}" viewBox="0 0 ${W} ${H}" xmlns="http://www.w3.org/2000/svg">
      <defs>
        <radialGradient id="fire" cx="50%" cy="100%" r="100%">
          <stop offset="0%" stop-color="#ea580c"/>
          <stop offset="50%" stop-color="#991b1b"/>
          <stop offset="100%" stop-color="#000"/>
        </radialGradient>
      </defs>
      <rect width="${W}" height="${H}" fill="url(#fire)" />
      
      <!-- Demogorgon Silhouette -->
      <g transform="translate(600, 400)">
        <animateTransform attributeName="transform" type="translate" values="600,400; 600,380; 600,400" dur="4s" repeatCount="indefinite" additive="sum"/>
        <path d="M -50 0 L -80 -100 L -150 -150 L -100 -200 L -50 -180 L 0 -250 L 50 -180 L 100 -200 L 150 -150 L 80 -100 L 50 0 Z" fill="#000" />
        <!-- Head -->
        <circle cx="0" cy="-250" r="40" fill="#000" />
        <!-- Open mouth / petals -->
        <path d="M 0 -250 L -60 -290 L -20 -330 L 0 -250" fill="#000" />
        <path d="M 0 -250 L 60 -290 L 20 -330 L 0 -250" fill="#000" />
        <path d="M 0 -250 L -70 -210 L -40 -190 L 0 -250" fill="#000" />
        <path d="M 0 -250 L 70 -210 L 40 -190 L 0 -250" fill="#000" />
        <!-- Red Glowing Eyes/Teeth -->
        <circle cx="0" cy="-250" r="10" fill="#ff0000">
          <animate attributeName="opacity" values="1; 0.5; 1" dur="1s" repeatCount="indefinite" />
        </circle>
      </g>
      
      <!-- Health Bar -->
      <rect x="300" y="50" width="600" height="30" fill="#111" stroke="#333" stroke-width="4" />
      <rect x="302" y="52" width="400" height="26" fill="#ef4444" />
      <text x="600" y="40" font-family="'VT323', monospace" font-size="24" fill="#ef4444" text-anchor="middle">BOSS: GATE 2027</text>
    </svg>
  `;
}

// 8. VECNA CLOCK
export function generateClockScene(): string {
  return `
    <svg width="${W}" height="${H}" viewBox="0 0 ${W} ${H}" xmlns="http://www.w3.org/2000/svg">
      <rect width="${W}" height="${H}" fill="#000" />
      <!-- Lightning -->
      <rect width="${W}" height="${H}" fill="#fff" opacity="0">
        <animate attributeName="opacity" values="0;0;0;0;1;0;0;0;0.5;0" dur="5s" repeatCount="indefinite" />
      </rect>

      <!-- Grandfather Clock -->
      <g transform="translate(600, 200)">
        <rect x="-60" y="-150" width="120" height="300" fill="#292524" stroke="#44403c" stroke-width="5" />
        <circle cx="0" cy="-80" r="50" fill="#fef3c7" stroke="#b45309" stroke-width="4" />
        <!-- Clock hands -->
        <line x1="0" y1="-80" x2="0" y2="-110" stroke="#000" stroke-width="4">
          <animateTransform attributeName="transform" type="rotate" values="0 0 -80; 360 0 -80" dur="10s" repeatCount="indefinite" />
        </line>
        <line x1="0" y1="-80" x2="30" y2="-80" stroke="#000" stroke-width="6">
          <animateTransform attributeName="transform" type="rotate" values="0 0 -80; 360 0 -80" dur="60s" repeatCount="indefinite" />
        </line>
        <!-- Pendulum -->
        <g>
          <animateTransform attributeName="transform" type="rotate" values="-15 0 20; 15 0 20; -15 0 20" dur="2s" repeatCount="indefinite" />
          <line x1="0" y1="20" x2="0" y2="100" stroke="#b45309" stroke-width="6" />
          <circle cx="0" cy="100" r="20" fill="#fbbf24" />
        </g>
      </g>
      <text x="300" y="200" font-family="'IM Fell English', serif" font-size="40" fill="#ef4444" text-anchor="middle">TIME IS TICKING</text>
      <text x="900" y="200" font-family="'IM Fell English', serif" font-size="40" fill="#ef4444" text-anchor="middle">GATE 2027</text>
    </svg>
  `;
}
