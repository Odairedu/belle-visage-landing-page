import { Logo } from "./Logo";

export function Footer() {
  return (
    <footer className="border-t border-border bg-background py-12">
      <div className="mx-auto max-w-7xl px-4 md:px-8 flex flex-col md:flex-row items-center justify-between gap-6">
        <Logo size="sm" />
        <p className="text-sm text-muted-foreground text-center">
          © {new Date().getFullYear()} Belle Visage. Skincare feito com carinho.
        </p>
        <div className="flex gap-5 text-sm text-muted-foreground">
          <a href="#" className="hover:text-primary transition">Privacidade</a>
          <a href="#" className="hover:text-primary transition">Termos</a>
          <a href="#" className="hover:text-primary transition">Contato</a>
        </div>
      </div>
    </footer>
  );
}
