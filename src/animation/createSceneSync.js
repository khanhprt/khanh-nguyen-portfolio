import { gsap } from 'gsap';
import { walker as walkerRig } from './walker';

/** Owns only illustration transforms; React retains ownership of content and state. */
export function createSceneSync(track, proxy) {
  const walkerElement = document.getElementById('walker');
  const character = walkerRig.create(walkerElement);
  const hero = document.getElementById('seated-hero');
  const cafe = document.getElementById('seated-cafe');
  const hint = document.getElementById('scroll-hint');
  const caption = document.querySelector('.cafe-caption');
  const journey = document.getElementById('experience');
  const layers = [...document.querySelectorAll('.parallax')];
  const actors = [...document.querySelectorAll('.actor')];
  const fades = new Map();
  let lastX = 0;
  let wasMoving = true;

  function frame(_time, deltaMs) {
    const x = Number(gsap.getProperty(track, 'x')) || 0;
    const delta = lastX - x;
    lastX = x;
    const moving = Math.abs(delta) > 0.01;
    const walkerBox = walkerElement.getBoundingClientRect();
    character.update(delta, Math.min(deltaMs / 1000, 0.1), Math.max(1, walkerBox.height * 0.85));
    const center = walkerBox.left + walkerBox.width / 2;
    let blend = 0;
    const mix = Math.min(1, deltaMs / 1000 * 12);
    for (const actor of actors) {
      const box = actor.getBoundingClientRect();
      const actorCenter = box.left + box.width / 2;
      const target = !moving && Math.abs(actorCenter - center) < walkerBox.width * 0.38 ? 1 : 0;
      let opacity = fades.get(actor) ?? 0;
      opacity += (target - opacity) * mix;
      if (Math.abs(target - opacity) < 0.01) opacity = target;
      fades.set(actor, opacity);
      actor.style.opacity = opacity;
      blend = Math.max(blend, opacity);
    }
    hero.style.opacity = 1 - proxy.stand;
    cafe.style.opacity = proxy.sit;
    caption.style.opacity = proxy.sit;
    caption.style.visibility = proxy.sit > 0.05 ? 'visible' : 'hidden';
    hint.style.opacity = Math.max(0, 1 - proxy.stand * 3);
    walkerElement.style.opacity = Math.min(1, proxy.stand * 1.6) * (1 - Math.min(1, proxy.sit * 1.6)) * (1 - blend);
    if (moving || wasMoving) {
      for (const layer of layers) layer.style.backgroundPositionX = `${(-x - journey.offsetLeft) * Number(layer.dataset.speed)}px`;
    }
    wasMoving = moving;
  }

  return {
    frame,
    reset() {
      character.reset();
      [hero, cafe, caption, hint, walkerElement, ...actors].forEach((element) => element.removeAttribute('style'));
      layers.forEach((layer) => { layer.style.backgroundPositionX = ''; });
    },
  };
}
