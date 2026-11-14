import { Suspense, useEffect, useMemo, useRef } from 'react';
import { Canvas, useFrame, useThree } from '@react-three/fiber';
import { Environment, Lightformer, Stars, useGLTF, useTexture } from '@react-three/drei';
import { Box3, Color, Group, Mesh, SRGBColorSpace, Vector3 } from 'three';
import earth from '@/assets/earth-surface.asset.json';
import clouds from '@/assets/earth-clouds.asset.json';
import satellite from '@/assets/models/landsat-8.glb.asset.json';

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
  return { ice: resolve('--scene-ice'), sun: resolve('--scene-sun') };
}

function Satellite() {
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
  return <primitive object={model} rotation={[0.3, 0.5, 0.2]} />;
}

function Globe({ reduced, mode, onReady }: { reduced: boolean; mode: number; onReady: () => void }) {
  const { camera, size } = useThree();
  useEffect(() => { camera.position.z = size.width < 700 ? 18 : 10.5; camera.updateProjectionMatrix(); }, [camera, size.width]);
  const map = useTexture(earth.url);
  const cloudMap = useTexture(clouds.url);
  map.colorSpace = SRGBColorSpace;
  const globe = useRef<Group>(null);
  const orbit = useRef<Group>(null);
  const radar = useRef<Group>(null);
  const cloud = useRef<Mesh>(null);
  const ready = useRef(false);
  const colors = useMemo(palette, []);
  useFrame(({ clock }, delta) => {
    if (!ready.current) { ready.current = true; onReady(); }
    if (reduced) return;
    const t = clock.elapsedTime;
    if (globe.current) globe.current.rotation.y += Math.min(delta, 0.05) * 0.08;
    if (cloud.current) cloud.current.rotation.y += Math.min(delta, 0.05) * 0.025;
    if (orbit.current) {
      orbit.current.position.set(Math.sin(t * 0.12 + 1.2) * 3.4, Math.cos(t * 0.12 + 1.2) * 1.35 + 0.1, Math.cos(t * 0.12 + 1.2) * 2.7);
      orbit.current.rotation.z = t * 0.025;
    }
    if (radar.current) radar.current.rotation.y = t * 0.18;
  });
  return <>
    <group position={[0, mode === 5 ? -2.3 : -1.25, 0]} scale={mode === 5 ? 1.35 : 1}>
      <group ref={globe} rotation={[0.16, -1.7, -0.13]}>
        <mesh><sphereGeometry args={[2.15, 64, 48]} /><meshStandardMaterial map={map} roughness={0.85} /></mesh>
        <mesh ref={cloud}><sphereGeometry args={[2.17, 64, 48]} /><meshStandardMaterial alphaMap={cloudMap} transparent opacity={0.18} depthWrite={false} /></mesh>
      </group>
      <mesh><sphereGeometry args={[2.19, 64, 48]} /><shaderMaterial transparent depthWrite={false} uniforms={{ glowColor: { value: colors.ice } }} vertexShader={'varying vec3 vNormal; varying vec3 vPosition; void main(){vNormal=normalize(normalMatrix*normal); vec4 p=modelViewMatrix*vec4(position,1.0);vPosition=p.xyz;gl_Position=projectionMatrix*p;}'} fragmentShader={'uniform vec3 glowColor; varying vec3 vNormal; varying vec3 vPosition; void main(){float rim=pow(1.0-abs(dot(normalize(vNormal),normalize(-vPosition))),4.0);gl_FragColor=vec4(glowColor,rim*0.62);}'} /></mesh>
      <group rotation={[1.18, 0.2, -0.35]}><mesh><torusGeometry args={[2.8, 0.007, 6, 160]} /><meshBasicMaterial color={colors.ice} transparent opacity={0.3} /></mesh></group>
      <group rotation={[0.65, -0.4, 0.6]}><mesh><torusGeometry args={[3.05, 0.004, 6, 160]} /><meshBasicMaterial color={colors.ice} transparent opacity={0.17} /></mesh></group>
      {(mode === 2 || mode === 4) && <group ref={radar}>
        <mesh rotation={[0, 0, 0.25]}><sphereGeometry args={[2.21, 32, 24, 0, 0.22]} /><meshBasicMaterial color={colors.ice} transparent opacity={0.22} side={2} depthWrite={false} /></mesh>
        {mode === 4 && <mesh><sphereGeometry args={[2.205, 24, 16]} /><meshBasicMaterial color={colors.ice} wireframe transparent opacity={0.12} /></mesh>}
      </group>}
      <group ref={orbit} position={[3, 0.8, 1]}><Suspense fallback={null}><Satellite /></Suspense></group>
    </group>
    {mode === 3 && <mesh position={[-4, 2.4, -8]}><sphereGeometry args={[1.15, 32, 24]} /><meshStandardMaterial map={map} color={colors.sun} roughness={1} /></mesh>}
  </>;
}

export default function SpaceScene({ mode, reduced, onReady }: { mode: number; reduced: boolean; onReady: () => void }) {
  return <Canvas camera={{ position: [0, 0.3, 8.8], fov: 44 }} dpr={[1, 1.5]} gl={{ antialias: true, alpha: true }}>
    <ambientLight intensity={0.32} />
    <directionalLight position={[-5, 3, 5]} intensity={3.5} />
    <Stars radius={70} depth={30} count={1400} factor={2.4} saturation={0} fade speed={reduced ? 0 : 0.25} />
    <Environment resolution={64}><Lightformer intensity={0.5} position={[0, 5, 0]} scale={[10, 10, 1]} /></Environment>
    <Suspense fallback={null}><Globe mode={mode} reduced={reduced} onReady={onReady} /></Suspense>
  </Canvas>;
}