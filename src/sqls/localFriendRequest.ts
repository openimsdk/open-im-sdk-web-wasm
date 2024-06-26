import squel from 'squel';
import { Database, QueryExecResult } from '@jlongster/sql.js';

export type LocalFriendRequest = { [key: string]: any };

export function localFriendRequests(db: Database): QueryExecResult[] {
  return db.exec(
    `
      create table if not exists 'local_friend_requests'
      (
          'from_user_id'    varchar(64),
          'from_nickname'   varchar(255),
          'from_face_url'   varchar(255),
          'to_user_id'   varchar(64),
          'to_nickname'   varchar(255),
          'to_face_url'     varchar(255),
          'handle_result'    INTEGER,
          'req_msg'        varchar(255),
          'create_time'   INTEGER,
          'handler_user_id'  varchar(64),
          'handle_msg'    varchar(255),
          'handle_time'    INTEGER,
          'ex'           varchar(1024),
          'attached_info'   varchar(1024),
          primary key ('from_user_id', 'to_user_id')
      );  
      `
  );
}

export function insertFriendRequest(
  db: Database,
  localFriendRequest: LocalFriendRequest
): QueryExecResult[] {
  const sql = squel
    .insert()
    .into('local_friend_requests')
    .setFields(localFriendRequest)
    .toString();

  return db.exec(sql);
}

export function deleteFriendRequestBothUserID(
  db: Database,
  fromUserID: string,
  toUserID: string
): QueryExecResult[] {
  return db.exec(
    `
      delete
      from local_friend_requests
      where from_user_id = "${fromUserID}"
        and to_user_id = "${toUserID}"
      `
  );
}

export function updateFriendRequest(
  db: Database,
  localFriendRequest: LocalFriendRequest
): QueryExecResult[] {
  const sql = squel
    .update()
    .table('local_friend_requests')
    .setFields(localFriendRequest)
    .where(
      `from_user_id = '${localFriendRequest.from_user_id}' and to_user_id = '${localFriendRequest.to_user_id}'`
    )
    .toString();

  return db.exec(sql);
}

export function getRecvFriendApplication(
  db: Database,
  loginUserID: string
): QueryExecResult[] {
  return db.exec(
    `
      select *
      from local_friend_requests
      where to_user_id = "${loginUserID}"
      order by create_time desc
      `
  );
}

export function getSendFriendApplication(
  db: Database,
  loginUserID: string
): QueryExecResult[] {
  return db.exec(
    `
      select * from local_friend_requests
      where from_user_id = "${loginUserID}"
      order by create_time desc
      `
  );
}

export function getFriendApplicationByBothID(
  db: Database,
  fromUserID: string,
  toUserID: boolean
): QueryExecResult[] {
  return db.exec(
    `
      select *
        from local_friend_requests
        where from_user_id = "${fromUserID}"
        and to_user_id = "${toUserID}"
        limit 1
      `
  );
}

export function getBothFriendReq(
  db: Database,
  fromUserID: string,
  toUserID: boolean
): QueryExecResult[] {
  return db.exec(
    `
      select *
        from local_friend_requests
        where (from_user_id = "${fromUserID}"
        and to_user_id = "${toUserID}")
        or (from_user_id = "${toUserID}"
        and to_user_id = "${fromUserID}")
      `
  );
}
