import * as React from "react";
import { clsx } from "clsx";
import { twMerge } from "tailwind-merge";

function cn(...inputs) {
  return twMerge(clsx(inputs));
}

export const InteractiveTravelCard = React.forwardRef(
  (
    { title, subtitle, imageUrl, className },
    ref
  ) => {
    return (
      <div
        ref={ref}
        className={cn(
          "relative h-104 w-full sm:w-160 rounded-2xl bg-transparent shadow-2xl border border-white/20 overflow-hidden cursor-pointer",
          className
        )}
      >
        <div
          className="absolute inset-4 grid h-[calc(100%-2rem)] w-[calc(100%-2rem)] grid-rows-[1fr_auto] rounded-xl shadow-lg"
        >
          {/* Background Image */}
          <img
            src={imageUrl}
            alt={`${title}, ${subtitle}`}
            className="absolute inset-0 h-full w-full rounded-xl object-cover"
          />

          {/* Darkening overlay */}
          <div className="absolute inset-0 h-full w-full rounded-xl bg-linear-to-b from-black/40 via-black/20 to-black/80" />
        </div>
      </div>
    );
  }
);
InteractiveTravelCard.displayName = "InteractiveTravelCard";
