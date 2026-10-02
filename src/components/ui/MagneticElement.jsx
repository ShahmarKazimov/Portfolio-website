export default function MagneticElement({
  children,
  className = "",
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
