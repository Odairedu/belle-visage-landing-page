import { Star } from "./Star";

export function Logo({ size = "md" }: { size?: "sm" | "md" | "lg" }) {
  const text =
    size === "lg"
      ? "text-4xl md:text-5xl"
      : size === "sm"
        ? "text-xl"
        : "text-2xl md:text-3xl";

  return (
    <div className="flex items-center gap-1.5 font-display font-semibold leading-none">
      <Star color="secondary" size={size === "lg" ? 20 : 14} className="shrink-0" />
      <span className={`${text} text-primary tracking-tight`}>belle</span>
      <span className={`${text} text-primary tracking-tight`}>visage</span>
      <Star color="primary" size={size === "lg" ? 20 : 14} className="shrink-0" />
    </div>
  );
}
