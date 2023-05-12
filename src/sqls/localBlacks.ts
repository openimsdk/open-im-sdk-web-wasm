import { Database, QueryExecResult } from '@jlongster/sql.js';
import squel from 'squel';

export type ClientLocalBlacks = { [key: string]: any };

export function localBlacks(db: Database): QueryExecResult[] {
  return db.exec(
    `
      create table if not exists 'local_blacks' (
        owner_user_id    varchar(64),
        block_user_id    varchar(64),
        nickname         varchar(255),
        face_url         varchar(255),
        gender           INTEGER,
        create_time      INTEGER,
        add_source       INTEGER,
        operator_user_id varchar(64),
        ex               varchar(1024),
        attached_info    varchar(1024),
        primary key (
            'owner_user_id',
            'block_user_id'
        )
      );
    `
  );
}

export function getBlackList(db: Database): QueryExecResult[] {
  const sql = squel.select().from('local_blacks').toString();

  return db.exec(sql);
}
