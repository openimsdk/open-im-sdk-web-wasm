import squel from 'squel';
import { Database, QueryExecResult } from '@jlongster/sql.js';

export type LocalVersionSync = { [key: string]: any };

export function localVersionSyncs(db: Database): QueryExecResult[] {
  return db.exec(
    `
      create table if not exists 'local_sync_version' (
        'table_name'         varchar(255),
        'entity_id'         varchar(255),
        'version_id'         text,
        'version'         integer,
        'create_time'         integer,
        'id_list'         text,
        primary key  ('table_name','entity_id')
    ) 
      `
  );
}

export function getVersionSync(
  db: Database,
  tableName: string,
  entityID: string
): QueryExecResult[] {
  return db.exec(
    `
      SELECT * FROM local_sync_version WHERE table_name = "${tableName}" AND entity_id = "${entityID}"
    `
  );
}

export function insertVersionSync(
  db: Database,
  localVersionSync: LocalVersionSync
): QueryExecResult[] {
  delete localVersionSync.table;
  const sql = squel
    .insert()
    .into('local_sync_version')
    .setFields(localVersionSync)
    .toString();

  return db.exec(sql);
}

export function updateVersionSync(
  db: Database,
  oldTable: string,
  oldEntityID: string,
  localVersionSync: LocalVersionSync
): QueryExecResult[] {
  delete localVersionSync.table;
  const sql = squel
    .update()
    .table('local_sync_version')
    .setFields(localVersionSync)
    .where(`table_name = '${oldTable}' AND entity_id = '${oldEntityID}'`)
    .toString();

  return db.exec(sql);
}

export function deleteVersionSync(
  db: Database,
  tableName: string,
  entityID: string
): QueryExecResult[] {
  return db.exec(
    `
    DELETE FROM local_sync_version WHERE table_name = "${tableName}" AND entity_id = "${entityID}";
    `
  );
}
