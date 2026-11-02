import cafeScene from '../../assets/pixel/lab-contact.webp';
import { memo, useState } from 'react';
import { portfolio } from '../../data/portfolio';
import { icons } from '../../graphics/icons';
import { useLanguage } from '../../context/LanguageContext';
import { Artwork } from '../ui/Artwork';
import { TranslatedTitle } from '../ui/SectionIntro';
import { Modal } from '../ui/Modal';

function ContactCard({ titleId }) {
  const { t } = useLanguage();
  const [status, setStatus] = useState('');
  const submit = (event) => {
    event.preventDefault();
    const data = new FormData(event.currentTarget);
    const name = data.get('name').trim();
    const email = data.get('email').trim();
    const message = data.get('message').trim();
    if (!name || !message) { setStatus(t('form.invalid')); return; }
    const subject = t('form.subject', { name });
    const body = `${name} <${email}>\n\n${message}`;
    window.location.href = `mailto:${portfolio.contact.email}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;
    setStatus(t('form.opening'));
  };
  const socials = [...portfolio.socials, { label: 'Email', icon: 'mail', url: `mailto:${portfolio.contact.email}` }];
  return <div className="contact-card glass-dark reveal is-in">
    <p className="kicker">{t('contact.kicker')}</p><TranslatedTitle id={titleId} translationKey="contact.title" />
    <form className="contact-form" onSubmit={submit}>
      <div className="field-row"><label className="field"><span>{t('form.name')}</span><input name="name" autoComplete="name" required maxLength={100} placeholder={t('form.namePh')} /></label>
        <label className="field"><span>{t('form.email')}</span><input name="email" type="email" autoComplete="email" required maxLength={254} placeholder="you@company.com" /></label></div>
      <label className="field"><span>{t('form.message')}</span><textarea name="message" rows="4" required maxLength={5000} placeholder={t('form.messagePh')} /></label>
      <div className="form-foot"><button className="btn btn-primary" type="submit">{t('form.send')}</button><p className="form-status" role="status" aria-live="polite">{status}</p></div>
    </form>
    <div className="socials">{socials.map((social) => <a className="social" href={social.url} key={social.icon}
      target={social.icon === 'mail' ? undefined : '_blank'} rel="noopener noreferrer">
      <Artwork markup={icons[social.icon]} aria-hidden="true" /><span>{social.label}</span>
    </a>)}</div>
  </div>;
}

export const Contact = memo(function Contact({ mobile, sheetOpen, closeSheet }) {
  const { t } = useLanguage();
  return <>
    <section className="panel panel-contact" id="contact" aria-label={t('nav.contact')}>
      {!mobile && <ContactCard titleId="contact-title" />}
      <div className="cafe-caption"><p className="kicker">{t('contact.kicker')}</p><h2><em>{t('contact.caption')}</em></h2><p>{t('contact.captionText')}</p></div>
      <img id="seated-cafe" className="pixel-scene pixel-scene-cafe" src={cafeScene} alt="" aria-hidden="true" draggable="false" />
      <div className="floor floor-cafe" aria-hidden="true" />
      <p className="footer-note">© {new Date().getFullYear()} Khanh Nguyen — AI Engineer.</p>
    </section>
    <Modal open={mobile && sheetOpen} onClose={closeSheet} labelledBy="sheet-contact-title" variant="contact">
      <div className="sheet-panel"><button className="sheet-close" type="button" aria-label={t('sheet.close')} onClick={closeSheet}>×</button>
        <ContactCard titleId="sheet-contact-title" />
      </div>
    </Modal>
  </>;
});
