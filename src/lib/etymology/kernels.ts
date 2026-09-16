import type { KernelEssay } from "./kernels-types";
import { KERNELS_1 } from "./kernels-1";
import { KERNELS_2 } from "./kernels-2";
import { KERNELS_3 } from "./kernels-3";

export type { KernelEssay };
export const KERNELS: Record<string, KernelEssay> = {
  ...KERNELS_1,
  ...KERNELS_2,
  ...KERNELS_3,
};
