import Dexie, { type Table } from "dexie";
import type { QRConfig } from "@/features/generator/types";

export interface ProjectRow {
  id?: number;
  name: string;
  config: QRConfig;
  createdAt: number;
  updatedAt: number;
}

class LanQDB extends Dexie {
  projects!: Table<ProjectRow, number>;
  constructor() {
    super("lanq");
    this.version(1).stores({ projects: "++id, name, updatedAt" });
  }
}

export const db = new LanQDB();
