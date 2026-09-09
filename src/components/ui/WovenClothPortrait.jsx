import { Component, useEffect, useMemo, useRef, useState } from "react";
import { Canvas, useFrame, useThree } from "@react-three/fiber";
import * as THREE from "three";

// A self-owned texture loader, deliberately not drei's `useTexture`: drei
// caches loaded textures by URL and disposes them on unmount. Under
// StrictMode's dev-only mount→unmount→mount cycle, that cache gets
// poisoned — the first (thrown-away) mount's cleanup disposes the cached
// texture, so the second (real) mount reuses a dead reference and the
// cloth renders solid white. Owning the load/dispose lifecycle per-mount
// avoids sharing state across that double-invoke entirely.
function useOwnedTexture(url) {
  const [texture, setTexture] = useState(null);
  useEffect(() => {
    let cancelled = false;
    const loader = new THREE.TextureLoader();
    const loaded = loader.load(url, (t) => {
      if (cancelled) return;
      t.colorSpace = THREE.SRGBColorSpace;
      setTexture(t);
    });
    return () => {
      cancelled = true;
      loaded.dispose();
    };
  }, [url]);
  return texture;
}

class ClothErrorBoundary extends Component {
  constructor(props) {
    super(props);
    this.state = { error: null };
  }
  static getDerivedStateFromError(error) {
    return { error };
  }
  componentDidCatch(error, info) {
    // eslint-disable-next-line no-console
    console.error("[WovenClothPortrait] render error:", error, info?.componentStack);
  }
  render() {
    if (this.state.error) return null;
    return this.props.children;
  }
}

/**
 * Kinetic-textile portrait: a Verlet-physics cloth simulation with the
 * subject's own photo as the fabric texture, pinned at the top edge so it
 * drapes and ripples like a hanging banner. Rendered with React Three
 * Fiber directly in the page (no iframe — a prior iframe+WebGL-alpha
 * version composited unreliably across browsers).
 */

const GX = 30;
const GY = 36;
const BW = 3.2;
const BH = 3.5;
const GRAVITY = -2.6;
const DAMPING = 0.988;
const DT = 1 / 60;

function wind(ix, iy, t) {
  const cx = ix / GX;
  const cy = iy / GY;
  const travel = t * 1.3 - cy * 3.6;
  const gust = 0.5 + 0.35 * Math.sin(t * 0.5) + 0.15 * Math.sin(t * 1.6 + 1.1);
  const amp = 2.4 * cy;
  const fz = (Math.sin(travel + cx * 2.8) + 0.5 * Math.sin(travel * 1.6 + cx * 5.2)) * amp * gust;
  const fx = Math.sin(t * 0.7 + cy * 2.0) * 0.32 * cy;
  const fy = -0.22 * cy;
  return [fx, fy, fz];
}

function useReducedMotion() {
  const ref = useRef(typeof window !== "undefined" && window.matchMedia("(prefers-reduced-motion: reduce)").matches);
  return ref.current;
}

function ClothMesh({ imageUrl }) {
  const texture = useOwnedTexture(imageUrl);
  const reduced = useReducedMotion();
  const elapsed = useRef(0);

  const sim = useMemo(() => {
    const geometry = new THREE.PlaneGeometry(BW, BH, GX, GY);
    const pos = geometry.attributes.position;
    const N = (GX + 1) * (GY + 1);
    const cur = new Float32Array(N * 3);
    const prev = new Float32Array(N * 3);
    const rest = new Float32Array(N * 3);
    const pinned = new Uint8Array(N);
    for (let i = 0; i < N; i++) {
      const ax = pos.getX(i);
      const ay = pos.getY(i);
      cur[i * 3] = prev[i * 3] = rest[i * 3] = ax;
      cur[i * 3 + 1] = prev[i * 3 + 1] = rest[i * 3 + 1] = ay;
      cur[i * 3 + 2] = prev[i * 3 + 2] = rest[i * 3 + 2] = 0;
    }
    // pin the top row so the cloth hangs and ripples below, like a banner
    for (let ix = 0; ix <= GX; ix++) pinned[ix] = 1;
    return { geometry, cur, prev, rest, pinned, N };
  }, []);

  const idx = (ix, iy) => ix + iy * (GX + 1);
  const restH = BW / GX;
  const restV = BH / GY;

  const solve = (a, b, rl) => {
    const { cur, pinned } = sim;
    const ax = cur[a * 3], ay = cur[a * 3 + 1], az = cur[a * 3 + 2];
    const bx = cur[b * 3], by = cur[b * 3 + 1], bz = cur[b * 3 + 2];
    let dx = bx - ax, dy = by - ay, dz = bz - az;
    const d = Math.sqrt(dx * dx + dy * dy + dz * dz) || 1e-6;
    const diff = ((d - rl) / d) * 0.5;
    dx *= diff; dy *= diff; dz *= diff;
    const pa = pinned[a], pb = pinned[b];
    if (!pa && !pb) {
      cur[a * 3] += dx; cur[a * 3 + 1] += dy; cur[a * 3 + 2] += dz;
      cur[b * 3] -= dx; cur[b * 3 + 1] -= dy; cur[b * 3 + 2] -= dz;
    } else if (pa && !pb) {
      cur[b * 3] -= dx * 2; cur[b * 3 + 1] -= dy * 2; cur[b * 3 + 2] -= dz * 2;
    } else if (!pa && pb) {
      cur[a * 3] += dx * 2; cur[a * 3 + 1] += dy * 2; cur[a * 3 + 2] += dz * 2;
    }
  };

  const step = (t) => {
    const { cur, prev, pinned } = sim;
    for (let iy = 0; iy <= GY; iy++) {
      for (let ix = 0; ix <= GX; ix++) {
        const i = idx(ix, iy);
        if (pinned[i]) continue;
        const w = wind(ix, iy, t);
        for (let k = 0; k < 3; k++) {
          const j = i * 3 + k;
          const a = k === 0 ? w[0] : k === 1 ? w[1] + GRAVITY : w[2];
          const v = (cur[j] - prev[j]) * DAMPING;
          prev[j] = cur[j];
          cur[j] = cur[j] + v + a * DT * DT;
        }
      }
    }
    for (let it = 0; it < 3; it++) {
      for (let iy = 0; iy <= GY; iy++) for (let ix = 0; ix < GX; ix++) solve(idx(ix, iy), idx(ix + 1, iy), restH);
      for (let iy = 0; iy < GY; iy++) for (let ix = 0; ix <= GX; ix++) solve(idx(ix, iy), idx(ix, iy + 1), restV);
    }
    for (let ix = 0; ix <= GX; ix++) {
      const i = ix;
      cur[i * 3] = sim.rest[i * 3]; cur[i * 3 + 1] = sim.rest[i * 3 + 1]; cur[i * 3 + 2] = sim.rest[i * 3 + 2];
      prev[i * 3] = sim.rest[i * 3]; prev[i * 3 + 1] = sim.rest[i * 3 + 1]; prev[i * 3 + 2] = sim.rest[i * 3 + 2];
    }
  };

  const commit = () => {
    const pos = sim.geometry.attributes.position;
    for (let i = 0; i < sim.N; i++) pos.setXYZ(i, sim.cur[i * 3], sim.cur[i * 3 + 1], sim.cur[i * 3 + 2]);
    pos.needsUpdate = true;
    sim.geometry.computeVertexNormals();
  };

  // pre-roll so the cloth starts mid-ripple, not perfectly flat
  useEffect(() => {
    for (let s = 0; s < 40; s++) step(s * DT);
    elapsed.current = 40 * DT;
    commit();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useFrame(() => {
    if (reduced) return;
    elapsed.current += DT;
    step(elapsed.current);
    commit();
  });

  // Don't mount the mesh until the texture has actually decoded — avoids a
  // flash of solid white (the material's default color with no map yet).
  if (!texture) return null;

  return (
    <mesh geometry={sim.geometry}>
      <meshPhongMaterial map={texture} side={THREE.DoubleSide} shininess={8} specular={new THREE.Color(0x1a1a1a)} />
    </mesh>
  );
}

function FitCamera() {
  const { camera, size } = useThree();
  useEffect(() => {
    const aspect = size.width / size.height;
    const fovRad = (38 * Math.PI) / 180;
    const vFit = (BH / 2) / Math.tan(fovRad / 2);
    const hFit = (BW / 2) / Math.tan(fovRad / 2) / aspect;
    camera.position.set(0, 0, Math.max(vFit, hFit) * 1.12 + 0.3);
    camera.lookAt(0, 0, 0);
    camera.updateProjectionMatrix();
  }, [size, camera]);
  return null;
}

export default function WovenClothPortrait({ imageUrl, className, style }) {
  return (
    // Hard clip boundary: `contain: strict` + overflow-hidden means the
    // canvas can never visually bleed past this box, no matter what R3F's
    // internal resize measurement does mid-drag while the window resizes.
    <div
      className={className}
      style={{ position: "relative", overflow: "hidden", contain: "strict", ...style }}
    >
      <ClothErrorBoundary>
        <Canvas
          style={{ display: "block", position: "absolute", inset: 0, width: "100%", height: "100%" }}
          camera={{ fov: 38, near: 0.1, far: 100 }}
          gl={{ alpha: true, antialias: true }}
          dpr={[1, 2]}
        >
          <FitCamera />
          <ambientLight intensity={0.75} />
          <directionalLight position={[-3, 3.5, 3.2]} intensity={1.1} />
          <directionalLight position={[3, -1.5, 2.0]} intensity={0.4} color="#7c8cff" />
          <ClothMesh imageUrl={imageUrl} />
        </Canvas>
      </ClothErrorBoundary>
    </div>
  );
}
