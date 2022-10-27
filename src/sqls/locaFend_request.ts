import squel from 'squel';
import { Database, QueryExecResult } from '@jlongster/sql.js';

export function locaFendRequest(db: Database): QueryExecResult[] {
    return db.exec(
      `
      create table if not exists 'local_friend_requests'
      (
          'from_user_id'    varchar(64),
          'from_nickname'   varchar(255),
          'from_face_url'   varchar(255),
         'from_gender'     INTEGER,
          'to_user_id'   varchar(64),
          'to_nickname'   varchar(255),
          'to_face_url'     varchar(255),
          'to_gender'      INTEGER,
         ' handle_result'    INTEGER,
         ' req_msg '        varchar(255),
          'create_time'   INTEGER,
          'handler_user_id'  varchar(64),
         ' handle_msg'    varchar(255),
          'handle_time '    INTEGER,
          'ex'           varchar(1024),
         ' attached_info'   varchar(1024),
          primary key ('from_user_id', 'to_user_id')
      );  
      `
    );
  }

export function insertFriendRequest(
    db: Database,
    LocalFriendRequest : string
  ): QueryExecResult[] {
    return db.exec(
      `
      insert into local_friend_requests (from_user_id, from_nickname, from_face_url, from_gender, to_user_id,
        to_nickname, to_face_url, to_gender, handle_result, req_msg,
        create_time, handler_user_id, handle_msg, handle_time, ex,
        attached_info)
        values ("123", "123", "", 1, "457", "457", "", 1, 0, "", 1666838764, "", "", 1666838764, "", "")
      `
    );
  }
  

export function deleteFriendRequestBothUserID(
    db: Database,
    fromUserID: string ,
    toUserID : string
  ): QueryExecResult[] {
    return db.exec(
      `
      delete
      from local_friend_requests
      where from_user_id = "457"
        and to_user_id = "123"
      `
    );
  }
  

export function updateFriendRequest(
    db: Database,
    LocalFriendRequest: string ,
  ): QueryExecResult[] {
    return db.exec(
      `
      update local_friend_requests
        set from_user_id="123",
        from_nickname="123",
        from_face_url="",
        from_gender=1,
        to_user_id="457",
        to_nickname="457",
        to_face_url="",
        to_gender=1,
        handle_result=0,
        req_msg="",
        create_time=1666838873,
        handler_user_id="",
        handle_msg="",
        handle_time=1666838873,
        ex="",
        attached_info=""
        where from_user_id = "123"
        and to_user_id = "457"
      `
    );
  }
  
export function getRecvFriendApplication(
    db: Database,
  ): QueryExecResult[] {
    return db.exec(
      `
      select *
      from local_friend_requests
      where to_user_id = "3433303585"
      order by create_time desc
      `
    );
  }
  
export function getSendFriendApplication(
    db: Database,
    groupID : string
  ): QueryExecResult[] {
    return db.exec(
      `
      select *
      from local_friend_requests
      where to_user_id = "3433303585"
      order by create_time desc
      `
    );
  }
  
export function getFriendApplicationByBothID(
    db: Database,
    fromUserID : string ,
    toUserID : boolean ,
  ): QueryExecResult[] {
    return db.exec(
      `
      select *
        from local_friend_requests
        where from_user_id = "457"
        and to_user_id = "123"
        limit 1
      `
    );
  }
  