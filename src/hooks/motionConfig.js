/** Shared spring/easing constants so motion feels consistent across the site. */

// Soft, weighty spring for large elements (cards, hero layers).
export const SPRING_SOFT = { stiffness: 120, damping: 16, mass: 0.6 };

// Snappier spring for small interactive elements (buttons, magnetic pull).
export const SPRING_SNAPPY = { stiffness: 260, damping: 20, mass: 0.4 };

// Very loose/smooth spring for ambient trailing effects (cursor glow).
export const SPRING_TRAIL = { stiffness: 60, damping: 18, mass: 0.8 };

// Standard entrance easing used across whileInView reveals.
export const EASE_OUT = [0.16, 1, 0.3, 1];

export const VIEWPORT_ONCE = { once: true, margin: "-80px" };

// Slow, heavy inertia for the hero orb's mouse-parallax drift.
export const SPRING_ORB = { stiffness: 40, damping: 14, mass: 1.2 };
