/* eslint-disable @typescript-eslint/explicit-module-boundary-types */
declare module 'absurd-sql-optimized' {
  export class SQLiteFS {
    constructor(fs: any, backend: any);
  }
}
declare module 'absurd-sql-optimized/dist/memory-backend' {
  export default class MemoryBBackend {}
}

declare module 'absurd-sql-optimized/dist/indexeddb-backend' {
  export default class IndexedDBBackend {}
}

declare module 'absurd-sql-optimized/dist/indexeddb-main-thread' {
  export function initBackend(worker: Worker);
}
