import type { LangFamily, LineageStep } from "./types";
import { LEMMAS_A } from "./lemmas-a";
import { LEMMAS_B } from "./lemmas-b";

export type LemmaHint = {
  root: string;
  family: LangFamily;
  lineage: LineageStep[];
  stem?: string;
};

export const LEMMAS: Record<string, LemmaHint> = {
  ...LEMMAS_A,
  ...LEMMAS_B,
};
