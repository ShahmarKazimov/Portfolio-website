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
        .uiverse-slide-btn {
          position: relative;
          display: inline-flex;
          align-items: center;
          justify-content: center;
          padding: 14px 32px;
          background: transparent;
          border: 1px solid gray;
          font-family: inherit;
          font-size: 15px;
          font-weight: 700;
          color: white;
          border-radius: 12px;
          cursor: pointer;
          overflow: hidden;
          transition: color 0.5s ease, border-color 0.5s ease, box-shadow 0.5s ease;
          text-transform: uppercase;
          letter-spacing: 1px;
          text-decoration: none;
          box-sizing: border-box;
          isolation: isolate;
        }

        .uiverse-slide-btn:hover {
          color: #0c071e;
          border-color: #FB920C;
          box-shadow: 0 0 20px rgba(251, 146, 12, 0.4);
        }

        .uiverse-slide-btn__span {
          position: absolute;
          width: 100%;
          height: 26%;
          background-color: #FB920C;
          transition: all 0.5s ease;
          z-index: 1;
          pointer-events: none;
        }

        .uiverse-slide-btn__span:nth-child(1) {
          top: -100%;
          left: 0;
        }

        .uiverse-slide-btn:hover .uiverse-slide-btn__span:nth-child(1) {
          top: 0%;
        }

        .uiverse-slide-btn__span:nth-child(2) {
          top: 25%;
          right: 100%;
        }

        .uiverse-slide-btn:hover .uiverse-slide-btn__span:nth-child(2) {
          right: 0%;
        }

        .uiverse-slide-btn__span:nth-child(3) {
          top: 50%;
          left: 100%;
        }

        .uiverse-slide-btn:hover .uiverse-slide-btn__span:nth-child(3) {
          left: 0%;
        }

        .uiverse-slide-btn__span:nth-child(4) {
          bottom: -100%;
          left: 0;
        }

        .uiverse-slide-btn:hover .uiverse-slide-btn__span:nth-child(4) {
          bottom: 0%;
        }

        .uiverse-slide-btn__label {
          position: relative;
          z-index: 2;
          display: inline-flex;
          align-items: center;
          gap: 10px;
        }
      `}</style>

      <Component
        className={`uiverse-slide-btn ${className}`}
        onClick={onClick}
        href={href}
        target={target}
        rel={rel}
        {...props}
      >
        <span className="uiverse-slide-btn__span"></span>
        <span className="uiverse-slide-btn__span"></span>
        <span className="uiverse-slide-btn__span"></span>
        <span className="uiverse-slide-btn__span"></span>
        <span className="uiverse-slide-btn__label">{children}</span>
      </Component>
    </>
  );
}

export default DominoButton;