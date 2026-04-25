import { Droplets, Flame, Sparkles, Sun } from "lucide-react";

const benefits = [
  {
    icon: Droplets,
    title: "Seca espinhas rapidamente",
    desc: "Ação direta nos pontos críticos para um efeito visível em pouco tempo.",
  },
  {
    icon: Flame,
    title: "Reduz vermelhidão",
    desc: "Acalma a pele inflamada e devolve uniformidade ao tom.",
  },
  {
    icon: Sun,
    title: "Controla oleosidade",
    desc: "Equilibra a produção de sebo deixando a pele com aspecto matte.",
  },
  {
    icon: Sparkles,
    title: "Uso diário",
    desc: "Fórmula leve, segura para todos os tipos de pele, manhã e noite.",
  },
];

export function Benefits() {
  return (
    <section id="beneficios" className="relative py-20 md:py-28">
      <div className="mx-auto max-w-7xl px-4 md:px-8">
        <div className="max-w-2xl">
          <span className="text-xs font-bold uppercase tracking-[0.2em] text-primary">
            Por que Belle Visage
          </span>
          <h2 className="mt-3 font-display text-4xl md:text-5xl font-semibold leading-tight">
            Pele lisinha em <span className="text-gradient-primary">poucos dias</span>
          </h2>
          <p className="mt-4 text-muted-foreground">
            Uma fórmula simples, com ativos que funcionam de verdade. Sem complicações,
            sem mil etapas.
          </p>
        </div>

        <div className="mt-12 grid sm:grid-cols-2 lg:grid-cols-4 gap-5">
          {benefits.map(({ icon: Icon, title, desc }, i) => (
            <div
              key={title}
              className="group relative p-7 rounded-3xl bg-card border border-border hover:border-primary/40 hover:-translate-y-1 transition-all shadow-soft"
            >
              <div
                className={`h-12 w-12 rounded-2xl grid place-items-center mb-5 ${
                  i % 2 === 0 ? "bg-primary text-primary-foreground" : "bg-secondary text-secondary-foreground"
                }`}
              >
                <Icon className="h-6 w-6" />
              </div>
              <h3 className="font-display text-xl font-semibold">{title}</h3>
              <p className="mt-2 text-sm text-muted-foreground leading-relaxed">{desc}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
