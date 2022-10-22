import squel from 'squel';
import { Database, QueryExecResult } from '@jlongster/sql.js';

export type ClientUser = { [key: string]: unknown };

export function localUsers(db: Database): QueryExecResult[] {
  return db.exec(
    `
      create table if not exists 'local_users' (
            'user_id' varchar(64),
            'name' varchar(255),
            'face_url' varchar(255),
            'gender' integer,
            'phone_number' varchar(32),
            'birth' integer,
            'email' varchar(64),
            'create_time' integer,
            'app_manger_level' integer,
            'ex' varchar(1024),
            'attached_info' varchar(1024),
            'global_recv_msg_opt' integer,
             primary key ('user_id')
        )
    `
  );
}

export function getLoginUser(db: Database, userID: string): QueryExecResult[] {
  return db.exec(
    `
        select * from local_users where user_id = '${userID}'  limit 1;
    `
  );
}

export function insertLoginUser(
  db: Database,
  user: ClientUser
): QueryExecResult[] {
  const sql = squel.insert().into('local_users').setFields(user).toString();

  return db.exec(sql);
}

export function updateLoginUserByMap(
  db: Database,
  userID: string,
  user: ClientUser
): QueryExecResult[] {
  return db.exec(
    `
        update local_users set 
            'app_manger_level'=${user.app_manger_level},
            'attached_info'='${user.attached_info}',
            'birth'=${user.birth},
            'create_time'=${user.create_time},
            'email'='${user.email}',
            'ex'='${user.ex}',
            'face_url'='${user.face_url}',
            'gender'=${user.gender},
            'global_recv_msg_opt'=${user.global_recv_msg_opt},
            'name'='${user.nickname}',
            'phone_number'='${user.phone_number}' 
        where 'user_id' = '${userID}';
      `
  );
}
