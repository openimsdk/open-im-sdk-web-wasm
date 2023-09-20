import { Database, QueryExecResult } from '@jlongster/sql.js';
import squel from 'squel';

export type LocalStranger = { [key: string]: any };

export function localStranger(db: Database): QueryExecResult[] {
  return db.exec(
    `
    create table if not exists 'local_stranger'
        (
            'user_id'             varchar(64),
            'name'                varchar(255),
            'face_url'            varchar(255),
            'create_time'         integer,
            'app_manger_level'    integer,
            'ex'                  varchar(1024),
            'attached_info'       varchar(1024),
            'global_recv_msg_opt' integer,
            PRIMARY KEY ('user_id')
        )
      `
  );
}

export function getStrangerInfo(
  db: Database,
  userIDList: string[]
): QueryExecResult[] {
  const ids = userIDList.map(v => `'${v}'`);
  return db.exec(
    `
        select *
        from local_stranger
        WHERE user_id = (${ids.join(',')})
        `
  );
}

export function insertStrangerInfo(
  db: Database,
  localStranger: LocalStranger
): QueryExecResult[] {
  const sql = squel
    .insert()
    .into('local_stranger')
    .setFields(localStranger)
    .toString();

  return db.exec(sql);
}

export function updateStrangerInfo(
  db: Database,
  localStranger: LocalStranger
): QueryExecResult[] {
  const sql = squel
    .update()
    .table('local_stranger')
    .setFields(localStranger)
    .where(`user_id = '${localStranger.user_id}'`)
    .toString();

  return db.exec(sql);
}
