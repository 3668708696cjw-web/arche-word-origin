import { createFileRoute, Link } from "@tanstack/react-router";
import { ArrowRight } from "lucide-react";
import { FamilyBadge, SourceChips, WordLink } from "@/components/word/chips";
import { Button } from "@/components/ui/button";
import { analyzeCached } from "@/lib/etymology/analyze";
import { ROOT_BY_ID } from "@/lib/etymology/roots";
import { BY_KEY, dailyWord, SOURCE_COUNTS, SOURCE_IDS, SOURCE_META } from "@/lib/lexicon";
import { useArcheStore } from "@/lib/store";

export const Route = createFileRoute("/")({ component: Home });

const FEATURED_ROOTS = ["speis", "weid", "sta", "gen", "deru", "log"] as const;

const CARD =
  "rounded-lg bg-surface shadow-[var(--shadow-border)] transition-[background-color,transform] duration-75 ease-out hover:bg-raised active:scale-[0.99] active:bg-raised";

function Home() {
  const daily = dailyWord();
  const analysis = analyzeCached(daily);
  const recent = useArcheStore((s) => s.recent)
    .map((k) => BY_KEY.get(k))
    .filter(Boolean)
    .slice(0, 6);

  return (
    <div>
      <section className="enter max-w-2xl pt-4 sm:pt-10">
        <p className="text-xs tracking-[0.28em] text-faint uppercase">A lexicon of first principles</p>
        <h1 className="mt-4 font-display text-5xl leading-[0.92] font-medium tracking-tight sm:text-7xl">
          每一个词
          <br />
          都有一口更老的气
        </h1>
        <p className="mt-6 max-w-xl text-[17px] leading-8 text-muted">
          一个词不是标签，是一条河。河的源头往往比河口更安静：一口气息、一次站立、一道切痕。本源沿着这条河向上走，走到语言还没有英语的地方。
        </p>
      </section>

      <section className="enter-2 mt-14">
        <p className="text-xs tracking-[0.22em] text-faint uppercase">Today</p>
        <Link
          to="/word/$lemma"
          params={{ lemma: daily.k }}
          className={`mt-4 block p-6 sm:p-8 rounded-xl ${CARD}`}
        >
          <div className="flex flex-wrap items-center gap-2">
            <FamilyBadge family={analysis.family} />
            <SourceChips sources={daily.s} />
          </div>
          <div className="mt-5 font-display text-4xl text-fg sm:text-5xl">{daily.w}</div>
          <p className="mt-3 max-w-lg text-muted">{daily.m || analysis.root.note}</p>
          <p className="mt-5 font-display text-lg italic text-faint">
            {analysis.root.form} · {analysis.root.gloss}
          </p>
        </Link>
      </section>

      <section className="enter-3 mt-16">
        <div className="flex items-end justify-between gap-4">
          <div>
            <p className="text-xs tracking-[0.22em] text-faint uppercase">Roots</p>
            <h2 className="mt-1 font-display text-3xl">六条古老的河</h2>
          </div>
          <Link
            to="/roots"
            className="inline-flex items-center gap-1 rounded-sm px-2 py-1 text-sm text-muted transition-colors duration-75 hover:text-fg active:bg-raised"
          >
            全部词根 <ArrowRight className="size-4" />
          </Link>
        </div>
        <div className="mt-6 grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
          {FEATURED_ROOTS.map((id) => {
            const r = ROOT_BY_ID[id];
            if (!r) return null;
            return (
              <Link key={id} to="/roots/$rootId" params={{ rootId: id }} className={`${CARD} p-5`}>
                <div className="font-display text-2xl text-fg">{r.form}</div>
                <div className="mt-1 text-sm text-muted">{r.gloss}</div>
                <p className="mt-3 line-clamp-3 text-sm leading-6 text-faint">{r.note}</p>
              </Link>
            );
          })}
        </div>
      </section>

      <section className="enter-4 mt-16">
        <p className="text-xs tracking-[0.22em] text-faint uppercase">Corpus</p>
        <h2 className="mt-1 font-display text-3xl">五部词表</h2>
        <p className="mt-3 max-w-xl text-sm leading-6 text-muted">
          词条来自四级、六级、专升本、专业四级与辽宁专升本。同一词若出现在多部书中，会并成一条，并保留全部出处。
        </p>
        <div className="mt-6 grid gap-3 sm:grid-cols-2 lg:grid-cols-5">
          {SOURCE_IDS.map((id) => {
            const meta = SOURCE_META[id];
            return (
              <Link
                key={id}
                to="/lexicon"
                search={{ q: "", src: id, letter: "" }}
                className={`${CARD} p-4`}
              >
                <div className="text-xs tracking-wide text-faint">{meta.short}</div>
                <div className="mt-1 font-display text-xl text-fg">{meta.name}</div>
                <div className="mt-2 text-sm tabular-nums text-muted">{SOURCE_COUNTS[id]} 词</div>
              </Link>
            );
          })}
        </div>
      </section>

      {recent.length ? (
        <section className="mt-16">
          <p className="text-xs tracking-[0.22em] text-faint uppercase">Recent</p>
          <h2 className="mt-1 font-display text-3xl">刚刚走过</h2>
          <div className="mt-6 grid gap-2 sm:grid-cols-2 lg:grid-cols-3">
            {recent.map((w) =>
              w ? <WordLink key={w.k} k={w.k} w={w.w} m={w.m} /> : null,
            )}
          </div>
        </section>
      ) : null}

      <section className="mt-20 max-w-2xl border-t border-border pt-10">
        <h2 className="font-display text-2xl">如何读一份词</h2>
        <div className="mt-5 space-y-4 text-[15px] leading-7 text-muted">
          <p>
            先看最古老本质：它通常不是这个词今天的意思，而是那意思尚未分开时的动作——吹、站、切、抓、生。
          </p>
          <p>
            再看哲学本质。不是把词变成格言，是问：这种动作在存在、现象与认识里分别是什么。
          </p>
          <p>
            同源词族用来核对。如果 inspire、spirit、conspire 真的共用一口气息，你对 spirit 的理解会自己校正。
          </p>
        </div>
        <Button asChild className="mt-8">
          <Link to="/lexicon">
            进入词库
            <ArrowRight className="size-4" />
          </Link>
        </Button>
      </section>
    </div>
  );
}
