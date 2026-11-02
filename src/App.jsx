import { useCallback, useEffect, useState } from 'react';
import { LanguageProvider } from './context/LanguageContext';
import { useJourney } from './hooks/useJourney';
import { Header } from './components/layout/Header';
import { StageDock } from './components/layout/StageDock';
import { WalkingCharacter } from './components/illustrations/Actor';
import { Hero } from './components/sections/Hero';
import { Experience } from './components/sections/Experience';
import { Projects } from './components/sections/Projects';
import { Hobbies } from './components/sections/Hobbies';
import { Contact } from './components/sections/Contact';
import { Intro } from './components/ui/Intro';
import { installBlipListeners } from './audio/blip';

function Portfolio() {
  const journey = useJourney();
  useEffect(installBlipListeners, []);
  const [sheetOpen, setSheetOpen] = useState(false);
  const closeSheet = useCallback(() => setSheetOpen(false), []);
  const openContact = useCallback(() => setSheetOpen(true), []);
  return <><Intro /><Header {...journey} /><main id="journey" className="journey"><div id="track" className="track"><Hero navigate={journey.navigate} /><Experience /><Projects /><Hobbies /><Contact mobile={journey.mobile} sheetOpen={sheetOpen} closeSheet={closeSheet} /></div><WalkingCharacter /></main>{journey.mobile && <StageDock {...journey} openContact={openContact} />}</>;
}
export function App() { return <LanguageProvider><Portfolio /></LanguageProvider>; }
