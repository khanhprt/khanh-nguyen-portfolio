import { useEffect, useState } from 'react';

const SEEN_KEY = 'pixel-intro-seen';
const COLS = 16;
const ROWS = 9;
const DONE_MS = 1300;

function alreadySeen() {
  try { return sessionStorage.getItem(SEEN_KEY) === '1'; } catch { return false; }
}

/**
 * Màn chuyển pixel mở đầu: các ô đen tan dần theo đường chéo để lộ trang, logo hiện ở giữa.
 * Chỉ chạy một lần mỗi phiên; bấm, gõ phím hoặc cuộn sẽ bỏ qua ngay.
 */
export function Intro() {
  const [show, setShow] = useState(() => !alreadySeen() && !window.matchMedia('(prefers-reduced-motion: reduce)').matches);
  useEffect(() => {
    if (!show) return undefined;
    const finish = () => {
      setShow(false);
      try { sessionStorage.setItem(SEEN_KEY, '1'); } catch { /* bỏ qua nếu không lưu được */ }
    };
    const timer = setTimeout(finish, DONE_MS);
    window.addEventListener('pointerdown', finish);
    window.addEventListener('keydown', finish);
    window.addEventListener('wheel', finish, { passive: true });
    return () => {
      clearTimeout(timer);
      window.removeEventListener('pointerdown', finish);
      window.removeEventListener('keydown', finish);
      window.removeEventListener('wheel', finish);
    };
  }, [show]);
  if (!show) return null;
  return <div className="px-intro" aria-hidden="true">
    <div className="px-intro-grid">
      {Array.from({ length: COLS * ROWS }, (_, i) => {
        const col = i % COLS;
        const row = Math.floor(i / COLS);
        return <span key={i} style={{ '--d': `${Math.round(((col + row) / (COLS + ROWS)) * 620)}ms` }} />;
      })}
    </div>
    <p className="px-intro-logo">K<span>.</span></p>
  </div>;
}
