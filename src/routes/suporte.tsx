import { createFileRoute, useNavigate, Link } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { CheckCircle2, MessageCircle, ArrowLeft, Send } from "lucide-react";
import { Logo } from "@/components/Logo";
import { Star } from "@/components/Star";
import { Header } from "@/components/Header";
import { useAuth } from "@/components/auth/AuthProvider";

const ADMIN_EMAIL = "bellevisage@gmail.com";
const MAX_CHARS = 300;

const CLIENTE_CATEGORIES = [
  "Problemas com o site",
  "Problemas com o produto",
  "Problemas com a embalagem",
  "Problemas com o correio",
  "Outros",
];

const ADM_CATEGORIES = [
  "Pedidos não chegam",
  "Problemas de carregamento do site",
  "Problemas com o estoque",
  "Problemas com cupons",
  "Outros",
];

export const Route = createFileRoute("/suporte")({
  head: () => ({
    meta: [
      { title: "Suporte — Belle Visage" },
      { name: "description", content: "Fale com o suporte Belle Visage. Nossa equipe responde em até 72 horas." },
    ],
  }),
  component: SuportePage,
});

function SuportePage() {
  const { user } = useAuth();
  const navigate = useNavigate();
  const isAdmin = user?.email?.toLowerCase() === ADMIN_EMAIL;
  const role: "ADM" | "CLIENTE" = isAdmin ? "ADM" : "CLIENTE";
  const categories = isAdmin ? ADM_CATEGORIES : CLIENTE_CATEGORIES;

  const [category, setCategory] = useState(categories[0]);
  const [message, setMessage] = useState("");
  const [sent, setSent] = useState(false);

  useEffect(() => {
    setCategory(categories[0]);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isAdmin]);

  useEffect(() => {
    if (!sent) return;
    const t = setTimeout(() => navigate({ to: "/" }), 4500);
    return () => clearTimeout(t);
  }, [sent, navigate]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!message.trim()) return;
    setSent(true);
  };

  return (
    <div className="min-h-screen bg-background">
      <Header />

      <main className="pt-24 md:pt-28 pb-20 px-4 md:px-8">
        <div className="mx-auto max-w-2xl">
          <Link
            to="/"
            className="inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-primary transition mb-6"
          >
            <ArrowLeft className="h-4 w-4" />
            Voltar para a loja
          </Link>

          {!sent ? (
            <div className="relative">
              <Star color="secondary" size={28} className="absolute -top-4 -left-3 opacity-70" />
              <Star color="primary" size={20} className="absolute -top-2 right-6 opacity-60" />

              <div className="rounded-3xl bg-card border border-border/60 shadow-[0_10px_40px_-12px_rgba(138,124,255,0.25)] p-6 md:p-10">
                <div className="flex items-center gap-3 mb-2">
                  <div className="h-10 w-10 rounded-2xl bg-primary/10 text-primary flex items-center justify-center">
                    <MessageCircle className="h-5 w-5" />
                  </div>
                  <span
                    className={`text-[10px] font-bold tracking-widest px-2.5 py-1 rounded-full ${
                      isAdmin
                        ? "bg-primary text-primary-foreground"
                        : "bg-secondary text-secondary-foreground"
                    }`}
                  >
                    {role}
                  </span>
                </div>

                <h1 className="font-display text-3xl md:text-4xl font-semibold text-primary tracking-tight">
                  Suporte Belle Visage
                </h1>
                <p className="mt-2 text-muted-foreground">
                  Conte para a gente o que aconteceu. Nossa equipe lê cada mensagem com carinho e
                  responde em até 72 horas. ✨
                </p>

                <form onSubmit={handleSubmit} className="mt-8 space-y-6">
                  <div>
                    <label className="block text-sm font-medium mb-2">Categoria</label>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                      {categories.map((c) => {
                        const active = c === category;
                        return (
                          <button
                            type="button"
                            key={c}
                            onClick={() => setCategory(c)}
                            className={`text-left text-sm px-4 py-3 rounded-2xl border transition-all ${
                              active
                                ? "border-primary bg-primary/10 text-primary font-medium shadow-sm"
                                : "border-border bg-background hover:border-primary/40 hover:bg-muted/40"
                            }`}
                          >
                            {c}
                          </button>
                        );
                      })}
                    </div>
                  </div>

                  <div>
                    <label htmlFor="msg" className="block text-sm font-medium mb-2">
                      Sua mensagem
                    </label>
                    <textarea
                      id="msg"
                      value={message}
                      onChange={(e) => setMessage(e.target.value.slice(0, MAX_CHARS))}
                      maxLength={MAX_CHARS}
                      rows={6}
                      placeholder="Descreva o problema com o máximo de detalhes possível..."
                      className="w-full rounded-2xl border border-border bg-background px-4 py-3 text-sm outline-none focus:border-primary/60 focus:ring-2 focus:ring-primary/20 transition resize-none"
                    />
                    <div className="mt-1.5 flex justify-end">
                      <span
                        className={`text-xs ${
                          message.length >= MAX_CHARS ? "text-primary font-medium" : "text-muted-foreground"
                        }`}
                      >
                        {message.length}/{MAX_CHARS} caracteres
                      </span>
                    </div>
                  </div>

                  <button
                    type="submit"
                    disabled={!message.trim()}
                    className="w-full inline-flex items-center justify-center gap-2 h-12 rounded-full bg-primary text-primary-foreground font-medium shadow-[0_8px_24px_-8px_rgba(138,124,255,0.6)] hover:opacity-95 active:scale-[0.99] transition disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    <Send className="h-4 w-4" />
                    Enviar mensagem
                  </button>
                </form>
              </div>
            </div>
          ) : (
            <div className="relative animate-in fade-in zoom-in-95 duration-500">
              <Star color="secondary" size={32} className="absolute -top-5 -left-2" />
              <Star color="primary" size={22} className="absolute -top-3 right-8" />
              <Star color="secondary" size={18} className="absolute bottom-6 -right-2 opacity-70" />

              <div className="rounded-3xl bg-card border border-border/60 shadow-[0_10px_40px_-12px_rgba(138,124,255,0.3)] p-8 md:p-12 text-center">
                <div className="mx-auto h-16 w-16 rounded-full bg-primary/10 text-primary flex items-center justify-center mb-5">
                  <CheckCircle2 className="h-8 w-8" />
                </div>
                <Logo size="md" />
                <h2 className="mt-5 font-display text-2xl md:text-3xl font-semibold text-primary">
                  Muito obrigado pela sua reclamação.
                </h2>
                <p className="mt-3 text-muted-foreground">
                  Lamentamos muito pelo problema. Sua mensagem chegou ao nosso suporte e você será
                  respondido em até <strong className="text-foreground">72 horas</strong>.
                </p>
                <p className="mt-6 text-xs text-muted-foreground">
                  Redirecionando para a página inicial...
                </p>
              </div>
            </div>
          )}
        </div>
      </main>
    </div>
  );
}
