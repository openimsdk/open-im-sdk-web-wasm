import squel from 'squel';
import { Database, QueryExecResult } from '@jlongster/sql.js';

export function locaFriend(db: Database): QueryExecResult[] {
    return db.exec(
      `
      create table if not exists 'local_friends'
      (
          'owner_user_id'    varchar(64),
          'friend_user_id'   varchar(64),
         ' remark'           varchar(255),
          'create_time'      INTEGER,
         ' add_source'       INTEGER,
         ' operator_user_id' varchar(64),
         ' name'             varchar(255),
         ' face_url'         varchar(255),
        '  gender'           INTEGER,
         ' phone_number'     varchar(32),
         ' birth'            INTEGER,
         ' email'            varchar(64),
       'ex'               varchar(1024),
       'attached_info'    varchar(1024),
         primary key ('owner_user_id', 'friend_user_id')
      )       
      `
    );
  }



export function insertFriend(
  db: Database,
  LocalFriend: string
): QueryExecResult[] {
  return db.exec(
    `
      insert into local_friends (owner_user_id, friend_user_id, remark, create_time, add_source,
      operator_user_id, name, face_url, gender, phone_number, birth, email, ex,
      attached_info)
     values ("123", "456", "hello", 1666778999, 0, "789", "hhhh", "", 1, "13000000000", 1666778999, "123@qq.com", "", "")
        `
  );
}

export function deleteFriend(
  db: Database,
  friendUserID: string
): QueryExecResult[] {
  return db.exec(
    `
      delete
      from local_groups
      where local_groups.group_id = "1234"
        `
  );
}
export function updateFriend(
  db: Database,
  LocalFriend: string
): QueryExecResult[] {
  return db.exec(
    `
      update local_friends
        set owner_user_id="123",
        friend_user_id="456",
        remark="hello",
        create_time=1666779080,
        add_source=0,
        operator_user_id="789",
        name="hhhh",
        face_url="",
        birth=1666779080,
        email="123@qq.com",
        ex="",
        attached_info=""
        where owner_user_id = "123"
        and friend_user_id = "456"
        `
  );
}

export function getAllFriendList(db: Database): QueryExecResult[] {
  return db.exec(
    `
      select *
        from local_friends
        where owner_user_id = "3433303585"
        `
  );
}

export function searchFriendList(
  db: Database,
  key: string,
  isSearchUserID: boolean,
  isSearchNickname: boolean,
  isSearchRemark: boolean
): QueryExecResult[] {
  return db.exec(
    `
      select *
        from local_friends
        where friend_user_id like "%123%"
        or name like "%123%"
        or remark like "%123%"
        order by create_time desc
        `
  );
}

export function getFriendInfoByFriendUserID(
  db: Database,
  friendUserID: string
): QueryExecResult[] {
  return db.exec(
    `
      select *
        from local_friends
        where owner_user_id = "3433303585"
         and friend_user_id = "123"
        limit 1
        `
  );
}

export function getFriendInfoList(
  db: Database,
  friendUserIDList: string[]
): QueryExecResult[] {
  return db.exec(
    `
      select *
        from local_friends
        where friend_user_id in ("123")
        `
  );
}
