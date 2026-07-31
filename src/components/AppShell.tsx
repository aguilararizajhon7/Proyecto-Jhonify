import { Link, useNavigate } from "@tanstack/react-router";
import { Home, Library, Heart, User, Moon, Sun, LogOut, Search } from "lucide-react";
import { useTheme } from "@/lib/theme";
import { Logo } from "@/components/Logo";
import { PlayerBar } from "@/components/PlayerBar";
import { GlobalPlayer } from "@/components/GlobalPlayer";
import { supabase } from "@/integrations/supabase/client";
import { usePlayer } from "@/lib/player";
import type { ReactNode } from "react";

const navItems = [
  { to: "/home", label: "Inicio", icon: Search },
  { to: "/library", label: "Biblioteca", icon: Library },
  { to: "/favorites", label: "Favoritos", icon: Heart },
  { to: "/profile", label: "Perfil", icon: User },
] as const;

export function AppShell({ children }: { children: ReactNode }) {
  const { theme, toggle } = useTheme();
  const navigate = useNavigate();
  const { current } = usePlayer();

  async function signOut() {
    await supabase.auth.signOut();
    navigate({ to: "/auth" });
  }

  return (
    <div className="min-h-screen bg-background text-foreground md:flex">
      {/* Desktop sidebar */}
      <aside className="sticky top-0 hidden h-screen w-60 shrink-0 flex-col border-r border-border bg-surface-elevated px-4 py-6 md:flex">
        <Link to="/home" className="mb-8 flex justify-center">
          <Logo size="lg" className="[&_img]:h-28 [&_img]:w-28 sm:[&_img]:h-28 sm:[&_img]:w-28" />
        </Link>
        <nav className="flex flex-col gap-1">
          {navItems.map(({ to, label, icon: Icon }) => (
            <Link
              key={to}
              to={to}
              activeProps={{ className: "bg-primary/15 text-primary" }}
              inactiveProps={{ className: "text-muted-foreground" }}
              className="flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium transition hover:bg-muted hover:text-foreground"
            >
              <Icon className="h-5 w-5 shrink-0" />
              {label}
            </Link>
          ))}
        </nav>
        <div className="mt-auto flex flex-col gap-1 pt-6">
          <button
            onClick={toggle}
            className="flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium text-muted-foreground transition hover:bg-muted hover:text-foreground"
          >
            {theme === "dark" ? <Sun className="h-5 w-5" /> : <Moon className="h-5 w-5" />}
            {theme === "dark" ? "Tema claro" : "Tema oscuro"}
          </button>
          <button
            onClick={signOut}
            className="flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium text-muted-foreground transition hover:bg-muted hover:text-foreground"
          >
            <LogOut className="h-5 w-5" />
            Cerrar sesión
          </button>
        </div>
      </aside>

      <div className="min-w-0 flex-1">
        {/* Mobile header */}
        <header className="sticky top-0 z-30 border-b border-border bg-surface/80 backdrop-blur md:hidden">
          <div className="mx-auto flex max-w-5xl items-center justify-between p-4">
            <Link to="/home">
              <Logo />
            </Link>
            <div className="flex items-center gap-2">
              <button
                onClick={toggle}
                aria-label="Cambiar tema"
                className="rounded-full p-2 hover:bg-muted"
              >
                {theme === "dark" ? <Sun className="h-5 w-5" /> : <Moon className="h-5 w-5" />}
              </button>
              <button
                onClick={signOut}
                aria-label="Cerrar sesión"
                className="rounded-full p-2 hover:bg-muted"
              >
                <LogOut className="h-5 w-5" />
              </button>
            </div>
          </div>
        </header>

        <main
          className={`mx-auto max-w-5xl px-4 py-6 md:px-8 ${current ? "pb-44 md:pb-32" : "pb-24 md:pb-10"}`}
        >
          {children}
        </main>
      </div>

      {/* Mobile bottom nav */}
      <nav className="fixed bottom-0 left-0 right-0 z-50 border-t border-border bg-surface-elevated md:hidden">
        <div className="mx-auto grid max-w-5xl grid-cols-4">
          {navItems.map(({ to, label, icon: Icon }) => (
            <Link
              key={to}
              to={to}
              activeProps={{ className: "text-primary" }}
              inactiveProps={{ className: "text-muted-foreground" }}
              className="flex flex-col items-center gap-1 py-3 text-xs font-medium hover:text-primary"
            >
              <Icon className="h-5 w-5" />
              {label}
            </Link>
          ))}
        </div>
      </nav>


      <PlayerBar />
      <GlobalPlayer />
    </div>
  );
}

export function BlueButton({
  children,
  className = "",
  ...props
}: React.ButtonHTMLAttributes<HTMLButtonElement>) {
  return (
    <button
      {...props}
      className={`inline-flex h-11 items-center justify-center rounded-lg bg-primary px-5 text-sm font-semibold text-primary-foreground shadow-md transition hover:bg-primary-hover focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary disabled:opacity-60 ${className}`}
    >
      {children}
    </button>
  );
}

export function Input(props: React.InputHTMLAttributes<HTMLInputElement>) {
  return (
    <input
      {...props}
      className={`h-11 w-full rounded-lg border border-border bg-input px-4 text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring ${props.className ?? ""}`}
    />
  );
}
