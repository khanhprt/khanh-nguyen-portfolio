import { memo } from 'react';
import { portfolio } from '../../data/portfolio';
import { pixelClouds, pixelSkyline } from '../../graphics/pixelScenes';
import { stationScene } from '../../graphics/pixelStations';
import { useLanguage } from '../../context/LanguageContext';
import { Artwork } from '../ui/Artwork';
import { Chips } from '../ui/Chips';
import { SectionIntro } from '../ui/SectionIntro';
import { Actor } from '../illustrations/Actor';

export const Experience = memo(function Experience() {
  const { t, pick } = useLanguage();
  return <section className="panel panel-journey" id="experience" aria-labelledby="exp-title">
    <div className="sky" aria-hidden="true" />
    <div className="clouds parallax" data-speed="0.55" aria-hidden="true" style={{ backgroundImage: pixelClouds() }} />
    <div className="skyline skyline-far parallax" data-speed="0.4" aria-hidden="true" style={{ backgroundImage: pixelSkyline(7, '#c3d6b4', '#dfe9cf', 300) }} />
    <div className="skyline skyline-near parallax" data-speed="0.25" aria-hidden="true" style={{ backgroundImage: pixelSkyline(42, '#94b184', '#bfd3a9', 240, 1000) }} />
    <SectionIntro prefix="exp" titleId="exp-title" className="journey-intro" />
    <div className="stations">{portfolio.experience.map((entry, i) => <article key={entry.scene} className="station play-scope" data-scene={entry.scene}>
      <div className="station-card glass reveal is-in">
        <p className="period">{pick(entry.period)}</p><h3>{pick(entry.role)}</h3>
        <p className="company">@ {pick(entry.company)}</p><p className="summary">{pick(entry.summary)}</p><Chips items={entry.stack} />
      </div>
      <div className="bus-stop" aria-hidden="true"><span className="bus-sign"><small>{t('stop')}</small>{String(i + 1).padStart(2, '0')}</span><span className="bus-pole" /></div>
      <div className="tree" aria-hidden="true"><span /></div>
      <Artwork className="building station-art" markup={stationScene('ehs')} aria-hidden="true" />
      <Actor scene={entry.scene} />
    </article>)}</div>
    <div className="floor floor-street" aria-hidden="true" />
  </section>;
});
