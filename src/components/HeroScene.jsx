import { Suspense, useMemo, useRef, useState, useEffect } from "react";
import { Canvas, useFrame } from "@react-three/fiber";
import { Points, PointMaterial } from "@react-three/drei";
import * as THREE from "three";

const ACCENT = new THREE.Color("#c9ff3a");
const SIGNAL = new THREE.Color("#7c8cff");

function useReducedMotion() {
  const [reduced, setReduced] = useState(false);
  useEffect(() => {
    const mq = window.matchMedia("(prefers-reduced-motion: reduce)");
    setReduced(mq.matches);
    const onChange = (e) => setReduced(e.matches);
    mq.addEventListener("change", onChange);
    return () => mq.removeEventListener("change", onChange);
  }, []);
  return reduced;
}

// Compact GLSL noise (Ashima simplex, trimmed) for the shell's surface displacement.
const NOISE_GLSL = `
vec3 mod289(vec3 x){return x-floor(x*(1.0/289.0))*289.0;}
vec4 mod289(vec4 x){return x-floor(x*(1.0/289.0))*289.0;}
vec4 permute(vec4 x){return mod289(((x*34.0)+1.0)*x);}
vec4 taylorInvSqrt(vec4 r){return 1.79284291400159-0.85373472095314*r;}
float snoise(vec3 v){
  const vec2 C=vec2(1.0/6.0,1.0/3.0);
  const vec4 D=vec4(0.0,0.5,1.0,2.0);
  vec3 i=floor(v+dot(v,C.yyy));
  vec3 x0=v-i+dot(i,C.xxx);
  vec3 g=step(x0.yzx,x0.xyz);
  vec3 l=1.0-g;
  vec3 i1=min(g.xyz,l.zxy);
  vec3 i2=max(g.xyz,l.zxy);
  vec3 x1=x0-i1+C.xxx;
  vec3 x2=x0-i2+C.yyy;
  vec3 x3=x0-D.yyy;
  i=mod289(i);
  vec4 p=permute(permute(permute(i.z+vec4(0.0,i1.z,i2.z,1.0))+i.y+vec4(0.0,i1.y,i2.y,1.0))+i.x+vec4(0.0,i1.x,i2.x,1.0));
  float n_=0.142857142857;
  vec3 ns=n_*D.wyz-D.xzx;
  vec4 j=p-49.0*floor(p*ns.z*ns.z);
  vec4 x_=floor(j*ns.z);
  vec4 y_=floor(j-7.0*x_);
  vec4 x=x_*ns.x+ns.yyyy;
  vec4 y=y_*ns.x+ns.yyyy;
  vec4 h=1.0-abs(x)-abs(y);
  vec4 b0=vec4(x.xy,y.xy);
  vec4 b1=vec4(x.zw,y.zw);
  vec4 s0=floor(b0)*2.0+1.0;
  vec4 s1=floor(b1)*2.0+1.0;
  vec4 sh=-step(h,vec4(0.0));
  vec4 a0=b0.xzyw+s0.xzyw*sh.xxyy;
  vec4 a1=b1.xzyw+s1.xzyw*sh.zzww;
  vec3 p0=vec3(a0.xy,h.x);
  vec3 p1=vec3(a0.zw,h.y);
  vec3 p2=vec3(a1.xy,h.z);
  vec3 p3=vec3(a1.zw,h.w);
  vec4 norm=taylorInvSqrt(vec4(dot(p0,p0),dot(p1,p1),dot(p2,p2),dot(p3,p3)));
  p0*=norm.x;p1*=norm.y;p2*=norm.z;p3*=norm.w;
  vec4 m=max(0.6-vec4(dot(x0,x0),dot(x1,x1),dot(x2,x2),dot(x3,x3)),0.0);
  m=m*m;
  return 42.0*dot(m*m,vec4(dot(p0,x0),dot(p1,x1),dot(p2,x2),dot(p3,x3)));
}
`;

function makeShellMaterial() {
  return new THREE.ShaderMaterial({
    transparent: true,
    depthWrite: false,
    side: THREE.DoubleSide,
    uniforms: {
      uTime: { value: 0 },
      uAmp: { value: 0.12 },
      uAccent: { value: ACCENT },
      uSignal: { value: SIGNAL },
    },
    vertexShader: `
      ${NOISE_GLSL}
      uniform float uTime;
      uniform float uAmp;
      varying vec3 vNormal;
      varying vec3 vView;
      varying float vNoise;
      void main() {
        float n = snoise(position * 1.4 + uTime * 0.12);
        vNoise = n;
        vec3 displaced = position + normal * n * uAmp;
        vec4 mv = modelViewMatrix * vec4(displaced, 1.0);
        vNormal = normalize(normalMatrix * normal);
        vView = normalize(-mv.xyz);
        gl_Position = projectionMatrix * mv;
      }
    `,
    fragmentShader: `
      uniform vec3 uAccent;
      uniform vec3 uSignal;
      varying vec3 vNormal;
      varying vec3 vView;
      varying float vNoise;
      void main() {
        float fresnel = pow(1.0 - max(dot(vNormal, vView), 0.0), 2.4);
        vec3 base = mix(uSignal, uAccent, clamp(vNoise * 0.5 + 0.5, 0.0, 1.0));
        vec3 color = base * (0.25 + fresnel * 1.4);
        float alpha = clamp(fresnel * 0.85 + 0.05, 0.0, 0.9);
        gl_FragColor = vec4(color, alpha);
      }
    `,
  });
}

function Orb({ reduced, pointer }) {
  const group = useRef();
  const shell = useRef();
  const core = useRef();
  const sparks = useRef();
  const target = useRef({ x: 0, y: 0 });
  const shellMat = useMemo(() => makeShellMaterial(), []);

  const sparkPositions = useMemo(() => {
    const count = reduced ? 40 : 90;
    const arr = new Float32Array(count * 3);
    for (let i = 0; i < count; i++) {
      const r = 0.35 + Math.random() * 0.85;
      const theta = Math.random() * Math.PI * 2;
      const phi = Math.acos(2 * Math.random() - 1);
      arr[i * 3] = r * Math.sin(phi) * Math.cos(theta);
      arr[i * 3 + 1] = r * Math.sin(phi) * Math.sin(theta);
      arr[i * 3 + 2] = r * Math.cos(phi);
    }
    return arr;
  }, [reduced]);

  useFrame((state, delta) => {
    if (!group.current) return;
    const t = state.clock.elapsedTime;

    target.current.x = pointer.current.y * 0.35;
    target.current.y = pointer.current.x * 0.45;
    group.current.rotation.x = THREE.MathUtils.lerp(group.current.rotation.x, target.current.x, 0.04);
    group.current.rotation.y = THREE.MathUtils.lerp(group.current.rotation.y, target.current.y, 0.04);
    // inertial drift on position too, so the orb feels like it has mass
    group.current.position.x = THREE.MathUtils.lerp(group.current.position.x, pointer.current.x * 0.18, 0.03);
    group.current.position.y = THREE.MathUtils.lerp(group.current.position.y, pointer.current.y * 0.14, 0.03);

    if (!reduced) {
      shellMat.uniforms.uTime.value = t;
      if (core.current) {
        const pulse = 1 + Math.sin(t * 0.9) * 0.06;
        core.current.scale.setScalar(pulse);
      }
      if (sparks.current) sparks.current.rotation.y -= delta * 0.06;
      if (shell.current) shell.current.rotation.y += delta * 0.03;
    }
  });

  return (
    <group ref={group}>
      <mesh ref={shell} material={shellMat}>
        <icosahedronGeometry args={[1.55, 5]} />
      </mesh>

      <mesh ref={core}>
        <sphereGeometry args={[0.62, 24, 24]} />
        <meshBasicMaterial color={SIGNAL} transparent opacity={0.5} />
      </mesh>

      <Points ref={sparks} positions={sparkPositions} stride={3} frustumCulled>
        <PointMaterial
          transparent
          color={ACCENT}
          size={0.02}
          sizeAttenuation
          depthWrite={false}
          opacity={0.85}
        />
      </Points>

      <pointLight position={[0, 0, 0]} intensity={6} color={SIGNAL} distance={4} />
    </group>
  );
}

function Scene({ reduced }) {
  const pointer = useRef({ x: 0, y: 0 });

  useFrame(({ pointer: p }) => {
    pointer.current.x = p.x;
    pointer.current.y = p.y;
  });

  return (
    <>
      <ambientLight intensity={0.35} />
      <Orb reduced={reduced} pointer={pointer} />
    </>
  );
}

export default function HeroScene() {
  const reduced = useReducedMotion();
  const [visible, setVisible] = useState(false);
  const wrapRef = useRef(null);

  useEffect(() => {
    const el = wrapRef.current;
    if (!el) return;
    const io = new IntersectionObserver(
      ([entry]) => setVisible(entry.isIntersecting),
      { threshold: 0.1 }
    );
    io.observe(el);
    return () => io.disconnect();
  }, []);

  return (
    <div ref={wrapRef} className="absolute inset-0">
      <Canvas
        dpr={[1, 1.75]}
        camera={{ position: [0, 0, 5.4], fov: 42 }}
        gl={{ antialias: true, alpha: true, powerPreference: "high-performance" }}
        frameloop={visible ? "always" : "never"}
      >
        <Suspense fallback={null}>
          <Scene reduced={reduced} />
        </Suspense>
      </Canvas>
    </div>
  );
}
