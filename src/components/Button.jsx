export default function Button({
  children,
  onClick,
  className = "",
  variant = "primary",
  type = "button",
  disabled = false,
}) {
  const base =
    "px-5 py-2.5 rounded-full font-medium transition-all duration-200 text-sm shadow-sm";

  const variants = {
    primary:
      "bg-primary text-white hover:bg-accent shadow-md hover:shadow-lg",
    secondary:
      "bg-white text-primary border border-primary hover:bg-muted",
    ghost:
      "bg-transparent text-primary hover:bg-muted/40",
  };

  return (
    <button
      onClick={onClick}
      type={type}
      disabled={disabled}
      className={`${base} ${variants[variant]} ${
        disabled ? "opacity-50 cursor-not-allowed" : ""
      } ${className}`}
    >
      {children}
    </button>
  );
}
