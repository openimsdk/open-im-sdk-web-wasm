import squel from 'squel';
import { Database, QueryExecResult } from '@jlongster/sql.js';

export type ClientUpload = { [key: string]: unknown };

export function localUploads(db: Database): QueryExecResult[] {
  return db.exec(
    `
        create table if not exists 'local_uploads' (
            'part_hash'   text,
            'upload_id'   varchar(1000),
            'upload_info'        varchar(2000),
            'expire_time' integer,
            'create_time' integer,
            PRIMARY KEY ('part_hash')
          )
      `
  );
}

export function getUpload(db: Database, partHash: string): QueryExecResult[] {
  return db.exec(
    `
        select * from local_uploads where part_hash = '${partHash}'  limit 1;
    `
  );
}

export function insertUpload(
  db: Database,
  upload: ClientUpload
): QueryExecResult[] {
  const sql = squel.insert().into('local_uploads').setFields(upload).toString();

  return db.exec(sql);
}

export function updateUpload(
  db: Database,
  upload: ClientUpload
): QueryExecResult[] {
  const sql = squel
    .update()
    .table('local_uploads')
    .setFields(upload)
    .where(`part_hash = '${upload.part_hash}'`)
    .toString();

  return db.exec(sql);
}

export function deleteUpload(
  db: Database,
  partHash: string
): QueryExecResult[] {
  const sql = squel
    .delete()
    .from('local_uploads')
    .where(`part_hash = '${partHash}'`)
    .toString();

  return db.exec(sql);
}

export function deleteExpireUpload(db: Database): QueryExecResult[] {
  const sql = squel
    .delete()
    .from('local_uploads')
    .where(`expire_time <= ${Date.now()}`)
    .toString();

  return db.exec(sql);
}
