/* eslint-disable @typescript-eslint/no-unsafe-member-access */
/* eslint-disable @typescript-eslint/no-unsafe-call */
import initSqlJs, { Database, SqlJsStatic } from '@jlongster/sql.js';
import { SQLiteFS } from 'open-absurd-sql';
import IndexedDBBackend from 'open-absurd-sql/dist/indexeddb-backend';

let _instance: Promise<Database> | undefined;
let SQL: SqlJsStatic | undefined;

async function InitializeDB(filePath: string) {
  if (!SQL) {
    SQL = await initSqlJs({ locateFile: () => '/sql-wasm.wasm' });
    const sqlFS = new SQLiteFS(SQL.FS, new IndexedDBBackend());

    SQL.register_for_idb(sqlFS);
    SQL.FS.mkdir('/sql');
    SQL.FS.mount(sqlFS, {}, '/sql');
  }

  const path = `/sql/${filePath}`;
  const db = new SQL.Database(path, { filename: true });

  if (typeof SharedArrayBuffer === 'undefined') {
    // @ts-ignore
    const stream = SQL.FS.open(path, 'a+');
    await stream.node.contents.readIfFallback();
    // @ts-ignore
    SQL.FS.close(stream);
  }

  db.exec(`
    PRAGMA page_size=8192;
    PRAGMA journal_mode=MEMORY;
  `);

  return db;
}

export function getInstance(filePath?: string): Promise<Database> {
  if (_instance) {
    return _instance;
  }

  if (!filePath) {
    throw new Error('must specific database file');
  }

  _instance = new Promise<Database>((resolve, reject) => {
    const db = InitializeDB(filePath);
    db.then(res => resolve(res)).catch(err => reject(err));
  });
  console.log(`!!! instance set new val about ${filePath}`);

  return _instance;
}

export async function resetInstance() {
  if (!_instance) {
    return;
  }

  const db = await _instance;

  db.close();
  _instance = undefined;
  console.log('!!! instance set undefined');
}
