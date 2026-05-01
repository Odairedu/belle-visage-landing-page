import { useState } from "react";
import { Eye, EyeOff, Loader2, Mail, Lock, User as UserIcon, Phone, IdCard } from "lucide-react";
import { z } from "zod";
import { toast } from "sonner";
import { Dialog, DialogContent, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "./AuthProvider";

type Tab = "login" | "signup";

// CPF validation (digits + checksum)
function isValidCPF(raw: string) {
  const cpf = raw.replace(/\D/g, "");
  if (cpf.length !== 11 || /^(\d)\1+$/.test(cpf)) return false;
  let sum = 0;
  for (let i = 0; i < 9; i++) sum += parseInt(cpf[i]) * (10 - i);
  let rev = 11 - (sum % 11);
  if (rev >= 10) rev = 0;
  if (rev !== parseInt(cpf[9])) return false;
  sum = 0;
  for (let i = 0; i < 10; i++) sum += parseInt(cpf[i]) * (11 - i);
  rev = 11 - (sum % 11);
  if (rev >= 10) rev = 0;
  return rev === parseInt(cpf[10]);
}

const maskCPF = (v: string) =>
  v.replace(/\D/g, "").slice(0, 11)
    .replace(/(\d{3})(\d)/, "$1.$2")
    .replace(/(\d{3})(\d)/, "$1.$2")
    .replace(/(\d{3})(\d{1,2})$/, "$1-$2");

const maskPhone = (v: string) =>
  v.replace(/\D/g, "").slice(0, 11)
    .replace(/(\d{2})(\d)/, "($1) $2")
    .replace(/(\d{5})(\d)/, "$1-$2");

const loginSchema = z.object({
  email: z.string().trim().email({ message: "Email inválido" }).max(255),
  password: z.string().min(6, { message: "Senha deve ter ao menos 6 caracteres" }).max(72),
});

const signupSchema = z.object({
  full_name: z.string().trim().min(3, { message: "Informe seu nome completo" }).max(120),
  phone: z.string().min(14, { message: "Telefone inválido" }).max(20),
  cpf: z.string().refine((v) => isValidCPF(v), { message: "CPF inválido" }),
  email: z.string().trim().email({ message: "Email inválido" }).max(255),
  password: z.string().min(6, { message: "Senha deve ter ao menos 6 caracteres" }).max(72),
});

export function AuthModal() {
  const { isAuthOpen, closeAuth } = useAuth();
  const [tab, setTab] = useState<Tab>("login");
  const [showPwd, setShowPwd] = useState(false);
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});

  // login
  const [loginEmail, setLoginEmail] = useState("");
  const [loginPwd, setLoginPwd] = useState("");

  // signup
  const [fullName, setFullName] = useState("");
  const [phone, setPhone] = useState("");
  const [cpf, setCpf] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const reset = () => {
    setErrors({});
    setShowPwd(false);
  };

  const switchTab = (t: Tab) => {
    setTab(t);
    reset();
  };

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    reset();
    const parsed = loginSchema.safeParse({ email: loginEmail, password: loginPwd });
    if (!parsed.success) {
      const errs: Record<string, string> = {};
      parsed.error.issues.forEach((i) => (errs[i.path[0] as string] = i.message));
      setErrors(errs);
      return;
    }
    setLoading(true);
    const { error } = await supabase.auth.signInWithPassword(parsed.data);
    setLoading(false);
    if (error) {
      toast.error(error.message === "Invalid login credentials" ? "Email ou senha incorretos" : error.message);
      return;
    }
    toast.success("Bem-vinda de volta!");
    closeAuth();
  };

  const handleSignup = async (e: React.FormEvent) => {
    e.preventDefault();
    reset();
    const parsed = signupSchema.safeParse({ full_name: fullName, phone, cpf, email, password });
    if (!parsed.success) {
      const errs: Record<string, string> = {};
      parsed.error.issues.forEach((i) => (errs[i.path[0] as string] = i.message));
      setErrors(errs);
      return;
    }
    setLoading(true);
    const { error } = await supabase.auth.signUp({
      email: parsed.data.email,
      password: parsed.data.password,
      options: {
        emailRedirectTo: `${window.location.origin}/`,
        data: {
          full_name: parsed.data.full_name,
          phone: parsed.data.phone,
          cpf: parsed.data.cpf,
        },
      },
    });
    setLoading(false);
    if (error) {
      toast.error(error.message);
      return;
    }
    toast.success("Conta criada com sucesso!");
    closeAuth();
  };

  return (
    <Dialog open={isAuthOpen} onOpenChange={(o) => (o ? null : closeAuth())}>
      <DialogContent className="sm:max-w-md p-0 overflow-hidden border-0 shadow-glow rounded-3xl bg-card">
        {/* Decorative header */}
        <div className="relative px-6 pt-8 pb-6 bg-gradient-to-br from-primary to-primary/80 text-primary-foreground">
          <div className="absolute -top-10 -right-10 h-32 w-32 rounded-full bg-secondary/40 blur-2xl" />
          <div className="absolute -bottom-10 -left-10 h-28 w-28 rounded-full bg-secondary/30 blur-2xl" />
          <div className="relative">
            <DialogTitle className="font-display text-3xl font-semibold">
              {tab === "login" ? "Bem-vinda de volta" : "Crie sua conta"}
            </DialogTitle>
            <DialogDescription className="text-primary-foreground/80 mt-1">
              {tab === "login" ? "Entre na sua conta Belle Visage." : "Junte-se ao Belle Visage."}
            </DialogDescription>
          </div>
        </div>

        <div className="px-6 pb-6 pt-5">
          {/* Tabs */}
          <div className="relative grid grid-cols-2 p-1 rounded-full bg-muted mb-6">
            <span
              className="absolute top-1 bottom-1 w-[calc(50%-4px)] rounded-full bg-background shadow-soft transition-all duration-300 ease-out"
              style={{ left: tab === "login" ? "4px" : "calc(50% + 0px)" }}
              aria-hidden
            />
            {(["login", "signup"] as Tab[]).map((t) => (
              <button
                key={t}
                type="button"
                onClick={() => switchTab(t)}
                className={`relative z-10 h-10 rounded-full text-sm font-semibold transition-colors ${
                  tab === t ? "text-foreground" : "text-muted-foreground hover:text-foreground"
                }`}
              >
                {t === "login" ? "Entrar" : "Cadastrar"}
              </button>
            ))}
          </div>

          {/* Forms */}
          <div className="relative">
            {tab === "login" ? (
              <form onSubmit={handleLogin} className="space-y-4 animate-fade-up">
                <Field
                  icon={<Mail className="h-4 w-4" />}
                  label="Email"
                  type="email"
                  value={loginEmail}
                  onChange={setLoginEmail}
                  placeholder="voce@email.com"
                  error={errors.email}
                  autoComplete="email"
                />
                <PasswordField
                  value={loginPwd}
                  onChange={setLoginPwd}
                  show={showPwd}
                  toggle={() => setShowPwd((s) => !s)}
                  error={errors.password}
                  autoComplete="current-password"
                />
                <SubmitButton loading={loading} label="Entrar" />
              </form>
            ) : (
              <form onSubmit={handleSignup} className="space-y-4 animate-fade-up">
                <Field
                  icon={<UserIcon className="h-4 w-4" />}
                  label="Nome completo"
                  value={fullName}
                  onChange={setFullName}
                  placeholder="Seu nome"
                  error={errors.full_name}
                  autoComplete="name"
                />
                <Field
                  icon={<Phone className="h-4 w-4" />}
                  label="Telefone"
                  value={phone}
                  onChange={(v) => setPhone(maskPhone(v))}
                  placeholder="(11) 99999-9999"
                  error={errors.phone}
                  inputMode="tel"
                  autoComplete="tel"
                />
                <Field
                  icon={<IdCard className="h-4 w-4" />}
                  label="CPF"
                  value={cpf}
                  onChange={(v) => setCpf(maskCPF(v))}
                  placeholder="000.000.000-00"
                  error={errors.cpf}
                  inputMode="numeric"
                />
                <Field
                  icon={<Mail className="h-4 w-4" />}
                  label="Email"
                  type="email"
                  value={email}
                  onChange={setEmail}
                  placeholder="voce@email.com"
                  error={errors.email}
                  autoComplete="email"
                />
                <PasswordField
                  value={password}
                  onChange={setPassword}
                  show={showPwd}
                  toggle={() => setShowPwd((s) => !s)}
                  error={errors.password}
                  autoComplete="new-password"
                />
                <SubmitButton loading={loading} label="Criar conta" />
              </form>
            )}
          </div>

          <p className="mt-6 text-center text-xs text-muted-foreground">
            {tab === "login" ? (
              <>Ainda não tem conta?{" "}
                <button onClick={() => switchTab("signup")} className="text-primary font-semibold hover:underline">
                  Cadastre-se
                </button>
              </>
            ) : (
              <>Já tem conta?{" "}
                <button onClick={() => switchTab("login")} className="text-primary font-semibold hover:underline">
                  Entrar
                </button>
              </>
            )}
          </p>
        </div>
      </DialogContent>
    </Dialog>
  );
}

function Field({
  icon, label, value, onChange, error, type = "text", placeholder, autoComplete, inputMode,
}: {
  icon: React.ReactNode; label: string; value: string; onChange: (v: string) => void;
  error?: string; type?: string; placeholder?: string; autoComplete?: string;
  inputMode?: "tel" | "numeric" | "email" | "text";
}) {
  return (
    <div>
      <label className="block text-xs font-semibold text-foreground/80 mb-1.5">{label}</label>
      <div className={`flex items-center gap-2 h-12 rounded-xl border bg-background px-3.5 transition ${error ? "border-destructive" : "border-border focus-within:border-primary/60"}`}>
        <span className="text-muted-foreground">{icon}</span>
        <input
          type={type}
          value={value}
          onChange={(e) => onChange(e.target.value)}
          placeholder={placeholder}
          autoComplete={autoComplete}
          inputMode={inputMode}
          className="flex-1 bg-transparent outline-none text-sm placeholder:text-muted-foreground/60"
        />
      </div>
      {error && <p className="mt-1 text-xs text-destructive">{error}</p>}
    </div>
  );
}

function PasswordField({
  value, onChange, show, toggle, error, autoComplete,
}: {
  value: string; onChange: (v: string) => void; show: boolean; toggle: () => void;
  error?: string; autoComplete?: string;
}) {
  return (
    <div>
      <label className="block text-xs font-semibold text-foreground/80 mb-1.5">Senha</label>
      <div className={`flex items-center gap-2 h-12 rounded-xl border bg-background px-3.5 transition ${error ? "border-destructive" : "border-border focus-within:border-primary/60"}`}>
        <Lock className="h-4 w-4 text-muted-foreground" />
        <input
          type={show ? "text" : "password"}
          value={value}
          onChange={(e) => onChange(e.target.value)}
          placeholder="••••••••"
          autoComplete={autoComplete}
          className="flex-1 bg-transparent outline-none text-sm placeholder:text-muted-foreground/60"
        />
        <button
          type="button"
          onClick={toggle}
          className="text-muted-foreground hover:text-foreground transition"
          aria-label={show ? "Ocultar senha" : "Mostrar senha"}
        >
          {show ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
        </button>
      </div>
      {error && <p className="mt-1 text-xs text-destructive">{error}</p>}
    </div>
  );
}

function SubmitButton({ loading, label }: { loading: boolean; label: string }) {
  return (
    <button
      type="submit"
      disabled={loading}
      className="w-full h-12 rounded-full bg-primary text-primary-foreground font-semibold shadow-glow hover:scale-[1.01] active:scale-[0.99] transition disabled:opacity-60 disabled:cursor-not-allowed flex items-center justify-center gap-2"
    >
      {loading && <Loader2 className="h-4 w-4 animate-spin" />}
      {label}
    </button>
  );
}
