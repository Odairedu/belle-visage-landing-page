import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { useEffect, useMemo, useState } from "react";
import {
  Package,
  TrendingUp,
  DollarSign,
  Clock,
  Truck,
  Ticket,
  ArrowLeft,
  AlertCircle,
  CheckCircle2,
  Sparkles,
} from "lucide-react";
import { Logo } from "@/components/Logo";
import { Star } from "@/components/Star";
import productImage from "@/assets/belle-visage-product.png";
import { useAuth } from "@/components/auth/AuthProvider";
import { Button } from "@/components/ui/button";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { toast } from "sonner";

const ADMIN_EMAIL = "bellevisage@gmail.com";

export const Route = createFileRoute("/admin")({
  head: () => ({
    meta: [
      { title: "Página do admin — Belle Visage" },
      { name: "description", content: "Painel de estoque e vendas Belle Visage." },
      { name: "robots", content: "noindex, nofollow" },
    ],
  }),
  component: AdminPage,
});

type Order = {
  id: string;
  customer: string;
  status: "Pendente" | "Pago" | "Enviado" | "Entregue";
  payment: "Cartão" | "PIX" | "Boleto";
  date: string;
  amount: number;
};

const orders: Order[] = [
  { id: "#1042", customer: "Mariana Souza", status: "Entregue", payment: "PIX", date: "08/05/2026", amount: 89.9 },
  { id: "#1041", customer: "Juliana Pereira", status: "Enviado", payment: "Cartão", date: "07/05/2026", amount: 109.9 },
  { id: "#1040", customer: "Carolina Lima", status: "Pago", payment: "Cartão", date: "07/05/2026", amount: 89.9 },
  { id: "#1039", customer: "Beatriz Almeida", status: "Pendente", payment: "Boleto", date: "06/05/2026", amount: 89.9 },
  { id: "#1038", customer: "Larissa Costa", status: "Entregue", payment: "PIX", date: "05/05/2026", amount: 179.8 },
  { id: "#1037", customer: "Patrícia Rocha", status: "Entregue", payment: "Cartão", date: "04/05/2026", amount: 89.9 },
];

function formatBRL(v: number) {
  return v.toLocaleString("pt-BR", { style: "currency", currency: "BRL" });
}

function statusColor(s: Order["status"]) {
  switch (s) {
    case "Pendente": return "bg-secondary text-secondary-foreground";
    case "Pago": return "bg-primary/15 text-primary";
    case "Enviado": return "bg-primary/25 text-primary";
    case "Entregue": return "bg-emerald-100 text-emerald-700";
  }
}

function AdminPage() {
  const { user, loading, openAuth } = useAuth();
  const navigate = useNavigate();
  const [stock, setStock] = useState(22);
  const stockMax = 100;

  useEffect(() => {
    if (!loading && (!user || user.email?.toLowerCase() !== ADMIN_EMAIL)) {
      // Not admin: kick out
      if (!user) openAuth();
      else navigate({ to: "/" });
    }
  }, [user, loading, navigate, openAuth]);

  const stockPct = (stock / stockMax) * 100;
  const stockLevel = stockPct >= 60 ? "high" : stockPct >= 30 ? "medium" : "low";
  const stockStatus = useMemo(() => {
    if (stockLevel === "high")
      return { label: "Estoque saudável", color: "text-emerald-700 bg-emerald-100", dot: "bg-emerald-500" };
    if (stockLevel === "medium")
      return { label: "Atenção ao estoque", color: "text-amber-700 bg-amber-100", dot: "bg-amber-500" };
    return { label: "Reposição necessária", color: "text-red-700 bg-red-100", dot: "bg-red-500" };
  }, [stockLevel]);

  const totalSold = 78;
  const revenue = orders.reduce((acc, o) => acc + o.amount, 0) + 5400;
  const pending = orders.filter((o) => o.status === "Pendente").length;
  const delivered = orders.filter((o) => o.status === "Entregue").length;
  const couponsUsed = 34;

  const restockDisabled = stockLevel === "high";

  if (loading || !user || user.email?.toLowerCase() !== ADMIN_EMAIL) {
    return (
      <div className="min-h-screen grid place-items-center bg-background">
        <p className="text-muted-foreground">Verificando acesso…</p>
      </div>
    );
  }

  return (
    <TooltipProvider>
      <div className="min-h-screen bg-gradient-to-br from-primary/15 via-background to-secondary/30">
        {/* Header */}
        <header className="backdrop-blur-xl bg-background/70 border-b border-border/60 sticky top-0 z-40">
          <div className="mx-auto max-w-7xl px-4 md:px-8 h-16 md:h-20 flex items-center gap-4">
            <Link to="/" className="shrink-0">
              <Logo />
            </Link>
            <div className="hidden md:flex items-center gap-2 ml-4 px-3 py-1 rounded-full bg-primary/10 text-primary text-xs font-semibold">
              <Sparkles className="h-3.5 w-3.5" /> Página do admin
            </div>
            <div className="ml-auto flex items-center gap-3">
              <span className="hidden sm:block text-sm text-muted-foreground">
                {user.email}
              </span>
              <Link
                to="/"
                className="inline-flex items-center gap-2 px-3 py-2 rounded-full text-sm font-medium border border-border hover:bg-muted transition"
              >
                <ArrowLeft className="h-4 w-4" /> Voltar ao site
              </Link>
            </div>
          </div>
        </header>

        <main className="mx-auto max-w-7xl px-4 md:px-8 py-8 md:py-12 space-y-8">
          {/* Title */}
          <div className="flex items-center gap-3">
            <Star color="secondary" size={18} />
            <h1 className="font-display text-3xl md:text-4xl font-semibold text-primary">
              Estoque e Dashboard
            </h1>
            <Star color="primary" size={18} />
          </div>

          {/* KPI cards */}
          <section className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-3 md:gap-4">
            <KpiCard icon={<Package className="h-5 w-5" />} label="Estoque atual" value={`${stock}/${stockMax}`} tone="primary" />
            <KpiCard icon={<TrendingUp className="h-5 w-5" />} label="Total vendido" value={`${totalSold}`} tone="secondary" />
            <KpiCard icon={<DollarSign className="h-5 w-5" />} label="Receita total" value={formatBRL(revenue)} tone="primary" />
            <KpiCard icon={<Clock className="h-5 w-5" />} label="Pedidos pendentes" value={`${pending}`} tone="secondary" />
            <KpiCard icon={<Truck className="h-5 w-5" />} label="Pedidos entregues" value={`${delivered}`} tone="primary" />
            <KpiCard icon={<Ticket className="h-5 w-5" />} label="Cupons usados" value={`${couponsUsed}`} tone="secondary" />
          </section>

          {/* Stock + Reports */}
          <section className="grid lg:grid-cols-3 gap-6">
            {/* Product stock */}
            <div className="lg:col-span-2 rounded-3xl bg-card border border-border/60 p-6 md:p-8 shadow-[0_10px_40px_-20px_rgba(138,124,255,0.35)]">
              <div className="flex items-start gap-5">
                <div className="h-24 w-24 md:h-28 md:w-28 rounded-2xl bg-gradient-to-br from-primary/20 to-secondary/40 grid place-items-center shrink-0">
                  <Sparkles className="h-10 w-10 text-primary" />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-xs uppercase tracking-wider text-muted-foreground">Produto</p>
                  <h2 className="font-display text-xl md:text-2xl font-semibold text-foreground">
                    Belle Visage – Spray para espinhas
                  </h2>
                  <p className="mt-1 text-sm text-muted-foreground">
                    {stock} de {stockMax} unidades disponíveis
                  </p>
                  <div className="mt-3 flex items-center gap-2">
                    <span className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold ${stockStatus.color}`}>
                      <span className={`h-2 w-2 rounded-full ${stockStatus.dot}`} />
                      {stockStatus.label}
                    </span>
                  </div>
                </div>
              </div>

              {/* Progress */}
              <div className="mt-6">
                <div className="h-3 w-full rounded-full bg-muted overflow-hidden">
                  <div
                    className={`h-full rounded-full transition-all ${
                      stockLevel === "high"
                        ? "bg-emerald-500"
                        : stockLevel === "medium"
                          ? "bg-amber-500"
                          : "bg-red-500"
                    }`}
                    style={{ width: `${stockPct}%` }}
                  />
                </div>
                <div className="mt-2 flex justify-between text-xs text-muted-foreground">
                  <span>0</span><span>50</span><span>100</span>
                </div>
              </div>

              {/* Restock */}
              <div className="mt-6 flex flex-wrap items-center gap-3">
                <Tooltip>
                  <TooltipTrigger asChild>
                    <span>
                      <Button
                        disabled={restockDisabled}
                        onClick={() => {
                          setStock(stockMax);
                          toast.success("Reposição solicitada com sucesso!");
                        }}
                        className="rounded-full"
                      >
                        Solicitar reposição
                      </Button>
                    </span>
                  </TooltipTrigger>
                  {restockDisabled && (
                    <TooltipContent>
                      Reposição indisponível porque o estoque ainda está alto
                    </TooltipContent>
                  )}
                </Tooltip>
                <Button
                  variant="outline"
                  onClick={() => setStock((s) => Math.max(0, s - 5))}
                  className="rounded-full"
                >
                  Simular venda (-5)
                </Button>
                {restockDisabled && (
                  <p className="text-xs text-muted-foreground inline-flex items-center gap-1">
                    <AlertCircle className="h-3.5 w-3.5" />
                    Reposição indisponível porque o estoque ainda está alto
                  </p>
                )}
              </div>
            </div>

            {/* Coupon report */}
            <div className="rounded-3xl bg-card border border-border/60 p-6 shadow-[0_10px_40px_-20px_rgba(138,124,255,0.25)]">
              <h3 className="font-display text-lg font-semibold text-primary flex items-center gap-2">
                <Ticket className="h-5 w-5" /> Cupons
              </h3>
              <ul className="mt-4 space-y-3 text-sm">
                <CouponRow label="Cupom usado" value="34 vezes" />
                <CouponRow label="Pedidos com desconto" value="29" />
                <CouponRow label="Cupons ativos" value="2" />
                <CouponRow label="Cupons expirados" value="3" />
              </ul>
            </div>
          </section>

          {/* Sales / Orders summary */}
          <section className="grid sm:grid-cols-2 lg:grid-cols-5 gap-3 md:gap-4">
            <ReportCard label="Último pedido" value={orders[0].id} sub={orders[0].customer} />
            <ReportCard label="Pedidos pendentes" value={`${pending}`} sub="Aguardando pagamento" />
            <ReportCard label="Pedidos entregues" value={`${delivered}`} sub="Concluídos" />
            <ReportCard label="Quantidade vendida" value={`${totalSold}`} sub="Unidades" />
            <ReportCard label="Receita total" value={formatBRL(revenue)} sub="Acumulado" />
          </section>

          {/* Orders list */}
          <section className="rounded-3xl bg-card border border-border/60 p-6 md:p-8 shadow-[0_10px_40px_-20px_rgba(138,124,255,0.25)]">
            <div className="flex items-center justify-between mb-4">
              <h3 className="font-display text-lg md:text-xl font-semibold text-primary">
                Pedidos recentes
              </h3>
              <span className="text-xs text-muted-foreground">{orders.length} pedidos</span>
            </div>

            <div className="overflow-x-auto -mx-2">
              <table className="w-full text-sm">
                <thead>
                  <tr className="text-left text-xs uppercase tracking-wider text-muted-foreground">
                    <th className="px-2 py-3">Pedido</th>
                    <th className="px-2 py-3">Cliente</th>
                    <th className="px-2 py-3">Status</th>
                    <th className="px-2 py-3 hidden sm:table-cell">Pagamento</th>
                    <th className="px-2 py-3 hidden md:table-cell">Data</th>
                    <th className="px-2 py-3 text-right">Valor</th>
                  </tr>
                </thead>
                <tbody>
                  {orders.map((o) => (
                    <tr
                      key={o.id}
                      className="border-t border-border/60 hover:bg-muted/40 transition-colors"
                    >
                      <td className="px-2 py-3 font-medium text-foreground">{o.id}</td>
                      <td className="px-2 py-3">
                        <div className="flex items-center gap-2">
                          <div className="h-7 w-7 rounded-full bg-primary/15 text-primary grid place-items-center text-xs font-semibold">
                            {o.customer.charAt(0)}
                          </div>
                          <span className="text-foreground">{o.customer}</span>
                        </div>
                      </td>
                      <td className="px-2 py-3">
                        <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium ${statusColor(o.status)}`}>
                          {o.status === "Entregue" && <CheckCircle2 className="h-3 w-3" />}
                          {o.status}
                        </span>
                      </td>
                      <td className="px-2 py-3 hidden sm:table-cell text-muted-foreground">{o.payment}</td>
                      <td className="px-2 py-3 hidden md:table-cell text-muted-foreground">{o.date}</td>
                      <td className="px-2 py-3 text-right font-medium">{formatBRL(o.amount)}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </section>
        </main>
      </div>
    </TooltipProvider>
  );
}

function KpiCard({
  icon, label, value, tone,
}: { icon: React.ReactNode; label: string; value: string; tone: "primary" | "secondary" }) {
  const bg = tone === "primary" ? "bg-primary text-primary-foreground" : "bg-secondary text-secondary-foreground";
  return (
    <div className="rounded-2xl bg-card border border-border/60 p-4 hover:shadow-[0_10px_30px_-15px_rgba(138,124,255,0.4)] transition-shadow">
      <div className={`h-9 w-9 rounded-xl grid place-items-center ${bg}`}>{icon}</div>
      <p className="mt-3 text-xs text-muted-foreground">{label}</p>
      <p className="mt-1 font-display text-xl font-semibold text-foreground">{value}</p>
    </div>
  );
}

function ReportCard({ label, value, sub }: { label: string; value: string; sub?: string }) {
  return (
    <div className="rounded-2xl bg-card border border-border/60 p-4">
      <p className="text-xs text-muted-foreground">{label}</p>
      <p className="mt-1 font-display text-lg font-semibold text-primary">{value}</p>
      {sub && <p className="text-xs text-muted-foreground mt-0.5">{sub}</p>}
    </div>
  );
}

function CouponRow({ label, value }: { label: string; value: string }) {
  return (
    <li className="flex items-center justify-between py-2 px-3 rounded-xl bg-muted/40">
      <span className="text-muted-foreground">{label}</span>
      <span className="font-semibold text-foreground">{value}</span>
    </li>
  );
}
