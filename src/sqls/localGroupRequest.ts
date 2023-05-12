import { Database, QueryExecResult } from '@jlongster/sql.js';
import squel from 'squel';

export type ClientLocalGroupRequest = { [key: string]: any };

export function localGroupRequests(db: Database): QueryExecResult[] {
  return db.exec(
    `
      create table if not exists 'local_group_requests' (
        "group_id" varchar(64),
        "group_name" text,
        "notification" varchar(255),
        "introduction" varchar(255),
        "face_url" varchar(255),
        "create_time" integer,
        "status" integer,
        "creator_user_id" varchar(64),
        "group_type" integer,
        "owner_user_id" varchar(64),
        "member_count" integer,
        "user_id" varchar(64),
        "nickname" varchar(255),
        "user_face_url" varchar(255),
        "gender" integer,
        "handle_result" integer,
        "req_msg" varchar(255),
        "handle_msg" varchar(255),
        "req_time" integer,
        "handle_user_id" varchar(64),
        "handle_time" integer,
        "ex" varchar(1024),
        "attached_info" varchar(1024),
        "join_source" integer,
        "inviter_user_id" text,
        primary key (
            'group_id',
            'user_id'
        )
        );
    `
  );
}

export function localAdminGroupRequests(db: Database): QueryExecResult[] {
  return db.exec(
    `
      create table if not exists 'local_admin_group_requests' (
        "group_id" varchar(64),
        "group_name" text,
        "notification" varchar(255),
        "introduction" varchar(255),
        "face_url" varchar(255),
        "create_time" integer,
        "status" integer,
        "creator_user_id" varchar(64),
        "group_type" integer,
        "owner_user_id" varchar(64),
        "member_count" integer,
        "user_id" varchar(64),
        "nickname" varchar(255),
        "user_face_url" varchar(255),
        "gender" integer,
        "handle_result" integer,
        "req_msg" varchar(255),
        "handle_msg" varchar(255),
        "req_time" integer,
        "handle_user_id" varchar(64),
        "handle_time" integer,
        "ex" varchar(1024),
        "attached_info" varchar(1024),
        "join_source" integer,
        "inviter_user_id" text,
        primary key (
            'group_id',
            'user_id'
        )
        );
    `
  );
}

export function getSendGroupApplication(db: Database): QueryExecResult[] {
  const sql = squel
    .select()
    .from('local_group_requests')
    .order('create_time', false)
    .toString();

  return db.exec(sql);
}

export function getAdminGroupApplication(db: Database): QueryExecResult[] {
  const sql = squel
    .select()
    .from('local_admin_group_requests')
    .order('create_time', false)
    .toString();

  return db.exec(sql);
}
