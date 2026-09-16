import { createFileRoute, Link } from "@tanstack/react-router";
import { useMemo, useState } from "react";
import { SourceChips } from "@/components/word/chips";
import { LETTERS, searchWords, SOURCE_IDS, SOURCE_META, WORDS, type SourceId } from "@/lib/lexicon";
import { cn } from "@/lib/utils";

type Search = { q?: string; src?: string; letter?: string };

export const Route = createFileRoute("/lexicon")({
  validateSearch: (s: Record<string, unknown>): Search => ({
    q: typeof s.q === "string" ? s.q : undefined,
    src: typeof s.src === "string" ? s.src : undefined,
    letter: typeof s.letter === "string" ? s.letter : undefined,
  }),
  component: LexiconPage,
});

function LexiconPage() {
  const { q = "", src = "", letter = "" } = Route.useSearch();
  const navigate = Route.useNavigate();
  const [limit, setLimit] = useState(60);

  const srcId = SOURCE_IDS.includes(src as SourceId) ? (src as SourceId) : "";

  const hits = useMemo(
    () => searchWords(q, srcId, letter, 800),
    [q, srcId, letter],
  );
  const shown = hits.slice(0, limit);

  function patch(next: Partial<Search>) {
    setLimit(60);
    void navigate({
      search: { q, src, letter, ...next },
    });
  }

  return (
    <div>
      <header className="enter max-w-2xl">
        <p className="text-xs tracking-[0.22em] text-faint uppercase">Lexicon</p>
        <h1 className="mt-2 font-display text-4xl sm:text-5xl">词库</h1>
        <p className="mt-3 text-muted">
          {WORDS.length.toLocaleString()} 个词条，来自五部词表。检索英文或汉语，或按字母、出处浏览。
        </p>
      </header>

      <div className="enter-2 mt-8 flex flex-wrap gap-2">
        <button
          type="button"
          onClick={() => patch({ src: "" })}
          className={cn(
            "h-9 rounded-sm px-3 text-sm transition-[background-color,color,transform] duration-75 active:scale-[0.97]",
            !srcId ? "bg-accent text-accent-fg" : "bg-surface text-muted hover:text-fg active:bg-raised",
          )}
        >
          全部
        </button>
        {SOURCE_IDS.map((id) => (
          <button
            key={id}
            type="button"
            onClick={() => patch({ src: id })}
            className={cn(
              "h-9 rounded-sm px-3 text-sm transition-[background-color,color,transform] duration-75 active:scale-[0.97]",
              srcId === id ? "bg-accent text-accent-fg" : "bg-surface text-muted hover:text-fg active:bg-raised",
            )}
          >
            {SOURCE_META[id].short}
          </button>
        ))}
      </div>

      <div className="mt-4 flex flex-wrap gap-1">
        {LETTERS.map((ch) => (
          <button
            key={ch}
            type="button"
            onClick={() => patch({ letter: letter === ch ? "" : ch })}
            className={cn(
              "size-8 rounded-sm text-xs uppercase transition-[background-color,color,transform] duration-75 active:scale-[0.94]",
              letter === ch ? "bg-accent text-accent-fg" : "text-muted hover:text-fg hover:bg-raised active:bg-raised",
            )}
          >
            {ch}
          </button>
        ))}
      </div>

      <p className="mt-6 text-sm tabular-nums text-faint">
        {hits.length.toLocaleString()} 条
        {q ? ` · 「${q}」` : ""}
      </p>

      <ul className="mt-4 divide-y divide-border">
        {shown.map((w) => (
          <li key={w.k}>
            <Link
              to="/word/$lemma"
              params={{ lemma: w.k }}
              className="flex flex-col gap-1 py-3 sm:flex-row sm:items-baseline sm:gap-6 transition-colors duration-75 hover:bg-raised/60 active:bg-raised -mx-2 px-2 rounded-sm"
            >
              <span className="w-44 shrink-0 font-display text-xl text-fg">{w.w}</span>
              <span className="min-w-0 flex-1 text-sm leading-6 text-muted line-clamp-2">
                {w.m || "—"}
              </span>
              <span className="hidden sm:block">
                <SourceChips sources={w.s} />
              </span>
            </Link>
          </li>
        ))}
      </ul>

      {shown.length < hits.length ? (
        <button
          type="button"
          className="mt-8 h-11 w-full rounded-md bg-surface text-sm text-muted transition-[background-color,color,transform] duration-75 hover:text-fg hover:bg-raised active:scale-[0.99] active:bg-raised"
          onClick={() => setLimit((n) => n + 80)}
        >
          继续显示
        </button>
      ) : null}

      {hits.length === 0 ? (
        <p className="mt-12 text-muted">没有找到。试一个更短的词干，或去掉出处筛选。</p>
      ) : null}
    </div>
  );
}
