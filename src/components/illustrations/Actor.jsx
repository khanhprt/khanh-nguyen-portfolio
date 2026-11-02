import { memo } from 'react';
import tablet from '../../assets/pixel/engineer-tablet.webp';
import inspect from '../../assets/pixel/engineer-inspect.webp';
import drone from '../../assets/pixel/engineer-drone.webp';
import point from '../../assets/pixel/engineer-point.webp';
import edge from '../../assets/pixel/engineer-edge.webp';
import workstation from '../../assets/pixel/engineer-workstation.webp';

const actions = { pod: tablet, fire: tablet, inspection: inspect, drone, safety: point, dota: edge, travel: inspect };


/** Scene-specific character poses for each stop. */
export function Actor({ scene }) {
  const action = actions[scene];
  if (action) return <span className="actor action-actor" data-scene={scene} aria-hidden="true">
    <img className="action-person" src={action} alt="" />
    <span className="action-signal" />
  </span>;
  return <span className="actor workstation-actor" data-scene={scene} aria-hidden="true">
    <img className="workstation-image" src={workstation} alt="" />
  </span>;
}

export const WalkingCharacter = memo(function WalkingCharacter() {
  return <div className="walker" id="walker" aria-hidden="true">
    <span className="pixel-walker" />
  </div>;
});
