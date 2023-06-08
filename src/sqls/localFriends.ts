import { Database, QueryExecResult } from '@jlongster/sql.js';
import squel from 'squel';

export type ClientLocalFriends = { [key: string]: any };

export function localFriends(db: Database): QueryExecResult[] {
  return db.exec(
    `
      create table if not exists 'local_friends' (
        owner_user_id    varchar(64),
        friend_user_id   varchar(64),
        remark           varchar(255),
        create_time      INTEGER,
        add_source       INTEGER,
        operator_user_id varchar(64),
        name             varchar(255),
        face_url         varchar(255),
        gender           INTEGER,
        phone_number     varchar(32),
        birth            INTEGER,
        email            varchar(64),
        ex               varchar(1024),
        attached_info    varchar(1024),
        primary key (
            'owner_user_id',
            'friend_user_id'
        )
        );
    `
  );
}

export function getAllFriendList(
  db: Database,
  ownerUserID: string
): QueryExecResult[] {
  const sql = squel
    .select()
    .from('local_friends')
    .where(`owner_user_id = '${ownerUserID}'`)
    .toString();

  return db.exec(sql);
}
