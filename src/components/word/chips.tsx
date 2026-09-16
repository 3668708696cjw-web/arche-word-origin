import { Link } from "@tanstack/react-router";
import { SOURCE_META, type SourceId } from "@/lib/lexicon";
import { cn } from "@/lib/utils";

export function SourceChips({ sources }: { sources: string[] }) {
  return (
    <div className="flex flex-wrap gap-1.5">
      {sources.map((s) => {
        const meta = SOURCE_META[s as SourceId];
        if (!meta) return null;
        return (
          <Link
            key={s}
            to="/lexicon"
            search={{ q: undefined, src: s, letter: undefined }}
            className="rounded-sm bg-raised px-2 py-1 text-xs text-muted transition-colors duration-75 hover:text-fg active:bg-raised"
          >
            {meta.short}
          </Link>
        );
      })}
    </div>
  );
}

export function FamilyBadge({ family }: { family: string }) {
  const label: Record<string, string> = {
    Germanic: "日耳曼",
    Italic: "拉丁",
    Hellenic: "希腊",
    Celtic: "凯尔特",
    Semitic: "闪米特",
    Sanskrit: "梵语",
    Hybrid: "多层",
    Unknown: "未明",
  };
  return (
    <span className="rounded-sm bg-raised px-2 py-1 text-xs tracking-wide text-muted">
      {label[family] ?? family}
    </span>
  );
}

export function WordLink({
  k,
  w,
  m,
  className,
}: {
  k: string;
  w: string;
  m?: string;
  className?: string;
}) {
  return (
    <Link
      to="/word/$lemma"
      params={{ lemma: k }}
      className={cn(
        "group block rounded-lg bg-surface px-4 py-3 shadow-[var(--shadow-border)] transition-[background-color,transform] duration-75 ease-out hover:bg-raised active:scale-[0.99] active:bg-raised",
        className,
      )}
    >
      <div className="font-display text-xl leading-tight text-fg">{w}</div>
      {m ? (
        <div className="mt-1 line-clamp-2 text-sm leading-relaxed text-muted">{m}</div>
      ) : null}
    </Link>
  );
}
