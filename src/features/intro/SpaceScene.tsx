import { Suspense, useEffect, useMemo, useRef, useState } from 'react';
import { Canvas, useFrame, useThree } from '@react-three/fiber';
import { Environment, Lightformer, Stars, OrbitControls, Line, useGLTF, useTexture } from '@react-three/drei';
import { Box3, Color, Group, Mesh, SRGBColorSpace, Vector3 } from 'three';
import earth from '@/assets/earth-surface.asset.json';
import clouds from '@/assets/earth-clouds.asset.json';
import satellite from '@/assets/models/landsat-8.glb.asset.json';
import night from '@/assets/earth-night.asset.json';

// Scene colors are shared design tokens, resolved only inside the client scene.
function palette() {
  const css = getComputedStyle(document.documentElement);
  const resolve = (token: string) => {
    const canvas = document.createElement('canvas');
    canvas.width = 1; canvas.height = 1;
    const context = canvas.getContext('2d');
    if (!context) return new Color();
    context.fillStyle = css.getPropertyValue(token).trim();
    context.fillRect(0, 0, 1, 1);
    const data = context.getImageData(0, 0, 1, 1).data;
    return new Color().setRGB((data[0] ?? 0) / 255, (data[1] ?? 0) / 255, (data[2] ?? 0) / 255, SRGBColorSpace);
  };
  return { ice: resolve('--scene-ice'), sun: resolve('--scene-sun'), warning: resolve('--scene-warning') };
}

function Satellite({ antenna = false }: { antenna?: boolean }) {
  const { scene } = useGLTF(satellite.url);
  const model = useMemo(() => {
    const clone = scene.clone(true);
    const box = new Box3().setFromObject(clone);
    const size = box.getSize(new Vector3());
    const center = box.getCenter(new Vector3());
    const scale = 1.25 / Math.max(size.x, size.y, size.z);
    clone.position.copy(center.multiplyScalar(-scale));
    clone.scale.setScalar(scale);
    return clone;
  }, [scene]);
  return <group><primitive object={model} rotation={[0.3, 0.5, 0.2]} />{antenna && <mesh position={[0, -0.5, 0]} rotation={[0.7, 0, 0]}><cylinderGeometry args={[0.68, 0.68, 0.025, 32]} /><meshStandardMaterial color={palette().sun} metalness={0.65} roughness={0.5} wireframe /></mesh>}</group>;
}

function Globe({ reduced, mode, onReady, interactive, grid, orbitVisible }: { reduced: boolean; mode: number; onReady: () => void; interactive: boolean; grid: boolean; orbitVisible: boolean }) {
  const { camera, size } = useThree();
  useEffect(() => { if (!interactive) { camera.position.z = size.width < 700 ? 13.5 : 9.2; camera.updateProjectionMatrix(); } }, [camera, size.width, interactive]);
  const map = useTexture(earth.url);
  const cloudMap = useTexture(clouds.url);
  const nightMap = useTexture(night.url); nightMap.colorSpace = SRGBColorSpace;
  map.colorSpace = SRGBColorSpace;
  const globe = useRef<Group>(null);
  const orbit = useRef<Group>(null);
  const radar = useRef<Group>(null);
  const cloud = useRef<Mesh>(null);
  const ready = useRef(false);
  const colors = useMemo(palette, []);
  const bands = useRef<Group>(null);
  const latitudeLines = useMemo(() => [-60,-30,0,30,60].map((lat) => Array.from({length: 97}, (_, i) => { const a = i / 96 * Math.PI * 2, b = lat * Math.PI / 180; return new Vector3(2.2 * Math.cos(b) * Math.cos(a), 2.2 * Math.sin(b), 2.2 * Math.cos(b) * Math.sin(a)); })), []);
  const longitudeLines = useMemo(() => Array.from({length: 6}, (_, j) => Array.from({length: 97}, (_, i) => { const a = i / 96 * Math.PI * 2, b = j / 6 * Math.PI; return new Vector3(2.2 * Math.cos(a) * Math.cos(b), 2.2 * Math.sin(a), 2.2 * Math.cos(a) * Math.sin(b)); })), []);
  useFrame(({ clock }, delta) => {
    if (!ready.current) { ready.current = true; onReady(); }
    if (reduced || document.hidden) return;
    const t = clock.elapsedTime;
    if (globe.current) globe.current.rotation.y += Math.min(delta, 0.05) * 0.08;
    if (cloud.current) cloud.current.rotation.y += Math.min(delta, 0.05) * 0.025;
    if (orbit.current) {
      orbit.current.position.set(Math.sin(t * 0.12 + 1.2) * 3.4, Math.cos(t * 0.12 + 1.2) * 1.35 + 0.1, Math.cos(t * 0.12 + 1.2) * 2.7);
      orbit.current.rotation.z = t * 0.025;
    }
    if (radar.current) radar.current.rotation.y = t * 0.18;
    if (bands.current) bands.current.children.forEach((band, i) => { const phase = (t * 0.7 + i * 0.22) % 1; band.position.set(3 - phase * 2.1, 1 - phase, 1); band.scale.setScalar(0.12 + phase * 0.6); });
    if (!interactive) { const target = mode >= 11 ? 12 : mode === 1 ? 8.1 : 9.2; camera.position.z += (target + (size.width < 700 ? 3.5 : 0) - camera.position.z) * (1 - Math.exp(-1.4 * Math.min(delta, 0.05))); camera.position.x = Math.sin(t * 0.06) * 0.3; camera.lookAt(0, -0.3, 0); }
  });
  return <>
    <group position={[0, interactive ? 0 : -0.9, 0]}>
      <group ref={globe} rotation={[0.16, -1.7, -0.13]}>
        <mesh><sphereGeometry args={[2.15, 64, 48]} /><meshStandardMaterial map={map} emissiveMap={nightMap} emissive={colors.sun} emissiveIntensity={0.75} roughness={0.85} /></mesh>
        <mesh ref={cloud}><sphereGeometry args={[2.17, 64, 48]} /><meshStandardMaterial alphaMap={cloudMap} transparent opacity={0.18} depthWrite={false} /></mesh>
      </group>
      <mesh><sphereGeometry args={[2.19, 64, 48]} /><shaderMaterial transparent depthWrite={false} uniforms={{ glowColor: { value: colors.ice } }} vertexShader={'varying vec3 vNormal; varying vec3 vPosition; void main(){vNormal=normalize(normalMatrix*normal); vec4 p=modelViewMatrix*vec4(position,1.0);vPosition=p.xyz;gl_Position=projectionMatrix*p;}'} fragmentShader={'uniform vec3 glowColor; varying vec3 vNormal; varying vec3 vPosition; void main(){float rim=pow(1.0-abs(dot(normalize(vNormal),normalize(-vPosition))),4.0);gl_FragColor=vec4(glowColor,rim*0.62);}'} /></mesh>
      {grid && <group rotation={[0.16, -1.7, -0.13]}>{[...latitudeLines, ...longitudeLines].map((points, i) => <Line key={i} points={points} color={colors.ice} transparent opacity={0.15} lineWidth={0.7} />)}</group>}
      {orbitVisible && <><group rotation={[1.18, 0.2, -0.35]}><mesh><torusGeometry args={[2.8, 0.007, 6, 160]} /><meshBasicMaterial color={colors.ice} transparent opacity={0.3} /></mesh></group>
      <group rotation={[0.65, -0.4, 0.6]}><mesh><torusGeometry args={[3.05, 0.004, 6, 160]} /><meshBasicMaterial color={colors.ice} transparent opacity={0.17} /></mesh></group>
      </>}
      {(mode === 2 || mode === 4 || mode === 6) && <group ref={radar}>
        <mesh rotation={[0, 0, 0.25]}><sphereGeometry args={[2.21, 32, 24, 0, 0.22]} /><meshBasicMaterial color={colors.ice} transparent opacity={0.22} side={2} depthWrite={false} /></mesh>
        {(mode === 4 || mode === 6) && <mesh><sphereGeometry args={[2.205, 24, 16]} /><meshBasicMaterial color={colors.ice} wireframe transparent opacity={0.12} /></mesh>}
      </group>}
      {orbitVisible && <group ref={orbit} position={[3, 0.8, 1]}><Suspense fallback={null}><Satellite antenna={mode >= 2} /></Suspense></group>}
      {(mode === 2 || mode === 4) && <group ref={bands}>{Array.from({length: 6}, (_, i) => <mesh key={i} rotation={[0, Math.PI / 2, 0.4]}><torusGeometry args={[0.65, 0.016, 6, 48]} /><meshBasicMaterial color={i % 2 ? colors.warning : colors.ice} transparent opacity={0.65} /></mesh>)}</group>}
    </group>
    {(mode === 5 || mode === 7) && <mesh position={[-4, 2.4, -8]}><sphereGeometry args={[1.15, 32, 24]} /><meshStandardMaterial map={map} color={colors.sun} roughness={1} /></mesh>}
  </>;
}

export default function SpaceScene({ mode, reduced, onReady, interactive = false, grid = true, orbitVisible = true }: { mode: number; reduced: boolean; onReady: () => void; interactive?: boolean; grid?: boolean; orbitVisible?: boolean }) {
  const [visible, setVisible] = useState(true);
  useEffect(() => { const update = () => setVisible(!document.hidden); document.addEventListener('visibilitychange', update); return () => document.removeEventListener('visibilitychange', update); }, []);
  return <Canvas frameloop={visible ? 'always' : 'never'} fallback={<div className="earth-fallback">3D unavailable · Earth reference imagery</div>} camera={{ position: [0, 0.3, 8.8], fov: 44 }} dpr={[1, 1.5]} gl={{ antialias: true, alpha: true }}>
    <ambientLight intensity={0.32} />
    <directionalLight position={[-5, 3, 5]} intensity={3.5} />
    <Stars radius={70} depth={30} count={2600} factor={2.4} saturation={0} fade speed={reduced ? 0 : 0.25} />
    <Environment resolution={64}><Lightformer intensity={0.5} position={[0, 5, 0]} scale={[10, 10, 1]} /></Environment>
    <Suspense fallback={null}><Globe mode={mode} reduced={reduced} onReady={onReady} interactive={interactive} grid={grid} orbitVisible={orbitVisible} /></Suspense>
    {interactive && <OrbitControls enablePan={false} minDistance={4} maxDistance={15} enableDamping />}
  </Canvas>;
}