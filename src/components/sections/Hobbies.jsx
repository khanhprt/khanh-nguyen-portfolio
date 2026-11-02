import { memo } from 'react';
import { portfolio } from '../../data/portfolio';
import { stationScene } from '../../graphics/pixelStations';
import { useLanguage } from '../../context/LanguageContext';
import { Artwork } from '../ui/Artwork';
import { Chips } from '../ui/Chips';
import { SectionIntro } from '../ui/SectionIntro';
import { Actor } from '../illustrations/Actor';

function SkillBackdrop() {
  return <svg className="skill-backdrop" viewBox="0 0 720 430" aria-hidden="true" focusable="false" shapeRendering="crispEdges">
    <rect x="44" y="50" width="626" height="322" fill="#eed1b3" />
    <rect x="44" y="50" width="626" height="8" fill="#d6ae8b" />
    <rect x="44" y="50" width="8" height="322" fill="#d6ae8b" />
    <rect x="662" y="50" width="8" height="322" fill="#d6ae8b" />
    <rect x="80" y="84" width="192" height="118" fill="#557461" />
    <rect x="88" y="92" width="176" height="102" fill="#d9e8d3" />
    <rect x="172" y="92" width="8" height="102" fill="#91aa91" />
    <rect x="88" y="140" width="176" height="7" fill="#91aa91" />
    <rect x="101" y="162" width="47" height="32" fill="#b8cdb2" />
    <rect x="198" y="155" width="45" height="39" fill="#b8cdb2" />
    <rect x="395" y="90" width="218" height="9" fill="#8e6b51" />
    <rect x="410" y="56" width="14" height="34" fill="#728d74" />
    <rect x="429" y="63" width="12" height="27" fill="#c7835e" />
    <rect x="446" y="52" width="13" height="38" fill="#e1aa70" />
    <rect x="465" y="63" width="11" height="27" fill="#748c73" />
    <rect x="548" y="71" width="34" height="19" fill="#bc7858" />
    <rect x="553" y="58" width="10" height="16" fill="#6a956c" />
    <rect x="564" y="52" width="10" height="22" fill="#80a879" />
    <rect x="100" y="252" width="128" height="8" fill="#b78c6c" />
    <rect x="112" y="226" width="26" height="26" fill="#d59672" />
    <rect x="143" y="216" width="11" height="36" fill="#8fa788" />
    <rect x="160" y="222" width="14" height="30" fill="#d0a06e" />
    <rect x="180" y="214" width="11" height="38" fill="#78957d" />
    <rect x="572" y="290" width="36" height="54" fill="#a86f53" />
    <rect x="567" y="270" width="46" height="23" fill="#789c77" />
    <rect x="578" y="252" width="24" height="23" fill="#8bab83" />
    <rect x="40" y="369" width="634" height="7" fill="#be9272" />
  </svg>;
}

export const Hobbies = memo(function Hobbies() {
  const { pick } = useLanguage();
  return <section className="panel panel-hobbies" id="hobbies" aria-labelledby="hob-title">
    <SectionIntro prefix="hob" titleId="hob-title" className="hobbies-intro" />
    <div className="hobbies">{portfolio.hobbies.map((hobby, i) => <article key={hobby.art} className="station hobby play-scope" data-scene={hobby.art}>
      <SkillBackdrop />
      <div className="station-card hobby-card glass reveal is-in"><p className="period">{String(i + 1).padStart(2, '0')}</p>
        <h3>{pick(hobby.title)}</h3><p className="summary">{pick(hobby.text)}</p><Chips items={hobby.tags} />

      </div>
      <Artwork className="building hobby-art station-art" markup={stationScene(hobby.art)} aria-hidden="true" /><Actor scene={hobby.art} />
    </article>)}</div><div className="floor floor-hobbies" aria-hidden="true" />
  </section>;
});

