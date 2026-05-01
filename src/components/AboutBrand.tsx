import { Star } from "./Star";

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

      </div>
    </section>
  );
}
