/*
 * Nhân vật pixel đi bộ: 6 tư thế liên tiếp trong engineer-walk-cycle.webp.
 * Pha bước được tính từ quãng đường cuộn, nên cuộn nhanh -> bước nhanh, dừng -> đứng lại,
 * cuộn ngược -> quay đầu đi lùi. Khi đứng yên, nhân vật giữ khung đầu tiên.
 */
const FRAMES = 6;
export const walker = (() => {
  function create(root) {
    let phase = 0;
    let amp = 0;
    let facing = 1;

    function pose() {
      const cycle = ((phase / (Math.PI * 2)) % 1 + 1) % 1;
      const frame = amp > 0.05 ? Math.floor(cycle * FRAMES) : 0;
      root.style.setProperty('--frame', frame);
    }

    /**
     * @param {number} dx   quãng đường thế giới đã dịch trong frame (px, + là đi tới)
     * @param {number} dt   thời gian frame (giây)
     * @param {number} stride px cho một chu kỳ 2 bước
     */
    function update(dx, dt, stride) {
      const speed = Math.abs(dx) / Math.max(dt, 1 / 240);
      const target = Math.min(1, speed / 160);
      amp += (target - amp) * Math.min(1, dt * (target > amp ? 10 : 6));
      if (amp < 0.002) amp = 0;
      phase += (Math.abs(dx) / stride) * Math.PI * 2;
      if (Math.abs(dx) > 0.4) {
        const dir = dx > 0 ? 1 : -1;
        if (dir !== facing) {
          facing = dir;
          root.style.setProperty('--facing', facing);
        }
      }
      pose();
    }

    function reset() {
      phase = 0;
      amp = 0;
      facing = 1;
      root.style.setProperty('--facing', 1);
      pose();
    }

    pose();
    return { update, reset, get walking() { return amp > 0.05; } };
  }

  return { create };
})();
