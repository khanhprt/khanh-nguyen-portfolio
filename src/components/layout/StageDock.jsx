import { useLanguage } from '../../context/LanguageContext';
import { sections } from './Header';

export function StageDock({ stops, index, step, navigate, openContact }) {
  const { t } = useLanguage();
  const last = index === stops.length - 1;
  const current = stops[index];
  const label = index === 0 ? t('dock.start') : last ? t('contact.write')
    : `${t('dock.next')}: ${stops[index + 1]?.label ?? ''}`;
  return <nav className={`stage-dock glass ${index === 0 ? 'is-start' : ''} ${last ? 'is-end' : ''}`} aria-label="Journey">
    <div className="dock-tabs">{sections.map(({ id, key }) => <button key={id} type="button"
      className={current?.section === id ? 'is-active' : ''}
      aria-current={current?.section === id ? 'step' : undefined} onClick={() => navigate(id)}>
      <span>{t(key)}</span><span className="dock-dots" aria-hidden="true">
        {stops.map((stop, i) => stop.section === id && <b key={i} className={i === index ? 'is-current' : ''} />)}
      </span>
    </button>)}</div>
    <div className="dock-row">
      <button className="dock-arrow" type="button" disabled={index === 0} aria-label={t('dock.prev')} onClick={() => step(-1)}>‹</button>
      <button className="dock-next" type="button" onClick={() => last ? openContact() : step(1)}>
        <span className="dock-next-label">{label}</span><span className="dock-next-icon" aria-hidden="true">{last ? '✉' : '→'}</span>
      </button>
    </div>
  </nav>;
}
