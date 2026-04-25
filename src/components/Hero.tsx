import productImg from "@/assets/belle-visage-product.jpg";
import { Star } from "./Star";

export function Hero() {
  return (
    <section
      id="top"
      className="relative overflow-hidden bg-hero-gradient pt-28 md:pt-36 pb-20 md:pb-28"
    >
      {/* Floating shapes */}
      <div className="pointer-events-none absolute inset-0">
        <div className="absolute top-24 left-[8%] h-40 w-40 rounded-full bg-secondary/60 blur-3xl animate-float-slow" />
        <div className="absolute bottom-10 right-[10%] h-56 w-56 rounded-full bg-primary/30 blur-3xl animate-float-slower" />
        <div className="absolute top-1/3 right-[20%] animate-spin-slow opacity-70">
          <Star color="primary" size={28} />
        </div>
        <div className="absolute bottom-1/4 left-[15%] animate-spin-slow opacity-80">
          <Star color="secondary" size={22} />
        </div>
        <div className="absolute top-1/4 left-[40%]">
          <Star color="primary" size={14} />
        </div>
      </div>

      <div className="relative mx-auto max-w-7xl px-4 md:px-8 grid md:grid-cols-2 gap-10 md:gap-16 items-center">
        <div className="animate-fade-up">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-primary/10 text-primary text-xs font-semibold uppercase tracking-wider mb-6">
            <Star color="primary" size={12} />
            Novo · Skincare
          </div>
          <h1 className="font-display text-5xl md:text-6xl lg:text-7xl font-semibold leading-[1.05] text-foreground">
            Diga adeus às <span className="text-gradient-primary">espinhas</span> com Belle Visage
          </h1>
          <p className="mt-6 text-lg md:text-xl text-muted-foreground max-w-lg">
            Spray prático, rápido e eficaz para todos os tipos de pele.
          </p>
          <div className="mt-8 flex flex-wrap items-center gap-4">
            <a
              href="#produto"
              className="inline-flex items-center justify-center h-14 px-8 rounded-full bg-primary text-primary-foreground font-semibold shadow-glow hover:scale-[1.03] active:scale-[0.98] transition"
            >
              Comprar agora
            </a>
            <a
              href="#beneficios"
              className="inline-flex items-center justify-center h-14 px-6 rounded-full border border-border bg-background/60 backdrop-blur font-medium hover:border-primary/50 transition"
            >
              Ver benefícios
            </a>
          </div>
          <div className="mt-10 flex items-center gap-6 text-sm text-muted-foreground">
            <div className="flex items-center gap-2">
              <div className="flex -space-x-2">
                <div className="h-8 w-8 rounded-full bg-primary/30 border-2 border-background" />
                <div className="h-8 w-8 rounded-full bg-secondary border-2 border-background" />
                <div className="h-8 w-8 rounded-full bg-primary/60 border-2 border-background" />
              </div>
              <span><strong className="text-foreground">+10k</strong> peles felizes</span>
            </div>
            <div className="hidden sm:flex items-center gap-1">
              <Star color="primary" size={14} />
              <span><strong className="text-foreground">4.9</strong> · 2.1k avaliações</span>
            </div>
          </div>
        </div>

        <div className="relative animate-fade-up" style={{ animationDelay: "0.15s" }}>
          <div className="relative mx-auto w-full max-w-md aspect-square">
            <div className="absolute inset-0 rounded-full bg-gradient-to-br from-secondary/80 to-primary/30 blur-2xl" />
            <div className="absolute inset-4 rounded-full bg-secondary/70" />
            <img
              src={productImg}
              alt="Belle Visage Spray para Espinhas"
              className="relative z-10 w-full h-full object-contain drop-shadow-product animate-float-slow"
            />
            <div className="absolute -top-2 -right-2 z-20 bg-primary text-primary-foreground rounded-full h-20 w-20 grid place-items-center text-center font-display font-semibold leading-tight rotate-12 shadow-glow">
              <span>
                <span className="block text-xs">só</span>
                <span className="text-lg">R$60</span>
              </span>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
