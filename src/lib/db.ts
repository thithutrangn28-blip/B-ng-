import { openDB } from 'idb';

const DB_NAME = 'journal-db';
const DB_VERSION = 2;

export const initDB = async () => {
  return openDB(DB_NAME, DB_VERSION, {
    upgrade(db) {
      if (!db.objectStoreNames.contains('user')) {
        db.createObjectStore('user', { keyPath: 'id' });
      }
      if (!db.objectStoreNames.contains('notebooks')) {
        db.createObjectStore('notebooks', { keyPath: 'id' });
      }
      if (!db.objectStoreNames.contains('entries')) {
        db.createObjectStore('entries', { keyPath: 'id' });
      }
      if (!db.objectStoreNames.contains('code_analyses')) {
        db.createObjectStore('code_analyses', { keyPath: 'id' });
      }
    },
  });
};

export const db = {
  async getUser() {
    const db = await initDB();
    return db.get('user', 'profile');
  },
  async updateUser(data: any) {
    const db = await initDB();
    return db.put('user', { id: 'profile', ...data });
  },
  async getNotebooks() {
    const db = await initDB();
    return db.getAll('notebooks');
  },
  async saveNotebook(notebook: any) {
    const db = await initDB();
    return db.put('notebooks', notebook);
  },
  async getNotebook(id: string) {
    const db = await initDB();
    return db.get('notebooks', id);
  },
  async deleteNotebook(id: string) {
    const db = await initDB();
    return db.delete('notebooks', id);
  },
  async getEntries(notebookId: string) {
    const db = await initDB();
    const all = await db.getAll('entries');
    return all.filter((entry) => entry.notebookId === notebookId);
  },
  async getAllEntries() {
    const db = await initDB();
    return db.getAll('entries');
  },
  async saveEntry(entry: any) {
    const db = await initDB();
    return db.put('entries', entry);
  },
  async deleteEntry(id: string) {
    const db = await initDB();
    return db.delete('entries', id);
  },
  async getCodeAnalyses() {
    const db = await initDB();
    return db.getAll('code_analyses');
  },
  async saveCodeAnalysis(analysis: any) {
    const db = await initDB();
    return db.put('code_analyses', analysis);
  },
  async deleteCodeAnalysis(id: string) {
    const db = await initDB();
    return db.delete('code_analyses', id);
  }
};
