import { Suspense, lazy } from "react";
import profilePicture from "../assets/profile-picture.png";

// Pulls in three.js/@react-three/fiber — kept out of the main bundle since
// it's only needed once this portrait actually mounts.
const WovenClothPortrait = lazy(() => import("./ui/WovenClothPortrait"));

// Sizing is entirely the parent's responsibility (see Hero.jsx, which
// gives this a differently-sized box per breakpoint) — this component
// just fills whatever box it's given.
export default function HeroPortrait() {
  return (
    <div className="pointer-events-none relative z-999 h-full w-full overflow-hidden">
      <div className="relative h-full w-full overflow-hidden">
        <Suspense fallback={null}>
          <WovenClothPortrait imageUrl={profilePicture} className="h-full scale-110 w-full" />
        </Suspense>
      </div>
    </div>
  );
}
