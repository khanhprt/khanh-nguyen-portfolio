const rect = (x, y, width, height, fill) => `<rect x="${x}" y="${y}" width="${width}" height="${height}" fill="${fill}"/>`;
const group = (name, content) => `<g class="${name}">${content}</g>`;
const frame = (body) => `<svg class="project-simulation" viewBox="0 0 320 240" preserveAspectRatio="xMidYMid slice" shape-rendering="crispEdges" aria-hidden="true">${body}</svg>`;
const label = (x, y, text, color = '#c7e4ca', size = 5) => `<text x="${x}" y="${y}" fill="${color}" font-family="monospace" font-size="${size}">${text}</text>`;
const outline = (x, y, w, h, color) => `<rect x="${x}" y="${y}" width="${w}" height="${h}" fill="none" stroke="${color}" stroke-width="1.5"/>`;

// Factory camera dashboard: individual feeds and alarm panel are separate layers.
function fire() {
  const cameras = Array.from({ length: 16 }, (_, i) => {
    const x = 12 + (i % 4) * 55, y = 25 + Math.floor(i / 4) * 50;
    const shades = ['#8a9d93', '#a6b4a7', '#788e83', '#b0bbb0'];
    return `<g transform="translate(${x} ${y})">${rect(0, 0, 52, 46, '#111c1b')}${rect(2, 2, 48, 42, shades[i % 4])}${rect(2, 31, 48, 13, '#596e65')}${rect(8, 12, 17, 19, '#bfc9bd')}${rect(10, 9, 13, 3, '#526a64')}${rect(29, 7, 4, 24, '#667c74')}${rect(35, 14, 9, 17, '#6d8278')}${rect(4, 4, 7, 3, '#dc584d')}${rect(4, 40, 19, 2, '#d4cb80')}${i === 5 ? group('sim-camera-alert', rect(2, 2, 48, 42, '#d04f4388') + outline(3, 3, 46, 40, '#ef7962')) : ''}</g>`;
  }).join('');
  return frame(rect(0, 0, 320, 240, '#161e24') + rect(0, 0, 320, 17, '#243039') + label(8, 11, 'EHS / CAMERA MONITOR', '#d4e2db', 6) + cameras + rect(236, 25, 76, 70, '#713b38') + group('sim-camera-alert', rect(239, 28, 70, 64, '#c24f45')) + label(241, 37, 'FIRE ALERT', '#fff3db', 6) + outline(250, 45, 37, 33, '#f8cf9c') + rect(236, 100, 76, 112, '#212c32') + Array.from({ length: 8 }, (_, i) => rect(241, 107 + i * 12, 60 - i % 3 * 6, 2, i === 0 ? '#ed8b70' : '#71847c')).join('') + rect(236, 216, 76, 13, '#34423f') + label(243, 225, 'SYSTEM ONLINE', '#b7d9ab', 5));
}

// Aerial industrial roof and telemetry, echoing the drone inspection interface.
function drone() {
  const roofs = Array.from({ length: 6 }, (_, i) => rect(35 + i * 36, 44, 29, 141, i % 2 ? '#a8b4a5' : '#bac2b3') + Array.from({ length: 6 }, (_, j) => rect(37 + i * 36, 50 + j * 20, 25, 2, '#81988e')).join('')).join('');
  return frame(rect(0, 0, 320, 240, '#122622') + rect(0, 0, 320, 18, '#10231f') + label(8, 12, 'GPS  /  BATTERY  /  ALTITUDE', '#83dfba', 6) + `<g clip-path="url(#drone-window)"><clipPath id="drone-window"><rect x="8" y="22" width="304" height="190"/></clipPath>${group('sim-aerial', rect(8, 22, 304, 190, '#77897d') + roofs + rect(16, 102, 280, 7, '#57929c') + rect(16, 111, 280, 3, '#94c2bd') + rect(16, 190, 280, 18, '#5a6b61') + rect(16, 28, 280, 9, '#65796c') + rect(165, 142, 35, 24, '#97816c') + rect(174, 148, 20, 15, '#bc8765') + outline(162, 139, 41, 30, '#e5ce69'))}</g>` + rect(8, 216, 304, 18, '#142a26') + label(14, 228, 'LIVE FEED   /   EDGE AI', '#91dfbc', 6) + group('sim-camera-alert', label(229, 228, 'TARGET LOCK', '#efcf69', 6)));
}

// Overhead view of a person entering a monitored zone, with detection and pose markers.
function safety() {
  const worker = rect(32, 0, 13, 14, '#253536') + rect(27, 14, 24, 31, '#405257') + rect(24, 20, 5, 20, '#c09679') + rect(50, 19, 5, 19, '#c09679') + rect(28, 45, 8, 23, '#283a3e') + rect(42, 45, 8, 23, '#283a3e');
  const skeleton = `<path d="M39 11 L39 25 L29 33 M39 25 L50 32 M39 25 L39 44 L32 60 M39 44 L46 60" fill="none" stroke="#f46b59" stroke-width="1.5"/>` + [ [39,11], [39,25], [29,33], [50,32], [39,44], [32,60], [46,60] ].map(([x,y]) => `<circle cx="${x}" cy="${y}" r="2" fill="#78a9fa"/>`).join('');
  return frame(rect(0, 0, 320, 240, '#92998c') + rect(0, 0, 45, 240, '#4d5c57') + rect(275, 0, 45, 240, '#576761') + Array.from({ length: 7 }, (_, i) => rect(6, 12 + i * 34, 32, 5, '#aeb9ac') + rect(282, 12 + i * 34, 31, 5, '#aab7a8')).join('') + rect(45, 76, 230, 3, '#5c70a0') + rect(45, 185, 230, 3, '#5c70a0') + `<ellipse cx="160" cy="143" rx="42" ry="55" fill="none" stroke="#edf0df" stroke-width="5" stroke-dasharray="7 4"/>` + group('sim-zone-alert', `<ellipse cx="160" cy="143" rx="42" ry="55" fill="none" stroke="#ed6f5e" stroke-width="5" stroke-dasharray="7 4"/>`) + group('sim-worker', worker + skeleton + outline(20, -5, 40, 77, '#77ef83') + label(61, 14, 'PERSON', '#6ff28a', 6)) + rect(0, 0, 320, 16, '#263832') + label(8, 11, 'SAFETY VISION / LIVE', '#cce5ca', 6) + group('sim-zone-alert', label(238, 11, 'WARNING', '#ffb38f', 6)));
}

export function projectSimulation(scene) {
  return ({ fire, drone, safety })[scene]?.() ?? null;
}
