import { createFileRoute, Link } from "@tanstack/react-router";
import { allRoots } from "@/lib/etymology/analyze";
import { KERNELS } from "@/lib/etymology/philosophy";

export const Route = createFileRoute("/roots/")({ component: RootsPage });

function RootsPage() {
  const roots = allRoots();
  return (
    <div>
      <header className="enter max-w-2xl">
        <p className="text-xs tracking-[0.22em] text-faint uppercase">Roots</p>
        <h1 className="mt-2 font-display text-4xl sm:text-5xl">词根</h1>
        <p className="mt-3 text-muted">
          印欧语、拉丁语与希腊语里最能生产英语的那些核。点进去，看它在词库里长成了哪些词。
        </p>
      </header>
      <div className="enter-2 mt-10 grid gap-3 sm:grid-cols-2">
        {roots.map((r) => (
          <Link
            key={r.id}
            to="/roots/$rootId"
            params={{ rootId: r.id }}
            className="rounded-lg bg-surface p-5 shadow-[var(--shadow-border)] transition-[background-color,transform] duration-75 ease-out hover:bg-raised active:scale-[0.99] active:bg-raised"
          >
            <div className="font-display text-2xl text-fg">{r.form}</div>
            <div className="mt-1 text-sm text-muted">
              {r.gloss}
              <span className="ml-2 text-faint">{KERNELS[r.kernel]?.name}</span>
            </div>
            <p className="mt-3 line-clamp-2 text-sm leading-6 text-faint">{r.note}</p>
          </Link>
        ))}
      </div>
    </div>
  );
}
