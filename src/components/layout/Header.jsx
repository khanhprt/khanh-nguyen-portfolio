import { useEffect, useRef, useState } from 'react';
import { languages } from '../../data/translations';
import { useLanguage } from '../../context/LanguageContext';
import { setSfx, sfxEnabled, subscribeSfx } from '../../audio/blip';

export const sections = [
  { id: 'home', key: 'nav.home' },
  { id: 'experience', key: 'nav.journey' },
  { id: 'projects', key: 'nav.projects' },
  { id: 'hobbies', key: 'nav.hobbies' },
  { id: 'contact', key: 'nav.contact' },
];

export function Header({ activeSection, progress, navigate }) {
  const { t, language, setLanguage } = useLanguage();
  const [menuOpen, setMenuOpen] = useState(false);
  const [sfx, setSfxState] = useState(sfxEnabled);
  useEffect(() => subscribeSfx(setSfxState), []);
  const menuRef = useRef(null);
  useEffect(() => {
    if (!menuOpen) return;
    const onPointer = (event) => {
      if (!menuRef.current?.contains(event.target)) setMenuOpen(false);
    };
    const onKey = (event) => {
      if (event.key === 'Escape') {
        setMenuOpen(false);
        menuRef.current?.querySelector('button').focus();
      }
    };
    document.addEventListener('pointerdown', onPointer);
    document.addEventListener('keydown', onKey);
    return () => {
      document.removeEventListener('pointerdown', onPointer);
      document.removeEventListener('keydown', onKey);
    };
  }, [menuOpen]);
  const link = (event, id) => { event.preventDefault(); navigate(id); };
  return <>
    <a className="skip-link" href="#contact" onClick={(event) => link(event, 'contact')}>{t('skip')}</a>
    <header className={`nav ${activeSection === 'contact' ? 'on-dark' : ''}`}>
      <div className="nav-inner glass">
        <a className="logo" href="#home" onClick={(event) => link(event, 'home')} aria-label="Khanh Nguyen — Home">
          <span className="logo-mark">K</span>
          <span className="logo-text"><span>Khanh<span className="dot">.</span></span><small>AI Vision Engineer</small></span>
        </a>
        <nav className="nav-links" aria-label="Sections">
          {sections.map(({ id, key }) => <a href={`#${id}`} key={id}
            className={activeSection === id ? 'is-active' : ''}
            aria-current={activeSection === id ? 'location' : undefined}
            onClick={(event) => link(event, id)}>{t(key)}</a>)}
        </nav>
        <div className="nav-actions">
          <button className="sfx-toggle" type="button" aria-pressed={sfx} aria-label={t('nav.sound')} onClick={() => setSfx(!sfx)}>
            <span aria-hidden="true">♪</span><span className="sfx-state">{sfx ? 'ON' : 'OFF'}</span>
          </button>
          <div className="lang-menu" ref={menuRef}>
            <button className="lang-toggle" type="button" aria-expanded={menuOpen}
              aria-controls="language-options" aria-label={t('nav.lang')} onClick={() => setMenuOpen(!menuOpen)}>
              <svg viewBox="0 0 24 24" aria-hidden="true"><circle cx="12" cy="12" r="9" fill="none" stroke="currentColor" strokeWidth="1.8" /><path d="M3 12h18M12 3c2.6 2.8 2.6 15.2 0 18M12 3c-2.6 2.8-2.6 15.2 0 18" fill="none" stroke="currentColor" strokeWidth="1.8" /></svg>
              <span>{languages[language].short}</span><span aria-hidden="true">⌄</span>
            </button>
            {menuOpen && <ul className="lang-list" id="language-options">
              {Object.entries(languages).map(([code, value]) => <li key={code}>
                <button type="button" className={code === language ? 'is-active' : ''} lang={code}
                  aria-pressed={code === language} onClick={() => {
                    setLanguage(code); setMenuOpen(false);
                    menuRef.current?.querySelector('button').focus();
                  }}>{value.name}<span>{value.short}</span></button>
              </li>)}
            </ul>}
          </div>
          <a className="btn btn-primary btn-sm" href="#contact" onClick={(event) => link(event, 'contact')}>{t('nav.cta')}</a>
        </div>
      </div>
      <div className="progress" aria-hidden="true"><span style={{ transform: `scaleX(${progress})` }} /></div>
    </header>
  </>;
}
