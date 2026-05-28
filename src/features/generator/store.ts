import { create } from "zustand";
import { defaultConfig, type QRConfig } from "@/features/generator/types";

type State = {
  config: QRConfig;
  set: <K extends keyof QRConfig>(k: K, v: QRConfig[K]) => void;
  replace: (cfg: QRConfig) => void;
  reset: () => void;
};

export const useQRStore = create<State>((set) => ({
  config: defaultConfig,
  set: (k, v) => set((s) => ({ config: { ...s.config, [k]: v } })),
  replace: (cfg) => set({ config: cfg }),
  reset: () => set({ config: defaultConfig }),
}));
