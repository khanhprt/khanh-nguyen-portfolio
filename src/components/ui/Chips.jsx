import { useLanguage } from '../../context/LanguageContext';

export function Chips({ items }) {
  const { pick } = useLanguage();
  return <ul className="chips">{items.map((item, index) => <li key={index}>{pick(item)}</li>)}</ul>;
}
