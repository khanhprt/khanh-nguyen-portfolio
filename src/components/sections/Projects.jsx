import { memo, useState } from 'react';
import { portfolio } from '../../data/portfolio';
import { useLanguage } from '../../context/LanguageContext';
import { Artwork } from '../ui/Artwork';
import { PROJECT_SCENES, stationScene } from '../../graphics/pixelStations';
import { projectSimulation } from '../../graphics/projectSimulations';
import { Chips } from '../ui/Chips';
import { Modal } from '../ui/Modal';
import { SectionIntro } from '../ui/SectionIntro';
import { Actor } from '../illustrations/Actor';

function PixelVision({ scene }) {
  return <Artwork className="pixel-vision" markup={projectSimulation(scene) ?? stationScene(scene)} aria-hidden="true" />;
}

export const Projects = memo(function Projects() {
  const { t, pick } = useLanguage();
  const [selected, setSelected] = useState(null);
  const project = portfolio.projects[selected];
  return <>
    <section className="panel panel-gallery" id="projects" aria-labelledby="proj-title">
      <div className="door door-gallery" aria-hidden="true"><span>GALLERY</span></div>
      <SectionIntro prefix="proj" titleId="proj-title" className="gallery-intro" />
      <div className="frames">{portfolio.projects.map((item, i) => <article className="frame-slot" key={item.title}>
        <div className="spot" aria-hidden="true" />
        <button type="button" className="frame reveal is-in" aria-label={`${item.title} — ${t('proj.open')}`}
          onClick={() => setSelected(i)}>
          <span className="frame-inner"><PixelVision scene={PROJECT_SCENES[i]} /></span>
          <span className="frame-overlay"><span className="btn btn-light">{t('case.view')} <span aria-hidden="true">→</span></span></span>
        </button>
        <Actor scene={PROJECT_SCENES[i]} />
        <div className="plaque"><span className="plaque-no">{String(i + 1).padStart(2, '0')}</span><div><h3>{item.title}</h3><p>{pick(item.category)} · {item.year}</p></div></div>
      </article>)}</div>
      <div className="floor floor-gallery" aria-hidden="true" />
    </section>
    <Modal open={selected !== null} onClose={() => setSelected(null)} labelledBy="modal-title">
      {project && <article className="modal-card">
        <button className="modal-close" type="button" aria-label={t('case.close')} onClick={() => setSelected(null)}>×</button>
        <div className="modal-media"><PixelVision scene={PROJECT_SCENES[selected]} /></div>
        <div className="modal-body">
          <p className="kicker">{pick(project.category)} · {project.year} · {pick(project.role)}</p><h3 id="modal-title">{project.title}</h3><Chips items={project.stack} />
          <dl className="case">{[['challenge', 'problem'], ['solution', 'solution'], ['result', 'result']].map(([label, key]) =>
            <div key={key}><dt>{t(`case.${label}`)}</dt><dd>{pick(project[key])}</dd></div>)}</dl>
          <div className="cta-row">{[['link', 'case.live'], ['repo', 'case.repo']].map(([key, label]) => project[key] &&
            <a key={key} className="btn btn-primary" href={project[key]} target="_blank" rel="noopener noreferrer">{t(label)} ↗</a>)}</div>
        </div>
      </article>}
    </Modal>
  </>;
});
