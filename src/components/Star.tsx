type StarProps = {
  className?: string;
  color?: "primary" | "secondary";
  size?: number;
};

export function Star({ className = "", color = "primary", size = 16 }: StarProps) {
  const fill = color === "primary" ? "var(--primary)" : "var(--secondary)";
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      className={className}
      aria-hidden="true"
    >
      <path
        d="M12 2c.4 3.6 2.4 5.6 6 6-3.6.4-5.6 2.4-6 6-.4-3.6-2.4-5.6-6-6 3.6-.4 5.6-2.4 6-6z"
        fill={fill}
      />
    </svg>
  );
}
