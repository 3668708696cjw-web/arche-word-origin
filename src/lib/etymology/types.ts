export type LangFamily =
  | "Germanic"
  | "Italic"
  | "Hellenic"
  | "Celtic"
  | "Semitic"
  | "Sanskrit"
  | "Hybrid"
  | "Unknown";

export type Root = {
  id: string;
  form: string;
  lang: string;
  gloss: string;
  glossEn: string;
  era: string;
  kernel: string;
  note: string;
};

export type LineageStep = {
  lang: string;
  form: string;
  gloss: string;
};

export type Affix = {
  form: string;
  kind: "prefix" | "suffix";
  lang: string;
  sense: string;
};

export type Analysis = {
  lemma: string;
  display: string;
  meaning: string;
  ipa?: string;
  pos: string;
  sources: string[];
  family: LangFamily;
  root: Root;
  lineage: LineageStep[];
  prefixes: Affix[];
  suffixes: Affix[];
  stem: string;
  formula: string;
  kernel: string;
  semanticField: string;
  colloc?: string;
  familyNote?: string;
};

export type Essence = {
  oldest: string;
  philosophy: string;
  ontology: string;
  phenomenology: string;
  epistemology: string;
  culture: string;
};
