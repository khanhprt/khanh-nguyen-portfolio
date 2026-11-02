import { memo } from 'react';
import { useLanguage } from '../../context/LanguageContext';
import visionLab from '../../assets/pixel/vision-lab.webp';

export const Hero = memo(function Hero({ navigate }) {
  const { t } = useLanguage();
  return <section className="panel panel-hero" id="home" aria-label="Introduction">
    <div className="hero-copy">
      <p className="eyebrow"><span className="pulse" /> <span>{t('hero.eyebrow')}</span></p>
      <h1><span className="h1-name">Khanh Nguyen</span><span className="h1-role">AI Vision Engineer</span></h1>
      <p className="lead">{t('hero.lead')}</p>
      <div className="cta-row">{['projects', 'contact'].map((id, i) =>
        <a key={id} className={`btn ${i === 0 ? 'btn-primary' : 'btn-ghost'}`} href={`#${id}`}
          onClick={(event) => { event.preventDefault(); navigate(id); }}>{t(i === 0 ? 'hero.ctaProjects' : 'hero.ctaContact')}</a>)}
      </div>
      <dl className="stats"><div><dt>4+</dt><dd>{t('hero.stat1')}</dd></div><div><dt>80</dt><dd>{t('hero.stat2')}</dd></div></dl>
    </div>
    <img id="seated-hero" className="pixel-scene pixel-scene-hero" src={visionLab} alt="" aria-hidden="true" draggable="false" />
    <div className="door door-exit" aria-hidden="true"><span>EXIT</span></div>
    <div className="floor floor-office" aria-hidden="true" />
    <div className="scroll-hint" id="scroll-hint" aria-hidden="true"><span className="mouse" /><span className="hint-scroll">{t('hint.scroll')}</span><span className="hint-swipe">{t('hint.tap')}</span></div>
  </section>;
});
