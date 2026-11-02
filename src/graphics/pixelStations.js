/*
 * Cảnh pixel nhỏ cho từng trạm: mỗi cảnh là lưới hình chữ nhật 320×240.
 * Chi tiết chuyển động được gắn class px-* và chạy bằng CSS (pixel.css),
 * nên không cần vòng lặp JS và vẫn tắt được khi người dùng bật giảm chuyển động.
 */
const R = (x, y, w, h, fill, cls = '') => `<rect x="${x}" y="${y}" width="${w}" height="${h}" fill="${fill}"${cls ? ` class="${cls}"` : ''}/>`;
const G = (cls, body) => `<g class="${cls}">${body}</g>`;
const INK = '#1e2d24', SAGE = '#9bb586', SAGE_D = '#557d4b', LEAF = '#c3dc8c', CLAY = '#d9774e', PAPER = '#fbf9ec', SCREEN = '#263c30';

/** Khung phát hiện: bốn cạnh hình chữ nhật, nhấp nháy để báo có vật thể. */
const detect = (x, y, w, h, color, cls = 'px-blink') => G(cls,
  R(x, y, w, 3, color) + R(x, y + h - 3, w, 3, color) + R(x, y, 3, h, color) + R(x + w - 3, y, 3, h, color));

const scenes = {
  /* Kinh nghiệm: nhà máy với camera EHS và bảng cảnh báo. */
  ehs: () => [
    R(0, 0, 320, 240, '#dfe9cf'), R(0, 190, 320, 50, '#c9b48f'),
    R(20, 110, 200, 82, '#8fa79b'), R(16, 100, 208, 12, SAGE_D), R(190, 50, 14, 62, '#7b8f84'),
    ...[0, 1, 2, 3, 4, 5].map((i) => R(34 + i * 28, 126, 16, 12, '#eef4e6', i % 2 ? 'px-blink' : '')),
    ...[0, 1, 2, 3, 4, 5].map((i) => R(34 + i * 28, 150, 16, 12, '#eef4e6', i % 3 ? '' : 'px-blink-b')),
    // Independent belt and packages keep the factory working behind the operator.
    R(18, 176, 200, 12, INK), R(24, 188, 7, 19, SAGE_D), R(205, 188, 7, 19, SAGE_D),
    `<svg x="18" y="156" width="200" height="22" viewBox="0 0 200 22">${G('px-belt', [0, 80, 160, 240, 320].map((x) => R(x, 2, 28, 18, PAPER) + R(x, 2, 28, 4, CLAY)).join(''))}</svg>`,
    R(236, 60, 6, 130, INK), R(230, 52, 30, 14, INK), R(256, 56, 6, 6, SAGE), G('px-blink', R(258, 48, 4, 4, CLAY)),
    R(236, 150, 72, 52, SCREEN), R(242, 156, 30, 18, '#8fa79b'), R(276, 156, 30, 18, '#8fa79b'),
    R(242, 178, 30, 18, '#8fa79b'), G('px-blink-b', R(276, 178, 30, 18, CLAY)), R(306, 150, 4, 52, INK),
  ].join(''),

  /* Dự án: phát hiện cháy bằng camera trên chân đế, ngọn lửa nhấp nháy. */
  fire: () => [
    R(0, 0, 320, 240, SCREEN), R(0, 200, 320, 40, '#3a4a3e'),
    R(40, 120, 96, 80, '#55705f'), R(44, 124, 88, 8, SAGE), R(60, 150, 56, 4, SAGE_D),
    G('px-smoke', R(184, 95, 12, 12, '#a9b5a4') + R(192, 79, 18, 12, '#a9b5a4') + R(201, 65, 12, 10, '#c1cbb9')),
    G('px-flicker', R(170, 150, 40, 50, '#e98d5d') + R(178, 130, 24, 30, '#f4c26b') + R(186, 116, 8, 18, PAPER)),
    R(250, 96, 8, 104, INK), R(236, 84, 34, 16, INK), R(266, 88, 6, 8, SAGE), G('px-blink', R(238, 76, 4, 4, CLAY)),
    detect(158, 116, 74, 84, CLAY),
  ].join(''),

  /* Dự án: kiểm tra thị giác trên băng chuyền, các hộp chạy liên tục. */
  inspection: () => [
    R(0, 0, 320, 240, '#dfe9cf'), R(0, 150, 320, 90, '#cfdcc0'),
    R(10, 150, 300, 22, '#2b3a30'), R(16, 172, 8, 40, '#7b8f84'), R(296, 172, 8, 40, '#7b8f84'),
    ...[30, 70, 110, 150, 190, 230, 270].map((x) => G('px-roller', R(x, 156, 12, 8, SAGE))),
    G('px-belt', [0, 80, 160, 240, 320, 400].map((x) => R(x - 40, 118, 44, 32, PAPER) + R(x - 40, 118, 44, 6, SAGE)).join('')),
    R(150, 20, 34, 18, INK), R(160, 36, 14, 16, INK), R(164, 52, 6, 8, SAGE),
    detect(154, 110, 56, 48, '#4f9a5a'),
    R(260, 60, 52, 30, '#eef4e6'), R(266, 68, 40, 4, SAGE_D), R(266, 78, 26, 4, SAGE),
  ].join(''),

  /* Dự án: drone bay trên khung hình, cánh quạt quay, ảnh mục tiêu bên dưới. */
  drone: () => [
    R(0, 0, 320, 240, '#d6e4e1'), R(0, 190, 320, 50, '#b9cbbf'),
    G('px-bob', [
      R(128, 76, 64, 22, SCREEN), R(114, 88, 92, 6, INK),
      G('px-spin', R(104, 70, 44, 4, INK)), G('px-spin', R(172, 70, 44, 4, INK)),
      R(152, 98, 20, 14, INK), R(158, 110, 8, 6, SAGE), G('px-blink', R(138, 80, 4, 4, CLAY)),
    ].join('')),
    R(118, 178, 78, 20, '#b98566'), R(134, 172, 40, 10, '#d19a73'),
    detect(116, 150, 88, 60, '#4f9a5a', 'px-blink-b'),
    R(138, 210, 44, 6, SAGE_D),
  ].join(''),

  /* Dự án: nhận diện mũ bảo hộ và áo phản quang cho công nhân. */
  safety: () => [
    R(0, 0, 320, 240, '#e9dfbf'), R(0, 200, 320, 40, '#c9b48f'),
    R(18, 96, 72, 94, '#9eac8f'), R(26, 106, 56, 5, SAGE_D),
    G('px-blink-b', R(44, 122, 12, 12, CLAY)),
    R(134, 66, 52, 14, '#e7b13b'), R(128, 78, 64, 6, '#c99a2c'), R(144, 84, 32, 30, '#c58e6f'),
    R(124, 116, 72, 86, SAGE_D), R(124, 130, 72, 14, '#f4c26b'), R(124, 152, 72, 4, '#f4c26b'),
    R(116, 118, 8, 60, '#c58e6f'), R(196, 118, 8, 60, '#c58e6f'),
    R(116, 200, 22, 30, INK), R(150, 200, 22, 30, INK),
    detect(112, 52, 96, 150, '#4f9a5a'),
    G('px-blink', R(112, 36, 62, 12, '#4f9a5a')),
  ].join(''),

  /* Sở thích: thị giác máy tính, màn hình có khung phát hiện. */
  vision: () => [
    R(0, 0, 320, 240, '#f3dcc0'),
    R(54, 46, 212, 136, SCREEN), R(66, 58, 188, 112, '#dfeee0'),
    R(108, 80, 64, 56, '#8fa79b'), detect(102, 74, 76, 68, SAGE_D),
    R(196, 76, 44, 4, SAGE), R(196, 88, 36, 4, SAGE), R(196, 100, 44, 4, CLAY), R(196, 112, 30, 4, SAGE),
    R(144, 182, 32, 26, SCREEN), R(116, 208, 88, 8, INK),
  ].join(''),

  /* Sở thích: edge AI, bo mạch có đèn LED nhấp nháy theo nhịp. */
  edge: () => [
    R(0, 0, 320, 240, '#f3dcc0'),
    R(40, 76, 240, 124, '#2f6b4f'), R(52, 90, 90, 48, '#8fa79b'),
    ...[0, 1, 2, 3, 4, 5].map((i) => R(56 + i * 14, 146, 10, 10, '#c9c4aa')),
    R(170, 110, 52, 42, INK), R(178, 118, 36, 26, SCREEN),
    G('px-blink', R(246, 96, 6, 6, LEAF)), G('px-blink-b', R(258, 96, 6, 6, CLAY)), G('px-blink', R(270, 96, 6, 6, LEAF)),
    R(252, 150, 36, 30, '#c9c4aa'), R(260, 158, 20, 14, INK),
  ].join(''),

  /* Sở thích: cơ điện tử, bánh răng quay và cánh tay robot. */
  mech: () => {
    const teeth = (cx, cy, r, n, w) => Array.from({ length: n }, (_, i) =>
      `<rect x="${cx - w / 2}" y="${cy - r - 10}" width="${w}" height="20" fill="${SAGE_D}" transform="rotate(${(360 / n) * i} ${cx} ${cy})"/>`).join('');
    const gear = (cx, cy, r, n, cls) => G(cls, `<circle cx="${cx}" cy="${cy}" r="${r}" fill="${SAGE_D}"/>${teeth(cx, cy, r, n, 12)}<circle cx="${cx}" cy="${cy}" r="${r / 3}" fill="#f3dcc0"/>`);
    return [
      R(0, 0, 320, 240, '#f6e2c8'), R(0, 200, 320, 40, '#d8b58c'),
      gear(112, 112, 46, 8, 'px-spin-slow'), gear(200, 160, 30, 8, 'px-spin-rev'),
      R(246, 110, 16, 90, INK), R(246, 100, 56, 14, INK), R(292, 100, 12, 36, SAGE_D),
      R(226, 200, 48, 20, INK), R(232, 190, 26, 12, SAGE), R(240, 178, 10, 14, CLAY),
    ].join('');
  },

  /* Sở thích: học tập liên tục, laptop có dòng code gõ dần và chồng sách. */
  learn: () => [
    R(0, 0, 320, 240, '#f6e2c8'), R(0, 200, 320, 40, '#d8b58c'),
    R(88, 66, 146, 100, SCREEN), R(100, 78, 122, 76, '#1a2a21'),
    G('px-type', R(110, 88, 70, 4, SAGE)), G('px-type-b', R(110, 100, 96, 4, CLAY)),
    G('px-type-c', R(118, 112, 60, 4, SAGE)), G('px-type-d', R(118, 124, 84, 4, LEAF)),
    G('px-type-b', R(110, 136, 44, 4, SAGE)),
    R(64, 166, 194, 12, '#8fa79b'),
    R(232, 150, 60, 16, CLAY), R(238, 134, 50, 16, SAGE_D), R(230, 118, 56, 16, '#f4c26b'),
    R(252, 90, 14, 18, PAPER), R(266, 96, 6, 8, PAPER),
  ].join(''),
};

const HOBBY_SCENES = { guitar: 'vision', dota: 'edge', travel: 'mech', movies: 'learn' };

/** SVG cảnh cho một trạm. Key là tên cảnh hoặc art của sở thích. */
export function stationScene(key) {
  const name = HOBBY_SCENES[key] ?? key;
  const body = (scenes[name] ?? scenes.ehs)();
  return `<svg class="px-scene px-scene-${name}" viewBox="0 0 320 240" aria-hidden="true" shape-rendering="crispEdges">${body}</svg>`;
}

/** Cảnh cho từng dự án theo thứ tự trong portfolio.projects. */
export const PROJECT_SCENES = ['fire', 'inspection', 'drone', 'safety'];
