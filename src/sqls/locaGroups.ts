import squel from 'squel';
import { Database, QueryExecResult } from '@jlongster/sql.js';

export function locaGroups(db: Database): QueryExecResult[] {
    return db.exec(
      `
      create table if not exists 'local_groups'
      (
          'group_id'                 varchar(64) PRIMARY KEY,
          'name   '                  TEXT,
          'notification '            varchar(255),
          'introduction '            varchar(255),
          'face_url      '           varchar(255),
          'create_time '             INTEGER,
          'status     '              INTEGER,
         ' creator_user_id    '      varchar(64),
          'group_type '              INTEGER,
          'owner_user_id  '          varchar(64),
          'member_count '            INTEGER,
          'ex    '                   varchar(1024),
          'attached_info '           varchar(1024),
          'need_verification   '     INTEGER,
          'look_member_info    '     INTEGER,
          'apply_member_friend'      INTEGER,
          'notification_update_time' INTEGER,
          'notification_user_id  '   TEXT
      )  ification_user_id  '   TEXT
      )  
      `
    );
  }




export function insertGroup(
  db: Database,
  LocalGroup: string
): QueryExecResult[] {
  return db.exec(
    `
      insert into local_groups (group_id, name, notification, introduction, face_url, create_time, status,
         creator_user_id, group_type, owner_user_id, member_count, ex, attached_info,
        need_verification, look_member_info, apply_member_friend, notification_update_time,
        notification_user_id)
        values ("1234567", "测试1234", "", "", "", 1666777417, 0, "", 0, "", 0, "", "", 0, 0, 0, 0, "")
          `
  );
}

export function deleteGroup(db: Database, groupID: string): QueryExecResult[] {
  return db.exec(
    `
    delete
        from local_conversation_unread_messages
        where conversation_id = "super_group_748402675"
        and send_time <= 0
          `
  );
}
export function updateGroup(
  db: Database,
  LocalGroup: string
): QueryExecResult[] {
  return db.exec(
    `
    update local_groups
    set group_id="1234567",
        name="hello",
        notification="",
        introduction="",
        face_url="",
        create_time=1666777635,
        status=0,
        creator_user_id="",
        group_type=0,
        owner_user_id="",
        member_count=0,
        ex="",
        attached_info="",
        need_verification=0,
        look_member_info=0,
        apply_member_friend=0,
        notification_update_time=0,
        notification_user_id=""
    where group_id = "1234567"
    `
  );
}

export function getJoinedGroupList(db: Database): QueryExecResult[] {
  return db.exec(
    `
    select *
    from local_group_members
    where group_id = "748402675"
    `
  );
}
export function getAllGroupInfoByGroupIDOrGroupName(
  db: Database,
  keyword: string,
  isSearchGroupID: boolean,
  isSearchGroupName: boolean
): QueryExecResult[] {
  return db.exec(
    `
    select *
    from local_groups
    where group_id like "%123%"
       or name like "%123%"
    order by create_time desc
    `
  );
}
