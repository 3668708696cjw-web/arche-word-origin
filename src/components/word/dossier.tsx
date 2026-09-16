import { Bookmark, BookmarkCheck, ChevronRight } from "lucide-react";
import { useEffect, useState, type ReactNode } from "react";
import { Link } from "@tanstack/react-router";
import { Button } from "@/components/ui/button";
import { FamilyBadge, SourceChips, WordLink } from "@/components/word/chips";
import { analyzeCached } from "@/lib/etymology/analyze";
import { essencesFor } from "@/lib/etymology/philosophy";
import type { Essence } from "@/lib/etymology/types";
import { familyOf } from "@/lib/family-index";
import { inquireWord } from "@/lib/inquire";
import type { WordEntry } from "@/lib/lexicon";
import { useArcheStore } from "@/lib/store";
import { cn } from "@/lib/utils";

function Section({
  kicker,
  title,
  children,
  className,
}: {
  kicker: string;
  title: string;
  children: ReactNode;
  className?: string;
}) {
  return (
    <section className={cn("enter-2", className)}>
      <p className="text-xs tracking-[0.22em] text-faint uppercase">{kicker}</p>
      <h2 className="mt-1 font-display text-2xl font-medium tracking-tight text-fg">{title}</h2>
      <div className="mt-4 text-[15px] leading-7 text-muted">{children}</div>
    </section>
  );
}

export function Dossier({ entry }: { entry: WordEntry }) {
  const analysis = analyzeCached(entry);
  const local = essencesFor(analysis);
  const saved = useArcheStore((s) => s.saved.includes(entry.k));
  const toggle = useArcheStore((s) => s.toggleSaved);
  const addRecent = useArcheStore((s) => s.addRecent);

  const [family, setFamily] = useState<WordEntry[]>([]);
  const [ai, setAi] = useState<Essence | null>(null);
  const [busy, setBusy] = useState(false);
  const [err, setErr] = useState("");

  useEffect(() => {
    addRecent(entry.k);
    const cached = localStorage.getItem(`arche:ai:${entry.k}`);
    if (cached) {
      try {
        setAi(JSON.parse(cached) as Essence);
      } catch {
        setAi(null);
      }
    } else {
      setAi(null);
    }
    setErr("");
    setFamily([]);
    const frame = requestAnimationFrame(() => {
      setFamily(familyOf(analysis.root.id, entry.k, 12));
    });
    return () => cancelAnimationFrame(frame);
  }, [entry.k, addRecent, analysis.root.id]);

  const essay = ai ?? local;

  async function deeper() {
    if (busy) return;
    setBusy(true);
    setErr("");
    const res = await inquireWord({
      data: {
        lemma: entry.w,
        meaning: entry.m,
        oldest: local.oldest,
        kernel: analysis.kernel,
      },
    });
    setBusy(false);
    if (!res.ok) {
      setErr(res.error);
      return;
    }
    setAi(res.essay);
    localStorage.setItem(`arche:ai:${entry.k}`, JSON.stringify(res.essay));
  }

  return (
    <article className="mx-auto max-w-3xl">
      <div className="enter">
        <div className="flex flex-wrap items-center gap-2">
          <FamilyBadge family={analysis.family} />
          <SourceChips sources={entry.s} />
        </div>
        <div className="mt-5 flex items-start justify-between gap-4">
          <h1 className="font-display text-5xl leading-[0.95] font-medium tracking-tight text-fg sm:text-6xl">
            {entry.w}
          </h1>
          <Button
            variant={saved ? "primary" : "outline"}
            size="icon"
            aria-label={saved ? "取消收藏" : "收藏"}
            onClick={() => toggle(entry.k)}
          >
            {saved ? <BookmarkCheck className="size-5" /> : <Bookmark className="size-5" />}
          </Button>
        </div>
        <div className="mt-3 flex flex-wrap items-baseline gap-x-4 gap-y-1 text-sm text-muted">
          {entry.ipa ? <span className="font-display italic">{entry.ipa}</span> : null}
          {entry.pos ? <span>{entry.pos}</span> : null}
          <span className="text-faint">{analysis.semanticField}</span>
        </div>
        {entry.m ? (
          <p className="mt-5 max-w-xl text-lg leading-8 text-fg/90">{entry.m}</p>
        ) : (
          <p className="mt-5 text-sm text-faint">词表未收汉语释义。以下溯源仍从其形态与词根展开。</p>
        )}
      </div>

      <div className="mt-12 space-y-14">
        <Section kicker="Etymon" title="最古老本质">
          <p className="text-fg/90">{essay.oldest}</p>
          <div className="mt-6 overflow-hidden rounded-lg bg-surface p-4 sm:p-5 shadow-[var(--shadow-border)]">
            <p className="font-display text-2xl text-fg">{analysis.root.form}</p>
            <p className="mt-1 text-sm text-muted">
              {analysis.root.lang} · {analysis.root.era} · {analysis.root.gloss}
            </p>
            <ol className="mt-5 space-y-3">
              {analysis.lineage.map((step, i) => (
                <li key={i} className="flex gap-3">
                  <span className="mt-1.5 size-1.5 shrink-0 rounded-full bg-accent/70" />
                  <div>
                    <div className="text-sm text-fg">
                      {step.lang}
                      <span className="ml-2 font-display italic text-muted">{step.form}</span>
                    </div>
                    <div className="text-sm text-faint">{step.gloss}</div>
                  </div>
                </li>
              ))}
            </ol>
          </div>
        </Section>

        <Section kicker="Morphology" title="形态解剖">
          <p className="font-display text-xl text-fg">{analysis.formula}</p>
          {analysis.prefixes.length || analysis.suffixes.length ? (
            <ul className="mt-4 space-y-2">
              {analysis.prefixes.map((a) => (
                <li key={a.form + a.kind}>
                  <span className="text-fg">{a.form}-</span>
                  <span className="ml-2 text-faint">
                    {a.lang} · {a.sense}
                  </span>
                </li>
              ))}
              <li>
                <span className="text-fg">{analysis.stem}</span>
                <span className="ml-2 text-faint">词干</span>
              </li>
              {analysis.suffixes.map((a) => (
                <li key={a.form + a.kind}>
                  <span className="text-fg">-{a.form}</span>
                  <span className="ml-2 text-faint">
                    {a.lang} · {a.sense}
                  </span>
                </li>
              ))}
            </ul>
          ) : (
            <p className="mt-3">这是一个几乎不可再切的词核。它自己就是源头附近的形状。</p>
          )}
        </Section>

        <Section kicker="Philosophy" title="哲学本质">
          <p className="text-fg/90">{essay.philosophy}</p>
        </Section>

        <div className="grid gap-8 sm:grid-cols-3">
          <div>
            <p className="text-xs tracking-[0.18em] text-faint uppercase">存在</p>
            <p className="mt-2 text-[15px] leading-7 text-muted">{essay.ontology}</p>
          </div>
          <div>
            <p className="text-xs tracking-[0.18em] text-faint uppercase">现象</p>
            <p className="mt-2 text-[15px] leading-7 text-muted">{essay.phenomenology}</p>
          </div>
          <div>
            <p className="text-xs tracking-[0.18em] text-faint uppercase">认知</p>
            <p className="mt-2 text-[15px] leading-7 text-muted">{essay.epistemology}</p>
          </div>
        </div>

        <Section kicker="Culture" title="文化本质">
          <p>{essay.culture}</p>
        </Section>

        {entry.col ? (
          <Section kicker="Collocation" title="常见搭配">
            <p>{entry.col}</p>
          </Section>
        ) : null}

        {family.length ? (
          <Section kicker="Family" title="同源词族">
            <p className="mb-5">
              与 {analysis.root.form} 同行的词。它们不一定同义，却共用一口更老的气。
            </p>
            <div className="grid gap-2 sm:grid-cols-2">
              {family.map((w) => (
                <WordLink key={w.k} k={w.k} w={w.w} m={w.m} />
              ))}
            </div>
            <Link
              to="/roots/$rootId"
              params={{ rootId: analysis.root.id }}
              className="mt-4 inline-flex items-center gap-1 rounded-sm px-1 py-1 text-sm text-fg transition-opacity duration-75 hover:opacity-80 active:opacity-60"
            >
              查看完整词根
              <ChevronRight className="size-4" />
            </Link>
          </Section>
        ) : null}

        <section className="rounded-xl bg-surface p-5 sm:p-6 shadow-[var(--shadow-border)]">
          <p className="text-xs tracking-[0.22em] text-faint uppercase">Further</p>
          <h2 className="mt-1 font-display text-2xl font-medium text-fg">再溯一层</h2>
          <p className="mt-3 text-sm leading-6 text-muted">
            本地分析已经给出词根与哲学骨架。若要针对这一词作更窄的深探，可发起一次询问——结果会留在这台设备上。
          </p>
          <div className="mt-5 flex flex-wrap items-center gap-3">
            <Button onClick={() => void deeper()} disabled={busy}>
              {busy ? "正在下探…" : ai ? "重新深探" : "深入溯源"}
            </Button>
            {ai ? <span className="text-xs text-faint">已是更深的一稿</span> : null}
          </div>
          {err ? <p className="mt-3 text-sm text-danger">{err}</p> : null}
        </section>
      </div>
    </article>
  );
}
