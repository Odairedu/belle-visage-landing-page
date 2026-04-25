import { Instagram } from "lucide-react";
import { Star } from "./Star";

function TikTokIcon({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" fill="currentColor" className={className} aria-hidden="true">
      <path d="M19.59 6.69a4.83 4.83 0 0 1-3.77-4.25V2h-3.45v13.67a2.89 2.89 0 0 1-5.2 1.74 2.89 2.89 0 0 1 2.31-4.64 2.93 2.93 0 0 1 .88.13V9.4a6.84 6.84 0 0 0-1-.05A6.33 6.33 0 0 0 5.8 20.1a6.34 6.34 0 0 0 10.86-4.43V8.85A8.16 8.16 0 0 0 21.5 10.4V7a4.85 4.85 0 0 1-1.91-.31z" />
    </svg>
  );
}

export function AboutBrand() {
  return (
    <section id="marca" className="relative py-20 md:py-28 overflow-hidden">
      <div className="absolute inset-0 bg-gradient-to-br from-primary to-primary/80" />
      <div className="absolute -top-20 -left-20 h-72 w-72 rounded-full bg-secondary/40 blur-3xl" />
      <div className="absolute -bottom-20 -right-20 h-96 w-96 rounded-full bg-secondary/30 blur-3xl" />
      <Star color="secondary" size={32} className="absolute top-12 right-[10%] animate-spin-slow" />
      <Star color="secondary" size={20} className="absolute bottom-16 left-[15%]" />

      <div className="relative mx-auto max-w-5xl px-4 md:px-8 text-center text-primary-foreground">
        <span className="text-xs font-bold uppercase tracking-[0.25em] text-secondary">
          A Marca
        </span>
        <h2 className="mt-4 font-display text-4xl md:text-6xl font-semibold leading-[1.05]">
          Skincare moderno, <br /> feito pra <span className="text-secondary">você</span>.
        </h2>
        <p className="mt-6 text-lg text-primary-foreground/85 max-w-2xl mx-auto">
          Belle Visage nasceu para descomplicar o cuidado com a pele. Soluções simples e
          eficazes, criadas com ingredientes de alta qualidade e pensadas para a nova
          geração que quer resultado de verdade.
        </p>

        <div className="mt-10 grid sm:grid-cols-2 md:grid-cols-4 gap-4 max-w-3xl mx-auto">
          {[
            "Marca moderna",
            "Fórmulas simples",
            "Para a nova geração",
            "Ingredientes premium",
          ].map((t) => (
            <div
              key={t}
              className="rounded-2xl bg-primary-foreground/10 backdrop-blur border border-primary-foreground/20 px-4 py-4 text-sm font-medium"
            >
              {t}
            </div>
          ))}
        </div>

        <div className="mt-12 flex items-center justify-center gap-4">
          <a
            href="#"
            aria-label="Instagram"
            className="h-12 w-12 grid place-items-center rounded-full bg-secondary text-secondary-foreground hover:scale-110 transition"
          >
            <Instagram className="h-5 w-5" />
          </a>
          <a
            href="#"
            aria-label="TikTok"
            className="h-12 w-12 grid place-items-center rounded-full bg-secondary text-secondary-foreground hover:scale-110 transition"
          >
            <TikTokIcon className="h-5 w-5" />
          </a>
        </div>
        <p className="mt-4 text-secondary font-display text-lg">@bellevisage</p>
      </div>
    </section>
  );
}
