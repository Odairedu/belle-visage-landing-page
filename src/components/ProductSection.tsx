import { useState } from "react";
import { Minus, Plus, ShoppingBag, Truck, ShieldCheck, Sparkles, Flower2 } from "lucide-react";
import productImg from "@/assets/belle-visage-product.png";
import { Star } from "./Star";

export function ProductSection() {
  const [qty, setQty] = useState(1);
  const unit = 60;
  const total = (unit * qty).toLocaleString("pt-BR", {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  });

  return (
    <section id="produto" className="relative py-20 md:py-28 bg-soft-gradient">
      <div className="mx-auto max-w-7xl px-4 md:px-8 grid md:grid-cols-2 gap-12 md:gap-16 items-center">
        {/* Image */}
        <div className="relative">
          <div className="relative mx-auto aspect-square max-w-md rounded-[2.5rem] bg-secondary overflow-hidden shadow-soft">
            <div className="absolute inset-0 bg-gradient-to-br from-secondary to-primary/20" />
            <img
              src={productImg}
              alt="Belle Visage Spray para Espinhas"
              className="relative w-full h-full object-contain p-6 animate-float-slower"
            />
            <Star color="primary" size={28} className="absolute top-6 left-6 animate-spin-slow" />
            <Star color="primary" size={20} className="absolute bottom-10 right-10" />
          </div>
        </div>

        {/* Details */}
        <div>
          <span className="text-xs font-bold uppercase tracking-[0.2em] text-primary">Best seller</span>
          <h2 className="mt-3 font-display text-4xl md:text-5xl font-semibold leading-tight">
            Belle Visage
          </h2>
          <p className="mt-2 font-display text-2xl md:text-3xl text-gradient-primary font-medium">
            spray para espinhas
          </p>

          <div className="mt-4 flex items-center gap-3 text-sm">
            <div className="flex items-center gap-0.5">
              {[...Array(5)].map((_, i) => (
                <Star key={i} color="primary" size={16} />
              ))}
            </div>
            <span className="text-muted-foreground">4.9 · 2.130 avaliações</span>
          </div>

          <p className="mt-6 text-muted-foreground leading-relaxed">
            Um cosmético com propriedades <strong className="text-foreground">calmantes</strong>,{" "}
            <strong className="text-foreground">hidratantes</strong>,{" "}
            <strong className="text-foreground">refrescantes</strong> e{" "}
            <strong className="text-foreground">cicatrizantes</strong>. O Belle Visage ajuda a
            reduzir a vermelhidão, controla a oleosidade da pele, auxilia na prevenção de novas
            espinhas, proporcionando sensação refrescante e calmante.
          </p>

          {/* Quantity & price */}
          <div className="mt-8 flex flex-wrap items-center gap-6">
            <div className="flex items-center rounded-full border border-border bg-background p-1">
              <button
                onClick={() => setQty((q) => Math.max(1, q - 1))}
                className="h-10 w-10 grid place-items-center rounded-full hover:bg-muted transition"
                aria-label="Diminuir quantidade"
              >
                <Minus className="h-4 w-4" />
              </button>
              <span className="w-10 text-center font-semibold tabular-nums">{qty}</span>
              <button
                onClick={() => setQty((q) => Math.min(99, q + 1))}
                className="h-10 w-10 grid place-items-center rounded-full hover:bg-muted transition"
                aria-label="Aumentar quantidade"
              >
                <Plus className="h-4 w-4" />
              </button>
            </div>

            <div>
              <div className="text-xs text-muted-foreground">Total</div>
              <div className="font-display text-3xl font-semibold tabular-nums">
                R$ {total}
              </div>
            </div>
          </div>

          <button className="mt-8 inline-flex w-full sm:w-auto items-center justify-center gap-2 h-14 px-10 rounded-full bg-primary text-primary-foreground font-semibold shadow-glow hover:scale-[1.02] active:scale-[0.98] transition">
            <ShoppingBag className="h-5 w-5" />
            Comprar agora
          </button>

          <div className="mt-8 grid grid-cols-2 sm:grid-cols-4 gap-4 text-xs text-muted-foreground">
            <div className="flex flex-col items-center text-center gap-1">
              <Truck className="h-5 w-5 text-primary" />
              Frete grátis acima de R$ 120
            </div>
            <div className="flex flex-col items-center text-center gap-1">
              <ShieldCheck className="h-5 w-5 text-primary" />
              Compra 100% segura
            </div>
            <div className="flex flex-col items-center text-center gap-1">
              <Sparkles className="h-5 w-5 text-primary" />
              Resultados a partir de 1 semana
            </div>
            <div className="flex flex-col items-center text-center gap-1">
              <Flower2 className="h-5 w-5 text-primary" />
              Produto natural
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
