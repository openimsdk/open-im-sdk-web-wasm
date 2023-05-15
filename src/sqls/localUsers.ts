import squel from 'squel';
import { Database, QueryExecResult } from '@jlongster/sql.js';

export type ClientUser = { [key: string]: unknown };

export function localUsers(db: Database): QueryExecResult[] {
  db.exec(
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
            'birth_time' datetime,
            primary key ('user_id')
        )
    `
  );

  // has no column burn_duration

  const tableInfo = db.exec('PRAGMA table_info(local_users)');
  if (tableInfo.length <= 0) {
    return tableInfo;
  }

  // check column for old version
  const hasColumnBirthTime = tableInfo[0].values.find(
    v => v[1] === 'birth_time'
  );

  const result: QueryExecResult[] = [];
  if (!hasColumnBirthTime) {
    result.push(
      ...db.exec(`
          alter table local_users add birth_time datetime;
      `)
    );
  }

  return result;
}

export function getLoginUser(db: Database, userID: string): QueryExecResult[] {
  return db.exec(
    `
        select *, name as nickname from local_users where user_id = '${userID}' limit 1;
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
  userInfoObj: ClientUser
): QueryExecResult[] {
  const sql = squel
    .update()
    .table('local_users')
    .setFields(userInfoObj)
    .where(`user_id = '${userID}'`)
    .toString();

  return db.exec(sql);
}
