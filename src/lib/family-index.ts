import { WORDS, type WordEntry } from "@/lib/lexicon";
import { analyzeCached } from "@/lib/etymology/analyze";

const byRoot = new Map<string, WordEntry[]>();
let cursor = 0;

function pump(n: number) {
  const end = Math.min(WORDS.length, cursor + n);
  for (; cursor < end; cursor++) {
    const w = WORDS[cursor]!;
    const id = analyzeCached(w).root.id;
    const arr = byRoot.get(id);
    if (arr) arr.push(w);
    else byRoot.set(id, [w]);
  }
}

function enough(rootId: string, need: number) {
  return cursor >= WORDS.length || (byRoot.get(rootId)?.length ?? 0) >= need;
}

export function familyOf(rootId: string, except?: string, limit = 24): WordEntry[] {
  if (rootId === "unk") return [];
  const need = except ? limit + 1 : limit;
  while (!enough(rootId, need)) pump(200);
  const arr = byRoot.get(rootId) ?? [];
  const out: WordEntry[] = [];
  for (const w of arr) {
    if (w.k === except) continue;
    out.push(w);
    if (out.length >= limit) break;
  }
  return out;
}

export function familyCount(rootId: string): number {
  if (rootId === "unk") return 0;
  while (cursor < WORDS.length) pump(400);
  return (byRoot.get(rootId) ?? []).length;
}

export function warmFamilyIndex() {
  if (cursor >= WORDS.length) return;
  const run = (budget: number) => {
    pump(budget);
    if (cursor >= WORDS.length) return;
    if (typeof requestIdleCallback === "function") {
      requestIdleCallback((d) => run(d.timeRemaining() > 10 ? 160 : 48));
    } else {
      setTimeout(() => run(80), 16);
    }
  };
  if (typeof requestIdleCallback === "function") requestIdleCallback(() => run(80));
  else setTimeout(() => run(80), 1);
}
