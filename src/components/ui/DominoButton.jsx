import React from "react";

export function DominoButton({
  children,
  onClick,
  href,
  target,
  rel,
  className = "",
  ...props
}) {
  const Component = href ? "a" : "button";

  return (
    <>
      <style>{`
        .domino-row-btn {
          position: relative;
          overflow: hidden;
          display: inline-flex;
          align-items: center;
          justify-content: center;
          padding: 14px 32px;
          background: #121214;
          border: 1px solid rgba(251, 146, 12, 0.3);
          border-radius: 15px;
          font-family: inherit;
          font-size: 15px;
          font-weight: 600;
          color: black;
          cursor: pointer;
          isolation: isolate;
          transform-origin: center;
          transition:
            box-shadow 0.25s ease,
            border-color 0.25s ease;
          text-decoration: none;
          box-sizing: border-box;
        }

        .domino-row-btn__label {
          position: relative;
          z-index: 3;
          display: inline-flex;
          align-items: center;
          gap: 10px;
          transition: color 0.25s ease;
        }

        .domino-row-btn__row {
          position: absolute;
          inset: 0;
          width: 100%;
          height: 100%;
          display: flex;
          gap: 0;
          perspective: 500px;
          pointer-events: none;
          z-index: 2;
        }

        .domino-row-btn__tile {
          position: relative;
          flex: 1 1 0;
          width: 20%;
          min-width: 0;
          height: 100%;
          margin: 0;
          padding: 0;
          background: #FB920C;
          transform-origin: bottom center;
          transform: rotateX(0deg);
          transition: transform 0.22s ease-in;
          box-sizing: border-box;
        }

        /* Daşlar arasında boşluq yaratmadan incə ayırıcı xətt */
        .domino-row-btn__tile:not(:last-child)::after {
          content: "";
          position: absolute;
          top: 0;
          right: 0;
          width: 1px;
          height: 100%;
          background: rgba(0, 0, 0, 0.15);
          pointer-events: none;
        }

        .domino-row-btn__tile:nth-child(1) {
          transition-delay: 0ms;
        }

        .domino-row-btn__tile:nth-child(2) {
          transition-delay: 75ms;
        }

        .domino-row-btn__tile:nth-child(3) {
          transition-delay: 150ms;
        }

        .domino-row-btn__tile:nth-child(4) {
          transition-delay: 225ms;
        }

        .domino-row-btn__tile:nth-child(5) {
          transition-delay: 300ms;
        }

        .domino-row-btn:hover .domino-row-btn__tile,
        .domino-row-btn:focus-visible .domino-row-btn__tile {
          transform: rotateX(90deg);
        }

        .domino-row-btn:hover .domino-row-btn__label,
        .domino-row-btn:focus-visible .domino-row-btn__label {
          color: #ffffff;
        }

        .domino-row-btn:hover,
        .domino-row-btn:focus-visible {
          animation: domino-weight 0.55s ease forwards;
          border-color: #FB920C;
          box-shadow: 0 0 20px rgba(251, 146, 12, 0.3);
        }

        @keyframes domino-weight {
          0% {
            transform: translateY(0) scale(1);
          }

          20% {
            transform: translateY(0.5px) scale(0.997);
          }

          40% {
            transform: translateY(1px) scale(0.993);
          }

          60% {
            transform: translateY(1.5px) scale(0.988);
          }

          80% {
            transform: translateY(2px) scale(0.982);
          }

          100% {
            transform: translateY(2px) scale(0.975);
          }
        }
      `}</style>

      <Component
        className={`domino-row-btn ${className}`}
        onClick={onClick}
        href={href}
        target={target}
        rel={rel}
        {...props}
      >
        <span className="domino-row-btn__label">
          {children}
        </span>

        <div
          className="domino-row-btn__row"
          aria-hidden="true"
        >
          <div className="domino-row-btn__tile" />
          <div className="domino-row-btn__tile" />
          <div className="domino-row-btn__tile" />
          <div className="domino-row-btn__tile" />
          <div className="domino-row-btn__tile" />
        </div>
      </Component>
    </>
  );
}

export default DominoButton;