/*
 * Âm "blip" 8-bit tổng hợp bằng Web Audio. Tắt mặc định; người dùng bật ở thanh điều hướng.
 * Âm chỉ phát sau thao tác của người dùng, nên không vi phạm chính sách autoplay của trình duyệt.
 */
const KEY = 'pixel-sfx';
let enabled = false;
let context = null;
const listeners = new Set();

try { enabled = localStorage.getItem(KEY) === 'on'; } catch { enabled = false; }

export function sfxEnabled() { return enabled; }

export function subscribeSfx(listener) {
  listeners.add(listener);
  return () => listeners.delete(listener);
}

export function setSfx(on) {
  enabled = on;
  try { localStorage.setItem(KEY, on ? 'on' : 'off'); } catch { /* không lưu được thì chỉ giữ trong phiên */ }
  listeners.forEach((listener) => listener(on));
  if (on) blip(990, 0.06);
}

/** Một nốt vuông ngắn; freq tính bằng Hz, duration tính bằng giây. */
export function blip(freq = 880, duration = 0.05) {
  if (!enabled) return;
  const AudioContextClass = window.AudioContext || window.webkitAudioContext;
  if (!AudioContextClass) return;
  context ??= new AudioContextClass();
  if (context.state === 'suspended') context.resume();
  const start = context.currentTime;
  const oscillator = context.createOscillator();
  const gain = context.createGain();
  oscillator.type = 'square';
  oscillator.frequency.value = freq;
  gain.gain.setValueAtTime(0.04, start);
  gain.gain.exponentialRampToValueAtTime(0.0001, start + duration);
  oscillator.connect(gain);
  gain.connect(context.destination);
  oscillator.start(start);
  oscillator.stop(start + duration + 0.02);
}

const INTERACTIVE = 'a, button, [role="button"]';

/** Gắn âm hover và click cho mọi nút/liên kết; trả về hàm gỡ listener. */
export function installBlipListeners() {
  let last = 0;
  const onOver = (event) => {
    const target = event.target.closest?.(INTERACTIVE);
    if (!target || target.disabled || target.contains(event.relatedTarget)) return;
    const now = performance.now();
    if (now - last < 60) return;
    last = now;
    blip(660, 0.035);
  };
  const onClick = (event) => {
    if (event.target.closest?.(INTERACTIVE)) blip(990, 0.06);
  };
  document.addEventListener('pointerover', onOver);
  document.addEventListener('click', onClick);
  return () => {
    document.removeEventListener('pointerover', onOver);
    document.removeEventListener('click', onClick);
  };
}
