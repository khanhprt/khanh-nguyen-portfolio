/* SVG / HTML generators cho bối cảnh: tòa nhà, skyline, mock dự án, icon. */
export const scenes = (() => {
  const esc = (s) => String(s).replace(/[&<>"']/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]));

  // Bộ sinh số ngẫu nhiên có seed để skyline luôn giống nhau mỗi lần load
  function rng(seed) {
    return () => {
      seed = (seed * 16807) % 2147483647;
      return (seed - 1) / 2147483646;
    };
  }

  function windowGrid(x0, y0, cols, rows, w, h, gx, gy, fill, litChance, rand) {
    let out = '';
    for (let r = 0; r < rows; r++) {
      for (let c = 0; c < cols; c++) {
        const lit = rand() < litChance;
        out += `<rect x="${x0 + c * (w + gx)}" y="${y0 + r * (h + gy)}" width="${w}" height="${h}" rx="2" fill="${lit ? '#ffe7b8' : fill}"/>`;
      }
    }
    return out;
  }

  // Mã QR giả (trang trí) — lưới 9x9 + 3 ô định vị
  function qrCode(x, y, cell, seed) {
    const rand = rng(seed);
    let out = `<rect x="${x - cell}" y="${y - cell}" width="${cell * 11}" height="${cell * 11}" rx="2" fill="#fff" />`;
    for (let r = 0; r < 9; r++) {
      for (let c = 0; c < 9; c++) {
        const inFinder = (r < 3 && c < 3) || (r < 3 && c > 5) || (r > 5 && c < 3);
        if (!inFinder && rand() > 0.5) out += `<rect x="${x + c * cell}" y="${y + r * cell}" width="${cell}" height="${cell}" fill="#14161f" />`;
      }
    }
    const finder = (fx, fy) =>
      `<rect x="${x + fx * cell}" y="${y + fy * cell}" width="${cell * 3}" height="${cell * 3}" fill="#14161f" />` +
      `<rect x="${x + (fx + 0.5) * cell}" y="${y + (fy + 0.5) * cell}" width="${cell * 2}" height="${cell * 2}" fill="#fff" />` +
      `<rect x="${x + (fx + 1) * cell}" y="${y + (fy + 1) * cell}" width="${cell}" height="${cell}" fill="#14161f" />`;
    return out + finder(0, 0) + finder(6, 0) + finder(0, 6);
  }

  // Cỡ chữ biển hiệu vừa với độ rộng (ước lượng ~0.68em mỗi ký tự in hoa)
  // (chữ Hán rộng gần gấp rưỡi chữ Latin in hoa)
  const textUnits = (str) => [...str].reduce((n, c) => n + (/[\u2e80-\u9fff\uff00-\uffef]/.test(c) ? 1.5 : 1), 0);
  const fit = (name, width, base, spacing = 1) => Math.min(base, width / (textUnits(name) * (0.68 + spacing / base))).toFixed(1);

  // Toà nhà theo ngành — viewBox 0 0 320 520, chân ở y=520
  const buildingKinds = {
    // Ngân hàng: toà tháp kính hiện đại, sảnh ATM, logo trừu tượng
    bank: (name) => `
      <defs>
        <linearGradient id="bk-navy" x1="0" y1="0" x2="1" y2="1"><stop offset="0" stop-color="#2d5b8f" /><stop offset="1" stop-color="#17325a" /></linearGradient>
        <clipPath id="bk-tower"><rect x="64" y="58" width="192" height="340" /></clipPath>
      </defs>
      <rect x="52" y="40" width="216" height="380" fill="#ece7de" />
      <rect x="64" y="58" width="192" height="340" fill="url(#bk-navy)" />
      <g clip-path="url(#bk-tower)">
        <g stroke="#9fc0e6" stroke-opacity=".28" stroke-width="1.5">
          ${Array.from({ length: 7 }, (_, i) => `<line x1="${88 + i * 24}" y1="58" x2="${88 + i * 24}" y2="398" />`).join('')}
          ${Array.from({ length: 13 }, (_, i) => `<line x1="64" y1="${84 + i * 26}" x2="256" y2="${84 + i * 26}" />`).join('')}
        </g>
        ${[[2, 1], [5, 2], [1, 4], [6, 5], [3, 7], [0, 8], [4, 10], [7, 11], [2, 12]].map(([c, r], k) => `<rect class="win w${k % 3}" x="${65 + c * 24}" y="${59 + r * 26}" width="22" height="24" fill="#ffe7b8" />`).join('')}
        <polygon class="glass-sweep" points="40,58 90,58 10,398 -40,398" fill="#fff" opacity=".14" />
      </g>
      <rect x="46" y="30" width="228" height="16" fill="#ece7de" />
      <rect x="126" y="12" width="68" height="30" rx="8" fill="#fff" />
      <g transform="translate(160 27)"><path d="M-14 6 L-4 -8 L4 -8 L-6 6 Z" fill="#17325a" /><path d="M-2 6 L8 -8 L16 -8 L6 6 Z" fill="#c9a35c" /></g>
      <rect x="30" y="398" width="260" height="122" fill="#f4f1ea" />
      <rect x="22" y="392" width="276" height="10" fill="#17325a" />
      <rect x="70" y="404" width="180" height="20" rx="3" fill="#17325a" />
      <text x="160" y="418" text-anchor="middle" font-size="${fit(name, 168, 10, 1.5)}" font-weight="800" fill="#fff" letter-spacing="1.5">${name}</text>
      <rect x="44" y="436" width="72" height="84" fill="#9fb6d6" opacity=".85" />
      <rect x="128" y="436" width="64" height="84" fill="#2b3550" />
      <line x1="160" y1="436" x2="160" y2="520" stroke="#8fa3c7" stroke-width="2" />
      <rect x="204" y="436" width="72" height="84" fill="#1f2a44" />
      <text x="240" y="450" text-anchor="middle" font-size="7" font-weight="800" fill="#9fc0e6" letter-spacing="1">ATM 24/7</text>
      <g><rect x="212" y="458" width="24" height="52" rx="3" fill="#e9e4dc" /><rect class="atm" x="216" y="463" width="16" height="12" rx="1.5" fill="#2ecc8a" />
        <rect x="244" y="458" width="24" height="52" rx="3" fill="#e9e4dc" /><rect class="atm a2" x="248" y="463" width="16" height="12" rx="1.5" fill="#7aa2ff" /></g>
      <g fill="#3e7d55"><circle cx="34" cy="508" r="10" /><circle cx="286" cy="508" r="10" /></g>`,

    vending: (name) => `
      <rect x="30" y="230" width="260" height="290" fill="#e8eef6" />
      <rect x="22" y="222" width="276" height="14" rx="3" fill="#5b6cff" />
      <rect x="70" y="246" width="180" height="24" rx="5" fill="#14161f" />
      <text x="160" y="262" text-anchor="middle" font-size="${fit(name, 166, 10)}" font-weight="800" fill="#fff" letter-spacing="1">${name}</text>
      ${Array.from({ length: 2 }, (_, r) => Array.from({ length: 5 }, (_, c) => `<rect x="${46 + c * 48}" y="${286 + r * 40}" width="36" height="26" rx="3" fill="#9fb3d6" />`).join('')).join('')}
      <rect x="44" y="370" width="104" height="150" rx="8" fill="#ff8a5c" />
      <rect x="52" y="380" width="64" height="104" rx="4" fill="#1f2a44" />
      <g class="product-glow">
        ${Array.from({ length: 4 }, (_, r) => Array.from({ length: 3 }, (_, c) => `<rect x="${57 + c * 20}" y="${386 + r * 25}" width="13" height="18" rx="3" fill="${['#ffd166', '#9be7c4', '#ff4d6d', '#7aa2ff'][(r + c) % 4]}" />`).join('')).join('')}
      </g>
      <rect x="52" y="490" width="64" height="18" rx="3" fill="#14161f" />
      <rect x="122" y="384" width="20" height="20" rx="2" fill="#14161f" />
      ${qrCode(124, 386, 1.8, 3)}
      <rect x="126" y="412" width="12" height="4" rx="2" fill="#14161f" />
      <circle class="blink-light" cx="132" cy="426" r="2.5" fill="#2ecc8a" />`,

    // Tài chính cho vay tiêu dùng: biển app duyệt hồ sơ, xu rơi vào chồng tiền, dấu duyệt
    finance: (name) => `
      <rect x="36" y="150" width="248" height="370" fill="#f4f7fb" />
      <rect x="28" y="140" width="264" height="14" rx="3" fill="#0e9f6e" />
      <rect x="36" y="154" width="248" height="36" fill="#12b886" />
      <text x="160" y="178" text-anchor="middle" font-size="${fit(name, 220, 12, 1.5)}" font-weight="800" fill="#fff" letter-spacing="1.5">${name}</text>
      <rect x="56" y="206" width="208" height="150" rx="12" fill="#fff" stroke="#dbe5ef" stroke-width="2" />
      <rect x="74" y="220" width="64" height="122" rx="10" fill="#14161f" />
      <rect x="79" y="228" width="54" height="106" rx="5" fill="#fff" />
      <rect x="79" y="228" width="54" height="18" rx="5" fill="#12b886" />
      <rect x="86" y="256" width="40" height="6" rx="3" fill="#e6e8f0" /><rect x="86" y="268" width="30" height="6" rx="3" fill="#e6e8f0" />
      <rect x="86" y="284" width="40" height="5" rx="2.5" fill="#e6e8f0" /><rect class="fin-progress" x="86" y="284" width="40" height="5" rx="2.5" fill="#12b886" />
      <g class="fin-ok"><circle cx="106" cy="312" r="11" fill="#12b886" /><path d="M100 312 l4 4 l8 -8" fill="none" stroke="#fff" stroke-width="3" stroke-linecap="round" stroke-linejoin="round" /></g>
      <g>
        <ellipse cx="206" cy="330" rx="26" ry="7" fill="#e3b341" /><rect x="180" y="318" width="52" height="12" fill="#e3b341" /><ellipse cx="206" cy="318" rx="26" ry="7" fill="#f2c94c" />
        <rect x="180" y="306" width="52" height="12" fill="#e3b341" /><ellipse cx="206" cy="306" rx="26" ry="7" fill="#f2c94c" />
        <g class="coin-drop"><rect x="180" y="294" width="52" height="12" fill="#e3b341" /><ellipse cx="206" cy="294" rx="26" ry="7" fill="#f2c94c" /></g>
        <g class="coin-drop c2"><rect x="180" y="282" width="52" height="12" fill="#e3b341" /><ellipse cx="206" cy="282" rx="26" ry="7" fill="#f2c94c" /></g>
      </g>
      <g class="stamp"><circle cx="232" cy="236" r="20" fill="none" stroke="#e0524b" stroke-width="3" /><path d="M222 236 l7 7 l13 -13" fill="none" stroke="#e0524b" stroke-width="3.5" stroke-linecap="round" stroke-linejoin="round" /></g>
      <rect x="48" y="380" width="224" height="140" fill="#dbe7f3" />
      <rect x="48" y="380" width="224" height="8" fill="#0e9f6e" />
      <g fill="#9fb6d6" opacity=".85"><rect x="58" y="398" width="60" height="70" /><rect x="202" y="398" width="60" height="70" /></g>
      <rect x="132" y="404" width="56" height="116" fill="#2b3550" /><line x1="160" y1="404" x2="160" y2="520" stroke="#8fa3c7" stroke-width="2" />
      <rect x="58" y="474" width="60" height="6" fill="#0e9f6e" /><rect x="202" y="474" width="60" height="6" fill="#0e9f6e" />`,

    luxury: (name) => `
      <defs>
        <linearGradient id="bk-marble" x1="0" y1="0" x2="1" y2="1"><stop offset="0" stop-color="#fbf9f5" /><stop offset="1" stop-color="#e8e2d8" /></linearGradient>
        <linearGradient id="bk-glass" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#2c2c36" /><stop offset="1" stop-color="#121217" /></linearGradient>
        <linearGradient id="bk-gold" x1="0" x2="1"><stop offset="0" stop-color="#b8893b" /><stop offset=".5" stop-color="#f3d58c" /><stop offset="1" stop-color="#b8893b" /></linearGradient>
        <radialGradient id="bk-ped" cx=".5" cy=".5" r=".5"><stop offset="0" stop-color="#fff3c4" stop-opacity=".9" /><stop offset="1" stop-color="#fff3c4" stop-opacity="0" /></radialGradient>
        <linearGradient id="bk-cone" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#fff3d1" stop-opacity=".45" /><stop offset="1" stop-color="#fff3d1" stop-opacity="0" /></linearGradient>
        <linearGradient id="bk-scr" x1="0" y1="0" x2="1" y2="1"><stop offset="0" stop-color="#6b5bff" /><stop offset="1" stop-color="#ff7ab6" /></linearGradient>
        <clipPath id="bk-phones"><rect x="64" y="344" width="16" height="32" rx="3" /><rect x="108" y="336" width="18" height="40" rx="3" /><rect x="152" y="344" width="16" height="32" rx="3" /></clipPath>
      </defs>
      <rect x="10" y="190" width="300" height="330" fill="url(#bk-marble)" />
      <g fill="none" stroke="#d6cdbf" stroke-width="1.2" opacity=".7"><path d="M20 300 C60 290 70 330 110 320" /><path d="M210 460 C240 440 260 480 300 470" /><path d="M14 470 C40 460 50 490 30 510" /></g>
      <rect x="6" y="180" width="308" height="12" fill="url(#bk-gold)" />
      <rect x="18" y="192" width="4" height="308" fill="url(#bk-gold)" /><rect x="298" y="192" width="4" height="308" fill="url(#bk-gold)" />
      <rect x="34" y="204" width="252" height="44" rx="4" fill="#111114" />
      <path d="M160 211 l5 5 l-5 6 l-5 -6 Z" fill="url(#bk-gold)" />
      <text x="160" y="239" text-anchor="middle" font-size="${fit(name, 236, 15, 2)}" font-weight="700" fill="url(#bk-gold)" letter-spacing="2" font-family="Playfair Display, Georgia, serif">${name}</text>
      <rect x="34" y="262" width="176" height="176" rx="3" fill="url(#bk-glass)" stroke="url(#bk-gold)" stroke-width="4" />
      <g fill="#c9a35c"><rect x="64" y="266" width="16" height="5" rx="2" /><rect x="109" y="266" width="16" height="5" rx="2" /><rect x="152" y="266" width="16" height="5" rx="2" /></g>
      <g fill="url(#bk-cone)"><polygon points="72,271 50,388 94,388" /><polygon points="117,271 94,388 140,388" /><polygon points="160,271 138,388 182,388" /></g>
      <g fill="url(#bk-ped)"><ellipse cx="72" cy="388" rx="24" ry="8" /><ellipse cx="117" cy="388" rx="26" ry="9" /><ellipse cx="160" cy="388" rx="24" ry="8" /></g>
      <g fill="#f4efe6"><rect x="58" y="388" width="28" height="46" /><rect x="102" y="388" width="30" height="46" /><rect x="146" y="388" width="28" height="46" /></g>
      <g fill="url(#bk-gold)"><rect x="56" y="386" width="32" height="4" /><rect x="100" y="386" width="34" height="4" /><rect x="144" y="386" width="32" height="4" /></g>
      <g fill="#0a0a0c" stroke="url(#bk-gold)" stroke-width="1"><rect x="61" y="340" width="22" height="40" rx="5" /><rect x="105" y="332" width="24" height="48" rx="5" /><rect x="149" y="340" width="22" height="40" rx="5" /></g>
      <g fill="url(#bk-scr)"><rect x="64" y="344" width="16" height="32" rx="3" /><rect x="108" y="336" width="18" height="40" rx="3" /><rect x="152" y="344" width="16" height="32" rx="3" /></g>
      <g clip-path="url(#bk-phones)"><rect class="shimmer" x="40" y="320" width="12" height="80" fill="#fff" opacity=".6" /></g>
      <ellipse class="halo-ring" cx="117" cy="356" rx="22" ry="5" fill="none" stroke="url(#bk-gold)" stroke-width="1.5" />
      <polygon points="34,262 90,262 34,330" fill="#fff" opacity=".06" />
      <g fill="#ffe7a3">
        <path class="sparkle" d="M92 320 l2 6 l6 2 l-6 2 l-2 6 l-2 -6 l-6 -2 l6 -2 Z" />
        <path class="sparkle s2" d="M140 306 l2 6 l6 2 l-6 2 l-2 6 l-2 -6 l-6 -2 l6 -2 Z" />
        <path class="sparkle s3" d="M186 334 l1.5 4.5 l4.5 1.5 l-4.5 1.5 l-1.5 4.5 l-1.5 -4.5 l-4.5 -1.5 l4.5 -1.5 Z" />
      </g>
      <rect x="226" y="270" width="60" height="230" rx="2" fill="url(#bk-glass)" stroke="url(#bk-gold)" stroke-width="4" />
      <line x1="256" y1="272" x2="256" y2="500" stroke="url(#bk-gold)" stroke-width="2" />
      <rect x="248" y="370" width="3" height="40" rx="1.5" fill="url(#bk-gold)" /><rect x="261" y="370" width="3" height="40" rx="1.5" fill="url(#bk-gold)" />
      <rect x="0" y="500" width="320" height="20" fill="#d9d2c4" /><rect x="0" y="500" width="320" height="3" fill="url(#bk-gold)" />
      <rect x="230" y="500" width="52" height="20" fill="#9e2430" />
      <g><rect x="206" y="478" width="16" height="22" fill="url(#bk-gold)" /><circle cx="214" cy="468" r="13" fill="#3e7d55" /><circle cx="210" cy="463" r="5" fill="#5a9a70" opacity=".7" /></g>
      <g><rect x="290" y="478" width="16" height="22" fill="url(#bk-gold)" /><circle cx="298" cy="468" r="13" fill="#3e7d55" /><circle cx="294" cy="463" r="5" fill="#5a9a70" opacity=".7" /></g>`,


    pod: (name) => `
      <defs><clipPath id="bk-belt"><rect x="52" y="420" width="216" height="80" /></clipPath></defs>
      <path d="M16 520 V236 L160 196 L304 236 V520 Z" fill="#eef0f3" />
      <path d="M8 240 L160 192 L312 240" fill="none" stroke="#9aa3b5" stroke-width="10" stroke-linejoin="round" />
      <rect x="92" y="226" width="136" height="24" rx="5" fill="#ff8a5c" />
      <text x="160" y="242" text-anchor="middle" font-size="${fit(name, 124, 10)}" font-weight="800" fill="#fff" letter-spacing="1">${name}</text>
      <g class="hue">
        <path d="M54 272 L70 264 Q80 272 90 264 L106 272 L100 290 L94 287 V318 H66 V287 L60 290 Z" fill="#5b6cff" />
        <circle cx="80" cy="294" r="8" fill="#ffd166" />
      </g>
      <path d="M232 280 H262 V310 Q262 318 254 318 H240 Q232 318 232 310 Z" fill="#fff" stroke="#d0d5de" stroke-width="2" />
      <path d="M262 288 q10 0 10 8 q0 8 -10 8" fill="none" stroke="#d0d5de" stroke-width="4" />
      <text class="hue" x="247" y="304" text-anchor="middle" font-size="11" font-weight="800" fill="#ff4d6d">♥</text>
      <rect x="52" y="342" width="216" height="178" fill="#2b2f3b" />
      <g fill="#9aa3b5"><rect x="52" y="342" width="216" height="6" /><rect x="52" y="352" width="216" height="6" /><rect x="52" y="362" width="216" height="6" /></g>
      <g clip-path="url(#bk-belt)">
        <g class="box-move"><rect x="60" y="446" width="34" height="26" rx="2" fill="#c9a06b" /><rect x="60" y="446" width="34" height="5" fill="#b38a55" /><rect x="74" y="446" width="6" height="26" fill="#e9d3a6" /></g>
        <g class="box-move b2"><rect x="60" y="452" width="26" height="20" rx="2" fill="#d9b27c" /><rect x="70" y="452" width="5" height="20" fill="#f0dcae" /></g>
        <g class="box-move b3"><rect x="60" y="440" width="38" height="32" rx="2" fill="#c9a06b" /><rect x="60" y="440" width="38" height="6" fill="#b38a55" /><rect x="76" y="440" width="6" height="32" fill="#e9d3a6" /></g>
      </g>
      <rect x="52" y="472" width="216" height="8" fill="#5d6372" />
      <g fill="#3a3f4b">${Array.from({ length: 9 }, (_, i) => `<circle cx="${62 + i * 25}" cy="476" r="3" />`).join('')}</g>
      <rect x="62" y="480" width="6" height="40" fill="#5d6372" /><rect x="252" y="480" width="6" height="40" fill="#5d6372" />`,
  };

  // viewBox 0 0 320 520 — chân tòa nhà nằm ở y=520
  function building(variant, label) {
    const rand = rng(variant * 97 + 13);
    const name = esc(label);
    let body;
    if (buildingKinds[variant]) {
      return `<svg class="building-svg" viewBox="0 0 320 520" preserveAspectRatio="xMidYMax meet" aria-hidden="true">${buildingKinds[variant](name)}</svg>`;
    }
    switch (variant % 4) {
      case 0: // Glass tower
        body = `
          <defs><linearGradient id="bg0" x1="0" y1="0" x2="1" y2="1"><stop offset="0" stop-color="#b9cdee"/><stop offset="1" stop-color="#7f99c9"/></linearGradient></defs>
          <line x1="160" y1="0" x2="160" y2="34" stroke="#5e74a1" stroke-width="3"/>
          <circle cx="160" cy="4" r="4" fill="#ff8a5c"/>
          <rect x="40" y="30" width="240" height="16" rx="3" fill="#5e74a1"/>
          <rect x="52" y="46" width="216" height="474" fill="url(#bg0)"/>
          <g stroke="rgba(255,255,255,.4)" stroke-width="1.5">
            ${Array.from({ length: 7 }, (_, i) => `<line x1="${79 + i * 27}" y1="46" x2="${79 + i * 27}" y2="430"/>`).join('')}
            ${Array.from({ length: 13 }, (_, i) => `<line x1="52" y1="${76 + i * 30}" x2="268" y2="${76 + i * 30}"/>`).join('')}
          </g>
          <polygon points="52,120 140,46 196,46 52,240" fill="#fff" opacity=".18"/>
          <rect x="52" y="430" width="216" height="90" fill="#e9eef7"/>
          <rect x="96" y="402" width="128" height="24" rx="5" fill="#14161f"/>
          <text x="160" y="419" text-anchor="middle" font-size="12" font-weight="700" fill="#fff" letter-spacing="1">${name}</text>
          <rect x="124" y="448" width="72" height="72" fill="#2b3550"/>
          <line x1="160" y1="448" x2="160" y2="520" stroke="#8fa3c7" stroke-width="2"/>`;
        break;
      case 1: // Stepped terracotta office
        body = `
          <rect x="84" y="70" width="152" height="160" fill="#dcc0a6"/>
          <rect x="76" y="62" width="168" height="12" rx="3" fill="#b98f6d"/>
          ${windowGrid(98, 90, 4, 4, 26, 22, 10, 14, '#8ea4c6', 0.25, rand)}
          <rect x="24" y="220" width="272" height="300" fill="#ead6c3"/>
          <rect x="16" y="212" width="288" height="14" rx="3" fill="#c49a77"/>
          ${windowGrid(44, 246, 6, 5, 28, 26, 13, 16, '#8ea4c6', 0.2, rand)}
          <rect x="88" y="446" width="144" height="10" rx="3" fill="#d97757"/>
          <rect x="104" y="424" width="112" height="20" rx="4" fill="#fff"/>
          <text x="160" y="438" text-anchor="middle" font-size="11" font-weight="700" fill="#14161f" letter-spacing="1">${name}</text>
          <rect x="124" y="456" width="72" height="64" fill="#3a2f2a"/>
          <rect x="130" y="462" width="28" height="58" fill="#6d84ad" opacity=".7"/>
          <rect x="162" y="462" width="28" height="58" fill="#6d84ad" opacity=".7"/>`;
        break;
      case 2: // Rounded white HQ with ribbon windows
        body = `
          <path d="M36 520 V150 Q36 104 82 104 H238 Q284 104 284 150 V520 Z" fill="#f4f2ee"/>
          <path d="M36 520 V150 Q36 104 82 104 H110 V520 Z" fill="#e7e3dc"/>
          ${Array.from({ length: 7 }, (_, i) => `<rect x="56" y="${134 + i * 42}" width="208" height="22" rx="11" fill="#6f86b4" opacity="${0.75 + (i % 2) * 0.15}"/>`).join('')}
          <rect x="100" y="436" width="120" height="22" rx="11" fill="#5b6cff"/>
          <text x="160" y="451" text-anchor="middle" font-size="11" font-weight="700" fill="#fff" letter-spacing="1">${name}</text>
          <rect x="110" y="466" width="100" height="54" rx="6" fill="#2b3550"/>
          <circle cx="250" cy="104" r="16" fill="#9be7c4"/>`;
        break;
      default: // Co-working hub with roof garden
        body = `
          <ellipse cx="70" cy="244" rx="34" ry="20" fill="#8cc49a"/>
          <ellipse cx="120" cy="236" rx="30" ry="22" fill="#76b487"/>
          <ellipse cx="252" cy="242" rx="38" ry="22" fill="#8cc49a"/>
          <rect x="16" y="248" width="288" height="272" rx="6" fill="#f1ece4"/>
          <rect x="16" y="248" width="288" height="16" rx="6" fill="#d8cfc1"/>
          <rect x="36" y="290" width="248" height="140" rx="6" fill="#9fb6d6"/>
          <g stroke="#f1ece4" stroke-width="6"><line x1="98" y1="290" x2="98" y2="430"/><line x1="160" y1="290" x2="160" y2="430"/><line x1="222" y1="290" x2="222" y2="430"/></g>
          <polygon points="36,290 120,290 36,380" fill="#fff" opacity=".2"/>
          <path d="M28 446 H292 L276 470 H44 Z" fill="#ff8a5c"/>
          <text x="160" y="463" text-anchor="middle" font-size="11" font-weight="700" fill="#fff" letter-spacing="1">${name}</text>
          <rect x="128" y="474" width="64" height="46" fill="#3a3f4b"/>
          <rect x="44" y="482" width="30" height="38" rx="4" fill="#c2b49f"/>
          <ellipse cx="59" cy="474" rx="20" ry="16" fill="#76b487"/>`;
    }
    return `<svg class="building-svg" viewBox="0 0 320 520" preserveAspectRatio="xMidYMax meet" aria-hidden="true">${body}</svg>`;
  }

  // Skyline xa — dùng làm background lặp ngang (parallax)
  function skylineDataURI(seed, color, height = 300, width = 1200) {
    const rand = rng(seed);
    let x = 0;
    let rects = '';
    while (x < width) {
      const w = 40 + rand() * 90;
      const h = 70 + rand() * (height - 90);
      rects += `<rect x="${x.toFixed(1)}" y="${(height - h).toFixed(1)}" width="${w.toFixed(1)}" height="${h.toFixed(1)}"/>`;
      if (rand() > 0.6) rects += `<rect x="${(x + w / 2 - 2).toFixed(1)}" y="${(height - h - 24).toFixed(1)}" width="4" height="24"/>`;
      x += w + 4 + rand() * 18;
    }
    const svg = `<svg xmlns="http://www.w3.org/2000/svg" width="${width}" height="${height}" viewBox="0 0 ${width} ${height}"><g fill="${color}">${rects}</g></svg>`;
    return `url("data:image/svg+xml,${encodeURIComponent(svg)}")`;
  }

  function cloudsDataURI() {
    const svg = `<svg xmlns="http://www.w3.org/2000/svg" width="1400" height="220" viewBox="0 0 1400 220"><g fill="#fff" opacity=".85">
      <ellipse cx="160" cy="80" rx="90" ry="26"/><ellipse cx="210" cy="64" rx="56" ry="30"/>
      <ellipse cx="640" cy="140" rx="110" ry="24"/><ellipse cx="690" cy="122" rx="60" ry="28"/>
      <ellipse cx="1100" cy="70" rx="80" ry="22"/><ellipse cx="1140" cy="56" rx="48" ry="24"/></g></svg>`;
    return `url("data:image/svg+xml,${encodeURIComponent(svg)}")`;
  }

  const icons = {
    facebook: '<svg viewBox="0 0 24 24" aria-hidden="true"><path fill="currentColor" d="M13.5 22v-8h2.7l.4-3.2h-3.1V8.8c0-.9.3-1.6 1.6-1.6h1.7V4.4c-.3 0-1.3-.1-2.4-.1-2.4 0-4.1 1.5-4.1 4.2v2.3H7.6V14h2.7v8z"/></svg>',
    zalo: '<svg viewBox="0 0 24 24" aria-hidden="true"><path fill="none" stroke="currentColor" stroke-width="2" stroke-linejoin="round" d="M4 4h16v12H10l-5 4v-4H4z"/><path fill="currentColor" d="M8.6 7.5h6.4v1.6L11.3 13h3.9v1.7H8.4v-1.6l3.7-3.9H8.6z"/></svg>',
    mail: '<svg viewBox="0 0 24 24" aria-hidden="true"><path fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" d="M3 6h18v12H3zM3 7l9 6 9-6"/></svg>',
  };

  // Minh hoạ sở thích (bối cảnh phía sau nhân vật) — viewBox 0 0 320 300, chân đế y=300
  const hobbyArts = {
    // Amp + nốt nhạc bay (tiếng đàn do js/fx.js chơi)
    guitar: `
      <g class="notes" font-family="Georgia, serif" font-size="30">
        <text class="note n1" x="64" y="150" fill="#5b6cff">♪</text>
        <text class="note n2" x="150" y="130" fill="#14161f">♫</text>
        <text class="note n3" x="226" y="160" fill="#ff8a5c">♪</text>
      </g>
      <rect x="178" y="178" width="122" height="122" rx="12" fill="#2b2724" />
      <rect x="190" y="206" width="98" height="84" rx="6" fill="#3a3430" />
      <circle class="speaker" cx="239" cy="248" r="32" fill="#1f1c1a" />
      <circle cx="239" cy="248" r="11" fill="#2e2a27" />
      <g fill="#d9b26b"><circle cx="196" cy="192" r="4.5" /><circle cx="212" cy="192" r="4.5" /><circle cx="228" cy="192" r="4.5" /></g>
      <rect x="252" y="187" width="38" height="10" rx="2" fill="#c8a35c" />
      <path d="M0 296 C60 300 120 282 178 290" fill="none" stroke="#1b1b1b" stroke-width="3" />`,

    // Màn hình Dota 2: Pudge tung Meat Hook kéo hero địch về rồi hạ gục
    dota: `
      <defs><clipPath id="hb-moba"><rect x="34" y="34" width="252" height="148" rx="4" /></clipPath></defs>
      <rect x="26" y="26" width="268" height="164" rx="10" fill="#14161f" />
      <g clip-path="url(#hb-moba)">
        <rect x="34" y="34" width="252" height="148" fill="#2c3b26" />
        <path d="M34 60 C110 96 190 120 286 170" fill="none" stroke="#3f78ad" stroke-width="16" opacity=".75" />
        <g fill="#3a4c30"><circle cx="70" cy="150" r="14" /><circle cx="92" cy="160" r="10" /><circle cx="250" cy="60" r="16" /><circle cx="226" cy="48" r="10" /><circle cx="160" cy="70" r="8" /></g>
        <g fill="none" stroke="#c9b98a" stroke-width="3" opacity=".6"><path d="M40 176 L280 40" /></g>
        <!-- Pudge -->
        <g transform="translate(110 132)">
          <ellipse cx="0" cy="6" rx="18" ry="16" fill="#7c9a52" />
          <ellipse cx="2" cy="10" rx="11" ry="9" fill="#a9c27c" />
          <circle cx="10" cy="-10" r="7" fill="#7c9a52" />
          <path d="M-16 -2 L-26 -14 L-20 -18 L-12 -6 Z" fill="#c9ced8" stroke="#5d6372" stroke-width="1" />
          <circle cx="13" cy="-11" r="1.5" fill="#ff4d4d" />
        </g>
        <text x="110" y="166" text-anchor="middle" font-size="8" font-weight="800" fill="#9be7c4" font-family="Inter, sans-serif">PUDGE</text>
        <!-- Xích & móc -->
        <line x1="124" y1="126" x2="124" y2="126" stroke="#d9d2c4" stroke-width="2" stroke-dasharray="3 2">
          <animate attributeName="x2" dur="4s" repeatCount="indefinite" values="124;236;158;124;124" keyTimes="0;.32;.66;.72;1" />
          <animate attributeName="y2" dur="4s" repeatCount="indefinite" values="126;68;112;126;126" keyTimes="0;.32;.66;.72;1" />
        </line>
        <g>
          <animateTransform attributeName="transform" type="translate" dur="4s" repeatCount="indefinite" values="124 126;236 68;158 112;124 126;124 126" keyTimes="0;.32;.66;.72;1" />
          <path d="M0 -6 C6 -6 7 2 2 4 L0 1" fill="none" stroke="#e8e1d2" stroke-width="2.6" stroke-linecap="round" />
        </g>
        <!-- Hero địch -->
        <g>
          <animateTransform attributeName="transform" type="translate" dur="4s" repeatCount="indefinite" values="240 64;240 64;162 108;162 108;240 64" keyTimes="0;.32;.66;.97;1" />
          <animate attributeName="opacity" dur="4s" repeatCount="indefinite" values="1;1;1;0;0;1" keyTimes="0;.32;.68;.72;.97;1" />
          <circle r="8" fill="#e0524b" stroke="#fff" stroke-width="1.5" />
          <rect x="-9" y="-15" width="18" height="3" fill="#14161f" /><rect x="-9" y="-15" width="18" height="3" fill="#5ad16f">
            <animate attributeName="width" dur="4s" repeatCount="indefinite" values="18;18;6;0;18" keyTimes="0;.32;.66;.7;1" /></rect>
        </g>
        <circle cx="162" cy="108" r="0" fill="#fff6d6" opacity=".9">
          <animate attributeName="r" dur="4s" repeatCount="indefinite" values="0;0;22;0;0" keyTimes="0;.68;.74;.8;1" />
        </circle>
        <text x="190" y="56" text-anchor="middle" font-size="11" font-weight="800" font-style="italic" fill="#ffd166" font-family="Inter, sans-serif" opacity="0">MEAT HOOK!
          <animate attributeName="opacity" dur="4s" repeatCount="indefinite" values="0;1;1;0;0" keyTimes="0;.04;.28;.34;1" /></text>
        <g opacity="0">
          <animate attributeName="opacity" dur="4s" repeatCount="indefinite" values="0;0;1;1;0" keyTimes="0;.72;.76;.94;1" />
          <rect x="94" y="90" width="132" height="30" rx="6" fill="#b4232c" />
          <text x="160" y="111" text-anchor="middle" font-size="15" font-weight="900" font-style="italic" fill="#fff" font-family="Inter, sans-serif">FIRST BLOOD!</text>
        </g>
        <rect x="34" y="168" width="252" height="14" fill="#0f0f14" opacity=".9" />
        <circle cx="50" cy="175" r="5" fill="#7c9a52" stroke="#c9a35c" stroke-width="1" />
        <rect x="60" y="171" width="70" height="3" fill="#5ad16f" /><rect x="60" y="176" width="70" height="3" fill="#4d8bff" />
        <g fill="#2b2f3b" stroke="#c9a35c" stroke-width=".8"><rect x="140" y="170" width="10" height="10" rx="2" /><rect x="153" y="170" width="10" height="10" rx="2" /><rect x="166" y="170" width="10" height="10" rx="2" /><rect x="179" y="170" width="10" height="10" rx="2" /></g>
        <text x="270" y="178" text-anchor="end" font-size="8" font-weight="800" fill="#fff" font-family="Inter, sans-serif">1 — 0</text>
      </g>
      <rect x="148" y="190" width="24" height="22" fill="#2b2f3b" /><rect x="120" y="210" width="80" height="6" rx="3" fill="#2b2f3b" />
      <rect x="40" y="216" width="260" height="10" rx="3" fill="#3a3f4b" />
      <rect x="52" y="226" width="8" height="74" fill="#2b2f3b" /><rect x="280" y="226" width="8" height="74" fill="#2b2f3b" />
      <path d="M262 196 H288 V204 C288 216 282 222 275 222 C268 222 262 216 262 204 Z" fill="#e8b64a" transform="translate(0 -10)" />`,

    // Bãi biển: sóng, cọ đung đưa, ô dù, máy bay kéo băng rôn, hải âu
    travel: `
      <defs>
        <linearGradient id="hb-sky" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#9fd8f5" /><stop offset="1" stop-color="#fff1d6" /></linearGradient>
        <clipPath id="hb-beach"><rect x="0" y="0" width="320" height="300" rx="18" /></clipPath>
      </defs>
      <g clip-path="url(#hb-beach)">
        <rect width="320" height="300" fill="url(#hb-sky)" />
        <circle cx="244" cy="64" r="28" fill="#ffd166" /><circle class="sun-glow" cx="244" cy="64" r="40" fill="#ffd166" opacity=".25" />
        <g fill="#fff" opacity=".9"><ellipse cx="70" cy="50" rx="28" ry="8" /><ellipse cx="88" cy="44" rx="16" ry="9" /></g>
        <g>
          <animateMotion dur="9s" repeatCount="indefinite" path="M-80 34 L400 24" />
          <path d="M0 0 L22 -2 L28 -8 L30 -2 L36 0 L30 3 L22 3 Z" fill="#14161f" />
          <line x1="-2" y1="0" x2="-14" y2="2" stroke="#5d6372" stroke-width="1" />
          <rect x="-74" y="-6" width="60" height="16" rx="2" fill="#ff8a5c" />
          <text x="-44" y="5.5" text-anchor="middle" font-size="9" font-weight="800" fill="#fff" font-family="Inter, sans-serif">HELLO VN ✈</text>
        </g>
        <g fill="none" stroke="#14161f" stroke-width="1.6" stroke-linecap="round">
          <path class="gull" d="M150 90 q5 -5 10 0 q5 -5 10 0" /><path class="gull g2" d="M182 76 q4 -4 8 0 q4 -4 8 0" />
        </g>
        <rect y="150" width="320" height="70" fill="#3fb7d9" />
        <rect y="150" width="320" height="10" fill="#2a9cc0" />
        <g class="wave"><path d="M-40 176 q20 -8 40 0 t40 0 t40 0 t40 0 t40 0 t40 0 t40 0 t40 0 t40 0 t40 0" fill="none" stroke="#fff" stroke-width="3" opacity=".7" /></g>
        <g class="wave w2"><path d="M-40 196 q20 -8 40 0 t40 0 t40 0 t40 0 t40 0 t40 0 t40 0 t40 0 t40 0 t40 0" fill="none" stroke="#fff" stroke-width="3" opacity=".5" /></g>
        <path d="M0 214 Q80 200 160 210 T320 206 V300 H0 Z" fill="#f3d9a4" />
        <g class="foam"><path d="M0 214 Q80 200 160 210 T320 206" fill="none" stroke="#fff" stroke-width="4" opacity=".85" /></g>
        <path d="M54 300 C50 250 56 200 76 150" fill="none" stroke="#8a6a3f" stroke-width="11" stroke-linecap="round" />
        <g class="palm">
          <path d="M76 150 C56 132 36 132 22 144 C40 136 58 140 76 150 Z" fill="#4caf6d" />
          <path d="M76 150 C64 126 66 108 78 96 C74 114 76 132 76 150 Z" fill="#3e9a5d" />
          <path d="M76 150 C96 128 118 126 132 136 C112 132 94 138 76 150 Z" fill="#4caf6d" />
          <path d="M76 150 C98 144 116 152 124 166 C108 156 92 152 76 150 Z" fill="#3e9a5d" />
          <path d="M76 150 C58 150 42 160 36 174 C50 162 62 156 76 150 Z" fill="#3e9a5d" />
          <circle cx="78" cy="152" r="5" fill="#7a5a32" /><circle cx="70" cy="154" r="4.5" fill="#7a5a32" />
        </g>
        <line x1="258" y1="196" x2="244" y2="290" stroke="#5d6372" stroke-width="3" />
        <path d="M206 204 Q258 156 310 196 Z" fill="#ff8a5c" />
        <path d="M232 192 Q258 156 258 196 Z M284 194 Q262 162 282 196 Z" fill="#fff" opacity=".9" />
        <g><rect x="150" y="248" width="40" height="44" rx="6" fill="#d97757" /><path d="M160 248 v-8 h20 v8" fill="none" stroke="#3a3f4b" stroke-width="3" />
          <circle cx="162" cy="264" r="6" fill="#5b6cff" /><rect x="170" y="272" width="16" height="10" rx="2" fill="#ffd166" transform="rotate(10 178 277)" /></g>
        <ellipse cx="122" cy="292" rx="16" ry="5" fill="#ff4d6d" opacity=".85" /><path d="M110 290 q12 -14 24 0" fill="#ffd166" />
      </g>`,

    // Rạp 3D: vật thể lao ra khỏi màn hình với viền đỏ/xanh anaglyph
    movies: `
      <defs>
        <linearGradient id="hb-beam" x1="1" x2="0"><stop offset="0" stop-color="#fff6d6" stop-opacity=".9" /><stop offset="1" stop-color="#fff6d6" stop-opacity=".04" /></linearGradient>
        <clipPath id="hb-screen"><rect x="40" y="24" width="220" height="136" /></clipPath>
      </defs>
      <rect x="32" y="16" width="236" height="152" rx="5" fill="#1b1d24" />
      <rect x="40" y="24" width="220" height="136" fill="#1d2747" />
      <g clip-path="url(#hb-screen)">
        <g fill="#fff"><circle class="twinkle" cx="60" cy="40" r="1.3" /><circle cx="96" cy="52" r="1" /><circle class="twinkle t2" cx="140" cy="36" r="1.3" /><circle cx="200" cy="50" r="1" /><circle class="twinkle" cx="236" cy="72" r="1.2" /><circle cx="84" cy="96" r="1" /></g>
        <circle cx="210" cy="118" r="34" fill="#3c4f86" /><ellipse cx="210" cy="118" rx="52" ry="9" fill="none" stroke="#9fb3e8" stroke-width="3" opacity=".7" />
        <text x="54" y="150" font-size="12" font-weight="900" fill="#e0242f" opacity=".8" font-family="Inter, sans-serif">3D</text>
        <text x="57" y="150" font-size="12" font-weight="900" fill="#1fb6ff" opacity=".8" font-family="Inter, sans-serif">3D</text>
      </g>
      <g class="pop3d">
        <g class="pop-r"><circle cx="150" cy="92" r="20" fill="#e0242f" opacity=".75" /></g>
        <g class="pop-c"><circle cx="150" cy="92" r="20" fill="#1fb6ff" opacity=".75" /></g>
        <circle cx="150" cy="92" r="20" fill="#8b8fa3" /><circle cx="143" cy="86" r="5" fill="#6d7186" /><circle cx="157" cy="98" r="4" fill="#6d7186" /><circle cx="154" cy="84" r="2.5" fill="#6d7186" />
      </g>
      <polygon class="beam" points="296,212 260,36 260,150" fill="url(#hb-beam)" />
      <rect x="262" y="212" width="58" height="6" rx="2" fill="#3a3f4b" />
      <rect x="268" y="218" width="6" height="82" fill="#2b2f3b" /><rect x="308" y="218" width="6" height="82" fill="#2b2f3b" />
      <rect x="270" y="186" width="46" height="26" rx="5" fill="#e9e4dc" />
      <circle cx="268" cy="199" r="7" fill="#2b2f3b" /><circle cx="268" cy="199" r="3.5" fill="#9ad0ff" />
      <g class="reel"><circle cx="282" cy="172" r="12" fill="#2b2f3b" /><g fill="#e9e4dc"><circle cx="282" cy="166" r="2.4" /><circle cx="282" cy="178" r="2.4" /><circle cx="276" cy="172" r="2.4" /><circle cx="288" cy="172" r="2.4" /></g></g>
      <g class="reel"><circle cx="306" cy="172" r="12" fill="#2b2f3b" /><g fill="#e9e4dc"><circle cx="306" cy="166" r="2.4" /><circle cx="306" cy="178" r="2.4" /><circle cx="300" cy="172" r="2.4" /><circle cx="312" cy="172" r="2.4" /></g></g>`,
  };

  function hobbyArt(key, opts) {
    const art = hobbyArts[key];
    const body = typeof art === 'function' ? art(opts) : art || '';
    return `<svg class="hobby-svg" viewBox="0 0 320 300" preserveAspectRatio="xMidYMax meet" overflow="visible" aria-hidden="true">${body}</svg>`;
  }

  return { esc, building, skylineDataURI, cloudsDataURI, hobbyArt, icons };
})();
