import { Link, useNavigate, useRouterState } from "@tanstack/react-router";
import { Bookmark, Library, Search, Waypoints, WholeWord } from "lucide-react";
import { useEffect, useState, type FormEvent, type ReactNode } from "react";
import { cn } from "@/lib/utils";
import { warmFamilyIndex } from "@/lib/family-index";

const NAV = [
  { to: "/lexicon", label: "词库", icon: WholeWord },
  { to: "/roots", label: "词根", icon: Waypoints },
  { to: "/library", label: "书册", icon: Library },
  { to: "/saved", label: "收藏", icon: Bookmark },
] as const;

export function Shell({ children }: { children: ReactNode }) {
  const [q, setQ] = useState("");
  const navigate = useNavigate();
  const pathname = useRouterState({ select: (s) => s.location.pathname });

  useEffect(() => {
    warmFamilyIndex();
  }, []);

  function onSearch(e: FormEvent) {
    e.preventDefault();
    const query = q.trim();
    if (!query) {
      void navigate({ to: "/lexicon", search: { q: "", src: "", letter: "" } });
      return;
    }
    void navigate({ to: "/lexicon", search: { q: query, src: "", letter: "" } });
  }

  return (
    <div className="min-h-dvh bg-bg text-fg">
      <header className="sticky top-0 z-30 border-b border-border bg-bg/92 backdrop-blur-sm">
        <div className="mx-auto flex max-w-6xl items-center gap-3 px-4 py-3 sm:px-6">
          <Link
            to="/"
            className="shrink-0 leading-none rounded-sm px-1 py-1 active:opacity-70"
          >
            <span className="font-display text-2xl font-medium tracking-tight text-fg">
              本源
            </span>
            <span className="ml-2 hidden font-display text-xs tracking-[0.28em] text-muted uppercase sm:inline">
              Arche
            </span>
          </Link>
          <nav className="ml-2 hidden items-center gap-1 md:flex">
            {NAV.map((item) => {
              const active = pathname === item.to || pathname.startsWith(item.to + "/");
              return (
                <Link
                  key={item.to}
                  to={item.to}
                  className={cn(
                    "rounded-sm px-3 py-2 text-sm transition-[color,background-color] duration-75",
                    active
                      ? "text-fg bg-raised"
                      : "text-muted hover:text-fg hover:bg-raised/70 active:bg-raised",
                  )}
                >
                  {item.label}
                </Link>
              );
            })}
          </nav>
          <form onSubmit={onSearch} className="ml-auto flex min-w-0 flex-1 max-w-sm items-center">
            <label className="relative w-full">
              <Search className="pointer-events-none absolute top-1/2 left-3 size-4 -translate-y-1/2 text-faint" />
              <input
                value={q}
                onChange={(e) => setQ(e.target.value)}
                placeholder="检索一个词…"
                className="h-11 w-full rounded-md bg-surface pr-3 pl-10 text-sm text-fg shadow-[var(--shadow-border)] outline-none placeholder:text-faint focus:shadow-[var(--shadow-focus)]"
              />
            </label>
          </form>
        </div>
      </header>
      <main className="mx-auto w-full max-w-6xl px-4 py-8 sm:px-6 sm:py-12">{children}</main>
      <nav className="fixed right-0 bottom-0 left-0 z-30 grid grid-cols-4 border-t border-border bg-bg/94 backdrop-blur-sm md:hidden">
        {NAV.map((item) => {
          const Icon = item.icon;
          const active = pathname === item.to || pathname.startsWith(item.to + "/");
          return (
            <Link
              key={item.to}
              to={item.to}
              className={cn(
                "flex min-h-14 flex-col items-center justify-center gap-1 text-[11px] transition-colors duration-75",
                active ? "text-fg" : "text-muted active:text-fg",
              )}
            >
              <Icon className="size-4" strokeWidth={1.75} />
              {item.label}
            </Link>
          );
        })}
      </nav>
      <div className="h-16 md:hidden" />
    </div>
  );
}
