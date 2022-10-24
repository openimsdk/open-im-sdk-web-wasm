import initSqlJs, { Database, SqlJsStatic } from '@jlongster/sql.js';
import { SQLiteFS } from 'absurd-sql';
import IndexedDBBackend from 'absurd-sql/dist/indexeddb-backend';

let instance: Promise<Database> | undefined;
let SQL: SqlJsStatic | undefined;

async function InitializeDB(filePath: string) {
  if (!SQL) {
    SQL = await initSqlJs({ locateFile: () => '/sql-wasm.wasm' });
    const sqlFS = new SQLiteFS(SQL.FS, new IndexedDBBackend());

    SQL.register_for_idb(sqlFS);
    SQL.FS.mkdir('/sql');
    SQL.FS.mount(sqlFS, {}, '/sql');
  }

  const db = new SQL.Database(`/sql/${filePath}`, { filename: true });
  db.exec(`
    PRAGMA page_size=8192;
    PRAGMA journal_mode=MEMORY;
  `);

  return db;
}

export function getInstance(filePath?: string): Promise<Database> {
  if (instance) {
    return instance;
  }

  if (!filePath) {
    throw new Error('must speciefic database file');
  }

  instance = new Promise<Database>((resolve, reject) => {
    const db = InitializeDB(filePath);
    db.then(res => resolve(res)).catch(err => reject(err));
  });

  return instance;
}

export async function resetInstance() {
  if (!instance) {
    return;
  }

  const db = await instance;

  db.close();
  instance = undefined;
}
