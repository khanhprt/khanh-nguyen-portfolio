import { useCallback, useLayoutEffect, useRef, useState } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { portfolio } from '../data/portfolio';
import { useLanguage } from '../context/LanguageContext';
import { createSceneSync } from '../animation/createSceneSync';

gsap.registerPlugin(ScrollTrigger);
const sectionIds = ['home', 'experience', 'projects', 'hobbies', 'contact'];
const clamp = (value, min, max) => Math.min(max, Math.max(min, value));

/** Desktop scroll timeline, mobile scene navigation, and reduced-motion fallback. */
export function useJourney() {
  const { t, pick, language } = useLanguage();
  const [state, setState] = useState({ mobile: false, activeSection: 'home', progress: 0, index: 0, stops: [] });
  const controller = useRef({ navigate: () => {}, step: () => {} });

  useLayoutEffect(() => {
    const root = document.documentElement;
    const track = document.getElementById('track');
    const journey = document.getElementById('journey');
    let disposed = false;
    const media = gsap.matchMedia();
    // One observer pauses offscreen illustrations and their CSS animations.
    const observer = new IntersectionObserver((entries) => {
      entries.forEach((entry) => entry.target.classList.toggle('is-playing', entry.isIntersecting));
    }, { threshold: 0.05 });
    document.querySelectorAll('.play-scope').forEach((element) => observer.observe(element));
    root.classList.add('is-ready');

    const publish = (next) => {
      if (!disposed) setState((previous) => {
        const merged = { ...previous, ...next };
        // Avoid re-rendering content for subpixel scroll movement.
        if (Object.keys(next).every((key) => previous[key] === merged[key])) return previous;
        return merged;
      });
    };

    media.add({
      desktop: '(min-width: 901px) and (min-height: 540px)',
      mobile: '(max-width: 900px) and (orientation: portrait)',
      reduced: '(prefers-reduced-motion: reduce)',
    }, (context) => {
      const { desktop, mobile, reduced } = context.conditions;
      const horizontal = (desktop || mobile) && !reduced;
      root.classList.toggle('h-mode', horizontal);
      root.classList.toggle('m-mode', horizontal && mobile);
      root.classList.toggle('js', horizontal);
      publish({ mobile: horizontal && mobile, index: 0 });
      window.scrollTo({ top: 0, behavior: 'instant' });

      if (!horizontal) {
        const onScroll = () => {
          const active = sectionIds.filter((id) => document.getElementById(id).getBoundingClientRect().top <= innerHeight / 2).at(-1) || 'home';
          const maximum = document.documentElement.scrollHeight - innerHeight;
          publish({ activeSection: active, progress: maximum > 0 ? scrollY / maximum : 0 });
        };
        controller.current = {
          navigate(id) { document.getElementById(id)?.scrollIntoView({ behavior: reduced ? 'instant' : 'smooth' }); },
          step() {},
        };
        addEventListener('scroll', onScroll, { passive: true });
        onScroll();
        return () => removeEventListener('scroll', onScroll);
      }

      const proxy = { stand: 0, sit: 0 };
      const scene = createSceneSync(track, proxy);
      const maxX = () => Math.max(0, track.scrollWidth - innerWidth);
      const elementX = (element) => element.getBoundingClientRect().left - track.getBoundingClientRect().left;
      let animation;
      let scrollTimeline;
      let frameHandle;
      const syncNavigation = () => {
        const x = -Number(gsap.getProperty(track, 'x')) || 0;
        const active = sectionIds.filter((id) => document.getElementById(id).offsetLeft <= x + innerWidth * 0.35).at(-1) || 'home';
        publish({ activeSection: active, progress: Math.round(x / Math.max(1, maxX()) * 1000) / 1000 });
      };
      const tick = (time, deltaMs) => { scene.frame(time, deltaMs); if (!mobile) syncNavigation(); };
      gsap.ticker.add(tick);

      const stopList = [
        { element: document.getElementById('home'), section: 'home', label: t('stop.home') },
        { element: document.querySelector('.journey-intro'), section: 'experience', label: t('stop.journey') },
        ...[...document.querySelectorAll('.stations .station')].map((element, i) => ({ element, section: 'experience', label: pick(portfolio.experience[i].company) })),
        { element: document.querySelector('.gallery-intro'), section: 'projects', label: t('stop.gallery') },
        ...[...document.querySelectorAll('.frame-slot')].map((element, i) => ({ element, section: 'projects', label: portfolio.projects[i].title })),
        { element: document.querySelector('.hobbies-intro'), section: 'hobbies', label: t('stop.hobbies') },
        ...[...document.querySelectorAll('.hobbies .station')].map((element, i) => ({ element, section: 'hobbies', label: pick(portfolio.hobbies[i].title) })),
        { element: document.getElementById('contact'), section: 'contact', label: t('stop.contact') },
      ];
      let index = 0;
      let startTouch = null;
      const onTouchStart = (event) => {
        if (event.target.closest('button, a, input, textarea')) return;
        startTouch = { x: event.touches[0].clientX, y: event.touches[0].clientY };
      };
      const onTouchEnd = (event) => {
        if (!startTouch) return;
        const dx = event.changedTouches[0].clientX - startTouch.x;
        const dy = event.changedTouches[0].clientY - startTouch.y;
        startTouch = null;
        if (Math.max(Math.abs(dx), Math.abs(dy)) > 45) controller.current.step((Math.abs(dx) >= Math.abs(dy) ? dx : dy) < 0 ? 1 : -1);
      };
      const onKey = (event) => {
        if (document.querySelector('dialog[open]') || event.target.closest('input, textarea, select, button, a')) return;
        if (event.key === 'ArrowRight' || event.key === 'ArrowLeft') {
          event.preventDefault(); controller.current.step(event.key === 'ArrowRight' ? 1 : -1);
        }
      };
      const onResize = () => {
        cancelAnimationFrame(frameHandle);
        frameHandle = requestAnimationFrame(() => {
          if (mobile) goToStop(index, true);
          else ScrollTrigger.refresh();
        });
      };
      const goToStop = (next, instant = false) => {
        index = clamp(next, 0, stopList.length - 1);
        const x = clamp(elementX(stopList[index].element), 0, maxX());
        animation?.kill();
        animation = gsap.timeline({ onUpdate: () => {
          const currentX = -Number(gsap.getProperty(track, 'x')) || 0;
          document.querySelectorAll('.frame').forEach((frame) => {
            const box = frame.getBoundingClientRect();
            frame.classList.toggle('is-live', Math.abs(box.left + box.width / 2 - innerWidth / 2) < innerWidth * 0.35);
          });
          publish({ progress: Math.round(currentX / Math.max(1, maxX()) * 1000) / 1000 });
        } });
        animation.to(proxy, { stand: index > 0 ? 1 : 0, sit: index === stopList.length - 1 ? 1 : 0, duration: instant ? 0 : 0.45 }, 0)
          .to(track, { x: -x, duration: instant ? 0 : clamp(Math.abs(x + Number(gsap.getProperty(track, 'x'))) / innerWidth * 0.45, 0.6, 1.8), ease: 'power2.inOut' }, 0);
        publish({ index, activeSection: stopList[index].section });
      };

      if (mobile) {
        publish({ stops: stopList.map(({ section, label }) => ({ section, label })) });
        controller.current = {
          navigate(id) { goToStop(Math.max(0, stopList.findIndex((stop) => stop.section === id))); },
          step(delta) { goToStop(index + delta); },
        };
        journey.addEventListener('touchstart', onTouchStart, { passive: true });
        journey.addEventListener('touchend', onTouchEnd, { passive: true });
        addEventListener('keydown', onKey);
        goToStop(0, true);
      } else {
        const width = innerWidth;
        const maximum = maxX() / width;
        const anchors = [...document.querySelectorAll('.stations .station, .hobbies .station')]
          .map((element) => clamp(elementX(element) / width, 0, maximum));
        const segments = [];
        const pause = 0.45;
        let position = 0;
        let time = 0.6;
        scrollTimeline = gsap.timeline({
          defaults: { ease: 'none' },
          scrollTrigger: {
            trigger: journey, pin: true, start: 'top top',
            end: () => `+=${(1.2 + maximum + anchors.length * pause) * innerWidth}`,
            scrub: 0.8, anticipatePin: 1, invalidateOnRefresh: true,
          },
        });
        scrollTimeline.to(proxy, { stand: 1, duration: 0.6 });
        for (const anchor of [...anchors, maximum]) {
          const duration = Math.max(0.001, anchor - position);
          segments.push({ start: time, from: position, to: anchor, duration });
          scrollTimeline.to(track, { x: () => -anchor * innerWidth, duration });
          time += duration;
          position = anchor;
          if (anchor !== maximum) { scrollTimeline.to({}, { duration: pause }); time += pause; }
        }
        scrollTimeline.to(proxy, { sit: 1, duration: 0.6 });
        const navigate = (id) => {
          let targetTime = 0;
          if (id === 'contact') targetTime = scrollTimeline.duration();
          else if (id !== 'home') {
            const x = clamp(document.getElementById(id).offsetLeft / innerWidth, 0, maximum);
            const segment = segments.find((item) => x <= item.to);
            if (segment) targetTime = segment.start + (x - segment.from);
          }
          const trigger = scrollTimeline.scrollTrigger;
          window.scrollTo({ top: Math.ceil(trigger.start + targetTime / scrollTimeline.duration() * (trigger.end - trigger.start)), behavior: 'smooth' });
        };
        controller.current = { navigate, step(delta) {
          const x = -Number(gsap.getProperty(track, 'x')) || 0;
          const positions = stopList.map((stop) => ({ ...stop, x: elementX(stop.element) }));
          const target = delta > 0 ? positions.find((stop) => stop.x > x + 20) : positions.filter((stop) => stop.x < x - 20).at(-1);
          if (target) window.scrollTo({ top: scrollY + (target.x - x), behavior: 'smooth' });
        } };
        ScrollTrigger.refresh();
      }
      addEventListener('resize', onResize);
      const refreshAfterFonts = () => { if (!disposed) onResize(); };
      document.fonts.ready.then(refreshAfterFonts);
      return () => {
        cancelAnimationFrame(frameHandle);
        animation?.kill();
        gsap.ticker.remove(tick);
        scrollTimeline?.scrollTrigger?.kill(true);
        scrollTimeline?.kill();
        scene.reset();
        gsap.set(track, { clearProps: 'transform' });
        journey.removeEventListener('touchstart', onTouchStart);
        journey.removeEventListener('touchend', onTouchEnd);
        removeEventListener('keydown', onKey);
        removeEventListener('resize', onResize);
        root.classList.remove('h-mode', 'm-mode', 'js');
      };
    });
    return () => { disposed = true; media.revert(); observer.disconnect(); };
  }, [language, t, pick]);

  const navigate = useCallback((id) => controller.current.navigate(id), []);
  const step = useCallback((delta) => controller.current.step(delta), []);
  return { ...state, navigate, step };
}
