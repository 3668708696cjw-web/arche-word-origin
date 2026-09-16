import { createFileRoute, Link } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { WordLink } from "@/components/word/chips";
import { ROOT_BY_ID } from "@/lib/etymology/roots";
import { KERNELS } from "@/lib/etymology/philosophy";
import { familyOf } from "@/lib/family-index";
import type { WordEntry } from "@/lib/lexicon";

export const Route = createFileRoute("/roots/$rootId")({
  component: RootPage,
});

function RootPage() {
  const { rootId } = Route.useParams();
  const root = ROOT_BY_ID[rootId];
  const [family, setFamily] = useState<WordEntry[]>([]);

  useEffect(() => {
    if (!root || root.id === "unk") {
      setFamily([]);
      return;
    }
    const id = requestAnimationFrame(() => {
      setFamily(familyOf(root.id, undefined, 80));
    });
    return () => cancelAnimationFrame(id);
  }, [root]);

  if (!root || root.id === "unk") {
    return (
      <div className="py-16 text-center">
        <h1 className="font-display text-4xl">没有这条河</h1>
        <Link to="/roots" className="mt-4 inline-block text-sm text-muted">
          回到词根
        </Link>
      </div>
    );
  }
  const k = KERNELS[root.kernel];

  return (
    <article className="mx-auto max-w-3xl">
      <p className="text-xs tracking-[0.22em] text-faint uppercase">{root.lang}</p>
      <h1 className="mt-2 font-display text-5xl leading-none text-fg">{root.form}</h1>
      <p className="mt-4 text-lg text-muted">
        {root.gloss}
        <span className="ml-3 font-display italic text-faint">{root.glossEn}</span>
      </p>
      <p className="mt-2 text-sm text-faint">{root.era}</p>
      <p className="mt-8 text-[16px] leading-8 text-fg/90">{root.note}</p>
      {k ? (
        <div className="mt-10 rounded-lg bg-surface p-5 sm:p-6 shadow-[var(--shadow-border)]">
          <p className="text-xs tracking-[0.18em] text-faint uppercase">Kernel · {k.name}</p>
          <p className="mt-3 text-[15px] leading-7 text-muted">{k.oldest}</p>
        </div>
      ) : null}
      <h2 className="mt-14 font-display text-2xl">词库中的后裔</h2>
      <p className="mt-2 text-sm text-faint tabular-nums">
        {family.length ? `${family.length} 词（显示前 80）` : "正在收集同源词…"}
      </p>
      <div className="mt-6 grid gap-2 sm:grid-cols-2">
        {family.map((w) => (
          <WordLink key={w.k} k={w.k} w={w.w} m={w.m} />
        ))}
      </div>
    </article>
  );
}
