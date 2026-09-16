import { createFileRoute, Link } from "@tanstack/react-router";
import { SOURCE_COUNTS, SOURCE_IDS, SOURCE_META } from "@/lib/lexicon";

type Search = { src: string };

export const Route = createFileRoute("/library")({
  validateSearch: (s: Record<string, unknown>): Search => ({
    src: typeof s.src === "string" ? s.src : "",
  }),
  component: LibraryPage,
});

function LibraryPage() {
  const { src } = Route.useSearch();
  return (
    <div>
      <header className="enter max-w-2xl">
        <p className="text-xs tracking-[0.22em] text-faint uppercase">Library</p>
        <h1 className="mt-2 font-display text-4xl sm:text-5xl">书册</h1>
        <p className="mt-3 text-muted">
          五部词表被拆开又重新并上。溯源不按考试级别停止——级别只说明这词曾经被要求记住。
        </p>
      </header>
      <div className="enter-2 mt-10 space-y-4">
        {SOURCE_IDS.map((id) => {
          const meta = SOURCE_META[id];
          const active = src === id;
          return (
            <Link
              key={id}
              to="/lexicon"
              search={{ q: "", src: id, letter: "" }}
              className={`block rounded-xl bg-surface p-6 shadow-[var(--shadow-border)] transition-[background-color,transform] duration-75 ease-out hover:bg-raised active:scale-[0.99] active:bg-raised ${active ? "ring-1 ring-border-strong" : ""}`}
            >
              <div className="text-xs tracking-[0.18em] text-faint uppercase">{meta.short}</div>
              <div className="mt-1 font-display text-3xl text-fg">{meta.name}</div>
              <p className="mt-2 text-sm text-muted">{meta.blurb}</p>
              <p className="mt-4 text-sm tabular-nums text-faint">{SOURCE_COUNTS[id].toLocaleString()} 词</p>
            </Link>
          );
        })}
      </div>
    </div>
  );
}
