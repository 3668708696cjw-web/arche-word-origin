import { createFileRoute, Link } from "@tanstack/react-router";
import { WordLink } from "@/components/word/chips";
import { BY_KEY } from "@/lib/lexicon";
import { useArcheStore } from "@/lib/store";

export const Route = createFileRoute("/saved")({ component: SavedPage });

function SavedPage() {
  const saved = useArcheStore((s) => s.saved);
  const recent = useArcheStore((s) => s.recent);
  const words = saved.map((k) => BY_KEY.get(k)).filter(Boolean);
  const recents = recent.map((k) => BY_KEY.get(k)).filter(Boolean);

  return (
    <div>
      <header className="enter max-w-2xl">
        <p className="text-xs tracking-[0.22em] text-faint uppercase">Saved</p>
        <h1 className="mt-2 font-display text-4xl sm:text-5xl">收藏</h1>
        <p className="mt-3 text-muted">留在这台设备上。收藏是一份私人的词根笔记，不是账号。</p>
      </header>
      {words.length === 0 ? (
        <p className="enter-2 mt-12 text-muted">
          还没有收藏。打开任何一个词，点右上角的标记。
          <Link to="/lexicon" className="ml-2 text-fg underline-offset-4 hover:underline active:opacity-70">
            去词库
          </Link>
        </p>
      ) : (
        <div className="enter-2 mt-8 grid gap-2 sm:grid-cols-2">
          {words.map((w) => (w ? <WordLink key={w.k} k={w.k} w={w.w} m={w.m} /> : null))}
        </div>
      )}
      {recents.length ? (
        <section className="mt-16">
          <h2 className="font-display text-2xl">最近</h2>
          <div className="mt-5 grid gap-2 sm:grid-cols-2">
            {recents.map((w) => (w ? <WordLink key={w.k} k={w.k} w={w.w} m={w.m} /> : null))}
          </div>
        </section>
      ) : null}
    </div>
  );
}
