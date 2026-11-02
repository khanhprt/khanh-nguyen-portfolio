
const block = (x,y,w,h,c) => `<rect x="${x}" y="${y}" width="${w}" height="${h}" fill="${c}"/>`;
/* Nền pixel cho hành trình: mọi hình đều là lưới ô vuông, không có đường cong. */
const GRID = 8;
const pixelRows = (rows, x, y, fill) => rows.flatMap((row, r) => [...row].map((c, col) => (c === 'X' ? block(x + col * GRID, y + r * GRID, GRID, GRID, fill) : ''))).join('');
const CLOUD = ['..XXXX..', '.XXXXXX.', 'XXXXXXXX', 'XXXXXXXX'];
const rngFrom = (seed) => () => { seed = (seed * 16807) % 2147483647; return seed / 2147483647; };
const svgUrl = (body, width, height) => `url("data:image/svg+xml,${encodeURIComponent(`<svg xmlns="http://www.w3.org/2000/svg" width="${width}" height="${height}" viewBox="0 0 ${width} ${height}" shape-rendering="crispEdges">${body}</svg>`)}")`;

/** Dãy nhà pixel: thân nhà theo lưới 8px, cửa sổ sáng rải ngẫu nhiên theo seed. */
export function pixelSkyline(seed, color, light, height, width = 1200) {
  const rand = rngFrom(seed);
  const rows = Math.floor(height / GRID);
  let x = 0;
  let body = '';
  while (x < width) {
    const w = (5 + Math.floor(rand() * 6)) * GRID;
    const h = (4 + Math.floor(rand() * (rows - 6))) * GRID;
    const top = height - h;
    body += block(x, top, w, h, color);
    if (rand() > 0.65) body += block(x + w / 2 - GRID / 2, top - GRID * 2, GRID, GRID * 2, color);
    for (let wy = top + GRID * 2; wy + GRID <= height - GRID; wy += GRID * 2) {
      for (let wx = x + GRID; wx + GRID <= x + w - GRID; wx += GRID * 2) {
        if (rand() > 0.55) body += block(wx, wy, GRID, GRID, light);
      }
    }
    x += w + GRID * (1 + Math.floor(rand() * 2));
  }
  return svgUrl(body, width, height);
}

/** Vài đám mây pixel trôi chậm phía trên hành trình. */
export function pixelClouds() {
  const body = [[80, 40], [330, 16], [620, 56], [880, 24], [1110, 48]]
    .map(([x, y]) => pixelRows(CLOUD, x, y, '#fbf8ea')).join('');
  return svgUrl(body, 1400, 120);
}
