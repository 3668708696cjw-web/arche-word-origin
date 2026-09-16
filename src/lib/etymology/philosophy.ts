import type { Affix, Analysis, Essence } from "./types";
import { KERNELS } from "./kernels";

export type { KernelEssay } from "./kernels-types";
export { KERNELS } from "./kernels";

export function kernelOfMeaning(meaning: string): string | null {
  const m = meaning || "";
  const cues: [RegExp, string][] = [
    [/精神|灵魂|呼吸|气息|灵感/, "breath"],
    [/存在|成为|是(?!否)/, "be"],
    [/看|见|视|观|察|瞧/, "see"],
    [/知|识|懂|认|晓/, "know"],
    [/说|言|语|讲|词/, "speak"],
    [/走|来|去|行|旅|路/, "go"],
    [/带|载|持|负|运/, "carry"],
    [/抓|握|拿|捕|获|持有/, "grasp"],
    [/切|割|分|断|析/, "cut"],
    [/结|连|合|接|联/, "join"],
    [/绑|束|约|系|约束/, "bind"],
    [/给|予|赠|授|数据/, "give"],
    [/生(?!活)|育|产|起源|诞生/, "birth"],
    [/死|亡|杀/, "die"],
    [/活|生命|生活/, "live"],
    [/想|思|念|忆|考虑/, "think"],
    [/心|情|勇|信/, "heart"],
    [/光|明|亮|照/, "light"],
    [/水|河|海|液/, "water"],
    [/土|地|陆|尘/, "earth"],
    [/火|热|燃/, "fire"],
    [/手|操|控/, "hand"],
    [/足|脚|步/, "foot"],
    [/家|房|屋|室|居/, "house"],
    [/量|度|测|尺/, "measure"],
    [/转|翻|变向/, "turn"],
    [/伸|拉|张|紧/, "stretch"],
    [/满|完|充|足/, "fill"],
    [/空|虚|缺|无/, "empty"],
    [/一|单|同|独/, "one"],
    [/真|诚|树/, "true"],
    [/好|善|优/, "good"],
    [/爱|恋|喜/, "love"],
    [/力|权|能|势/, "power"],
    [/时|候|期|岁/, "time"],
    [/名|称/, "name"],
    [/工|做|劳|业/, "work"],
    [/随|跟|次/, "follow"],
    [/显|示|指/, "show"],
    [/放|置|设|立/, "put"],
    [/流|飞|漂/, "flow"],
    [/长|生长|增/, "grow"],
    [/感|情|受|情/, "feel"],
    [/听|闻/, "hear"],
    [/触|碰|接/, "touch"],
    [/治|统|王|法/, "rule"],
    [/新/, "new"],
    [/吃|食|吞/, "eat"],
    [/睡|梦/, "sleep"],
    [/写|书|刻/, "write"],
    [/驱|动|演/, "drive"],
    [/导|领|教/, "lead"],
    [/天|神|圣/, "sky"],
    [/人|男|人类/, "man"],
    [/愿|意|志/, "wish"],
    [/覆|盖|藏|护/, "cover"],
    [/信任|托/, "trust"],
  ];
  for (const [re, k] of cues) {
    if (re.test(m)) return k;
  }
  return null;
}

function affixModulation(prefixes: Affix[], suffixes: Affix[]): string {
  const notes: string[] = [];
  for (const p of prefixes) {
    if (p.form === "re") notes.push("前缀 re- 把本质折回去：再一次，或向后。同一动作的返回，已经不再是第一次。");
    else if (p.form === "un" || p.form === "in" || p.form === "im" || p.form === "non" || p.form === "dis" || p.form === "a")
      notes.push(`前缀 ${p.form}- 以否定或解开，让被取消的那一层反而更清楚地显形。`);
    else if (p.form === "con" || p.form === "com" || p.form === "col" || p.form === "cor" || p.form === "syn")
      notes.push("共同的前缀把单独的动作变成一场相遇。");
    else if (p.form === "pre" || p.form === "pro" || p.form === "fore")
      notes.push("时间被提前：本质发生在事情「正式开始」之前。");
    else if (p.form === "trans" || p.form === "dia" || p.form === "per")
      notes.push("穿过：本质不在起点也不在终点，在中间那次穿越。");
    else if (p.form === "sub" || p.form === "hypo" || p.form === "under")
      notes.push("在下：真正起作用的一层，往往不在表面上。");
    else if (p.form === "ex" || p.form === "e" || p.form === "out")
      notes.push("向外：内在的被逼出表面，成为事件。");
    else if (p.form === "en" || p.form === "em" || p.form === "be")
      notes.push("使役：词不再描述一种状态，而是把状态做成。");
  }
  for (const s of suffixes) {
    if (s.form === "tion" || s.form === "sion" || s.form === "ation" || s.form === "ition" || s.form === "ment")
      notes.push("名词词尾把动作凝成事物：过程取得了可以指认的身体。");
    else if (s.form === "ology" || s.form === "osophy" || s.form === "ography")
      notes.push("它把一种观看或一种爱，变成可以传承的学科。");
    else if (s.form === "ness" || s.form === "ity" || s.form === "hood" || s.form === "ship" || s.form === "dom")
      notes.push("抽象词尾抽出性质本身，使它能在没有载体时仍被讨论。");
    else if (s.form === "able" || s.form === "ible")
      notes.push("可能态：本质从「做了」退到「可被做」。世界变成一套能力。");
    else if (s.form === "ize" || s.form === "ise" || s.form === "ify" || s.form === "ate" || s.form === "en")
      notes.push("使动：词在请求一次转化。");
    else if (s.form === "er" || s.form === "or" || s.form === "ist" || s.form === "ant" || s.form === "ent")
      notes.push("施事者出现：本质找到了一个代理人。");
    else if (s.form === "less")
      notes.push("缺少：以空洞的方式指向它所没有的东西。");
  }
  return notes.slice(0, 2).join("");
}

export function essencesFor(analysis: Analysis): Essence {
  const k = KERNELS[analysis.kernel] ?? KERNELS.name;
  const root = analysis.root;
  const meaningBit = analysis.meaning
    ? `汉语常译作「${stripPos(analysis.meaning)}」。译名是河口，不是源头。`
    : "此词在词表中没有现成汉语，更说明它常被当作透明的工具，而不是被凝视的对象。";
  const aff = affixModulation(analysis.prefixes, analysis.suffixes);
  const oldest = [
    `词根 ${root.form}（${root.lang}，${root.era}）核义「${root.gloss}」。`,
    root.note,
    k.oldest,
    analysis.lineage.length
      ? `谱系：${analysis.lineage.map((s) => `${s.lang} ${s.form}`).join(" → ")}。`
      : "",
  ]
    .filter(Boolean)
    .join("");

  return {
    oldest,
    philosophy: `${k.philosophy}${aff ? aff : ""}${meaningBit}`,
    ontology: k.ontology,
    phenomenology: k.phenomenology,
    epistemology: k.epistemology,
    culture: k.culture,
  };
}

function stripPos(meaning: string): string {
  return meaning
    .replace(/^(?:n|v|vt|vi|vlink|adj|adv|prep|pron|conj|art|num|det|modal|interj|abbr|suff)(?:\.|\/|\s)+/gi, "")
    .replace(/[;；].*$/, "")
    .replace(/[（(][^)）]*[)）]/g, "")
    .trim()
    .slice(0, 24);
}
