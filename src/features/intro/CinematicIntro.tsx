import { lazy, Suspense, useCallback, useEffect, useRef, useState } from 'react';
import { ClientOnly } from '@tanstack/react-router';
import { AnimatePresence, motion, useReducedMotion } from 'framer-motion';
import { ArrowRight, ArrowUpRight, Globe2, Radio, RotateCcw, SkipForward } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { INTRO_DURATION, SCENES, sceneAt } from './timeline';

const SpaceScene = lazy(() => import('./SpaceScene'));
const labels = ['PROLOGUE', 'ORBITAL PERSPECTIVE', 'RADAR INTELLIGENCE', 'BEYOND THE VISIBLE', 'EARTH OBSERVATION', 'A NEW PERSPECTIVE', 'THE COLLECTIVE', 'THE MISSION'];
const descriptions = ['','A perspective without boundaries.','Reading the signals of a changing world.','Finding meaning beyond the visible.','Every observation tells a story.','One planet. Infinite possibilities.'];

export default function CinematicIntro() {
  const [scene, setScene] = useState(0);
  const [mission, setMission] = useState(false);
  const [run, setRun] = useState(0);
  const [ready, setReady] = useState(false);
  const progress = useRef<HTMLDivElement>(null);
  const time = useRef<HTMLSpanElement>(null);
  const reduced = Boolean(useReducedMotion());
  const onReady = useCallback(() => setReady(true), []);
  const enter = useCallback(() => setMission(true), []);

  useEffect(() => {
    if (mission) return;
    const start = performance.now();
    let frame = 0;
    let lastScene = -1;
    const update = () => {
      const elapsed = Math.min(performance.now() - start, INTRO_DURATION);
      if (progress.current) progress.current.style.transform = `scaleX(${elapsed / INTRO_DURATION})`;
      if (time.current) time.current.textContent = `${(elapsed / 1000).toFixed(1).padStart(4, '0')} / 25.0`;
      const next = sceneAt(elapsed);
      if (next >= 0 && next !== lastScene) { lastScene = next; setScene(next); }
      if (elapsed < INTRO_DURATION) frame = requestAnimationFrame(update);
      else enter();
    };
    frame = requestAnimationFrame(update);
    const finish = window.setTimeout(enter, INTRO_DURATION);
    return () => { cancelAnimationFrame(frame); clearTimeout(finish); };
  }, [run, mission, enter]);

  function replay() { setScene(0); setMission(false); setRun((n) => n + 1); }

  return <main className={`cinema ${mission ? 'is-mission' : ''} scene-${scene}`} data-scene-ready={ready ? 'true' : undefined} data-intro-scene={mission ? 'mission' : SCENES[scene]?.id}>
    <div className="space-stage" aria-hidden="true"><ClientOnly fallback={null}><Suspense fallback={null}><SpaceScene mode={scene} reduced={reduced} onReady={onReady} /></Suspense></ClientOnly></div>
    <div className="space-vignette" aria-hidden="true" />
    <div className={`opening-veil ${reduced ? 'reduced' : ''}`} key={run} aria-hidden="true" />
    <header className="cinema-header">
      <a href="/" className="wordmark" aria-label="SARsathi home"><Globe2 size={22} strokeWidth={1.2} /><span>SAR<span className="wordmark-light">sathi</span><i /></span></a>
      <div className="header-center"><span className="status-dot" /> EARTH OBSERVATION INITIATIVE</div>
      {mission ? <span className="header-team">TEAM DRISHTI <ArrowUpRight size={13} /></span> : <Button variant="cinematic" size="sm" onClick={enter}>SKIP INTRO <SkipForward size={13} /></Button>}
    </header>

    {!mission && <div className="scene-coordinate"><span className="coordinate-cross">+</span><span>MISSION 001 / PLANET EARTH</span><span>23°26′ N · 82°30′ E</span></div>}

    <AnimatePresence initial={false} mode="sync">
      <motion.section key={mission ? 'mission' : scene} className={`scene-copy ${mission ? 'mission-copy' : ''}`} initial={{ opacity: 0, y: reduced ? 0 : 12 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }} transition={{ duration: reduced ? 0.1 : 0.38 }}>
        {mission ? <>
          <div className="eyebrow"><span className="tiny-line" /> THE EARTH HAS A STORY TO TELL</div>
          <h1>SARsathi<span className="title-period">.</span></h1>
          <p className="project-subtitle">DANCING WITH THE SARs</p>
          <p className="mission-description">See the Earth change.<br />Understand the story.</p>
          <Button variant="mission" onClick={() => document.getElementById('mission-details')?.scrollIntoView({ behavior: reduced ? 'instant' : 'smooth' })}>EXPLORE THE MISSION <ArrowRight size={17} /></Button>
        </> : scene === 0 ? <>
          <div className="eyebrow"><span className="tiny-line" /> A TEAM DRISHTI ORIGINAL</div>
          <h1 className="opening-title">A MISSION TO UNDERSTAND<br />OUR CHANGING PLANET<span className="title-period">.</span></h1>
          <p className="scene-caption">A new way to see our world.</p>
        </> : scene >= 1 && scene <= 5 ? <>
          <div className="eyebrow"><span className="tiny-line" /> TEAM DRISHTI <span className="member-number">0{scene} / 05</span></div>
          <h1 className={scene === 2 ? 'long-name' : ''}>{scene === 2 ? <>NIKHIL <span className="nickname">(RAVANA)</span></> : SCENES[scene]?.name}<span className="title-period">.</span></h1>
          <p className="project-subtitle">{labels[scene]}</p>
          <p className="scene-caption">{descriptions[scene]}</p>
        </> : scene === 6 ? <>
          <div className="eyebrow"><span className="tiny-line" /> UNITED BY CURIOSITY</div>
          <h1 className="team-title">TEAM DRISHTI<span className="title-period">.</span></h1>
          <p className="project-subtitle">FIVE MINDS. ONE MISSION.</p>
          <div className="team-names">{SCENES.slice(1,6).map((s) => <span key={s.id}>{s.name}</span>)}</div>
        </> : <>
          <div className="eyebrow"><span className="tiny-line" /> INTRODUCING</div>
          <h1>SARSATHI<span className="title-period">.</span></h1>
          <p className="project-subtitle">DANCING WITH THE SARs</p>
          <p className="scene-caption">SEE THE EARTH CHANGE. UNDERSTAND THE STORY.</p>
          <Button variant="mission" onClick={enter}>ENTER THE MISSION <ArrowRight size={17} /></Button>
        </>}
      </motion.section>
    </AnimatePresence>

    <div className="orbital-label" aria-hidden="true"><span className="orbital-marker" /><span>EARTH<br /><small>OUR ONLY HOME</small></span></div>
    <footer className="cinema-footer">
      <div className="footer-left"><Radio size={15} /><span>{mission ? 'SYNTHETIC APERTURE RADAR' : 'ESTABLISHING A NEW PERSPECTIVE'}</span></div>
      {mission ? <Button variant="cinematic" size="sm" onClick={replay}><RotateCcw size={13} /> REPLAY INTRO</Button> : <div className="timeline"><div className="timeline-label"><span>0{scene + 1} <span className="timeline-divider">/</span> {labels[scene]}</span><span ref={time}>00.0 / 25.0</span></div><div className="timeline-track"><div ref={progress} className="timeline-fill" /></div></div>}
      <span className="footer-credit">A PROJECT BY <strong>TEAM DRISHTI</strong></span>
    </footer>
    {mission && <section id="mission-details" className="mission-details">
      <div className="eyebrow"><span className="tiny-line" /> MISSION BRIEF</div>
      <div className="brief-grid"><h2>A changing planet.<br />A clearer perspective.</h2><div><p>From orbit, synthetic aperture radar reveals changes on Earth — through clouds, through darkness, and across time.</p><p>SARsathi brings those observations into focus. Five minds, one mission: understand the story behind the change.</p></div></div>
      <div className="mission-team"><span>TEAM DRISHTI</span>{SCENES.slice(1,6).map((s) => <span key={s.id}>{s.name}</span>)}</div>
    </section>}
  </main>;
}