import { useRef } from "react";

export function ScrollWordReveal({
  text,
  as: Component = "p",
  className = "",
  style,
  children,
}) {
  const containerRef = useRef(null);
  const contentText = typeof text === "string" ? text : children;

  return (
    <Component ref={containerRef} className={className} style={style}>
      {contentText}
    </Component>
  );
}

export default ScrollWordReveal;
