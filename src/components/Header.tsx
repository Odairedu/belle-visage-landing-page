import { Search, User, Menu, LogOut, ClipboardList } from "lucide-react";
import { Link } from "@tanstack/react-router";
import { Logo } from "./Logo";
import { useAuth } from "./auth/AuthProvider";

const ADMIN_EMAIL = "bellevisage@gmail.com";

export function Header() {
  const { user, openAuth, signOut } = useAuth();
  const isAdmin = user?.email?.toLowerCase() === ADMIN_EMAIL;
  return (
    <header className="fixed top-0 left-0 right-0 z-50 backdrop-blur-xl bg-background/70 border-b border-border/60">
      <div className="mx-auto max-w-7xl px-4 md:px-8 h-16 md:h-20 flex items-center gap-4 md:gap-8">
        <a href="#top" className="shrink-0">
          <Logo />
        </a>

        <nav className="hidden md:flex items-center gap-6 text-sm font-medium text-muted-foreground">
          <a href="#produto" className="hover:text-primary transition-colors">Produto</a>
          <a href="#beneficios" className="hover:text-primary transition-colors">Benefícios</a>
          <a href="#marca" className="hover:text-primary transition-colors">A Marca</a>
          <Link to="/suporte" className="hover:text-primary transition-colors" activeProps={{ className: "text-primary font-semibold" }}>Suporte</Link>
        </nav>

        <div className="flex-1 hidden sm:flex max-w-md mx-auto">
          <div className="w-full relative">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <input
              type="search"
              placeholder="Buscar produtos..."
              className="w-full h-10 rounded-full bg-muted/60 pl-11 pr-4 text-sm outline-none border border-transparent focus:border-primary/40 focus:bg-background transition"
            />
          </div>
        </div>

        <div className="flex items-center gap-1 md:gap-2 ml-auto">
          <button className="sm:hidden p-2 rounded-full hover:bg-muted transition" aria-label="Buscar">
            <Search className="h-5 w-5" />
          </button>
          {user ? (
            <button
              onClick={() => signOut()}
              className="p-2 rounded-full hover:bg-muted transition"
              aria-label="Sair"
              title={user.email ?? "Sair"}
            >
              <LogOut className="h-5 w-5" />
            </button>
          ) : (
            <button
              onClick={openAuth}
              className="p-2 rounded-full hover:bg-muted transition"
              aria-label="Conta"
            >
              <User className="h-5 w-5" />
            </button>
          )}
          {isAdmin && (
            <Link
              to="/admin"
              className="p-2 rounded-full hover:bg-muted transition text-primary"
              aria-label="Painel do admin"
              title="Página do admin"
            >
              <ClipboardList className="h-5 w-5" />
            </Link>
          )}
          <button className="md:hidden p-2 rounded-full hover:bg-muted transition" aria-label="Menu">
            <Menu className="h-5 w-5" />
          </button>
        </div>
      </div>
    </header>
  );
}
