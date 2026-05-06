import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { CheckCircle2, Lock, UserCircle2 } from "lucide-react";
import { Minus, Plus, ShoppingBag, Tag, CreditCard, QrCode, FileText, ArrowLeft } from "lucide-react";
import productImg from "@/assets/belle-visage-product.png";
import { Logo } from "@/components/Logo";
import { Star } from "@/components/Star";
import { toast } from "sonner";
import { useAuth } from "@/components/auth/AuthProvider";
import { supabase } from "@/integrations/supabase/client";

export const Route = createFileRoute("/checkout")({
  head: () => ({
    meta: [
      { title: "Finalizar compra — Belle Visage" },
      { name: "description", content: "Finalize sua compra do Belle Visage com segurança." },
    ],
  }),
  component: CheckoutPage,
});

type Payment = "cartao" | "pix" | "boleto";

const maskCPF = (v: string) =>
  v.replace(/\D/g, "").slice(0, 11)
    .replace(/(\d{3})(\d)/, "$1.$2")
    .replace(/(\d{3})(\d)/, "$1.$2")
    .replace(/(\d{3})(\d{1,2})$/, "$1-$2");

const maskPhone = (v: string) =>
  v.replace(/\D/g, "").slice(0, 11)
    .replace(/(\d{2})(\d)/, "($1) $2")
    .replace(/(\d{5})(\d)/, "$1-$2");

const maskCEP = (v: string) =>
  v.replace(/\D/g, "").slice(0, 8).replace(/(\d{5})(\d)/, "$1-$2");

const maskCard = (v: string) =>
  v.replace(/\D/g, "").slice(0, 16).replace(/(\d{4})(?=\d)/g, "$1 ");

const maskValidade = (v: string) =>
  v.replace(/\D/g, "").slice(0, 4).replace(/(\d{2})(\d)/, "$1/$2");

const fmt = (n: number) =>
  n.toLocaleString("pt-BR", { minimumFractionDigits: 2, maximumFractionDigits: 2 });

function CheckoutPage() {
  const [qty, setQty] = useState(1);
  const unit = 60;
  const frete = 20;

  // Coupon
  const [couponOpen, setCouponOpen] = useState(false);
  const [coupon, setCoupon] = useState("");
  const [discountPct, setDiscountPct] = useState(0);
  const [couponMsg, setCouponMsg] = useState<{ text: string; ok: boolean } | null>(null);

  // Form
  const [form, setForm] = useState({
    nome: "", cpf: "", telefone: "", email: "",
    rua: "", numero: "", bairro: "", cidade: "", estado: "", cep: "", complemento: "",
    cardNum: "", cardName: "", cardVal: "", cardCvv: "",
  });
  const set = (k: keyof typeof form) => (e: React.ChangeEvent<HTMLInputElement>) => {
    const v = e.target.value;
    const masks: Partial<Record<keyof typeof form, (s: string) => string>> = {
      cpf: maskCPF, telefone: maskPhone, cep: maskCEP,
      cardNum: maskCard, cardVal: maskValidade,
    };
    setForm((f) => ({ ...f, [k]: masks[k] ? masks[k]!(v) : v }));
  };

  const [payment, setPayment] = useState<Payment>("cartao");

  const subtotal = unit * qty;
  const desconto = subtotal * discountPct;
  const total = subtotal - desconto + frete;

  const applyCoupon = () => {
    const code = coupon.trim().toUpperCase();
    if (code === "BELLE10") {
      setDiscountPct(0.1);
      setCouponMsg({ text: "Cupom aplicado · 10% de desconto", ok: true });
    } else if (code === "BELLE20") {
      setDiscountPct(0.2);
      setCouponMsg({ text: "Cupom aplicado · 20% de desconto", ok: true });
    } else {
      setDiscountPct(0);
      setCouponMsg({ text: "Cupom inválido", ok: false });
    }
  };

  // Reviews
  const [reviews, setReviews] = useState([
    { name: "Mariana", stars: 5, text: "Adorei o produto! Funcionou muito bem pra minha pele." },
    { name: "Juliana", stars: 4, text: "Textura ótima e cheirinho leve. Recomendo demais." },
    { name: "Carolina", stars: 5, text: "Foi o único produto que realmente ajudou minhas espinhas!" },
  ]);
  const [newReview, setNewReview] = useState("");
  const [newStars, setNewStars] = useState(5);

  const navigate = useNavigate();
  const [success, setSuccess] = useState(false);

  const { user, loading: authLoading, openAuth } = useAuth();
  const [profileName, setProfileName] = useState("");

  // Load profile + prefill form when user logs in
  useEffect(() => {
    if (!user) {
      setProfileName("");
      return;
    }
    setForm((f) => ({ ...f, email: user.email ?? f.email }));
    supabase
      .from("profiles")
      .select("full_name, phone, cpf")
      .eq("id", user.id)
      .maybeSingle()
      .then(({ data }) => {
        if (!data) return;
        setProfileName(data.full_name ?? "");
        setForm((f) => ({
          ...f,
          nome: data.full_name ?? f.nome,
          telefone: data.phone ? maskPhone(data.phone) : f.telefone,
          cpf: data.cpf ? maskCPF(data.cpf) : f.cpf,
        }));
      });
  }, [user]);

  const submitReview = (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) {
      toast.error("Faça login para enviar uma avaliação.");
      openAuth();
      return;
    }
    if (!newReview.trim()) {
      toast.error("Escreva um comentário antes de enviar.");
      return;
    }
    const name = profileName.trim() || user.email?.split("@")[0] || "Cliente Belle Visage";
    setReviews((r) => [{ name, stars: newStars, text: newReview.trim() }, ...r]);
    setNewReview("");
    setNewStars(5);
    toast.success("Avaliação enviada com sucesso!");
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) {
      toast.error("Faça login para finalizar a compra.");
      openAuth();
      return;
    }
    const required: (keyof typeof form)[] = ["nome", "cpf", "telefone", "email", "rua", "numero", "bairro", "cidade", "estado", "cep"];
    for (const k of required) {
      if (!form[k].trim()) {
        toast.error("Preencha todos os campos obrigatórios.");
        return;
      }
    }
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email)) {
      toast.error("Email inválido.");
      return;
    }
    if (form.cpf.replace(/\D/g, "").length !== 11) {
      toast.error("CPF inválido.");
      return;
    }
    if (payment === "cartao") {
      if (form.cardNum.replace(/\s/g, "").length < 16 || !form.cardName || form.cardVal.length < 5 || form.cardCvv.length < 3) {
        toast.error("Dados do cartão incompletos.");
        return;
      }
    }
    setSuccess(true);
    toast.success("Compra realizada com sucesso! 🎉");
    setTimeout(() => navigate({ to: "/" }), 2400);
  };

  const inputCls = "w-full h-11 rounded-xl border border-border bg-background px-4 text-sm outline-none focus:border-primary/60 focus:ring-2 focus:ring-primary/20 transition";
  const labelCls = "block text-xs font-semibold text-muted-foreground mb-1.5";

  return (
    <div className="min-h-screen relative overflow-hidden">
      {/* Background */}
      <div className="absolute inset-0 -z-10 bg-gradient-to-br from-primary/15 via-secondary/30 to-primary/10" />
      <div className="pointer-events-none absolute inset-0 -z-10">
        <div className="absolute top-32 left-[5%] h-72 w-72 rounded-full bg-primary/20 blur-3xl" />
        <div className="absolute bottom-20 right-[8%] h-80 w-80 rounded-full bg-secondary/40 blur-3xl" />
        <div className="absolute top-1/4 right-[15%] animate-spin-slow"><Star color="primary" size={22} /></div>
        <div className="absolute bottom-1/3 left-[12%] animate-spin-slow"><Star color="secondary" size={18} /></div>
      </div>

      {/* Header */}
      <header className="sticky top-0 z-40 backdrop-blur-xl bg-background/70 border-b border-border/60">
        <div className="mx-auto max-w-7xl px-4 md:px-8 h-16 md:h-20 flex items-center justify-between">
          <Link to="/" className="shrink-0"><Logo /></Link>
          <Link to="/" className="inline-flex items-center gap-2 text-sm font-medium text-muted-foreground hover:text-primary transition">
            <ArrowLeft className="h-4 w-4" />
            Voltar à loja
          </Link>
        </div>
      </header>

      <main className="mx-auto max-w-7xl px-4 md:px-8 py-10 md:py-14">
        <div className="mb-8 md:mb-12 animate-fade-up">
          <h1 className="font-display text-3xl md:text-4xl font-semibold">Finalizar compra</h1>
          <p className="text-muted-foreground mt-2">Revise seu pedido e preencha seus dados para concluir.</p>
          {!authLoading && (
            user ? (
              <div className="mt-4 inline-flex items-center gap-2 rounded-full bg-primary/10 border border-primary/20 px-4 py-2 text-sm">
                <UserCircle2 className="h-4 w-4 text-primary" />
                <span>
                  Olá{profileName ? `, ${profileName.split(" ")[0]}` : ""}! Você está identificada como{" "}
                  <span className="font-semibold text-primary">{user.email}</span>.
                </span>
              </div>
            ) : (
              <div className="mt-4 flex flex-wrap items-center gap-3 rounded-2xl bg-secondary/40 border border-secondary px-4 py-3 text-sm">
                <Lock className="h-4 w-4 text-primary" />
                <span>Entre na sua conta para preenchermos seus dados automaticamente.</span>
                <button
                  type="button"
                  onClick={openAuth}
                  className="ml-auto inline-flex items-center justify-center h-9 px-4 rounded-full bg-primary text-primary-foreground text-xs font-semibold hover:opacity-90 transition"
                >
                  Entrar
                </button>
              </div>
            )
          )}
        </div>

        <div className="grid lg:grid-cols-[1fr_1.1fr] gap-8 items-start">
          {/* LEFT — Product summary */}
          <aside className="space-y-6 animate-fade-up">
            <div className="rounded-3xl bg-background border border-border/60 p-6 md:p-8 shadow-soft">
              <div className="flex gap-5">
                <div className="relative shrink-0 h-28 w-28 md:h-32 md:w-32 rounded-2xl bg-gradient-to-br from-secondary to-primary/25 grid place-items-center overflow-hidden">
                  <img src={productImg} alt="Belle Visage" className="w-full h-full object-contain p-2" />
                  <Star color="primary" size={14} className="absolute top-2 right-2" />
                </div>
                <div className="flex-1 min-w-0">
                  <span className="text-[10px] font-bold uppercase tracking-[0.2em] text-primary">Best seller</span>
                  <h2 className="font-display text-xl font-semibold mt-1">Belle Visage</h2>
                  <p className="font-display text-sm text-gradient-primary font-medium">Spray para espinhas</p>
                  <div className="mt-3 flex items-center justify-between">
                    <div className="flex items-center rounded-full border border-border p-1">
                      <button onClick={() => setQty((q) => Math.max(1, q - 1))} aria-label="Diminuir" className="h-8 w-8 grid place-items-center rounded-full hover:bg-muted transition">
                        <Minus className="h-3.5 w-3.5" />
                      </button>
                      <span className="w-8 text-center text-sm font-semibold tabular-nums">{qty}</span>
                      <button onClick={() => setQty((q) => Math.min(99, q + 1))} aria-label="Aumentar" className="h-8 w-8 grid place-items-center rounded-full hover:bg-muted transition">
                        <Plus className="h-3.5 w-3.5" />
                      </button>
                    </div>
                    <div className="text-right">
                      <div className="text-[10px] text-muted-foreground">Unidade</div>
                      <div className="font-semibold tabular-nums">R$ {fmt(unit)}</div>
                    </div>
                  </div>
                </div>
              </div>

              <p className="mt-5 text-sm text-muted-foreground leading-relaxed">
                Um cosmético com propriedades calmantes, hidratantes, refrescantes e cicatrizantes.
                O Belle Visage ajuda a reduzir a vermelhidão, controla a oleosidade da pele, auxilia
                na prevenção de novas espinhas, proporcionando sensação refrescante e calmante.
              </p>
            </div>

            {/* Coupon */}
            <div className="rounded-3xl bg-background border border-border/60 p-6 shadow-soft">
              <button
                type="button"
                onClick={() => setCouponOpen((o) => !o)}
                className="w-full flex items-center justify-between text-left"
              >
                <span className="inline-flex items-center gap-2 font-medium">
                  <Tag className="h-4 w-4 text-primary" />
                  Possui cupom?
                </span>
                <span className="text-primary text-sm font-semibold">{couponOpen ? "Fechar" : "Adicionar"}</span>
              </button>
              {couponOpen && (
                <div className="mt-4 animate-fade-up">
                  <label className={labelCls}>Digite seu cupom</label>
                  <div className="flex gap-2">
                    <input
                      value={coupon}
                      onChange={(e) => setCoupon(e.target.value)}
                      placeholder="EX: BELLE10"
                      className={inputCls}
                    />
                    <button onClick={applyCoupon} className="h-11 px-5 rounded-xl bg-primary text-primary-foreground text-sm font-semibold hover:opacity-90 transition">
                      Aplicar
                    </button>
                  </div>
                  {couponMsg && (
                    <p className={`mt-2 text-xs font-medium ${couponMsg.ok ? "text-primary" : "text-destructive"}`}>
                      {couponMsg.text}
                    </p>
                  )}
                </div>
              )}
            </div>

            {/* Price summary */}
            <div className="rounded-3xl bg-background border border-border/60 p-6 shadow-soft">
              <h3 className="font-display text-lg font-semibold mb-4">Resumo do pedido</h3>
              <div className="space-y-2 text-sm">
                <div className="flex justify-between"><span className="text-muted-foreground">Subtotal</span><span className="tabular-nums">R$ {fmt(subtotal)}</span></div>
                <div className="flex justify-between"><span className="text-muted-foreground">Frete</span><span className="tabular-nums">R$ {fmt(frete)}</span></div>
                {desconto > 0 && (
                  <div className="flex justify-between text-primary"><span>Desconto</span><span className="tabular-nums">- R$ {fmt(desconto)}</span></div>
                )}
                <div className="border-t border-border/60 mt-3 pt-3 flex justify-between items-center">
                  <span className="font-semibold">Total</span>
                  <span className="font-display text-2xl font-semibold tabular-nums">R$ {fmt(total)}</span>
                </div>
              </div>
            </div>
          </aside>

          {/* RIGHT — Form */}
          <form onSubmit={handleSubmit} className="rounded-3xl bg-background border border-border/60 p-6 md:p-8 shadow-soft animate-fade-up space-y-8">
            <section>
              <h3 className="font-display text-lg font-semibold mb-4">Dados pessoais</h3>
              <div className="grid sm:grid-cols-2 gap-4">
                <div className="sm:col-span-2"><label className={labelCls}>Nome completo</label><input className={inputCls} value={form.nome} onChange={set("nome")} placeholder="Seu nome" /></div>
                <div><label className={labelCls}>CPF</label><input className={inputCls} value={form.cpf} onChange={set("cpf")} placeholder="000.000.000-00" /></div>
                <div><label className={labelCls}>Telefone</label><input className={inputCls} value={form.telefone} onChange={set("telefone")} placeholder="(00) 00000-0000" /></div>
                <div className="sm:col-span-2"><label className={labelCls}>Email</label><input type="email" className={inputCls} value={form.email} onChange={set("email")} placeholder="voce@email.com" /></div>
              </div>
            </section>

            <section>
              <h3 className="font-display text-lg font-semibold mb-4">Endereço de entrega</h3>
              <div className="grid sm:grid-cols-6 gap-4">
                <div className="sm:col-span-4"><label className={labelCls}>Rua</label><input className={inputCls} value={form.rua} onChange={set("rua")} /></div>
                <div className="sm:col-span-2"><label className={labelCls}>Número</label><input className={inputCls} value={form.numero} onChange={set("numero")} /></div>
                <div className="sm:col-span-3"><label className={labelCls}>Bairro</label><input className={inputCls} value={form.bairro} onChange={set("bairro")} /></div>
                <div className="sm:col-span-3"><label className={labelCls}>Complemento</label><input className={inputCls} value={form.complemento} onChange={set("complemento")} placeholder="Opcional" /></div>
                <div className="sm:col-span-3"><label className={labelCls}>Cidade</label><input className={inputCls} value={form.cidade} onChange={set("cidade")} /></div>
                <div className="sm:col-span-1"><label className={labelCls}>Estado</label><input maxLength={2} className={`${inputCls} uppercase`} value={form.estado} onChange={(e) => setForm((f) => ({ ...f, estado: e.target.value.toUpperCase().slice(0, 2) }))} placeholder="SP" /></div>
                <div className="sm:col-span-2"><label className={labelCls}>CEP</label><input className={inputCls} value={form.cep} onChange={set("cep")} placeholder="00000-000" /></div>
              </div>
            </section>

            <section>
              <h3 className="font-display text-lg font-semibold mb-4">Forma de pagamento</h3>
              <div className="grid grid-cols-3 gap-3">
                {([
                  { id: "cartao", label: "Cartão", icon: CreditCard },
                  { id: "pix", label: "PIX", icon: QrCode },
                  { id: "boleto", label: "Boleto", icon: FileText },
                ] as const).map(({ id, label, icon: Icon }) => (
                  <button
                    key={id}
                    type="button"
                    onClick={() => setPayment(id)}
                    className={`group flex flex-col items-center gap-2 rounded-2xl border-2 p-4 transition ${
                      payment === id
                        ? "border-primary bg-primary/5 shadow-glow"
                        : "border-border hover:border-primary/40"
                    }`}
                  >
                    <Icon className={`h-5 w-5 ${payment === id ? "text-primary" : "text-muted-foreground"}`} />
                    <span className="text-sm font-medium">{label}</span>
                  </button>
                ))}
              </div>

              <div className="mt-5">
                {payment === "cartao" && (
                  <div className="grid sm:grid-cols-2 gap-4 animate-fade-up">
                    <div className="sm:col-span-2"><label className={labelCls}>Número do cartão</label><input className={inputCls} value={form.cardNum} onChange={set("cardNum")} placeholder="0000 0000 0000 0000" /></div>
                    <div className="sm:col-span-2"><label className={labelCls}>Nome no cartão</label><input className={inputCls} value={form.cardName} onChange={set("cardName")} placeholder="Como impresso no cartão" /></div>
                    <div><label className={labelCls}>Validade</label><input className={inputCls} value={form.cardVal} onChange={set("cardVal")} placeholder="MM/AA" /></div>
                    <div><label className={labelCls}>CVV</label><input maxLength={4} className={inputCls} value={form.cardCvv} onChange={(e) => setForm((f) => ({ ...f, cardCvv: e.target.value.replace(/\D/g, "").slice(0, 4) }))} placeholder="000" /></div>
                  </div>
                )}
                {payment === "pix" && (
                  <div className="rounded-2xl bg-secondary/40 border border-secondary p-4 text-sm animate-fade-up">
                    Após finalizar, você receberá o código PIX.
                  </div>
                )}
                {payment === "boleto" && (
                  <div className="rounded-2xl bg-secondary/40 border border-secondary p-4 text-sm animate-fade-up">
                    O boleto será gerado após finalizar a compra.
                  </div>
                )}
              </div>
            </section>

            <button
              type="submit"
              className="w-full inline-flex items-center justify-center gap-2 h-14 rounded-full bg-primary text-primary-foreground font-semibold shadow-glow hover:scale-[1.01] active:scale-[0.99] transition"
            >
              <ShoppingBag className="h-5 w-5" />
              Finalizar compra · R$ {fmt(total)}
            </button>
          </form>
        </div>

        {/* Reviews */}
        <section className="mt-16 md:mt-20">
          <div className="flex items-center gap-3 mb-6">
            <h2 className="font-display text-2xl md:text-3xl font-semibold">Avaliações</h2>
            <Star color="primary" size={18} />
          </div>

          <div className="grid md:grid-cols-3 gap-5">
            {reviews.map((r, i) => (
              <article key={i} className="rounded-3xl bg-background border border-border/60 p-6 shadow-soft">
                <div className="flex items-center gap-1 mb-3">
                  {Array.from({ length: 5 }).map((_, j) => (
                    <Star key={j} color={j < r.stars ? "primary" : "secondary"} size={20} />
                  ))}
                </div>
                <p className="text-sm text-muted-foreground leading-relaxed">"{r.text}"</p>
                <div className="mt-4 flex items-center gap-3 pt-4 border-t border-border/50">
                  <div className="h-9 w-9 rounded-full bg-gradient-to-br from-primary/30 to-secondary grid place-items-center text-xs font-semibold text-primary">
                    {r.name.charAt(0)}
                  </div>
                  <span className="text-sm font-medium">{r.name}</span>
                </div>
              </article>
            ))}
          </div>

          <form onSubmit={submitReview} className="mt-8 rounded-3xl bg-background border border-border/60 p-6 md:p-8 shadow-soft">
            <h3 className="font-display text-lg font-semibold mb-4">Deixe sua avaliação</h3>
            {user ? (
              <div className="mb-4 inline-flex items-center gap-2 text-xs text-muted-foreground">
                <UserCircle2 className="h-4 w-4 text-primary" />
                Publicando como{" "}
                <span className="font-semibold text-foreground">
                  {profileName || user.email}
                </span>
              </div>
            ) : (
              <div className="mb-4 flex flex-wrap items-center gap-3 rounded-xl bg-secondary/40 border border-secondary px-4 py-3 text-xs">
                <Lock className="h-3.5 w-3.5 text-primary" />
                <span>Entre na sua conta para deixar uma avaliação.</span>
                <button
                  type="button"
                  onClick={openAuth}
                  className="ml-auto inline-flex items-center justify-center h-8 px-3 rounded-full bg-primary text-primary-foreground text-xs font-semibold hover:opacity-90 transition"
                >
                  Entrar
                </button>
              </div>
            )}
            <div className="mb-4">
              <label className={labelCls}>Sua nota</label>
              <div className="flex items-center gap-1 h-11">
                {Array.from({ length: 5 }).map((_, i) => {
                  const n = i + 1;
                  return (
                    <button key={n} type="button" onClick={() => setNewStars(n)} aria-label={`${n} estrelas`} className="p-1 hover:scale-110 transition">
                      <Star color={n <= newStars ? "primary" : "secondary"} size={28} />
                    </button>
                  );
                })}
              </div>
            </div>
            <label className={labelCls}>Comentário</label>
            <textarea
              value={newReview}
              onChange={(e) => setNewReview(e.target.value)}
              rows={3}
              placeholder="Conte como foi sua experiência..."
              className="w-full rounded-xl border border-border bg-background p-4 text-sm outline-none focus:border-primary/60 focus:ring-2 focus:ring-primary/20 transition resize-none"
            />
            <button type="submit" className="mt-4 inline-flex items-center justify-center h-11 px-6 rounded-full bg-primary text-primary-foreground text-sm font-semibold hover:opacity-90 transition">
              Enviar avaliação
            </button>
          </form>
        </section>
      </main>

      {success && (
        <div className="fixed inset-0 z-50 grid place-items-center bg-background/80 backdrop-blur-md animate-fade-up">
          <div className="mx-4 max-w-md w-full rounded-3xl bg-background border border-border p-8 md:p-10 shadow-glow text-center">
            <div className="mx-auto h-16 w-16 rounded-full bg-primary/10 grid place-items-center mb-4">
              <CheckCircle2 className="h-10 w-10 text-primary" />
            </div>
            <h2 className="font-display text-2xl font-semibold">Compra realizada com sucesso!</h2>
            <p className="mt-2 text-sm text-muted-foreground">
              Obrigado pela sua compra. Você será redirecionada para a página inicial em instantes.
            </p>
            <div className="mt-5 h-1 w-full overflow-hidden rounded-full bg-secondary">
              <div className="h-full bg-primary animate-[loading_2.4s_linear_forwards]" style={{ width: "100%" }} />
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
