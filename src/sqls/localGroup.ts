import { Database, QueryExecResult } from '@jlongster/sql.js';
import squel from 'squel';

export type ClientLocalGroup = { [key: string]: any };

export function localGroup(db: Database): QueryExecResult[] {
  return db.exec(
    `
      create table if not exists 'local_groups' (
        group_id                 varchar(64) PRIMARY KEY,
        name                     TEXT,
        notification             varchar(255),
        introduction             varchar(255),
        face_url                 varchar(255),
        create_time              INTEGER,
        status                   INTEGER,
        creator_user_id          varchar(64),
        group_type               INTEGER,
        owner_user_id            varchar(64),
        member_count             INTEGER,
        ex                       varchar(1024),
        attached_info            varchar(1024),
        need_verification        INTEGER,
        look_member_info         INTEGER,
        apply_member_friend      INTEGER,
        notification_update_time INTEGER,
        notification_user_id     TEXT
      );
    `
  );
}

export function insertGroup(
  db: Database,
  LocalGroup: ClientLocalGroup
): QueryExecResult[] {
  const sql = squel
    .insert()
    .into('local_groups')
    .setFields(LocalGroup)
    .toString();

  return db.exec(sql);
}

export function deleteGroup(db: Database, groupId: string): QueryExecResult[] {
  const sql = squel
    .delete()
    .from('local_conversation_unread_messages')
    .where(`conversation_id='${groupId}' and send_time <= 0`)
    .toString();

  return db.exec(sql);
}

export function updateGroup(
  db: Database,
  groupId: string,
  LocalGroup: ClientLocalGroup
): QueryExecResult[] {
  const sql = squel
    .update()
    .table('local_groups')
    .setFields(LocalGroup)
    .where(`group_id='${groupId}'`)
    .toString();

  return db.exec(sql);
}

export function getJoinedGroupList(db: Database): QueryExecResult[] {
  const sql = squel.select().from('local_groups').toString();

  return db.exec(sql);
}

export function getGroupInfoByGroupID(
  db: Database,
  groupId: string
): QueryExecResult[] {
  const sql = squel
    .select()
    .from('local_groups')
    .where(`group_id = "${groupId}"`)
    .toString();

  return db.exec(sql);
}

export function getAllGroupInfoByGroupIDOrGroupName(
  db: Database,
  keyword: string,
  isSearchGroupID: boolean,
  isSearchGroupName: boolean
): QueryExecResult[] {
  const filter =
    isSearchGroupID || isSearchGroupName
      ? isSearchGroupID && isSearchGroupName
        ? `group_id like "${keyword}" or name like "${keyword}`
        : `${isSearchGroupID ? 'group_id' : 'name'} like "${keyword}"`
      : '';

  const sql = squel
    .select()
    .from('local_groups')
    .where(filter)
    .order('create_time', false)
    .toString();

  return db.exec(sql);
}

export function subtractMemberCount(
  db: Database,
  groupId: string
): QueryExecResult[] {
  const sql = `UPDATE 'local_groups' SET 'member_count'=member_count-1 WHERE group_id='${groupId}'`;

  return db.exec(sql);
}

export function addMemberCount(
  db: Database,
  groupId: string
): QueryExecResult[] {
  const sql = `UPDATE 'local_groups' SET 'member_count'=member_count+1 WHERE group_id='${groupId}'`;
  return db.exec(sql);
}

export function getJoinedWorkingGroupIDList(db: Database): QueryExecResult[] {
  return db.exec(
    `
        select * from local_groups where group_type = 2;
    `
  );
}
