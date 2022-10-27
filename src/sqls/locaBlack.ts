import squel from 'squel';
import { Database, QueryExecResult } from '@jlongster/sql.js';

export function locaBlack(db: Database): QueryExecResult[] {
    return db.exec(
      `
      create table if not exists 'local_blacks' (
        'owner_user_id'     varchar(64),
        'block_user_id'     varchar(64),
        'nickname'         varchar(255),
        'face_url'         varchar(255),
          'gender'           INTEGER,
          'create_time'      INTEGER,
          'add_source '      INTEGER,
        'operator_user_id'   varchar(64),
        'ex'              varchar(1024),
        'attached_info'     varchar(1024),
        primary key  ('owner_user_id', 'block_user_id')
    ) 
      `
    );
  }


export function getBlackList(db: Database): QueryExecResult[] {
  return db.exec(
    `
      select *
      from local_blacks
      `
  );
}

export function getBlackListUserID(
  db: Database,
  blockUserID: string
): QueryExecResult[] {
  return db.exec(
    `
      select *
        from local_blacks
        where owner_user_id = "3433303585"
        and block_user_id = "123"
        limit 1
      `
  );
}

// export function getFriendInfoByFriendUserID(
//   db: Database,
//   blockUserID: string
// ): QueryExecResult[] {
//   return db.exec(
//     `
//       select *
//         from local_blacks
//         where owner_user_id = "3433303585"
//         and block_user_id = "123"
//         limit 1
//       `
//   );
// }

export function getBlackInfoList(
  db: Database,
  blockUserIDList  : string[]
): QueryExecResult[] {
  return db.exec(
    `
    select *
    from local_blacks
    where block_user_id in ("123")
      `
  );
}

export function insertBlack(
  db: Database,
  LocalBlack     : string
): QueryExecResult[] {
  return db.exec(
    `
    insert into local_blacks (owner_user_id, block_user_id, nickname, face_url, gender,create_time,
         add_source, operator_user_id, ex, attached_info)
         values ("123", "456", "hello", "", 1, 1666779750, 1, "789", "", "")
      `
  );
}

export function deleteBlack(
  db: Database,
  blockUserID     : string
): QueryExecResult[] {
  return db.exec(
    `
    delete
    from local_blacks
    where owner_user_id = "3433303585"
    and block_user_id = "123"
      `
  );
}

export function updateBlack(
  db: Database,
  LocalBlack       : string
): QueryExecResult[] {
  return db.exec(
    `
    update local_blacks
    set nickname="hello",
        gender=1,
        create_time=1666779794,
        add_source=1,
        operator_user_id="789"
        where owner_user_id = "123"
        and block_user_id = "456"
      `
  );
}
