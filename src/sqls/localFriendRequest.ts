import { Database, QueryExecResult } from '@jlongster/sql.js';
import squel from 'squel';

export type ClientLocalFriendRequest = { [key: string]: any };

export function localFriendRequest(db: Database): QueryExecResult[] {
  return db.exec(
    `
      create table if not exists 'local_friend_requests' (
        from_user_id    varchar(64),
        from_nickname   varchar(255),
        from_face_url   varchar(255),
        from_gender     INTEGER,
        to_user_id      varchar(64),
        to_nickname     varchar(255),
        to_face_url     varchar(255),
        to_gender       INTEGER,
        handle_result   INTEGER,
        req_msg         varchar(255),
        create_time     INTEGER,
        handler_user_id varchar(64),
        handle_msg      varchar(255),
        handle_time     INTEGER,
        ex              varchar(1024),
        attached_info   varchar(1024),
        primary key (
            'from_user_id',
            'to_user_id'
        )
        );
    `
  );
}

export function getRecvFriendApplication(
  db: Database,
  toUserId: string
): QueryExecResult[] {
  const sql = squel
    .select()
    .from('local_friend_requests')
    .where(`to_user_id = '${toUserId}'`)
    .order('create_time', false)
    .toString();

  return db.exec(sql);
}

export function getSendFriendApplication(
  db: Database,
  fromUserId: string
): QueryExecResult[] {
  const sql = squel
    .select()
    .from('local_friend_requests')
    .where(`from_user_id = '${fromUserId}'`)
    .order('create_time', false)
    .toString();

  return db.exec(sql);
}
