import { useState } from 'react';
import mumbai from '@/assets/mumbai-simulation.jpg';
import { Button } from '@/components/ui/button';
import { Layers, ScanLine } from 'lucide-react';

export type ScienceKind = 'flood' | 'wetland' | 'surface';
export default function ScienceMap({ kind, cinematic = false }: { kind: ScienceKind; cinematic?: boolean }) {
  const [overlay, setOverlay] = useState(true);
  const [compare, setCompare] = useState(50);
  return <div className={`science-map ${kind} ${cinematic ? 'map-cinematic' : ''}`}>
    <img src={mumbai} alt="Generated Mumbai-inspired coastal landscape, simulated demonstration" width={1536} height={1024} />
    <div className="map-grid" />
    {overlay && <div className="science-overlay" style={kind === 'wetland' ? { clipPath: `inset(0 ${100 - compare}% 0 0)` } : undefined} />}
    <div className="map-corner top-left"><span>AOI / MUMBAI, INDIA</span><strong>19.0760° N · 72.8777° E</strong></div>
    <div className="map-corner top-right"><span className="simulated">SIMULATED DEMONSTRATION</span><span>NOT SATELLITE DATA</span></div>
    <div className="map-target"><ScanLine size={28} /><span>{kind === 'flood' ? 'ILLUSTRATIVE FLOOD EXTENT' : kind === 'wetland' ? 'ILLUSTRATIVE LAND-COVER CHANGE' : 'ILLUSTRATIVE PHASE FRINGES'}</span></div>
    <div className="map-corner bottom-left"><span>{kind === 'surface' ? 'RELATIVE PHASE / NO MEASURED DISPLACEMENT' : kind === 'wetland' ? 'SCENARIO A → SCENARIO B' : 'WATER RESPONSE / CONCEPTUAL MASK'}</span><span>REFERENCE 2025-07-01 · COMPARISON 2025-08-01 · FICTIONAL DATES</span></div>
    {!cinematic && <div className="map-controls"><Button variant="cinematic" onClick={() => setOverlay(!overlay)} aria-pressed={overlay}><Layers size={14} />{overlay ? 'Hide' : 'Show'} analysis layer</Button>{kind === 'wetland' && <label>Comparison<input aria-label="Wetland comparison" type="range" min="0" max="100" value={compare} onChange={(e) => setCompare(Number(e.target.value))} /></label>}</div>}
  </div>;
}