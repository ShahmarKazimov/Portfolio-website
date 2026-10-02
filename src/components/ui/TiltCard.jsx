export default function TiltCard({
  children,
  className = "",
  range = 8,
  lift = true,
  glare = false,
  ...rest
}) {
  return (
    <div
      className={className}
      {...rest}
    >
      {children}
    </div>
  );
}
