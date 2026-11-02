import { useLanguage } from '../../context/LanguageContext';

export function TranslatedTitle({ translationKey, ...props }) {
  const { t } = useLanguage();
  // Translations support one typographic emphasis tag, without injecting HTML.
  const parts = t(translationKey).split(/<em>|<\/em>/);
  return <h2 {...props}>{parts[0]}{parts.length > 1 && <em>{parts[1]}</em>}{parts[2]}</h2>;
}

export function SectionIntro({ prefix, titleId, className }) {
  const { t } = useLanguage();
  return <div className={`section-intro ${className} reveal is-in`}>
    <p className="kicker">{t(`${prefix}.kicker`)}</p>
    <TranslatedTitle id={titleId} translationKey={`${prefix}.title`} />
    <p>{t(`${prefix}.text`)}</p>
  </div>;
}
