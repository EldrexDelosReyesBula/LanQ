import { openDB } from 'idb';

const DB_NAME = 'lanq-db';
const STORE_NAME = 'blends';

export interface SavedBlend {
  id?: number;
  fg: string;
  bg: string;
  timestamp: number;
}

export const initDB = async () => {
  return openDB(DB_NAME, 1, {
    upgrade(db) {
      if (!db.objectStoreNames.contains(STORE_NAME)) {
        db.createObjectStore(STORE_NAME, { keyPath: 'id', autoIncrement: true });
      }
    },
  });
};

export const saveBlendToDB = async (fg: string, bg: string) => {
  const db = await initDB();
  const blend: SavedBlend = { fg, bg, timestamp: Date.now() };
  await db.add(STORE_NAME, blend);
  // Keep only last 20
  const count = await db.count(STORE_NAME);
  if (count > 20) {
    const keys = await db.getAllKeys(STORE_NAME);
    // Delete oldest (lowest ID)
    if (keys.length > 0) {
        await db.delete(STORE_NAME, keys[0]);
    }
  }
  return blend;
};

export const getBlendsFromDB = async (): Promise<SavedBlend[]> => {
  const db = await initDB();
  const blends = await db.getAll(STORE_NAME);
  return blends.sort((a, b) => b.timestamp - a.timestamp);
};