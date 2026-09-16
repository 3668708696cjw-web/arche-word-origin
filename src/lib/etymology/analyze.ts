import type { Affix, Analysis, LangFamily } from "./types";
import { ROOT_BY_ID, ROOTS } from "./roots";
import { PREFIXES, SUFFIXES } from "./affixes";
import { LEMMAS } from "./lemmas";
import { STEM_KEYS, STEMS } from "./stems";
import { KERNELS, kernelOfMeaning } from "./philosophy";
import type { WordEntry } from "@/lib/lexicon";

const PREFIX_FORMS = [...PREFIXES].sort((a, b) => b.form.length - a.form.length);
const SUFFIX_FORMS = [...SUFFIXES].sort((a, b) => b.form.length - a.form.length);

function guessFamily(w: string): LangFamily {
  if (/ph|tion$|sion$|ous$|ence$|ance$|ude$|ure$|ate$|al$|ible$|able$/.test(w)) return "Italic";
  if (/ology|ography|ism$|phobia|pathy|meter$|scope$|chron|psych|hydr|bio|geo|phon|graph|log/.test(w))
    return "Hellenic";
  if (/gh|ck|ness$|hood$|ship$|ough|ight|kn|^wh|ed$|ing$/.test(w)) return "Germanic";
  if (/^al[b-z]{3,}/.test(w) && /aa|ii|q/.test(w)) return "Semitic";
  return "Unknown";
}

function familyFromRootLang(lang: string, fallback: LangFamily): LangFamily {
  if (lang.includes("希腊")) return "Hellenic";
  if (lang.includes("拉丁")) return "Italic";
  if (lang.includes("日耳曼") || lang.includes("英语") || lang.includes("诺斯")) return "Germanic";
  if (lang.includes("梵")) return "Sanskrit";
  if (lang.includes("印欧")) return fallback === "Unknown" ? "Hybrid" : fallback;
  return fallback;
}

function findStem(raw: string): { stem: string; rootId: string } | null {
  const w = raw.toLowerCase();
  if (STEMS[w]) return { stem: w, rootId: STEMS[w] };
  for (const k of STEM_KEYS) {
    if (k.length < 3) continue;
    if (w === k || w.startsWith(k) || w.endsWith(k)) {
      return { stem: k, rootId: STEMS[k] };
    }
    // medial
    if (w.includes(k) && k.length >= 4) return { stem: k, rootId: STEMS[k] };
  }
  return null;
}

function stripMorph(word: string): { stem: string; prefixes: Affix[]; suffixes: Affix[] } {
  let rest = word.toLowerCase().replace(/[^a-z]/g, "");
  const prefixes: Affix[] = [];
  const suffixes: Affix[] = [];

  for (let i = 0; i < 3; i++) {
    let hit = false;
    for (const s of SUFFIX_FORMS) {
      if (s.form.length < 2) continue;
      if (rest.length - s.form.length < 3) continue;
      if (rest.endsWith(s.form)) {
        const next = rest.slice(0, -s.form.length);
        if (findStem(next) || LEMMAS[next] || next.length >= 4) {
          suffixes.unshift({ form: s.form, kind: "suffix", lang: s.lang, sense: s.sense });
          rest = next.replace(/[aeio]$/, "") || next;
          hit = true;
          break;
        }
      }
    }
    if (!hit) break;
  }

  for (let i = 0; i < 2; i++) {
    let hit = false;
    for (const p of PREFIX_FORMS) {
      if (p.form.length < 2) continue;
      if (rest.length - p.form.length < 3) continue;
      if (rest.startsWith(p.form)) {
        const next = rest.slice(p.form.length);
        if (findStem(next) || LEMMAS[next] || next.length >= 4) {
          prefixes.push({ form: p.form, kind: "prefix", lang: p.lang, sense: p.sense });
          rest = next;
          hit = true;
          break;
        }
      }
    }
    if (!hit) break;
  }

  return { stem: rest || word, prefixes, suffixes };
}

function defaultLineage(rootId: string, family: LangFamily, stem: string) {
  const root = ROOT_BY_ID[rootId] ?? ROOT_BY_ID.unk;
  const steps = [
    { lang: root.lang, form: root.form, gloss: root.gloss },
  ];
  if (root.lang.includes("印欧")) {
    if (family === "Italic") steps.push({ lang: "拉丁语", form: stem, gloss: "经拉丁语进入英语" });
    else if (family === "Hellenic") steps.push({ lang: "古希腊语", form: stem, gloss: "经希腊语进入英语" });
    else if (family === "Germanic") steps.push({ lang: "古英语 / 原始日耳曼语", form: stem, gloss: "日耳曼底层" });
    else steps.push({ lang: "中古英语", form: stem, gloss: "多层借用后的形态" });
  }
  steps.push({ lang: "英语", form: stem, gloss: "现代形式" });
  return steps;
}

export function analyzeEntry(entry: WordEntry): Analysis {
  const lemma = entry.k;
  const display = entry.w;
  const hint = LEMMAS[lemma];
  const morph = hint ? { stem: hint.stem ?? lemma, prefixes: [] as Affix[], suffixes: [] as Affix[] } : stripMorph(lemma);

  if (!hint) {
    const hyphen = lemma.split("-");
    if (hyphen.length === 2 && hyphen[1].length > 2) {
      const inner = stripMorph(hyphen[1]);
      morph.prefixes = [
        { form: hyphen[0], kind: "prefix", lang: "英语", sense: "复合前部" },
        ...inner.prefixes,
      ];
      morph.suffixes = inner.suffixes;
      morph.stem = inner.stem;
    }
  }

  const stemHit = findStem(morph.stem) ?? findStem(lemma);
  const rootId = hint?.root ?? stemHit?.rootId ?? "unk";
  const root = ROOT_BY_ID[rootId] ?? ROOT_BY_ID.unk;
  const family: LangFamily = hint?.family ?? familyFromRootLang(root.lang, guessFamily(lemma));
  let kernel = root.kernel;
  if (kernel === "name" || rootId === "unk") {
    kernel = kernelOfMeaning(entry.m) ?? kernel;
  }

  const prefixes = morph.prefixes;
  const suffixes = morph.suffixes;
  const formulaParts = [
    ...prefixes.map((p) => p.form + "-"),
    morph.stem,
    ...suffixes.map((s) => "-" + s.form),
  ];

  return {
    lemma,
    display,
    meaning: entry.m,
    ipa: entry.ipa,
    pos: entry.pos ?? "",
    sources: entry.s,
    family,
    root,
    lineage: hint?.lineage?.length ? [...hint.lineage, { lang: "英语", form: display, gloss: "现代英语" }] : defaultLineage(root.id, family, morph.stem),
    prefixes,
    suffixes,
    stem: morph.stem,
    formula: formulaParts.join(" + "),
    kernel,
    semanticField: KERNELS[kernel]?.field ?? "意义",
    colloc: entry.col,
    familyNote: entry.fam,
  };
}

const cache = new Map<string, Analysis>();

export function analyzeCached(entry: WordEntry): Analysis {
  const hit = cache.get(entry.k);
  if (hit) return hit;
  const a = analyzeEntry(entry);
  cache.set(entry.k, a);
  return a;
}

export function allRoots() {
  return ROOTS.filter((r) => r.id !== "unk");
}
