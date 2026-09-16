import raw from "@/data/lexicon.json";
import type { Analysis } from "@/lib/etymology/types";

export type SourceId = "cet4" | "cet6" | "zsb" | "tem4" | "ln";

export type WordEntry = {
  k: string;
  w: string;
  m: string;
  s: SourceId[];
  pos?: string;
  ipa?: string;
  sec?: string;
  fam?: string;
  col?: string;
};

export const SOURCE_META: Record<
  SourceId,
  { name: string; short: string; blurb: string }
> = {
  cet4: { name: "英语四级", short: "CET-4", blurb: "大学英语四级词表，词族编排。" },
  cet6: { name: "英语六级", short: "CET-6", blurb: "大学英语六级乱序词表。" },
  zsb: { name: "2027 专升本", short: "专升本", blurb: "全国专升本英语词族表。" },
  tem4: { name: "英语专业四级", short: "TEM-4", blurb: "专业四级英文词表。" },
  ln: { name: "辽宁专升本 3000 词", short: "辽专", blurb: "按语法信号与语义场景重编。" },
};

type Payload = { meta: { counts: { unique: number } }; words: WordEntry[] };

function cleanMeaning(m: string): string {
  if (!m) return "";
  return m
    .replace(/\u0000/g, "")
    .replace(/英语[四六]级[\s\S]*$/g, "")
    .replace(/2027专升本[\s\S]*$/g, "")
    .replace(/你还在背单词吗[\s\S]*$/g, "")
    .replace(/扫码[\s\S]*$/g, "")
    .replace(/纸上默写[\s\S]*$/g, "")
    .replace(/共\s*\d+\s*词[\s\S]*$/g, "")
    .replace(/\s{2,}/g, " ")
    .trim();
}

const data = raw as Payload;

export const WORDS: WordEntry[] = data.words.map((w) => ({
  ...w,
  m: cleanMeaning(w.m),
  s: w.s as SourceId[],
}));

export const BY_KEY = new Map(WORDS.map((w) => [w.k, w]));

export const SOURCE_IDS = Object.keys(SOURCE_META) as SourceId[];

export const SOURCE_COUNTS: Record<SourceId, number> = {
  cet4: 0,
  cet6: 0,
  zsb: 0,
  tem4: 0,
  ln: 0,
};
for (const w of WORDS) {
  for (const id of w.s) SOURCE_COUNTS[id] += 1;
}

export const LETTERS = "abcdefghijklmnopqrstuvwxyz".split("");

export function getWord(k: string): WordEntry | undefined {
  return BY_KEY.get(decodeURIComponent(k).toLowerCase()) ?? BY_KEY.get(k);
}

export function dailyWord(date = new Date()): WordEntry {
  const key = `${date.getUTCFullYear()}-${date.getUTCMonth() + 1}-${date.getUTCDate()}`;
  let h = 2166136261;
  for (let i = 0; i < key.length; i++) {
    h ^= key.charCodeAt(i);
    h = Math.imul(h, 16777619);
  }
  return WORDS[Math.abs(h) % WORDS.length]!;
}

export function searchWords(q: string, src?: SourceId | "", letter?: string, limit = 80): WordEntry[] {
  const query = q.trim().toLowerCase();
  let pool = WORDS;
  if (src) pool = pool.filter((w) => w.s.includes(src));
  if (letter) pool = pool.filter((w) => w.k[0] === letter);
  if (!query) return pool.slice(0, limit);

  const exact: WordEntry[] = [];
  const prefix: WordEntry[] = [];
  const contains: WordEntry[] = [];
  const meaning: WordEntry[] = [];
  for (const w of pool) {
    if (w.k === query || w.w.toLowerCase() === query) {
      exact.push(w);
      continue;
    }
    if (w.k.startsWith(query)) {
      prefix.push(w);
      continue;
    }
    if (w.k.includes(query) || w.w.toLowerCase().includes(query)) {
      contains.push(w);
      continue;
    }
    if (w.m.includes(query) || w.m.toLowerCase().includes(query)) meaning.push(w);
  }
  return [...exact, ...prefix, ...contains, ...meaning].slice(0, limit);
}

export function countFor(src?: SourceId | "", letter?: string, q?: string) {
  return searchWords(q ?? "", src, letter, 1_000_000).length;
}

export function relatedByRoot(analysis: Analysis, limit = 18): WordEntry[] {
  const id = analysis.root.id;
  if (id === "unk") return [];
  const out: WordEntry[] = [];
  const stem = analysis.stem.slice(0, 4);
  for (const w of WORDS) {
    if (w.k === analysis.lemma) continue;
    if (stem.length >= 3 && w.k.includes(stem)) {
      out.push(w);
      if (out.length >= limit) return out;
    }
  }
  return out;
}
