import { lazy, Suspense, useCallback, useEffect, useRef, useState } from 'react';
import { ClientOnly, useNavigate } from '@tanstack/react-router';
import { AnimatePresence, motion, useReducedMotion } from 'framer-motion';
import { Eye, SkipForward, ArrowRight, Volume2, VolumeX, RotateCcw, Radio } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { INTRO_DURATION, SCENES, sceneAt } from './timeline';
import ScienceMap from './ScienceMap';
import { createTransmission } from './audio';
const SpaceScene = lazy(() => import('./SpaceScene'));
const crewVisuals = ['ORBITAL NAVIGATION', 'RADAR SIGNAL ANALYSIS', 'PLANETARY OBSERVATION', 'TERRAIN INTELLIGENCE', 'DEEP SPACE DISCOVERY'];
export default function CinematicIntro() {
  const [scene, setScene] = useState(0);
  const [finished, setFinished] = useState(false);
  const [run, setRun] = useState(0);
  const [ready, setReady] = useState(false);
  const [sound, setSound] = useState(false);
  const audio = useRef<ReturnType<typeof createTransmission> | null>(null);
  const progress = useRef<HTMLDivElement>(null);
  const time = useRef<HTMLSpanElement>(null);
  const reduced = Boolean(useReducedMotion());
  const navigate = useNavigate();
  const onReady = useCallback(() => setReady(true), []);
  const enter = () => void navigate({ to: '/earth-explorer' });
  useEffect(() => {
    let elapsed = 0, previous = performance.now(), frame = 0, last = -1;
    const update = () => {
      const now = performance.now();
      if (!document.hidden) elapsed = Math.min(elapsed + now - previous, INTRO_DURATION);
      previous = now;
      if (progress.current) progress.current.style.transform = `scaleX(${elapsed / INTRO_DURATION})`;
      if (time.current) time.current.textContent = `${(elapsed / 1000).toFixed(1).padStart(4, '0')} / 30.0`;
      const next = sceneAt(elapsed);
      if (next >= 0 && next !== last) { last = next; setScene(next); }
      if (elapsed < INTRO_DURATION) frame = requestAnimationFrame(update);
      else { setScene(SCENES.length - 1); setFinished(true); }
    };
    const visibility = () => { previous = performance.now(); if (audio.current) { if (document.hidden) void audio.current.context.suspend(); else if (sound) void audio.current.context.resume(); } };
    document.addEventListener('visibilitychange', visibility);
    frame = requestAnimationFrame(update);
    return () => { cancelAnimationFrame(frame); document.removeEventListener('visibilitychange', visibility); };
  }, [run]);
  useEffect(() => () => audio.current?.close(), []);
  async function toggleAudio() {
    if (!audio.current) audio.current = createTransmission();
    if (sound) await audio.current.context.suspend(); else await audio.current.context.resume();
    setSound(!sound);
  }
  const id = SCENES[scene]?.id;
  const science = id === 'flood' || id === 'wetland' || id === 'surface';
  return <main className={`cinema awakening scene-${id}`} data-scene-ready={ready ? 'true' : undefined} data-intro-scene={id}>
    <div className="space-stage" aria-hidden="true"><ClientOnly fallback={<div className="earth-fallback" />}><Suspense fallback={<div className="earth-fallback" />}><SpaceScene mode={scene} reduced={reduced} onReady={onReady} /></Suspense></ClientOnly></div>
    <div className="space-vignette" />
    <div key={run} className={`opening-veil ${reduced ? 'reduced' : ''}`} />
    <header className="cinema-header"><a href="/" className="wordmark"><Eye size={26} strokeWidth={1.3} /><span>GOD'S EYE<i /></span></a><span className="header-center"><span className="status-dot" /> TEAM DRISHTI / NASA SPACE APPS CHALLENGE</span><div className="header-actions"><Button variant="cinematic" size="icon" title={sound ? 'Mute transmission' : 'Enable transmission'} aria-label={sound ? 'Mute transmission' : 'Enable transmission'} onClick={toggleAudio}>{sound ? <Volume2 /> : <VolumeX />}</Button>{finished ? <Button variant="cinematic" size="sm" onClick={() => { setScene(0); setFinished(false); setRun(n => n + 1); }}><RotateCcw /> REPLAY</Button> : <Button variant="cinematic" size="sm" onClick={enter}>SKIP INTRO <SkipForward /></Button>}</div></header>
    <div className="scene-coordinate"><span className="coordinate-cross">+</span><span>THE AWAKENING / MISSION 001</span><span>19.0760° N · 72.8777° E</span></div>
    {science && <ScienceMap key={id} kind={id} cinematic />}
    <AnimatePresence mode="sync"><motion.section key={scene} className={`scene-copy ${science ? 'science-copy' : ''}`} initial={{ opacity: 0, y: reduced ? 0 : 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }} transition={{ duration: reduced ? 0.1 : 0.28 }}>
      {scene === 0 ? <><div className="eyebrow"><span className="tiny-line" /> AN UNKNOWN SIGNAL</div><h1 className="opening-title">BEYOND WHAT<br />HUMAN EYES CAN SEE<span className="title-period">...</span></h1><p className="scene-caption">One Planet. Infinite Signals. Hidden Stories.</p></> : scene === 1 ? <><div className="eyebrow">THE LIVING PLANET</div><h1>ONE PLANET<span className="title-period">.</span></h1><p className="project-subtitle">INFINITE SIGNALS. HIDDEN STORIES.</p></> : scene === 2 ? <><div className="eyebrow">THE EYE ACTIVATES / NISAR INSPIRED</div><h1 className="opening-title">THE PLANET HAS SIGNALS.<br />WE LEARN TO READ THEM.</h1><p className="scene-caption">L-BAND / S-BAND · RADAR BEAMS ARE ILLUSTRATIVE</p></> : scene >= 3 && scene <= 7 ? <><div className="eyebrow">TEAM DRISHTI / 0{scene - 2} OF 05</div><h1 className={scene === 4 ? 'long-name' : ''}>{SCENES[scene]?.name}<span className="title-period">.</span></h1><p className="project-subtitle">{crewVisuals[scene - 3]}</p></> : science ? <><div className="eyebrow">THE HIDDEN STORY / MUMBAI</div><h1>{id === 'flood' ? 'FLOOD' : id === 'wetland' ? 'WETLAND' : 'SURFACE'}<br />INTELLIGENCE<span className="title-period">.</span></h1></> : <><div className="eyebrow">{scene === 11 ? 'THE REVELATION' : 'TEAM DRISHTI / NASA SPACE APPS CHALLENGE'}</div><h1 className="revelation-title">GOD'S EYE<span className="title-period">.</span></h1><p className="project-subtitle">SEE WHAT THE EYE CANNOT.</p>{scene === 12 && <><p className="scene-caption">Understanding Earth's Hidden Changes Through Radar Intelligence.</p><Button variant="mission" onClick={enter}>INITIALIZE MISSION <ArrowRight /></Button></>}</>}
    </motion.section></AnimatePresence>
    <div className="orbital-label"><span className="orbital-marker" /><span>EARTH<small>OUR ONLY HOME</small></span></div>
    {scene >= 2 && scene <= 7 && <div className="radar-telemetry"><span>L / 24 cm</span><span>S / 10 cm</span><span>ILLUSTRATIVE WAVES</span><span>LANDSAT REFERENCE MODEL<br />NISAR-INSPIRED ANTENNA</span></div>}
    <footer className="cinema-footer"><div className="footer-left"><Radio size={15} /><span>INDEPENDENT SCIENTIFIC DEMONSTRATION</span></div><div className="timeline"><div className="timeline-label"><span>{finished ? 'MISSION READY' : `${String(scene + 1).padStart(2, '0')} / ${id?.toUpperCase()}`}</span><span ref={time}>00.0 / 30.0</span></div><div className="timeline-track"><div ref={progress} className="timeline-fill" /></div></div><span className="footer-credit">DANCING WITH THE SARs</span></footer>
  </main>;
}
